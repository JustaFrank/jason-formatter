interface Logger {
  info: (s: any) => void
  success: (s: any) => void
  error: (s: any) => void
  event: (s: any) => void
  log: (s: any) => void
}

interface CssMessage {
  message: string
  css: string
}

interface KeyboardAction {
  action: () => void
  shortcut: KeyboardShortcut
}

interface KeyboardShortcut {
  keyCode: number
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
}

export { Logger, CssMessage, KeyboardAction, KeyboardShortcut }
