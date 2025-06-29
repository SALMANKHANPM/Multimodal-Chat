"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ImagePlus, 
  Mic, 
  Send, 
  X, 
  FileText, 
  Music, 
  Video,
  Paperclip
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define the UploadedFile interface
export interface UploadedFile {
  id: string;
  file: File;
  type: 'audio' | 'document' | 'image' | 'video';
  preview?: string;
  audioUrl?: string;
}

interface AI_PromptProps {
  onSendMessage: (message: string, files?: UploadedFile[]) => void;
  isLoading?: boolean;
}

export function AI_Prompt({ onSendMessage, isLoading = false }: AI_PromptProps) {
  const [input, setInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): UploadedFile['type'] => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'image': return <ImagePlus className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
    }
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const fileType = getFileType(file);
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const newFile: UploadedFile = {
        id: fileId,
        file,
        type: fileType,
      };

      // Create preview for images
      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          setUploadedFiles(prev => 
            prev.map(f => f.id === fileId ? { ...f, preview } : f)
          );
        };
        reader.readAsDataURL(file);
      }

      // Create audio URL for audio files
      if (fileType === 'audio') {
        const audioUrl = URL.createObjectURL(file);
        newFile.audioUrl = audioUrl;
      }

      setUploadedFiles(prev => [...prev, newFile]);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.audioUrl) {
        URL.revokeObjectURL(fileToRemove.audioUrl);
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() && uploadedFiles.length === 0) return;
    
    onSendMessage(input, uploadedFiles);
    setInput("");
    
    // Clean up uploaded files
    uploadedFiles.forEach(file => {
      if (file.audioUrl) {
        URL.revokeObjectURL(file.audioUrl);
      }
    });
    setUploadedFiles([]);
  }, [input, uploadedFiles, onSendMessage]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* File Preview Area */}
      {uploadedFiles.length > 0 && (
        <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border/50">
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="relative group flex items-center gap-2 bg-background rounded-md border border-border/50 p-2 shadow-sm"
              >
                {file.type === 'image' && file.preview ? (
                  <div className="relative">
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="h-12 w-12 object-cover rounded border"
                    />
                  </div>
                ) : file.type === 'audio' && file.audioUrl ? (
                  <div className="flex items-center gap-2 min-w-[200px]">
                    <Music className="h-4 w-4 text-muted-foreground" />
                    <audio
                      controls
                      src={file.audioUrl}
                      className="h-8 flex-1"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {getFileIcon(file.type)}
                    <span className="text-sm font-medium truncate max-w-[120px]">
                      {file.file.name}
                    </span>
                  </div>
                )}
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-2 p-3 bg-background rounded-xl border border-border/50 shadow-sm">
          {/* File Upload Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Text Input */}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          {/* Send Button */}
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}