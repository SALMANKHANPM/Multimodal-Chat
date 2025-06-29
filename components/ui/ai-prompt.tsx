"use client";

import { ArrowRight, Bot, Check, ChevronDown, Paperclip, ChevronRight, Circle, X, FileText, Music, Video, Image, Mic, MicOff, Volume2, VolumeX, Loader2, Play, Pause } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
        inset?: boolean;
    }
>(({ className, inset, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
        ref={ref}
        className={cn(
            "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
            inset && "pl-8",
            className,
        )}
        {...props}
    >
        {children}
        <ChevronRight className="ml-auto h-4 w-4" />
    </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
        ref={ref}
        className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className,
        )}
        {...props}
    />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className,
            )}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            inset && "pl-8",
            className,
        )}
        {...props}
    />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className,
        )}
        checked={checked}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <DropdownMenuPrimitive.ItemIndicator>
                <Check className="h-4 w-4" />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className,
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <DropdownMenuPrimitive.ItemIndicator>
                <Circle className="h-2 w-2 fill-current" />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
        ref={ref}
        className={cn(
            "px-2 py-1.5 text-sm font-semibold",
            inset && "pl-8",
            className,
        )}
        {...props}
    />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props}
    />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
            {...props}
        />
    );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
};

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Textarea.displayName = "Textarea";

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

interface UploadedFile {
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
                <div className="w-8 h-8 rounded bg-black/10 dark:bg-white/10 flex items-center justify-center">
                    <Music className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-black/50 dark:text-white/50">
                        {formatFileSize(file.file.size)}
                    </p>
                </div>
                <button
                    onClick={togglePlayPause}
                    className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
                    aria-label={isPlaying ? "Stop" : "Play"}
                >
                    {isPlaying ? (
                        <Pause className="w-4 h-4 text-black/70 dark:text-white/70" />
                    ) : (
                        <Play className="w-4 h-4 text-black/70 dark:text-white/70" />
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
                className="bg-black/90 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"
                        animate={{
                            scale: isRecording ? [1, 1.2, 1] : [1, 1.1, 1],
                            opacity: isRecording ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                <div className="relative z-10 flex flex-col items-center space-y-6">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute -top-2 -right-2 p-2 text-white/60 hover:text-white transition-colors"
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
                                "bg-gradient-to-br from-white/20 to-white/10 border-2",
                                isRecording ? "border-red-500 shadow-lg shadow-red-500/25" :
                                isProcessing ? "border-yellow-500 shadow-lg shadow-yellow-500/25" :
                                "border-white/20 hover:border-white/40"
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{
                                boxShadow: isRecording 
                                    ? ["0 0 0 0 rgba(239, 68, 68, 0.4)", "0 0 0 20px rgba(239, 68, 68, 0)"]
                                    : undefined
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: isRecording ? Infinity : 0
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
                                        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
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
                                        <Mic className="w-8 h-8 text-white" />
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
                                            ease: "easeOut"
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
                                    isRecording ? "bg-red-500" :
                                    isProcessing ? "bg-yellow-500" :
                                    "bg-white/30"
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
                                isRecording ? "text-red-400" :
                                isProcessing ? "text-yellow-400" :
                                "text-white/70"
                            )}
                            animate={{ opacity: [1, 0.7, 1] }}
                            transition={{
                                duration: 2,
                                repeat: isRecording || isProcessing ? Infinity : 0
                            }}
                        >
                            {getStatusText()}
                        </motion.p>
                        
                        <p className="text-sm text-white/50 font-mono">
                            {formatTime(duration)}
                        </p>

                        {volume > 0 && (
                            <motion.div
                                className="flex items-center justify-center space-x-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <VolumeX className="w-4 h-4 text-white/50" />
                                <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-red-500 rounded-full"
                                        animate={{ width: `${volume}%` }}
                                        transition={{ duration: 0.1 }}
                                    />
                                </div>
                                <Volume2 className="w-4 h-4 text-white/50" />
                            </motion.div>
                        )}
                    </div>

                    <p className="text-xs text-white/40 text-center">
                        {isRecording ? "Tap the button to stop recording" : "Tap the microphone to start recording"}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

interface AI_PromptProps {
    onSendMessage?: (message: string, files: UploadedFile[]) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export function AI_Prompt({ onSendMessage, isLoading = false, disabled = false }: AI_PromptProps) {
    const [value, setValue] = useState("");
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 72,
        maxHeight: 300,
    });
    const [selectedModel, setSelectedModel] = useState("GPT-4-1 Mini");
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isVoiceRecorderOpen, setIsVoiceRecorderOpen] = useState(false);
    const [audioRecordings, setAudioRecordings] = useState<AudioRecording[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const AI_MODELS = [
        "o3-mini",
        "Gemini 2.5 Flash",
        "Claude 3.5 Sonnet",
        "GPT-4-1 Mini",
        "GPT-4o",
        "Claude 3.5 Haiku",
        "Gemini 1.5 Pro",
        "Llama 3.3 70B",
        "Qwen 2.5 Coder 32B",
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
        <div className="w-full py-4">
            <form onSubmit={handleSubmit} className="relative">
                <div
                    className={cn(
                        "relative overflow-hidden rounded-2xl border bg-background transition-all duration-200",
                        isDragOver ? "border-primary bg-primary/5" : "border-border",
                        "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
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
                                                    <div className="w-8 h-8 rounded bg-black/10 dark:bg-white/10 flex items-center justify-center">
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
                    <div className="flex items-end gap-2 p-3">
                        {/* Model selector */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground shrink-0"
                                    disabled={disabled}
                                >
                                    {selectedModel}
                                    <ChevronDown className="w-3 h-3 ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                                {AI_MODELS.map((model) => (
                                    <DropdownMenuItem
                                        key={model}
                                        onClick={() => setSelectedModel(model)}
                                        className="text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            {model === selectedModel && <Check className="w-4 h-4" />}
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
                                className="min-h-[72px] resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                                disabled={disabled}
                            />
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                            {/* File upload */}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={disabled}
                            >
                                <Paperclip className="w-4 h-4" />
                            </Button>

                            {/* Voice recorder */}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setIsVoiceRecorderOpen(true)}
                                disabled={disabled}
                            >
                                <Mic className="w-4 h-4" />
                            </Button>

                            {/* Send button */}
                            <Button
                                type="submit"
                                size="icon"
                                className="h-8 w-8"
                                disabled={disabled || isLoading || (!value.trim() && uploadedFiles.length === 0)}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="w-4 h-4" />
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