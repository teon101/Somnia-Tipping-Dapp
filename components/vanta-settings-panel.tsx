"use client"

import { useState } from "react"
import { useVantaSettings } from "@/hooks/use-vanta-settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Settings, X } from "lucide-react"
import { hexToNumber, numberToHex } from "@/lib/color-utils"

export default function VantaSettingsPanel() {
  const { settings, updateSettings, resetSettings } = useVantaSettings()
  const [isOpen, setIsOpen] = useState(false)
  const [colorHex, setColorHex] = useState(numberToHex(settings.color))

  const handleColorChange = (hex: string) => {
    setColorHex(hex)
    if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
      updateSettings({ color: hexToNumber(hex) })
    }
  }

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full bg-background/80 backdrop-blur-sm"
        onClick={togglePanel}
      >
        <Settings className="h-5 w-5" />
      </Button>

      <div
        className={`fixed bottom-0 right-0 z-50 w-full max-w-sm transform overflow-auto rounded-tl-lg bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ maxHeight: "80vh" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Wave Animation Settings</h3>
          <Button variant="ghost" size="icon" onClick={togglePanel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="color">Color (Hex)</Label>
            <Input
              id="color"
              type="text"
              value={colorHex}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#1a1420"
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="shininess">Shininess: {settings.shininess}</Label>
            </div>
            <Slider
              id="shininess"
              min={0}
              max={300}
              step={5}
              value={[settings.shininess]}
              onValueChange={(value) => updateSettings({ shininess: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="waveHeight">Wave Height: {settings.waveHeight}</Label>
            </div>
            <Slider
              id="waveHeight"
              min={0}
              max={100}
              step={1}
              value={[settings.waveHeight]}
              onValueChange={(value) => updateSettings({ waveHeight: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="waveSpeed">Wave Speed: {settings.waveSpeed}</Label>
            </div>
            <Slider
              id="waveSpeed"
              min={0}
              max={5}
              step={0.1}
              value={[settings.waveSpeed]}
              onValueChange={(value) => updateSettings({ waveSpeed: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="zoom">Zoom: {settings.zoom}</Label>
            </div>
            <Slider
              id="zoom"
              min={0.5}
              max={2}
              step={0.1}
              value={[settings.zoom]}
              onValueChange={(value) => updateSettings({ zoom: value[0] })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={resetSettings}>
              Reset
            </Button>
            <Button onClick={togglePanel}>Done</Button>
          </div>
        </div>
      </div>
    </>
  )
}
