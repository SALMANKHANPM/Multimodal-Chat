"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  Mic,
  X,
  Play,
  Pause,
  Download
} from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import { VoiceChat } from "@/components/ui/voice-chat";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    '.pdf',
    '.doc',
    '.docx',
    '.txt',
    '.rtf'
  ]
}: AI_PromptProps) {
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isVoiceChatOpen, setIsVoiceChatOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120); // Max height of ~6 lines
      textarea.style.height = `${newHeight}px`;
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!message.trim() && uploadedFiles.length === 0) || isLoading) return;
    
    onSendMessage?.(message, uploadedFiles);
    setMessage("");
    setUploadedFiles([]);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
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
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      if (fileToRemove?.audioUrl) {
        URL.revokeObjectURL(fileToRemove.audioUrl);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleVoiceRecording = (audioBlob: Blob) => {
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
  };

  // Truncate filename for mobile display
  const truncateFilename = (filename: string, maxLength: number = 10): string => {
    if (!filename || filename.length <= maxLength) return filename;
    
    const extension = filename.split('.').pop();
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
    
    if (extension) {
      const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 1);
      return `${truncatedName}...${extension}`;
    }
    
    return `${filename.substring(0, maxLength)}...`;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-blue-500" />;
      case 'audio':
        return <Mic className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <>
      <div className="w-full bg-background border border-border rounded-2xl shadow-sm">
        {/* File previews */}
        {uploadedFiles.length > 0 && (
          <div className="p-3 border-b border-border">
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file) => (
                <FilePreview
                  key={file.id}
                  file={file}
                  onRemove={() => removeFile(file.id)}
                  truncateFilename={truncateFilename}
                  getFileIcon={getFileIcon}
                />
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="flex items-end gap-2 p-3">
          {/* File upload button */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || uploadedFiles.length >= maxFiles}
                  className="flex-shrink-0 h-9 w-9"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                Attach files ({uploadedFiles.length}/{maxFiles})
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Voice recording button */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsVoiceChatOpen(true)}
                  disabled={isLoading}
                  className="flex-shrink-0 h-9 w-9"
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                Record voice message
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Text input */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 min-h-[36px] max-h-[120px] resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent"
            rows={1}
          />

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={(!message.trim() && uploadedFiles.length === 0) || isLoading}
            size="icon"
            className="flex-shrink-0 h-9 w-9"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Voice Chat Dialog */}
      <VoiceChat
        isOpen={isVoiceChatOpen}
        onOpenChange={setIsVoiceChatOpen}
        onAudioCaptured={handleVoiceRecording}
        sourceLang="Telugu"
      />
    </>
  );
}

// File preview component
interface FilePreviewProps {
  file: UploadedFile;
  onRemove: () => void;
  truncateFilename: (filename: string, maxLength?: number) => string;
  getFileIcon: (type: string) => JSX.Element;
}

function FilePreview({ file, onRemove, truncateFilename, getFileIcon }: FilePreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const downloadFile = () => {
    const url = file.audioUrl || file.preview || URL.createObjectURL(file.file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayName = file.file.name;
  const truncatedName = truncateFilename(displayName, 12);

  return (
    <div className="relative bg-muted/50 rounded-lg p-2 border border-border/50 max-w-full">
      <div className="flex items-center gap-2 min-w-0">
        {/* File icon or image preview */}
        <div className="flex-shrink-0">
          {file.type === 'image' && file.preview ? (
            <img
              src={file.preview}
              alt={file.file.name}
              className="w-8 h-8 object-cover rounded"
            />
          ) : (
            getFileIcon(file.type)
          )}
        </div>

        {/* File info */}
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

        {/* Audio controls */}
        {file.type === 'audio' && file.audioUrl && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <audio
              ref={audioRef}
              src={file.audioUrl}
              onEnded={handleAudioEnded}
              className="hidden"
            />
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleAudio}
                    className="h-6 w-6"
                  >
                    {isPlaying ? (
                      <Pause className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {isPlaying ? 'Pause' : 'Play'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Download button */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={downloadFile}
                className="h-6 w-6 flex-shrink-0"
              >
                <Download className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Download</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Remove button */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="h-6 w-6 flex-shrink-0 text-destructive hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Remove</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}