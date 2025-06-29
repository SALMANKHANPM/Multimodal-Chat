"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ImagePlus, 
  Paperclip, 
  Send, 
  X, 
  FileText, 
  Music, 
  Video,
  Mic,
  Square
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AudioRecorder } from '@/components/AudioRecorder';

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
  placeholder?: string;
}

export function AI_Prompt({ 
  onSendMessage, 
  isLoading = false,
  placeholder = "Type your message..."
}: AI_PromptProps) {
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Determine file type
      let fileType: UploadedFile['type'] = 'document';
      if (file.type.startsWith('image/')) fileType = 'image';
      else if (file.type.startsWith('audio/')) fileType = 'audio';
      else if (file.type.startsWith('video/')) fileType = 'video';

      const uploadedFile: UploadedFile = {
        id: fileId,
        file,
        type: fileType,
      };

      // Create preview for images
      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, preview: e.target?.result as string }
              : f
          ));
        };
        reader.readAsDataURL(file);
      }

      // Create audio URL for audio files
      if (fileType === 'audio') {
        const audioUrl = URL.createObjectURL(file);
        uploadedFile.audioUrl = audioUrl;
      }

      setUploadedFiles(prev => [...prev, uploadedFile]);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Handle audio recording
  const handleAudioCaptured = useCallback((audioBlob: Blob) => {
    const fileId = `audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(audioBlob);

    const uploadedFile: UploadedFile = {
      id: fileId,
      file: audioFile,
      type: 'audio',
      audioUrl,
    };

    setUploadedFiles(prev => [...prev, uploadedFile]);
  }, []);

  // Remove uploaded file
  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.audioUrl) {
        URL.revokeObjectURL(fileToRemove.audioUrl);
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && uploadedFiles.length === 0) return;

    // Send message with files
    onSendMessage(message, uploadedFiles.length > 0 ? uploadedFiles : undefined);
    
    // Clear form
    setMessage('');
    setUploadedFiles([]);
    
    // Clean up object URLs
    uploadedFiles.forEach(file => {
      if (file.audioUrl) {
        URL.revokeObjectURL(file.audioUrl);
      }
    });
  }, [message, uploadedFiles, onSendMessage]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  // Get file icon
  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'image': return <ImagePlus className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* File Previews */}
      {uploadedFiles.length > 0 && (
        <div className="mb-4 p-4 bg-muted/50 rounded-lg border">
          <div className="flex flex-wrap gap-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="relative group">
                {file.type === 'image' && file.preview ? (
                  <div className="relative">
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="h-20 w-20 object-cover rounded-md border"
                    />
                    <button
                      onClick={() => removeFile(file.id)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : file.type === 'audio' && file.audioUrl ? (
                  <div className="flex items-center gap-2 p-2 bg-background rounded-md border min-w-[200px]">
                    <Music className="h-4 w-4 text-muted-foreground" />
                    <audio controls src={file.audioUrl} className="flex-1 h-8" />
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-background rounded-md border min-w-[150px]">
                    {getFileIcon(file.type)}
                    <span className="text-sm truncate flex-1">{file.file.name}</span>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-2 p-4 bg-background border rounded-lg shadow-sm">
          {/* File Upload Button */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isRecording}
              className="h-10 w-10"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            
            {/* Audio Recorder */}
            <AudioRecorder
              onAudioCaptured={handleAudioCaptured}
              onRecordingStateChange={setIsRecording}
              sourceLang="tel"
            />
          </div>

          {/* Text Input */}
          <div className="flex-1">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading || isRecording}
              className="border-0 shadow-none focus-visible:ring-0 resize-none min-h-[40px]"
            />
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || isRecording || (!message.trim() && uploadedFiles.length === 0)}
            className="h-10 w-10"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </form>
    </div>
  );
}