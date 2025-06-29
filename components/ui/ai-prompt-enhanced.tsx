"use client";

import { ArrowRight, Paperclip, Mic, X, FileText, Music, Video, Image, Play, Pause, Loader2, Volume2, VolumeX, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Import existing UI components
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;

      const newHeight = Math.max(
        minHeight,
        Math.min(
          textarea.scrollHeight,
          maxHeight ?? Number.POSITIVE_INFINITY
        )
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export interface UploadedFile {
  id: string;
  file: File;
  type: 'audio' | 'document' | 'image' | 'video';
  preview?: string;
  audioUrl?: string;
}

interface AudioRecording {
  id: string;
  blob: Blob;
  duration: number;
  timestamp: Date;
}

interface VoiceRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordingComplete: (recording: AudioRecording) => void;
}

interface AudioPreviewProps {
  file: UploadedFile;
  isRecording?: AudioRecording;
  onRemove: () => void;
}

function AudioPreview({ file, isRecording, onRemove }: AudioPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !file.audioUrl) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [file.audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={file.audioUrl} preload="metadata" />
      
      <div className="flex items-center gap-2 w-full">
        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
          <Music className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.file.size)}
          </p>
        </div>
        <button
          onClick={togglePlayPause}
          className="p-1.5 hover:bg-muted rounded transition-colors"
          aria-label={isPlaying ? "Stop" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Play className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        <button
          onClick={onRemove}
          className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
          aria-label="Remove file"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </>
  );
}

