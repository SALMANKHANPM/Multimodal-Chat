"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Paperclip,
  Send,
  Mic,
  X,
  Image as ImageIcon,
  FileText,
  Volume2,
  Square,
  Loader2,
} from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the UploadedFile interface
interface UploadedFile {
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
}

// Utility function to truncate filename for mobile
function truncateFilename(filename: string, maxLength: number = 10): string {
  if (!filename || filename.length <= maxLength) return filename;
  
  const extension = filename.split('.').pop();
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
  
  if (extension) {
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 1);
    return `${truncatedName}...${extension}`;
  }
  
  return `${filename.substring(0, maxLength)}...`;
}

export function AI_Prompt({
  onSendMessage,
  isLoading = false,
  placeholder = "Type your message...",
  maxFiles = 5,
}: AI_PromptProps) {
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Handle recording timer
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
        if (file.audioUrl) URL.revokeObjectURL(file.audioUrl);
      });
    };
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files at once.`);
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
    
    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };

  const getFileType = (file: File): 'audio' | 'document' | 'image' | 'video' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        if (fileToRemove.preview) URL.revokeObjectURL(fileToRemove.preview);
        if (fileToRemove.audioUrl) URL.revokeObjectURL(fileToRemove.audioUrl);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });
      
      // Try different MIME types for better compatibility
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/wav'
      ];
      
      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }
      
      if (!selectedMimeType) {
        throw new Error('No supported audio format found');
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        audioBitsPerSecond: 128000,
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { 
          type: selectedMimeType || 'audio/webm' 
        });
        
        if (audioBlob.size > 0) {
          const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
            type: selectedMimeType || 'audio/webm'
          });

          const newFile: UploadedFile = {
            id: Math.random().toString(36).substr(2, 9),
            file: audioFile,
            type: 'audio',
            audioUrl: URL.createObjectURL(audioBlob),
          };

          setUploadedFiles(prev => [...prev, newFile]);
        }
        
        // Cleanup
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording with data collection every 100ms
      mediaRecorder.start(100);
      setIsRecording(true);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check your permissions.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSend = () => {
    if ((!message.trim() && uploadedFiles.length === 0) || isLoading) return;
    
    onSendMessage?.(message, uploadedFiles);
    setMessage("");
    setUploadedFiles([]);
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'audio': return <Volume2 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Recording Modal Overlay - This will blur everything behind it including sidebar */}
      {isRecording && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-background rounded-2xl p-8 shadow-2xl border max-w-sm w-full mx-4">
            <div className="text-center space-y-6">
              {/* Close button */}
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={stopRecording}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Microphone Icon */}
              <div className="relative">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Mic className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping"></div>
              </div>

              {/* Recording Status */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Recording...</h3>
                <div className="text-2xl font-mono font-bold text-primary">
                  {formatTime(recordingTime)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Tap the microphone to start recording
                </p>
              </div>

              {/* Waveform Animation */}
              <div className="flex items-center justify-center space-x-1 h-8">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 24 + 8}px`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '1s'
                    }}
                  />
                ))}
              </div>

              {/* Stop Button */}
              <Button
                onClick={stopRecording}
                variant="destructive"
                size="lg"
                className="w-full"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Recording
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Prompt Container */}
      <div className="w-full">
        <div className="bg-background border border-border rounded-2xl shadow-lg overflow-hidden">
          {/* File Previews */}
          {uploadedFiles.length > 0 && (
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file) => {
                  const displayName = file.file.name;
                  const truncatedName = truncateFilename(displayName, 12);
                  
                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 bg-background rounded-lg p-2 border border-border/50 shadow-sm max-w-full"
                    >
                      <div className="flex-shrink-0 text-muted-foreground">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-xs font-medium truncate cursor-help">
                                <span className="sm:hidden">{truncatedName}</span>
                                <span className="hidden sm:inline">{displayName}</span>
                              </p>
                            </TooltipTrigger>
                            {displayName !== truncatedName && (
                              <TooltipContent side="top" className="max-w-xs break-all">
                                {displayName}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.file.size)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id)}
                        className="h-6 w-6 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4">
            <div className="flex items-end gap-3">
              {/* Attachment Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 h-10 w-10 rounded-full hover:bg-muted"
                    disabled={isLoading}
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload Image
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Document
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Upload Audio
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Text Input */}
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="min-h-[2.5rem] max-h-32 resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent p-0 text-base"
                  disabled={isLoading}
                  rows={1}
                />
              </div>

              {/* Voice Recording Button */}
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={startRecording}
                      className="flex-shrink-0 h-10 w-10 rounded-full hover:bg-muted"
                      disabled={isLoading || isRecording}
                    >
                      <Mic className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Record voice message</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={isLoading || (!message.trim() && uploadedFiles.length === 0)}
                className="flex-shrink-0 h-10 w-10 rounded-full p-0"
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </>
  );
}