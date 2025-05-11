declare global {
  interface Window {
    VANTA: {
      WAVES: (options: any) => any
      [key: string]: any
    }
  }
}

export {}