function VoiceRecorder({ isOpen, onClose, onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>(Array(32).fill(0));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      // Start audio analysis for waveform
      if (analyserRef.current) {
        const updateWaveform = () => {
          const dataArray = new Uint8Array(analyserRef.current!.frequencyBinCount);
          analyserRef.current!.getByteFrequencyData(dataArray);
          
          const waveform = Array(32).fill(0).map((_, i) => {
            const index = Math.floor((i / 32) * dataArray.length);
            return (dataArray[index] / 255) * 100;
          });
          
          setWaveformData(waveform);
          setVolume(Math.max(...waveform));
          
          if (isRecording) {
            animationRef.current = requestAnimationFrame(updateWaveform);
          }
        };
        updateWaveform();
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setWaveformData(Array(32).fill(0));
      setVolume(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      // Setup audio context for visualization
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Check for supported MIME types
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/wav'
      ];
      
      let selectedMimeType = 'audio/wav';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: selectedMimeType
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: selectedMimeType });
        const recording: AudioRecording = {
          id: Math.random().toString(36).substr(2, 9),
          blob: audioBlob,
          duration,
          timestamp: new Date()
        };
        onRecordingComplete(recording);
        
        // Cleanup
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setIsRecording(false);
        setIsProcessing(false);
      };

      mediaRecorderRef.current.start(100); // Collect data every 100ms
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsRecording(false);
      setIsProcessing(true);
      mediaRecorderRef.current.stop();
      
      setTimeout(() => {
        setIsProcessing(false);
        setDuration(0);
        onClose();
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusText = () => {
    if (isProcessing) return "Processing...";
    if (isRecording) return "Recording...";
    return "Tap to start recording";
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-background border rounded-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden shadow-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative z-10 flex flex-col items-center space-y-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Main recording button */}
          <motion.div className="relative">
            <motion.button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={cn(
                "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300",
                "bg-primary text-primary-foreground border-2",
                isRecording ? "border-red-500 shadow-lg shadow-red-500/25" :
                isProcessing ? "border-yellow-500 shadow-lg shadow-yellow-500/25" :
                "border-primary hover:border-primary/80"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </motion.div>
                ) : isRecording ? (
                  <motion.div
                    key="recording"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="w-6 h-6 bg-red-500 rounded-sm" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Mic className="w-8 h-8" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Waveform visualizer */}
          <div className="flex items-center justify-center space-x-1 h-12">
            {waveformData.map((height, index) => (
              <motion.div
                key={index}
                className={cn(
                  "w-1 rounded-full transition-colors duration-300",
                  isRecording ? "bg-red-500" :
                  isProcessing ? "bg-yellow-500" :
                  "bg-muted"
                )}
                animate={{
                  height: `${Math.max(4, height * 0.4)}px`,
                  opacity: isRecording ? 1 : 0.3
                }}
                transition={{
                  duration: 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Status and timer */}
          <div className="text-center space-y-2">
            <motion.p
              className={cn(
                "text-lg font-medium transition-colors",
                isRecording ? "text-red-500" :
                isProcessing ? "text-yellow-500" :
                "text-foreground"
              )}
            >
              {getStatusText()}
            </motion.p>
            
            <p className="text-sm text-muted-foreground font-mono">
              {formatTime(duration)}
            </p>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            {isRecording ? "Tap the button to stop recording" : "Tap the microphone to start recording"}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface AI_PromptEnhancedProps {
  onSendMessage?: (message: string, files: UploadedFile[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function AI_PromptEnhanced({ onSendMessage, isLoading = false, disabled = false }: AI_PromptEnhancedProps) {
  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 56,
    maxHeight: 200,
  });
  const [selectedModel, setSelectedModel] = useState("GPT-4-1 Mini");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isVoiceRecorderOpen, setIsVoiceRecorderOpen] = useState(false);
  const [audioRecordings, setAudioRecordings] = useState<AudioRecording[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const AI_MODELS = [
    "GPT-4-1 Mini",
    "Claude 3.5 Sonnet",
    "Gemini 2.5 Flash",
    "GPT-4o",
    "Claude 3.5 Haiku",
    "Gemini 1.5 Pro",
    "Llama 3.3 70B",
    "DeepSeek V3",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!value.trim() && uploadedFiles.length === 0) || disabled || isLoading) return;

    // Call the parent callback with message and files
    onSendMessage?.(value, uploadedFiles);

    // Clear the form
    setValue("");
    setUploadedFiles([]);
    adjustHeight(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustHeight();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = async (files: File[]) => {
    const newFiles: UploadedFile[] = [];

    for (const file of files) {
      const fileType = getFileType(file);
      const fileId = Math.random().toString(36).substr(2, 9);

      let preview: string | undefined;
      let audioUrl: string | undefined;

      if (fileType === 'image') {
        preview = URL.createObjectURL(file);
      } else if (fileType === 'audio') {
        audioUrl = URL.createObjectURL(file);
      }

      newFiles.push({
        id: fileId,
        file,
        type: fileType,
        preview,
        audioUrl,
      });
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const getFileType = (file: File): 'audio' | 'document' | 'image' | 'video' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Clean up object URLs
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      if (fileToRemove?.audioUrl) {
        URL.revokeObjectURL(fileToRemove.audioUrl);
      }
      return updated;
    });
  };

  const handleRecordingComplete = (recording: AudioRecording) => {
    const audioUrl = URL.createObjectURL(recording.blob);
    const audioFile: UploadedFile = {
      id: recording.id,
      file: new File([recording.blob], `recording-${recording.id}.wav`, { type: 'audio/wav' }),
      type: 'audio',
      audioUrl,
    };
    setUploadedFiles(prev => [...prev, audioFile]);
    setAudioRecordings(prev => [...prev, recording]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border bg-background transition-all duration-200 shadow-sm",
            isDragOver ? "border-primary bg-primary/5" : "border-border",
            "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* File previews */}
          <AnimatePresence>
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-border p-3"
              >
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="relative group"
                    >
                      {file.type === 'image' && file.preview ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={file.preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(file.id)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ) : file.type === 'audio' ? (
                        <div className="w-48 p-2 rounded-lg bg-muted border relative">
                          <AudioPreview
                            file={file}
                            onRemove={() => removeFile(file.id)}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted border relative">
                          <div className="w-8 h-8 rounded bg-muted-foreground/10 flex items-center justify-center">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.file.size)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(file.id)}
                            className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input area */}
          <div className="flex items-end gap-3 p-4">
            {/* Model selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 text-sm font-medium text-muted-foreground hover:text-foreground shrink-0 border border-border"
                  disabled={disabled}
                >
                  {selectedModel}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {AI_MODELS.map((model) => (
                  <DropdownMenuItem
                    key={model}
                    onClick={() => setSelectedModel(model)}
                    className="text-sm"
                  >
                    <div className="flex items-center gap-2 w-full">
                      {model === selectedModel && <Check className="w-4 h-4 text-primary" />}
                      <span className={model === selectedModel ? "font-medium" : ""}>
                        {model}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Text input */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Message AI..."
                className="min-h-[56px] max-h-[200px] resize-none border-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                disabled={disabled}
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* File upload */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-muted"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                title="Attach files"
              >
                <Paperclip className="w-5 h-5" />
              </Button>

              {/* Voice recorder */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-muted"
                onClick={() => setIsVoiceRecorderOpen(true)}
                disabled={disabled}
                title="Record voice message"
              >
                <Mic className="w-5 h-5" />
              </Button>

              {/* Send button */}
              <Button
                type="submit"
                size="icon"
                className="h-9 w-9"
                disabled={disabled || isLoading || (!value.trim() && uploadedFiles.length === 0)}
                title="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Drag overlay */}
          <AnimatePresence>
            {isDragOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-2xl flex items-center justify-center"
              >
                <div className="text-center">
                  <Paperclip className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-primary">Drop files here</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </form>

      {/* Voice recorder modal */}
      <AnimatePresence>
        {isVoiceRecorderOpen && (
          <VoiceRecorder
            isOpen={isVoiceRecorderOpen}
            onClose={() => setIsVoiceRecorderOpen(false)}
            onRecordingComplete={handleRecordingComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Export types for use in other components
export type { AudioRecording };