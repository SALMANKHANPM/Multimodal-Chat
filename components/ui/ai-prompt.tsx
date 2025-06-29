"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Paperclip, 
  Send, 
  X, 
  Image as ImageIcon, 
  FileText, 
  Mic,
  Volume2,
  Download
} from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VoiceChat } from "@/components/ui/voice-chat";

// File type definitions
export interface UploadedFile {
  id: string;
  file: File;
  type: 'audio' | 'document' | 'image' | 'video';
  preview?: string;
  audioUrl?: string;
}

interface AI_PromptProps {
  onSendMessage?: (message: string, files?: UploadedFile[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
}

// Utility functions
const getFileType = (file: File): UploadedFile['type'] => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('video/')) return 'video';
  return 'document';
};

const createFilePreview = async (file: File): Promise<string | undefined> => {
  if (file.type.startsWith('image/')) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }
  return undefined;
};

const truncateFilename = (filename: string, maxLength: number = 15): string => {
  if (filename.length <= maxLength) return filename;
  
  const extension = filename.split('.').pop();
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
  
  if (extension) {
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 4);
    return `${truncatedName}...${extension}`;
  }
  
  return `${filename.substring(0, maxLength - 3)}...`;
};

export function AI_Prompt({
  onSendMessage,
  isLoading = false,
  placeholder = "Type your message...",
  maxFiles = 5,
  acceptedFileTypes = [
    'image/*',
    'audio/*',
    'application/pdf',
    'text/*',
    '.doc',
    '.docx',
    '.txt',
    '.md'
  ],
  maxFileSize = 10 * 1024 * 1024, // 10MB
}: AI_PromptProps) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isVoiceDialogOpen, setIsVoiceDialogOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleFileSelect = useCallback(async (selectedFiles: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < selectedFiles.length && files.length + newFiles.length < maxFiles; i++) {
      const file = selectedFiles[i];
      
      // Check file size
      if (file.size > maxFileSize) {
        alert(`File "${file.name}" is too large. Maximum size is ${formatFileSize(maxFileSize)}.`);
        continue;
      }
      
      const fileType = getFileType(file);
      const preview = await createFilePreview(file);
      
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${i}`,
        file,
        type: fileType,
        preview,
        audioUrl: fileType === 'audio' ? URL.createObjectURL(file) : undefined,
      };
      
      newFiles.push(uploadedFile);
    }
    
    setFiles(prev => [...prev, ...newFiles]);
  }, [files.length, maxFiles, maxFileSize]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.audioUrl) {
        URL.revokeObjectURL(fileToRemove.audioUrl);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleSend = () => {
    if ((!message.trim() && files.length === 0) || isLoading) return;
    
    onSendMessage?.(message, files);
    setMessage("");
    setFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceRecordingStart = () => {
    setIsRecording(true);
  };

  const handleVoiceRecordingStop = (duration: number) => {
    setIsRecording(false);
  };

  const handleAudioCaptured = (audioBlob: Blob) => {
    // Create a File object from the blob
    const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
      type: 'audio/webm'
    });
    
    // Add to files
    const uploadedFile: UploadedFile = {
      id: `audio-${Date.now()}`,
      file: audioFile,
      type: 'audio',
      audioUrl: URL.createObjectURL(audioBlob),
    };
    
    setFiles(prev => [...prev, uploadedFile]);
    setIsVoiceDialogOpen(false);
  };

  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-blue-500" />;
      case 'audio':
        return <Volume2 className="w-4 h-4 text-green-500" />;
      case 'video':
        return <Volume2 className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <>
      <div 
        className={cn(
          "relative bg-background border border-border rounded-2xl shadow-sm transition-all duration-200",
          isDragOver && "border-primary bg-primary/5",
          "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* File Previews */}
        {files.length > 0 && (
          <div className="p-3 border-b border-border">
            <div className="flex flex-wrap gap-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 bg-muted rounded-lg p-2 pr-1 max-w-[200px] group"
                >
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" title={file.file.name}>
                      <span className="sm:hidden">{truncateFilename(file.file.name, 8)}</span>
                      <span className="hidden sm:inline">{truncateFilename(file.file.name, 15)}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.file.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-end gap-2 p-3">
          {/* Attachment Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || files.length >= maxFiles}
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          {/* Voice Recording Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 flex-shrink-0"
            onClick={() => setIsVoiceDialogOpen(true)}
            disabled={isLoading}
          >
            <Mic className="w-4 h-4" />
          </Button>

          {/* Text Input */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 min-h-[40px] max-h-[120px] resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent"
            rows={1}
          />

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={isLoading || (!message.trim() && files.length === 0)}
            size="sm"
            className="h-8 w-8 p-0 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Drag Overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-2xl flex items-center justify-center">
            <p className="text-primary font-medium">Drop files here</p>
          </div>
        )}
      </div>

      {/* Voice Recording Dialog */}
      <Dialog open={isVoiceDialogOpen} onOpenChange={setIsVoiceDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Voice Recording</DialogTitle>
          </DialogHeader>
          <VoiceChat
            onStart={handleVoiceRecordingStart}
            onStop={handleVoiceRecordingStop}
            onAudioCaptured={handleAudioCaptured}
            isRecording={isRecording}
            onToggleRecording={() => setIsRecording(!isRecording)}
            className="min-h-[300px]"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}