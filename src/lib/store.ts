import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Tipos para el estado
interface VideoState {
  currentVideo: 'idle' | 'talking'
  isPlaying: boolean
  isMuted: boolean
  volume: number
}

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  reducedMotion: boolean
  isLoading: boolean
  error: string | null
}

interface ContactState {
  isRecording: boolean
  isProcessing: boolean
  hasStartedConversation: boolean
  lastInteraction: Date | null
}

interface AppStore extends VideoState, UIState, ContactState {
  // Video actions
  setCurrentVideo: (video: 'idle' | 'talking') => void
  togglePlaying: () => void
  setMuted: (muted: boolean) => void
  setVolume: (volume: number) => void
  
  // UI actions
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setReducedMotion: (reduced: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Contact actions
  startRecording: () => void
  stopRecording: () => void
  startProcessing: () => void
  stopProcessing: () => void
  startConversation: () => void
  endConversation: () => void
  updateLastInteraction: () => void
  
  // Reset actions
  resetVideoState: () => void
  resetContactState: () => void
  resetAll: () => void
}

// Estado inicial
const initialVideoState: VideoState = {
  currentVideo: 'idle',
  isPlaying: true,
  isMuted: true,
  volume: 0.8,
}

const initialUIState: UIState = {
  sidebarOpen: false,
  theme: 'system',
  reducedMotion: false,
  isLoading: false,
  error: null,
}

const initialContactState: ContactState = {
  isRecording: false,
  isProcessing: false,
  hasStartedConversation: false,
  lastInteraction: null,
}

// Store principal
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        ...initialVideoState,
        ...initialUIState,
        ...initialContactState,

        // Video actions
        setCurrentVideo: (video) => {
          set({ currentVideo: video }, false, 'setCurrentVideo')
        },

        togglePlaying: () => {
          set((state) => ({ isPlaying: !state.isPlaying }), false, 'togglePlaying')
        },

        setMuted: (muted) => {
          set({ isMuted: muted }, false, 'setMuted')
        },

        setVolume: (volume) => {
          set({ volume: Math.max(0, Math.min(1, volume)) }, false, 'setVolume')
        },

        // UI actions
        setSidebarOpen: (open) => {
          set({ sidebarOpen: open }, false, 'setSidebarOpen')
        },

        setTheme: (theme) => {
          set({ theme }, false, 'setTheme')
        },

        setReducedMotion: (reduced) => {
          set({ reducedMotion: reduced }, false, 'setReducedMotion')
        },

        setLoading: (loading) => {
          set({ isLoading: loading }, false, 'setLoading')
        },

        setError: (error) => {
          set({ error }, false, 'setError')
        },

        // Contact actions
        startRecording: () => {
          set(
            {
              isRecording: true,
              currentVideo: 'talking',
              hasStartedConversation: true,
              lastInteraction: new Date(),
            },
            false,
            'startRecording'
          )
        },

        stopRecording: () => {
          set(
            {
              isRecording: false,
              isProcessing: true,
              lastInteraction: new Date(),
            },
            false,
            'stopRecording'
          )
        },

        startProcessing: () => {
          set({ isProcessing: true }, false, 'startProcessing')
        },

        stopProcessing: () => {
          set(
            {
              isProcessing: false,
              currentVideo: 'idle',
              lastInteraction: new Date(),
            },
            false,
            'stopProcessing'
          )
        },

        startConversation: () => {
          set(
            {
              hasStartedConversation: true,
              currentVideo: 'talking',
              lastInteraction: new Date(),
            },
            false,
            'startConversation'
          )
        },

        endConversation: () => {
          // Delay para volver al estado idle después de la conversación
          setTimeout(() => {
            const currentState = get()
            if (!currentState.isRecording && !currentState.isProcessing) {
              set({ currentVideo: 'idle' }, false, 'endConversation')
            }
          }, 2000)
          
          set(
            {
              hasStartedConversation: false,
              lastInteraction: new Date(),
            },
            false,
            'endConversationImmediate'
          )
        },

        updateLastInteraction: () => {
          set({ lastInteraction: new Date() }, false, 'updateLastInteraction')
        },

        // Reset actions
        resetVideoState: () => {
          set(initialVideoState, false, 'resetVideoState')
        },

        resetContactState: () => {
          set(initialContactState, false, 'resetContactState')
        },

        resetAll: () => {
          set(
            {
              ...initialVideoState,
              ...initialUIState,
              ...initialContactState,
            },
            false,
            'resetAll'
          )
        },
      }),
      {
        name: 'intelcobro-storage',
        partialize: (state) => ({
          // Solo persistir configuraciones del usuario
          theme: state.theme,
          reducedMotion: state.reducedMotion,
          volume: state.volume,
          isMuted: state.isMuted,
        }),
      }
    ),
    {
      name: 'intelcobro-store',
    }
  )
)

// Hooks específicos para partes del estado
export const useVideoStore = () => {
  const {
    currentVideo,
    isPlaying,
    isMuted,
    volume,
    setCurrentVideo,
    togglePlaying,
    setMuted,
    setVolume,
    resetVideoState,
  } = useAppStore()

  return {
    currentVideo,
    isPlaying,
    isMuted,
    volume,
    setCurrentVideo,
    togglePlaying,
    setMuted,
    setVolume,
    resetVideoState,
  }
}

export const useUIStore = () => {
  const {
    sidebarOpen,
    theme,
    reducedMotion,
    isLoading,
    error,
    setSidebarOpen,
    setTheme,
    setReducedMotion,
    setLoading,
    setError,
  } = useAppStore()

  return {
    sidebarOpen,
    theme,
    reducedMotion,
    isLoading,
    error,
    setSidebarOpen,
    setTheme,
    setReducedMotion,
    setLoading,
    setError,
  }
}

export const useContactStore = () => {
  const {
    isRecording,
    isProcessing,
    hasStartedConversation,
    lastInteraction,
    startRecording,
    stopRecording,
    startProcessing,
    stopProcessing,
    startConversation,
    endConversation,
    updateLastInteraction,
    resetContactState,
  } = useAppStore()

  return {
    isRecording,
    isProcessing,
    hasStartedConversation,
    lastInteraction,
    startRecording,
    stopRecording,
    startProcessing,
    stopProcessing,
    startConversation,
    endConversation,
    updateLastInteraction,
    resetContactState,
  }
}

// Selector para estado combinado
export const useCombinedState = () => {
  const { currentVideo, isRecording, isProcessing } = useAppStore()
  
  return {
    shouldShowTalkingVideo: currentVideo === 'talking' || isRecording || isProcessing,
    shouldShowIdleVideo: currentVideo === 'idle' && !isRecording && !isProcessing,
    isInteracting: isRecording || isProcessing,
  }
}