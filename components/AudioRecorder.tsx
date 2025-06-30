"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, Square, Loader2, AudioWaveform, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AudioRecorderProps {
  onAudioCaptured: (audioBlob: Blob) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  sourceLang: string;
}

export function AudioRecorder({
  onAudioCaptured,
  onRecordingStateChange,
  sourceLang,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Refs for audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Clear intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }

    // Reset refs
    analyserRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Duration timer effect
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

  // Volume monitoring effect
  useEffect(() => {
    if (isRecording && analyserRef.current) {
      volumeIntervalRef.current = setInterval(() => {
        if (analyserRef.current) {
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
          setVolume(Math.round((average / 255) * 100));
        }
      }, 100);
    } else {
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
        volumeIntervalRef.current = null;
      }
    }

    return () => {
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
        volumeIntervalRef.current = null;
      }
    };
  }, [isRecording]);

  // Waveform visualization effect
  useEffect(() => {
    if (isRecording && canvasRef.current && analyserRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const drawWaveform = () => {
        if (!analyserRef.current || !ctx || !isRecording) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteTimeDomainData(dataArray);

        // Clear canvas
        ctx.fillStyle = "rgb(20, 20, 20)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw waveform
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(59, 130, 246)"; // Blue color
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

  const setupAudioAnalysis = useCallback((stream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.8;
    } catch (error) {
      console.error("Error setting up audio analysis:", error);
      setError("Failed to setup audio analysis");
    }
  }, []);

  const startRecording = async () => {
    try {
      setIsPreparing(true);
      setError(null);
      
      // Check for microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        } 
      });
      
      streamRef.current = stream;
      
      // Setup audio analysis
      setupAudioAnalysis(stream);
      
      // Check for MediaRecorder support
      if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        console.warn('audio/webm;codecs=opus not supported, falling back to default');
      }
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm',
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setRecordingDuration(0);
      setVolume(0);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        setIsPreparing(true);
        
        try {
          const audioBlob = new Blob(chunksRef.current, { 
            type: mediaRecorder.mimeType || 'audio/webm' 
          });
          
          // Validate blob
          if (audioBlob.size === 0) {
            throw new Error('Recording failed - no audio data captured');
          }
          
          onAudioCaptured(audioBlob);
        } catch (error) {
          console.error("Error creating audio blob:", error);
          setError("Failed to process recording");
        }
        
        // Cleanup
        cleanup();
        setIsPreparing(false);
        setRecordingDuration(0);
        setVolume(0);
        setIsRecording(false);
        onRecordingStateChange?.(false);
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setError("Recording failed");
        stopRecording();
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setIsPreparing(false);
      onRecordingStateChange?.(true);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setIsPreparing(false);
      setIsRecording(false);
      onRecordingStateChange?.(false);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setError("Microphone access denied. Please allow microphone permissions and try again.");
        } else if (error.name === 'NotFoundError') {
          setError("No microphone found. Please connect a microphone and try again.");
        } else {
          setError("Unable to access microphone. Please check your permissions and try again.");
        }
      }
    }
  };

  const stopRecording = useCallback(() => {
    try {
      if (mediaRecorderRef.current && isRecording) {
        if (mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      } else {
        // Force cleanup if recorder is not in expected state
        cleanup();
        setIsRecording(false);
        onRecordingStateChange?.(false);
        setIsPreparing(false);
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      setError("Failed to stop recording");
      // Force cleanup
      cleanup();
      setIsRecording(false);
      onRecordingStateChange?.(false);
      setIsPreparing(false);
    }
  }, [isRecording, cleanup, onRecordingStateChange]);

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && isRecording) {
      stopRecording();
    }
  };

  const handleDialogClick = (e: React.MouseEvent) => {
    // Stop recording when clicking anywhere in the dialog
    if (!isPreparing) {
      stopRecording();
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={startRecording}
        disabled={isRecording || isPreparing}
        className="rounded-r-md rounded-l-none border-l-0"
        title={error || "Record audio"}
      >
        {isPreparing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mic className={cn("h-4 w-4", error && "text-destructive")} />
        )}
      </Button>

      <Dialog
        open={isRecording}
        onOpenChange={handleDialogOpenChange}
      >
        <DialogContent 
          className="sm:max-w-md cursor-pointer select-none"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onClick={handleDialogClick}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Recording Audio ({sourceLang})</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-mono text-muted-foreground">
                  {formatDuration(recordingDuration)}
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-6 py-4">
            {/* Waveform Visualization */}
            <div className="w-full bg-black rounded-lg overflow-hidden border-2 border-blue-500/20">
              <canvas
                ref={canvasRef}
                width={400}
                height={100}
                className="w-full h-[100px]"
              />
            </div>
            
            {/* Volume Indicator */}
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Volume Level</span>
                <span>{volume}%</span>
              </div>
              <Progress value={volume} className="w-full h-2" />
            </div>
            
            {/* Stop Recording Button */}
            <div className="flex flex-col items-center gap-3">
              <Button
                variant="destructive"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  stopRecording();
                }}
                className="relative px-8 py-3 text-base font-medium"
                disabled={isPreparing}
              >
                {isPreparing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Square className="h-5 w-5 mr-2" />
                    Stop Recording
                  </>
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                Click anywhere or press the stop button to finish recording
              </p>
            </div>
            
            {error && (
              <div className="w-full p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive text-center">
                  {error}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}