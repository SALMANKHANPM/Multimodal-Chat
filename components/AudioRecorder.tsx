"use client";

import { useState, useRef, useEffect } from "react";
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      // Start duration timer
      intervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      // Clear duration timer
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

        ctx.fillStyle = "rgb(20, 20, 20)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(255, 0, 0)";
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
        mimeType: "audio/webm;codecs=opus",
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setRecordingDuration(0);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        setIsPreparing(true);
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        onAudioCaptured(audioBlob);
        
        // Cleanup
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        
        setIsPreparing(false);
        setRecordingDuration(0);
        setVolume(0);
        setIsRecording(false);
        onRecordingStateChange?.(false);
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        stopRecording();
      };

      analyzeAudio(stream);
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setIsPreparing(false);
      onRecordingStateChange?.(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setIsPreparing(false);
      setIsRecording(false);
      onRecordingStateChange?.(false);
      
      // Show user-friendly error
      alert("Unable to access microphone. Please check your permissions and try again.");
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && isRecording) {
        // Stop the media recorder
        if (mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      }
      
      // Stop animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      
      // Clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Update state
      setIsRecording(false);
      onRecordingStateChange?.(false);
    } catch (error) {
      console.error("Error stopping recording:", error);
      // Force state reset even if there's an error
      setIsRecording(false);
      onRecordingStateChange?.(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && isRecording) {
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
      >
        {isPreparing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      <Dialog
        open={isRecording}
        onOpenChange={handleDialogOpenChange}
      >
        <DialogContent 
          className="sm:max-w-md"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Recording Audio ({sourceLang})</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <canvas
              ref={canvasRef}
              width={400}
              height={100}
              className="w-full bg-black rounded-lg"
            />
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono">
                {formatDuration(recordingDuration)}
              </span>
              <Button
                variant="destructive"
                size="icon"
                onClick={stopRecording}
                className="relative"
                disabled={isPreparing}
              >
                {isPreparing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Click the stop button or press Escape to finish recording
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}