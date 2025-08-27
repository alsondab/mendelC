'use client'

import { UploadButton } from '@/lib/uploadthing'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function UploadTest() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const { toast } = useToast()

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Test Uploadthing</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Upload Button</h3>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res) {
                setUploadedFiles(prev => [...prev, ...res.map(file => file.url)])
                toast({
                  description: "Upload completed successfully!",
                })
              }
            }}
            onUploadError={(error: Error) => {
              toast({
                description: `Upload failed: ${error.message}`,
                variant: "destructive",
              })
            }}
          />
        </div>

        {uploadedFiles.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Uploaded Files:</h3>
            <div className="space-y-2">
              {uploadedFiles.map((url, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
