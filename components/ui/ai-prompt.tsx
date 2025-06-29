"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatFileSize } from "@/lib/utils";
import {
  RiSendPlaneFill,
  RiImageAddLine,
  RiAttachmentLine,
  RiMicLine,
  RiCloseLine,
  RiStopFill,
  RiImageLine,
  RiFilePdfLine,
  RiFileTextLine,
  RiVolumeUpLine,
} from "@remixicon/react";
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
  onSendMessage: (message: string, files?: UploadedFile[]) => void;
  isLoading?: boolean;
}

// Utility function to truncate filename for mobile
function truncateFilename(filename: string, maxLength: number = 7): string {
  if (!filename || filename.length <= maxLength) return filename;
  
  const extension = filename.split('.').pop();
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
  
  if (extension) {
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 1);
    return `${truncatedName}...${extension}`;
  }
  
  return `${filename.substring(0, maxLength)}...`;
}

export function AI_Prompt({ onSendMessage, isLoading = false }: AI_PromptProps) {
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPreparing, setIsPreparing] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Cleanup function
  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Recording duration timer
  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRecording]);

  // Waveform animation
  useEffect(() => {
    if (isRecording && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const drawWaveform = () => {
        if (!analyserRef.current || !ctx || !isRecording) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteTimeDomainData(dataArray);

        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ef4444";
        ctx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = v * (canvas.height / 2);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        if (isRecording) {
          animationFrameRef.current = requestAnimationFrame(drawWaveform);
        }
      };

      drawWaveform();
    }
  }, [isRecording]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const analyzeAudio = (stream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 2048;
    } catch (error) {
      console.error("Error setting up audio analysis:", error);
    }
  };

  const startRecording = async () => {
    try {
      setIsPreparing(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : undefined,
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setRecordingDuration(0);

      mediaRecorder.ondataavailable = (e) => {
        console.log('Data available:', e.data.size);
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('MediaRecorder stopped, chunks:', chunksRef.current.length);
        setIsPreparing(true);
        
        if (chunksRef.current.length > 0) {
          const audioBlob = new Blob(chunksRef.current, { 
            type: mediaRecorder.mimeType || 'audio/webm' 
          });
          console.log('Created audio blob:', audioBlob.size, 'bytes');
          
          // Create audio file and add to uploaded files
          const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
            type: audioBlob.type
          });
          
          const audioUrl = URL.createObjectURL(audioBlob);
          
          const newFile: UploadedFile = {
            id: Date.now().toString(),
            file: audioFile,
            type: 'audio',
            audioUrl: audioUrl
          };
          
          setUploadedFiles(prev => [...prev, newFile]);
        } else {
          console.error('No audio data recorded');
        }
        
        // Reset state
        setIsPreparing(false);
        setRecordingDuration(0);
        setIsRecording(false);
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        handleRecordingError();
      };

      analyzeAudio(stream);
      
      // Start recording with data collection every 100ms
      mediaRecorder.start(100);
      
      setIsRecording(true);
      setIsPreparing(false);
      
      console.log('Recording started successfully');
    } catch (error) {
      console.error("Error accessing microphone:", error);
      handleRecordingError();
      alert("Unable to access microphone. Please check your permissions and try again.");
    }
  };

  const handleRecordingError = () => {
    setIsPreparing(false);
    setIsRecording(false);
    setRecordingDuration(0);
    cleanup();
  };

  const stopRecording = () => {
    console.log('Stop recording called');
    
    try {
      // Stop the media recorder first
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        console.log('Stopping MediaRecorder...');
        mediaRecorderRef.current.stop();
      }
      
      // Stop animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          console.log('Stopping track:', track.kind);
          track.stop();
        });
        streamRef.current = null;
      }
      
      // Close audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      
      // Clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      console.log('Stop recording completed');
    } catch (error) {
      console.error("Error stopping recording:", error);
      // Force state reset even if there's an error
      setIsRecording(false);
      setIsPreparing(false);
    }
  };

  const handleSend = () => {
    if (message.trim() || uploadedFiles.length > 0) {
      onSendMessage(message, uploadedFiles);
      setMessage("");
      setUploadedFiles([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const fileType = file.type.startsWith('image/') ? 'image' : 'document';
      
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(),
        file,
        type: fileType,
      };

      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          newFile.preview = e.target?.result as string;
          setUploadedFiles(prev => [...prev, newFile]);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadedFiles(prev => [...prev, newFile]);
      }
    });

    // Reset input
    e.target.value = '';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(),
        file,
        type: 'image',
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        newFile.preview = e.target?.result as string;
        setUploadedFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.audioUrl) {
        URL.revokeObjectURL(fileToRemove.audioUrl);
      }
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const getFileIcon = (file: UploadedFile) => {
    if (file.type === 'image') {
      return <RiImageLine size={16} className="text-blue-500" />;
    } else if (file.type === 'audio') {
      return <RiVolumeUpLine size={16} className="text-green-500" />;
    } else if (file.file.name.toLowerCase().endsWith('.pdf')) {
      return <RiFilePdfLine size={16} className="text-red-500" />;
    } else {
      return <RiFileTextLine size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="w-full">
      {/* Recording Modal */}
      {isRecording && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-black/90 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-500/5"></div>
            
            <div className="relative z-10 flex flex-col items-center space-y-6">
              {/* Recording indicator */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full border-2 border-red-500/20"></div>
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <RiMicLine size={32} className="text-white" />
                </div>
                <div className="absolute -inset-2 rounded-full border border-red-500/30 animate-ping"></div>
              </div>

              {/* Waveform */}
              <div className="w-full max-w-xs">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={60}
                  className="w-full h-15 rounded-lg border border-red-500/20"
                />
              </div>

              {/* Duration */}
              <div className="text-white text-2xl font-mono font-bold">
                {formatDuration(recordingDuration)}
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                <Button
                  onClick={stopRecording}
                  disabled={isPreparing}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center space-x-2"
                >
                  {isPreparing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <RiStopFill size={18} />
                      <span>Stop Recording</span>
                    </>
                  )}
                </Button>
              </div>

              <p className="text-white/70 text-sm text-center">
                Click "Stop Recording" to finish and save your audio
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File previews */}
      {uploadedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {uploadedFiles.map((file) => {
            const displayName = file.file.name;
            const truncatedName = truncateFilename(displayName, 10);
            
            return (
              <div
                key={file.id}
                className="flex items-center gap-2 bg-muted rounded-lg p-2 text-sm max-w-full"
              >
                {getFileIcon(file)}
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="truncate cursor-help">
                        <span className="sm:hidden">{truncatedName}</span>
                        <span className="hidden sm:inline">{displayName}</span>
                      </span>
                    </TooltipTrigger>
                    {displayName !== truncatedName && (
                      <TooltipContent side="top" className="max-w-xs break-all">
                        {displayName}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {formatFileSize(file.file.size)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="h-6 w-6 p-0 hover:bg-destructive/20 flex-shrink-0"
                >
                  <RiCloseLine size={14} />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2 p-3 bg-background border border-border rounded-2xl shadow-sm">
        {/* File upload buttons */}
        <div className="flex gap-1 flex-shrink-0">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isLoading || isRecording}
                  className="h-9 w-9 p-0"
                >
                  <RiImageAddLine size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Add image</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isRecording}
                  className="h-9 w-9 p-0"
                >
                  <RiAttachmentLine size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach file</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startRecording}
                  disabled={isLoading || isRecording || isPreparing}
                  className="h-9 w-9 p-0"
                >
                  <RiMicLine size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Record audio</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Text input */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading || isRecording}
          className="flex-1 min-h-[36px] max-h-32 resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          rows={1}
        />

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={isLoading || isRecording || (!message.trim() && uploadedFiles.length === 0)}
          size="sm"
          className="h-9 w-9 p-0 flex-shrink-0"
        >
          <RiSendPlaneFill size={16} />
        </Button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}