"use client";

import { Mic, MicOff, Volume2, VolumeX, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoiceChatProps {
  onStart?: () => void;
  onStop?: (duration: number) => void;
  onVolumeChange?: (volume: number) => void;
  onAudioCaptured?: (audioBlob: Blob) => void;
  className?: string;
  demoMode?: boolean;
  isRecording?: boolean;
  onToggleRecording?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocity: { x: number; y: number };
}

export function VoiceChat({
  onStart,
  onStop,
  onVolumeChange,
  onAudioCaptured,
  className,
  demoMode = false,
  isRecording = false,
  onToggleRecording
}: VoiceChatProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);
  const [duration, setDuration] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [waveformData, setWaveformData] = useState<number[]>(Array(32).fill(0));
  const intervalRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Sync with external recording state
  useEffect(() => {
    setIsListening(isRecording);
  }, [isRecording]);

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
            y: (Math.random() - 0.5) * 0.5
          }
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.velocity.x + 400) % 400,
        y: (particle.y + particle.velocity.y + 400) % 400,
        opacity: Math.max(0.1, Math.min(0.4, particle.opacity + (Math.random() - 0.5) * 0.02))
      })));
      animationRef.current = requestAnimationFrame(animateParticles);
    };

    animationRef.current = requestAnimationFrame(animateParticles);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Real audio recording and waveform analysis
  useEffect(() => {
    if (isListening && !demoMode) {
      startRealRecording();
    } else if (!isListening && mediaRecorderRef.current) {
      stopRealRecording();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isListening, demoMode]);

  // Demo mode simulation
  useEffect(() => {
    if (!demoMode) return;

    if (isListening) {
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
        
        // Simulate audio waveform
        const newWaveform = Array(32).fill(0).map(() => 
          Math.random() * 100
        );
        setWaveformData(newWaveform);
        
        // Simulate volume changes
        const newVolume = Math.random() * 100;
        setVolume(newVolume);
        onVolumeChange?.(newVolume);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setWaveformData(Array(32).fill(0));
      setVolume(0);
    }
  }, [isListening, demoMode, onVolumeChange]);

  const startRealRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio analysis
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        onAudioCaptured?.(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
        setDuration(0);
        setVolume(0);
        setWaveformData(Array(32).fill(0));
        
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };

      mediaRecorderRef.current.start();
      onStart?.();

      // Start real-time audio analysis
      const analyzeAudio = () => {
        if (!analyserRef.current || !isListening) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Convert to waveform data for visualization
        const waveform = [];
        const step = Math.floor(bufferLength / 32);
        for (let i = 0; i < 32; i++) {
          const start = i * step;
          const end = start + step;
          let sum = 0;
          for (let j = start; j < end && j < bufferLength; j++) {
            sum += dataArray[j];
          }
          waveform.push((sum / step) * 0.8); // Scale down for better visualization
        }
        setWaveformData(waveform);

        // Calculate volume
        const avgVolume = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        setVolume(avgVolume);
        onVolumeChange?.(avgVolume);

        if (isListening) {
          requestAnimationFrame(analyzeAudio);
        }
      };

      analyzeAudio();

      // Timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRealRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      onStop?.(duration);
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleToggleListening = () => {
    if (demoMode) return;
    
    if (onToggleRecording) {
      onToggleRecording();
    } else {
      setIsListening(!isListening);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusText = () => {
    if (isListening) return "Listening...";
    if (isProcessing) return "Processing...";
    if (isSpeaking) return "Speaking...";
    return "Tap to speak";
  };

  const getStatusColor = () => {
    if (isListening) return "text-blue-400";
    if (isProcessing) return "text-yellow-400";
    if (isSpeaking) return "text-green-400";
    return "text-muted-foreground";
  };

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] bg-background relative overflow-hidden", className)}>
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.opacity
            }}
            animate={{
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Background glow effects */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"
          animate={{
            scale: isListening ? [1, 1.2, 1] : [1, 1.1, 1],
            opacity: isListening ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Main voice button */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.button
            onClick={handleToggleListening}
            className={cn(
              "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300",
              "bg-gradient-to-br from-primary/20 to-primary/10 border-2",
              isListening ? "border-blue-500 shadow-lg shadow-blue-500/25" :
              isProcessing ? "border-yellow-500 shadow-lg shadow-yellow-500/25" :
              isSpeaking ? "border-green-500 shadow-lg shadow-green-500/25" :
              "border-border hover:border-primary/50"
            )}
            animate={{
              boxShadow: isListening 
                ? ["0 0 0 0 rgba(59, 130, 246, 0.4)", "0 0 0 20px rgba(59, 130, 246, 0)"]
                : undefined
            }}
            transition={{
              duration: 1.5,
              repeat: isListening ? Infinity : 0
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
              ) : isSpeaking ? (
                <motion.div
                  key="speaking"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Volume2 className="w-8 h-8 text-green-500" />
                </motion.div>
              ) : isListening ? (
                <motion.div
                  key="listening"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Mic className="w-8 h-8 text-blue-500" />
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
            {isListening && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-500/30"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-500/20"
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.5
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
                isListening ? "bg-blue-500" :
                isProcessing ? "bg-yellow-500" :
                isSpeaking ? "bg-green-500" :
                "bg-muted"
              )}
              animate={{
                height: `${Math.max(4, height * 0.4)}px`,
                opacity: isListening || isSpeaking ? 1 : 0.3
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
            className={cn("text-base font-medium transition-colors", getStatusColor())}
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{
              duration: 2,
              repeat: isListening || isProcessing || isSpeaking ? Infinity : 0
            }}
          >
            {getStatusText()}
          </motion.p>
          
          <p className="text-sm text-muted-foreground font-mono">
            {formatTime(duration)}
          </p>

          {volume > 0 && (
            <motion.div
              className="flex items-center justify-center space-x-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <VolumeX className="w-3 h-3 text-muted-foreground" />
              <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  animate={{ width: `${Math.min(100, volume)}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <Volume2 className="w-3 h-3 text-muted-foreground" />
            </motion.div>
          )}
        </div>

        {/* AI indicator */}
        <motion.div
          className="flex items-center space-x-2 text-xs text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-3 h-3" />
          <span>AI Voice Assistant</span>
        </motion.div>
      </div>
    </div>
  );
}

// Usage example
export default function VoiceChatDemo() {
  return (
    <VoiceChat
      onStart={() => console.log("Voice recording started")}
      onStop={(duration) => console.log(`Voice recording stopped after ${duration}s`)}
      onVolumeChange={(volume) => console.log(`Volume: ${volume}%`)}
      demoMode={true}
    />
  );
}