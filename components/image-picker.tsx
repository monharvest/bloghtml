"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, ExternalLink, Upload, Loader2 } from "lucide-react"

interface ImagePickerProps {
  value: string
  onChange: (value: string) => void
}

export function ImagePicker({ value, onChange }: ImagePickerProps) {
  const [images, setImages] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [customUrl, setCustomUrl] = useState(value)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
      return
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      
      if (result.success) {
        // Add new image to the list and select it
        setImages(prev => [result.url, ...prev])
        handleSelectImage(result.url)
        
        // Refresh the images list
        setTimeout(() => {
          fetch("/api/images")
            .then((res) => res.json())
            .then((data) => setImages(data.images || []))
            .catch((err) => console.error("Failed to refresh images:", err))
        }, 1000)
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Image (optional)</Label>
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
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Choose or Upload an Image</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="browse" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="browse">Browse Images</TabsTrigger>
                <TabsTrigger value="upload">Upload New</TabsTrigger>
              </TabsList>
              
              <TabsContent value="browse" className="mt-4">
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
              </TabsContent>
              
              <TabsContent value="upload" className="mt-4">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                    {uploading ? (
                      <div className="space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Uploading image...</p>
                          <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                          <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <div>
                          <Button 
                            type="button" 
                            onClick={triggerFileUpload}
                            className="mb-2"
                          >
                            Choose Image to Upload
                          </Button>
                          <p className="text-sm text-muted-foreground">
                            Supports JPEG, PNG, GIF, WebP • Max 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Local Development:</strong> Images saved to /public folder</p>
                    <p><strong>Production:</strong> Images uploaded to Cloudflare R2 bucket</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
