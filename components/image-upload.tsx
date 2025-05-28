"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, Camera, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageData: string) => void
  maxSizeKB?: number
  className?: string
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  maxSizeKB = 500,
  className = "",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentImage || "")
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError("")
    setIsProcessing(true)

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      setIsProcessing(false)
      return
    }

    // Validate file size
    const fileSizeKB = file.size / 1024
    if (fileSizeKB > maxSizeKB) {
      setError(`Image size must be less than ${maxSizeKB}KB. Current size: ${Math.round(fileSizeKB)}KB`)
      setIsProcessing(false)
      return
    }

    // Create image element to get dimensions and potentially resize
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        setError("Failed to process image")
        setIsProcessing(false)
        return
      }

      // Set maximum dimensions
      const maxWidth = 400
      const maxHeight = 400

      let { width, height } = img

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to base64 with compression
      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8)

      // Check final size
      const finalSizeKB = (compressedDataUrl.length * 3) / 4 / 1024
      if (finalSizeKB > maxSizeKB) {
        // Try with more compression
        const moreCompressed = canvas.toDataURL("image/jpeg", 0.6)
        const moreSizeKB = (moreCompressed.length * 3) / 4 / 1024

        if (moreSizeKB > maxSizeKB) {
          setError(`Image is too large even after compression. Please choose a smaller image.`)
          setIsProcessing(false)
          return
        }

        setPreview(moreCompressed)
        onImageChange(moreCompressed)
      } else {
        setPreview(compressedDataUrl)
        onImageChange(compressedDataUrl)
      }

      setIsProcessing(false)
    }

    img.onerror = () => {
      setError("Failed to load image")
      setIsProcessing(false)
    }

    // Create object URL for the image
    const objectUrl = URL.createObjectURL(file)
    img.src = objectUrl
  }

  const handleRemoveImage = () => {
    setPreview("")
    onImageChange("")
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>Profile Picture</Label>

      <div className="flex flex-col items-center space-y-4">
        {/* Image Preview */}
        <div className="relative">
          <Avatar className="h-32 w-32 border-2 border-dashed border-muted-foreground/25">
            {preview ? (
              <AvatarImage src={preview || "/placeholder.svg"} alt="Profile preview" className="object-cover" />
            ) : (
              <AvatarFallback className="bg-muted">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </AvatarFallback>
            )}
          </Avatar>

          {preview && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={handleRemoveImage}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex flex-col items-center space-y-2">
          <Button
            variant="outline"
            onClick={triggerFileInput}
            disabled={isProcessing}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>{isProcessing ? "Processing..." : preview ? "Change Picture" : "Upload Picture"}</span>
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            JPG, PNG, GIF up to {maxSizeKB}KB
            <br />
            Recommended: 400x400px
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          capture="environment" // This enables camera on mobile devices
        />

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
