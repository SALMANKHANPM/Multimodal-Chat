"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Paperclip, 
  Mic, 
  Square, 
  Volume2, 
  VolumeX, 
  Loader2, 
  X, 
  Image as ImageIcon, 
  FileText, 
  Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// File upload types
interface UploadedFile {
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
  maxLength?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocity: { x: number; y: number };
}

// Voice recording hook
function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [volume, setVolume] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>(Array(32).fill(0));
  const [error, setError] = useState<string>("");
  const [isSupported, setIsSupported] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const volumeAnimationRef = useRef<number>();
  const animationRef = useRef<number>();
  const chunksRef = useRef<Blob[]>([]);

  // Check browser support
  useEffect(() => {
    const checkSupport = () => {
      const hasMediaRecorder = 'MediaRecorder' in window;
      const hasAudioContext = 'AudioContext' in window || 'webkitAudioContext' in window;
      
      setIsSupported(hasMediaRecorder && hasAudioContext);
      
      if (!hasMediaRecorder) {
        setError("Media recording not supported");
      } else if (!hasAudioContext) {
        setError("Audio context not supported");
      }
    };

    checkSupport();
  }, []);

  // Generate particles for ambient effect
  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 400,
          y: Math.random() * 400,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.3 + 0.1,
          velocity: {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5,
          },
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x: (particle.x + particle.velocity.x + 400) % 400,
          y: (particle.y + particle.velocity.y + 400) % 400,
          opacity: particle.opacity + (Math.random() - 0.5) * 0.02,
        }))
      );
      animationRef.current = requestAnimationFrame(animateParticles);
    };

    animationRef.current = requestAnimationFrame(animateParticles);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Audio volume detection
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate volume
    const sum = dataArray.reduce((a, b) => a + b, 0);
    const average = sum / dataArray.length;
    const volumePercent = (average / 255) * 100;

    setVolume(volumePercent);

    // Update waveform visualization
    const waveform = Array.from({ length: 32 }, (_, i) => {
      const index = Math.floor((i / 32) * dataArray.length);
      return (dataArray[index] / 255) * 100;
    });
    setWaveformData(waveform);

    if (isRecording) {
      volumeAnimationRef.current = requestAnimationFrame(analyzeAudio);
    }
  }, [isRecording]);

  // Setup audio context and analyzer
  const setupAudioAnalysis = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      streamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Setup media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        return audioBlob;
      };
      
      analyzeAudio();
    } catch (error) {
      console.error('Error setting up audio analysis:', error);
      setError('Failed to access microphone');
    }
  }, [analyzeAudio]);

  // Timer
  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (!isRecording) {
        setWaveformData(Array(32).fill(0));
        setVolume(0);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    if (!isSupported) {
      setError("Voice recording not supported");
      return;
    }

    try {
      setError("");
      setIsRecording(true);
      setDuration(0);

      await setupAudioAnalysis();

      // Start media recorder
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.start();
      }
    } catch (error) {
      console.error('Error starting voice recording:', error);
      setError('Failed to start voice recording');
      setIsRecording(false);
    }
  };

  const stopRecording = useCallback(() => {
    return new Promise<Blob>((resolve, reject) => {
      setIsRecording(false);
      setIsProcessing(true);

      // Stop audio analysis
      if (volumeAnimationRef.current) {
        cancelAnimationFrame(volumeAnimationRef.current);
      }

      // Stop media recorder and get blob
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.onstop = () => {
          try {
            const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
            resolve(audioBlob);
          } catch (error) {
            reject(error);
          } finally {
            // Cleanup
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
              audioContextRef.current.close();
            }
            setIsProcessing(false);
            setDuration(0);
          }
        };
        mediaRecorderRef.current.stop();
      } else {
        // Cleanup and reject if recorder not in expected state
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        setIsProcessing(false);
        setDuration(0);
        reject(new Error('Recording not in progress'));
      }
    });
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    isRecording,
    isProcessing,
    volume,
    duration,
    waveformData,
    error,
    isSupported,
    particles,
    startRecording,
    stopRecording,
    formatTime,
  };
}

