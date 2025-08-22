// Tipos para el sistema de videos
export interface VideoConfig {
  idle: string
  talking: string
  poster?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  playsInline?: boolean
  removeBackground?: boolean
  backgroundType?: 'black' | 'white' | 'transparent'
}

export interface VideoPlayerProps {
  config: VideoConfig
  className?: string
  onLoad?: () => void
  onError?: (error: string) => void
  onVideoChange?: (videoType: 'idle' | 'talking') => void
}

export interface VideoState {
  currentVideo: 'idle' | 'talking'
  isPlaying: boolean
  isMuted: boolean
  volume: number
  isLoading: boolean
  error: string | null
}

// Interfaz simplificada para VideoElement
export interface VideoElement {
  requestVideoFrameCallback?: (callback: VideoFrameRequestCallback) => number
  cancelVideoFrameCallback?: (handle: number) => void
}

export type VideoFrameRequestCallback = (
  now: DOMHighResTimeStamp, 
  metadata: VideoFrameCallbackMetadata
) => void

export interface VideoFrameCallbackMetadata {
  presentationTime: DOMHighResTimeStamp
  expectedDisplayTime: DOMHighResTimeStamp
  width: number
  height: number
  mediaTime: number
  presentedFrames: number
  processingDuration?: number
}

export interface BackgroundRemovalOptions {
  type: 'black' | 'white' | 'transparent'
  threshold?: number
  softness?: number
  spill?: number
}

export interface VideoTransitionOptions {
  duration?: number
  easing?: string
  delay?: number
}

export interface VideoAnalytics {
  loadTime: number
  playTime: number
  switchCount: number
  errorCount: number
  lastSwitch: Date | null
}