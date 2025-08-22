import { API_CONFIG, API_ENDPOINTS, ERROR_MESSAGES } from './constants'
import type { APIResponse, ContactFormData } from '@/types'

// Configuración base del cliente
class APIClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  // Método privado para hacer peticiones
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    }

    // Agregar token de autenticación si está disponible
    const token = this.getAuthToken()
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      }
    }

    try {
      const response = await this.fetchWithRetry(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        data: data as T,
        message: data.message || 'Operación exitosa',
      } as APIResponse<T>
    } catch (error) {
      console.error('API Error:', error)
      
      return {
        success: false,
        error: this.formatError(error),
        message: this.getErrorMessage(error),
      } as APIResponse<T>
    }
  }

  // Implementar retry logic
  private async fetchWithRetry(
    url: string, 
    config: RequestInit, 
    attempt: number = 1
  ): Promise<Response> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      if (attempt < API_CONFIG.RETRY_ATTEMPTS) {
        await this.delay(API_CONFIG.RETRY_DELAY * attempt)
        return this.fetchWithRetry(url, config, attempt + 1)
      }
      throw error
    }
  }

  // Utilidad para delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Obtener token de autenticación
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth-token')
  }

  // Formatear errores
  private formatError(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    return ERROR_MESSAGES.GENERIC
  }

  // Obtener mensaje de error apropiado
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return ERROR_MESSAGES.TIMEOUT
      }
      if (error.message.includes('Failed to fetch')) {
        return ERROR_MESSAGES.NETWORK
      }
      if (error.message.includes('401')) {
        return ERROR_MESSAGES.UNAUTHORIZED
      }
      if (error.message.includes('404')) {
        return ERROR_MESSAGES.NOT_FOUND
      }
      if (error.message.includes('5')) {
        return ERROR_MESSAGES.SERVER_ERROR
      }
    }
    return ERROR_MESSAGES.GENERIC
  }

  // Métodos públicos de la API
  
  // Contacto
  async submitContact(data: ContactFormData): Promise<APIResponse<{ id: string }>> {
    return this.request<{ id: string }>(API_ENDPOINTS.CONTACT, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Enviar lead de la ruleta
  async submitLead(data: {
    name: string
    email: string
    phone?: string
    discount: number
    source: string
  }): Promise<APIResponse<{ id: string }>> {
    return this.request<{ id: string }>(API_ENDPOINTS.LEADS, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Solicitar cotización
  async requestQuote(data: {
    company: string
    email: string
    phone: string
    debtAmount: number
    debtType: string
    message?: string
  }): Promise<APIResponse<{ id: string }>> {
    return this.request<{ id: string }>(API_ENDPOINTS.QUOTE, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Obtener contenido dinámico
  async getContent(section?: string): Promise<APIResponse<Record<string, any>>> {
    const endpoint = section 
      ? `${API_ENDPOINTS.CONTENT}/${section}` 
      : API_ENDPOINTS.CONTENT
    
    return this.request<Record<string, any>>(endpoint, {
      method: 'GET',
    })
  }

  // Obtener servicios
  async getServices(): Promise<APIResponse<Array<{
    id: string
    name: string
    description: string
    icon: string
    features: string[]
  }>>> {
    return this.request<Array<{
      id: string
      name: string
      description: string
      icon: string
      features: string[]
    }>>(API_ENDPOINTS.SERVICES, {
      method: 'GET',
    })
  }

  // Subir archivo
  async uploadFile(file: File): Promise<APIResponse<{ url: string }>> {
    const formData = new FormData()
    formData.append('file', file)

    return this.request<{ url: string }>(API_ENDPOINTS.UPLOAD, {
      method: 'POST',
      headers: {
        // No incluir Content-Type para FormData
      },
      body: formData,
    })
  }

  // Autenticación
  async login(email: string, password: string): Promise<APIResponse<{
    token: string
    user: {
      id: string
      email: string
      name: string
    }
  }>> {
    return this.request<{
      token: string
      user: {
        id: string
        email: string
        name: string
      }
    }>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async logout(): Promise<APIResponse<void>> {
    const result = await this.request<void>(API_ENDPOINTS.LOGOUT, {
      method: 'POST',
    })
    
    // Limpiar token local
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token')
    }
    
    return result
  }

  // Refrescar token
  async refreshToken(): Promise<APIResponse<{ token: string }>> {
    return this.request<{ token: string }>(API_ENDPOINTS.REFRESH, {
      method: 'POST',
    })
  }

  // Hacer el método request público para interceptores
  public async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, options)
  }
}

// Instancia singleton del cliente
export const apiClient = new APIClient()

// Hooks para uso en React
export function useAPI() {
  return {
    // Métodos del cliente
    submitContact: apiClient.submitContact.bind(apiClient),
    submitLead: apiClient.submitLead.bind(apiClient),
    requestQuote: apiClient.requestQuote.bind(apiClient),
    getContent: apiClient.getContent.bind(apiClient),
    getServices: apiClient.getServices.bind(apiClient),
    uploadFile: apiClient.uploadFile.bind(apiClient),
    login: apiClient.login.bind(apiClient),
    logout: apiClient.logout.bind(apiClient),
    refreshToken: apiClient.refreshToken.bind(apiClient),
  }
}

// Funciones de utilidad para formularios
export async function submitContactForm(formData: ContactFormData) {
  try {
    const response = await apiClient.submitContact(formData)
    
    if (!response.success) {
      throw new Error(response.error || ERROR_MESSAGES.GENERIC)
    }
    
    return response.data
  } catch (error) {
    console.error('Error submitting contact form:', error)
    throw error
  }
}

export async function submitLeadForm(leadData: {
  name: string
  email: string
  phone?: string
  discount: number
  source: string
}) {
  try {
    const response = await apiClient.submitLead(leadData)
    
    if (!response.success) {
      throw new Error(response.error || ERROR_MESSAGES.GENERIC)
    }
    
    return response.data
  } catch (error) {
    console.error('Error submitting lead form:', error)
    throw error
  }
}

// Funciones para manejo de archivos
export async function uploadFileWithProgress(
  file: File,
  _onProgress?: (progress: number) => void
): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)

    const xhr = new XMLHttpRequest()

    // Configurar progress handler
    if (_onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          _onProgress(progress)
        }
      })
    }

    // Configurar completion handler
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve(response.data)
        } catch (error) {
          reject(new Error('Error parsing response'))
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`))
      }
    })

    // Configurar error handler
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'))
    })

    // Enviar petición
    xhr.open('POST', `${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPLOAD}`)
    
    // Agregar token si está disponible
    const token = localStorage.getItem('auth-token')
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }
    
    xhr.send(formData)
  })
}

// Interceptor para manejar errores globalmente
export function setupAPIInterceptors() {
  // Interceptar respuestas 401 para renovar token automáticamente
  const originalRequest = apiClient.makeRequest.bind(apiClient)
  
  // Sobrescribir el método con manejo de tipos correcto
  apiClient.makeRequest = async function<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    try {
      const result = await originalRequest<T>(endpoint, options)
      return result
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        // Intentar renovar token
        try {
          const refreshResponse = await this.refreshToken()
          if (refreshResponse.success && refreshResponse.data?.token) {
            localStorage.setItem('auth-token', refreshResponse.data.token)
            // Reintentar petición original
            const retryResult = await originalRequest<T>(endpoint, options)
            return retryResult
          }
        } catch (refreshError) {
          // Si falla la renovación, limpiar token y redirigir a login
          localStorage.removeItem('auth-token')
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
      }
      throw error
    }
  }
}

// Configurar interceptores al cargar
if (typeof window !== 'undefined') {
  setupAPIInterceptors()
}