"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { useVantaSettings } from "@/hooks/use-vanta-settings"

export default function VantaBackground({ children }: { children: React.ReactNode }) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)
  const { settings } = useVantaSettings()

  useEffect(() => {
    if (!scriptsLoaded || !vantaRef.current) return

    // Destroy previous effect if it exists
    if (vantaEffect) {
      vantaEffect.destroy()
    }

    // Create new effect with current settings
    if (window.VANTA) {
      const newEffect = window.VANTA.WAVES({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: settings.color,
        shininess: settings.shininess,
        waveHeight: settings.waveHeight,
        waveSpeed: settings.waveSpeed,
        zoom: settings.zoom,
      })

      setVantaEffect(newEffect)
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect, scriptsLoaded, settings])

  const handleScriptsLoad = () => {
    setScriptsLoaded(true)
  }

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js" onLoad={handleScriptsLoad} />
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js"
        onLoad={handleScriptsLoad}
        strategy="lazyOnload"
      />
      <div ref={vantaRef} className="min-h-screen w-full overflow-hidden">
        <div className="relative z-10">{children}</div>
      </div>
    </>
  )
}
