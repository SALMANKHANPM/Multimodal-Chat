"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  RiSendPlaneFill,
  RiAttachmentLine,
  RiImageLine,
  RiFileTextLine,
  RiVolumeUpLine,
  RiMicLine,
  RiStopLine,
  RiDeleteBinLine,
  RiCloseLine,
} from "@remixicon/react";
import { cn } from "@/lib/utils";

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
}

export function AI_Prompt({
  onSendMessage,
  isLoading = false,
  placeholder = "Type your message...",
  maxFiles = 5,
  acceptedFileTypes = [
    'image/*',
    'audio/*',
    'application/pdf',
    '.doc,.docx,.txt,.rtf'
  ]
}: AI_PromptProps) {
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAttachments, setShowAttachments] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFileType = (file: File): UploadedFile['type'] => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles: UploadedFile[] = files.map(file => {
      const fileType = getFileType(file);
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        type: fileType,
      };

      // Create preview for images
      if (fileType === 'image') {
        newFile.preview = URL.createObjectURL(file);
      }

      // Create audio URL for audio files
      if (fileType === 'audio') {
        newFile.audioUrl = URL.createObjectURL(file);
      }

      return newFile;
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setShowAttachments(false);
    
    // Clear the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      if (fileToRemove?.audioUrl) {
        URL.revokeObjectURL(fileToRemove.audioUrl);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
          type: 'audio/webm'
        });

        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          file: audioFile,
          type: 'audio',
          audioUrl: URL.createObjectURL(audioBlob)
        };

        setUploadedFiles(prev => [...prev, newFile]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = () => {
    if ((!message.trim() && uploadedFiles.length === 0) || isLoading) return;
    
    onSendMessage?.(message, uploadedFiles);
    setMessage("");
    setUploadedFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'image': return <RiImageLine size={16} className="text-blue-500" />;
      case 'audio': return <RiVolumeUpLine size={16} className="text-green-500" />;
      case 'video': return <RiVolumeUpLine size={16} className="text-purple-500" />;
      default: return <RiFileTextLine size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* File Previews - Mobile optimized */}
      {uploadedFiles.length > 0 && (
        <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-muted/50 rounded-lg border">
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 bg-background rounded-md p-2 border text-sm max-w-full"
              >
                {getFileIcon(file.type)}
                <span className="truncate flex-1 text-xs sm:text-sm">
                  {file.file.name}
                </span>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-muted-foreground hover:text-destructive p-0.5 rounded-full hover:bg-destructive/10 transition-colors flex-shrink-0"
                >
                  <RiCloseLine size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recording Indicator - Mobile optimized */}
      {isRecording && (
        <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                Recording... {formatTime(recordingTime)}
              </span>
            </div>
            <Button
              onClick={stopRecording}
              size="sm"
              variant="destructive"
              className="h-7 px-2 sm:h-8 sm:px-3"
            >
              <RiStopLine size={14} className="sm:w-4 sm:h-4" />
              <span className="ml-1 text-xs sm:text-sm">Stop</span>
            </Button>
          </div>
        </div>
      )}

      {/* Main Input Area - Mobile optimized */}
      <div className="relative bg-background border border-border rounded-xl shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
        <div className="flex items-end gap-2 p-2 sm:p-3">
          {/* Attachment Button - Mobile optimized */}
          <div className="relative flex-shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAttachments(!showAttachments)}
                    disabled={isLoading}
                    className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground"
                  >
                    <RiAttachmentLine size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach files</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Attachment Menu - Mobile optimized */}
            {showAttachments && (
              <div className="absolute bottom-full left-0 mb-2 bg-background border border-border rounded-lg shadow-lg p-2 min-w-[140px] sm:min-w-[160px] z-10">
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowAttachments(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted rounded-md transition-colors"
                  >
                    <RiImageLine size={16} />
                    <span>Upload Files</span>
                  </button>
                  <button
                    onClick={() => {
                      if (isRecording) {
                        stopRecording();
                      } else {
                        startRecording();
                      }
                      setShowAttachments(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted rounded-md transition-colors"
                  >
                    <RiMicLine size={16} />
                    <span>{isRecording ? 'Stop Recording' : 'Record Audio'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Text Input - Mobile optimized */}
          <div className="flex-1 min-w-0">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              className="min-h-[36px] sm:min-h-[40px] max-h-[120px] resize-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-sm sm:text-base p-0"
              rows={1}
            />
          </div>

          {/* Send Button - Mobile optimized */}
          <div className="flex-shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleSend}
                    disabled={(!message.trim() && uploadedFiles.length === 0) || isLoading}
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-9 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <RiSendPlaneFill size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Send message</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Click outside to close attachments */}
      {showAttachments && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowAttachments(false)}
        />
      )}
    </div>
  );
}