export function AI_Prompt({ 
  onSendMessage, 
  isLoading = false, 
  placeholder = "What can I do for you?",
  maxLength = 2000 
}: AI_PromptProps) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isRecording,
    isProcessing,
    volume,
    duration,
    waveformData,
    error,
    isSupported,
    particles,
    startRecording,
    stopRecording,
    formatTime,
  } = useVoiceRecording();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if ((!message.trim() && files.length === 0) || isLoading) return;
    
    onSendMessage(message, files);
    setMessage("");
    setFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    selectedFiles.forEach((file) => {
      const fileType = file.type.startsWith('image/') ? 'image' :
                      file.type.startsWith('audio/') ? 'audio' :
                      file.type.startsWith('video/') ? 'video' : 'document';
      
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        type: fileType,
      };

      if (fileType === 'image') {
        newFile.preview = URL.createObjectURL(file);
      } else if (fileType === 'audio') {
        newFile.audioUrl = URL.createObjectURL(file);
      }

      setFiles(prev => [...prev, newFile]);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      if (fileToRemove?.audioUrl) {
        URL.revokeObjectURL(fileToRemove.audioUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleVoiceRecord = async () => {
    if (!isSupported) {
      return;
    }

    setShowVoiceDialog(true);
    await startRecording();
  };

  const handleStopVoiceRecord = async () => {
    try {
      const audioBlob = await stopRecording();
      
      // Create audio file
      const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
        type: 'audio/webm'
      });

      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        file: audioFile,
        type: 'audio',
        audioUrl: URL.createObjectURL(audioBlob),
      };

      setFiles(prev => [...prev, newFile]);
      setShowVoiceDialog(false);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const handleDialogClose = () => {
    if (isRecording) {
      handleStopVoiceRecord();
    } else {
      setShowVoiceDialog(false);
    }
  };

  const getStatusText = () => {
    if (error) return error;
    if (isRecording) return "Recording... (tap to stop)";
    if (isProcessing) return "Processing...";
    return "Tap to start recording";
  };

  const getStatusColor = () => {
    if (error) return "text-red-400";
    if (isRecording) return "text-red-400";
    if (isProcessing) return "text-yellow-400";
    return "text-muted-foreground";
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        {/* File previews */}
        {files.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 px-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="relative flex items-center gap-2 rounded-lg border bg-muted p-2"
              >
                {file.type === 'image' && file.preview && (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="h-8 w-8 rounded object-cover"
                  />
                )}
                {file.type === 'audio' && (
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    {file.audioUrl && (
                      <audio controls className="h-8">
                        <source src={file.audioUrl} type="audio/webm" />
                      </audio>
                    )}
                  </div>
                )}
                {file.type === 'document' && <FileText className="h-4 w-4" />}
                
                <span className="text-sm truncate max-w-32">
                  {file.file.name}
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Main input container */}
        <div className="relative bg-muted/50 rounded-3xl border border-border/50 p-4">
          <div className="flex items-end gap-3">
            {/* Attachment button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="shrink-0 rounded-full h-10 w-10 hover:bg-muted"
                  >
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Attach files</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Voice recording button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleVoiceRecord}
                    disabled={!isSupported || isLoading}
                    className="shrink-0 rounded-full h-10 w-10 hover:bg-muted"
                  >
                    <Mic className={cn("h-5 w-5 text-muted-foreground", error && "text-destructive")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {error || "Record voice message"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Message input */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                maxLength={maxLength}
                className="min-h-[44px] max-h-[120px] resize-none border-0 bg-transparent p-0 text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
              />
            </div>

            {/* Send button */}
            <Button
              onClick={handleSend}
              disabled={(!message.trim() && files.length === 0) || isLoading}
              className="shrink-0 rounded-full h-10 w-10 p-0"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Character count */}
          {message.length > maxLength * 0.8 && (
            <div className="absolute bottom-2 right-16 text-xs text-muted-foreground">
              {message.length}/{maxLength}
            </div>
          )}
        </div>
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

      {/* Voice Recording Dialog */}
      <Dialog open={showVoiceDialog} onOpenChange={handleDialogClose}>
        <DialogContent 
          className="sm:max-w-md cursor-pointer select-none"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onClick={handleDialogClose}
        >
          <DialogHeader>
            <DialogTitle className="sr-only">Voice Recording</DialogTitle>
          </DialogHeader>
          
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-background to-muted/50">
            {/* Ambient particles */}
            <div className="absolute inset-0 overflow-hidden">
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute w-1 h-1 bg-primary/20 rounded-full"
                  style={{
                    left: particle.x * 0.5,
                    top: particle.y * 0.3,
                    opacity: particle.opacity,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Background glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-48 h-48 rounded-full bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 blur-3xl"
                animate={{
                  scale: isRecording ? [1, 1.2, 1] : [1, 1.1, 1],
                  opacity: isRecording ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className="relative z-10 flex flex-col items-center space-y-6 p-8">
              {/* Main voice button */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStopVoiceRecord();
                  }}
                  disabled={!!error}
                  className={cn(
                    "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300",
                    "bg-gradient-to-br from-primary/20 to-primary/10 border-2",
                    error
                      ? "border-red-500 shadow-lg shadow-red-500/25"
                      : isRecording
                      ? "border-red-500 shadow-lg shadow-red-500/25"
                      : isProcessing
                      ? "border-yellow-500 shadow-lg shadow-yellow-500/25"
                      : "border-border hover:border-primary/50",
                    error ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                  )}
                  animate={{
                    boxShadow: isRecording
                      ? [
                          "0 0 0 0 rgba(239, 68, 68, 0.4)",
                          "0 0 0 20px rgba(239, 68, 68, 0)",
                        ]
                      : undefined,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isRecording ? Infinity : 0,
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isProcessing ? (
                      <motion.div
                        key="processing"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                      </motion.div>
                    ) : isRecording ? (
                      <motion.div
                        key="recording"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Square className="w-6 h-6 text-red-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Mic className="w-8 h-8 text-muted-foreground" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Pulse rings */}
                <AnimatePresence>
                  {isRecording && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-red-500/30"
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-red-500/20"
                        initial={{ scale: 1, opacity: 0.4 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeOut",
                          delay: 0.5,
                        }}
                      />
                    </>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Waveform visualizer */}
              <div className="flex items-center justify-center space-x-1 h-12">
                {waveformData.map((height, index) => (
                  <motion.div
                    key={index}
                    className={cn(
                      "w-1 rounded-full transition-colors duration-300",
                      error
                        ? "bg-red-500"
                        : isRecording
                        ? "bg-red-500"
                        : isProcessing
                        ? "bg-yellow-500"
                        : "bg-muted"
                    )}
                    animate={{
                      height: `${Math.max(4, height * 0.4)}px`,
                      opacity: isRecording ? 1 : 0.3,
                    }}
                    transition={{
                      duration: 0.1,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>

              {/* Status and timer */}
              <div className="text-center space-y-2">
                <motion.p
                  className={cn(
                    "text-base font-medium transition-colors",
                    getStatusColor()
                  )}
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{
                    duration: 2,
                    repeat: isRecording || isProcessing ? Infinity : 0,
                  }}
                >
                  {getStatusText()}
                </motion.p>

                <p className="text-sm text-muted-foreground font-mono">
                  {formatTime(duration)}
                </p>

                {volume > 0 && isRecording && (
                  <motion.div
                    className="flex items-center justify-center space-x-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <VolumeX className="w-4 h-4 text-muted-foreground" />
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-red-500 rounded-full"
                        animate={{ width: `${volume}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                )}
              </div>

              {/* AI indicator */}
              <motion.div
                className="flex items-center space-x-2 text-sm text-muted-foreground"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Voice Assistant</span>
              </motion.div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}