"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ImageIcon, ExternalLink } from "lucide-react"

interface ImagePickerProps {
  value: string
  onChange: (value: string) => void
}

export function ImagePicker({ value, onChange }: ImagePickerProps) {
  const [images, setImages] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [customUrl, setCustomUrl] = useState(value)

  useEffect(() => {
    setCustomUrl(value)
  }, [value])

  useEffect(() => {
    if (isOpen) {
      fetch("/api/images")
        .then((res) => res.json())
        .then((data) => setImages(data.images || []))
        .catch((err) => console.error("Failed to load images:", err))
    }
  }, [isOpen])

  const handleSelectImage = (imagePath: string) => {
    onChange(imagePath)
    setCustomUrl(imagePath)
    setIsOpen(false)
  }

  const handleCustomUrlChange = (url: string) => {
    setCustomUrl(url)
    onChange(url)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Image URL (optional)</Label>
      <div className="flex gap-2">
        <Input
          id="image"
          value={customUrl}
          onChange={(e) => handleCustomUrlChange(e.target.value)}
          placeholder="Enter custom URL or choose from library"
        />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="icon">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Choose an Image</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[500px] pr-4">
              {images.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No images found in public folder</p>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {images.map((imagePath) => (
                    <button
                      key={imagePath}
                      type="button"
                      onClick={() => handleSelectImage(imagePath)}
                      className="group relative aspect-video overflow-hidden rounded-lg border-2 border-transparent hover:border-primary transition-all"
                    >
                      <img
                        src={imagePath || "/placeholder.svg"}
                        alt={imagePath}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ExternalLink className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-2 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {imagePath}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
      {customUrl && (
        <div className="mt-2 border rounded-lg overflow-hidden">
          <img
            src={customUrl || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-32 object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=128&width=400"
            }}
          />
        </div>
      )}
    </div>
  )
}
