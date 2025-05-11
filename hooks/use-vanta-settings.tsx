"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface VantaSettings {
  color: number
  shininess: number
  waveHeight: number
  waveSpeed: number
  zoom: number
}

interface VantaSettingsContextType {
  settings: VantaSettings
  updateSettings: (newSettings: Partial<VantaSettings>) => void
  resetSettings: () => void
}

const defaultSettings: VantaSettings = {
  color: 0x1a1420,
  shininess: 150,
  waveHeight: 40,
  waveSpeed: 2,
  zoom: 1,
}

const VantaSettingsContext = createContext<VantaSettingsContextType | undefined>(undefined)

export function VantaSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<VantaSettings>(defaultSettings)

  const updateSettings = (newSettings: Partial<VantaSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <VantaSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </VantaSettingsContext.Provider>
  )
}

export function useVantaSettings() {
  const context = useContext(VantaSettingsContext)
  if (context === undefined) {
    throw new Error("useVantaSettings must be used within a VantaSettingsProvider")
  }
  return context
}
