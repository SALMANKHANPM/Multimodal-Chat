// "use client";

// import {
//   ArrowRight,
//   Bot,
//   Check,
//   ChevronDown,
//   Paperclip,
//   ChevronRight,
//   Circle,
//   X,
//   FileText,
//   Music,
//   Video,
//   Image,
//   Mic,
//   MicOff,
//   Volume2,
//   VolumeX,
//   Loader2,
//   Play,
//   Pause,
//   Square,
// } from "lucide-react";
// import { useState, useRef, useCallback, useEffect } from "react";
// import { cn, formatFileSize } from "@/lib/utils";
// import { motion, AnimatePresence } from "framer-motion";

// import * as React from "react";
// import { Slot } from "@radix-ui/react-slot";
// import { cva, type VariantProps } from "class-variance-authority";

// const buttonVariants = cva(
//   "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground hover:bg-primary/90",
//         destructive:
//           "bg-destructive text-destructive-foreground hover:bg-destructive/90",
//         outline:
//           "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
//         secondary:
//           "bg-secondary text-secondary-foreground hover:bg-secondary/80",
//         ghost: "hover:bg-accent hover:text-accent-foreground",
//         link: "text-primary underline-offset-4 hover:underline",
//       },
//       size: {
//         default: "h-10 px-4 py-2",
//         sm: "h-9 rounded-md px-3",
//         lg: "h-11 rounded-md px-8",
//         icon: "h-10 w-10",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// );

// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariants> {
//   asChild?: boolean;
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant, size, asChild = false, ...props }, ref) => {
//     const Comp = asChild ? Slot : "button";
//     return (
//       <Comp
//         className={cn(buttonVariants({ variant, size, className }))}
//         ref={ref}
//         {...props}
//       />
//     );
//   }
// );
// Button.displayName = "Button";

// export { Button, buttonVariants };

// import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

// const DropdownMenu = DropdownMenuPrimitive.Root;

// const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

// const DropdownMenuGroup = DropdownMenuPrimitive.Group;

// const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

// const DropdownMenuSub = DropdownMenuPrimitive.Sub;

// const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// const DropdownMenuSubTrigger = React.forwardRef<
//   React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
//   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
//     inset?: boolean;
//   }
// >(({ className, inset, children, ...props }, ref) => (
//   <DropdownMenuPrimitive.SubTrigger
//     ref={ref}
//     className={cn(
//       "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
//       inset && "pl-8",
//       className
//     )}
//     {...props}
//   >
//     {children}
//     <ChevronRight className="ml-auto h-4 w-4" />
//   </DropdownMenuPrimitive.SubTrigger>
// ));
// DropdownMenuSubTrigger.displayName =
//   DropdownMenuPrimitive.SubTrigger.displayName;

// const DropdownMenuSubContent = React.forwardRef<
//   React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
//   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
// >(({ className, ...props }, ref) => (
//   <DropdownMenuPrimitive.SubContent
//     ref={ref}
//     className={cn(
//       "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
//       className
//     )}
//     {...props}
//   />
// ));
// DropdownMenuSubContent.displayName =
//   DropdownMenuPrimitive.SubContent.displayName;

// const DropdownMenuContent = React.forwardRef<
//   React.ElementRef<typeof DropdownMenuPrimitive.Content>,
//   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
// >(({ className, sideOffset = 4, ...props }, ref) => (
//   <DropdownMenuPrimitive.Portal>
//     <DropdownMenuPrimitive.Content
//       ref={ref}
//       sideOffset={sideOffset}
//       className={cn(
//         "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
//         className
//       )}
//       {...props}
//     />
//   </DropdownMenuPrimitive.Portal>
// ));
// DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

// const DropdownMenuItem = React.forwardRef<
//   React.ElementRef<typeof DropdownMenuPrimitive.Item>,
//   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
//     inset?: boolean;
//   }
// >(({ className, inset, ...props }, ref) => (
//   <DropdownMenuPrimitive.Item
//     ref={ref}
//     className={cn(
//       "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
//       inset && "pl-8",
//       className
//     )}
//     {...props}
//   />
// ));
// DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

// const DropdownMenuCheckboxItem = React.forwardRef<
//   React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
//   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
// >(({ className, children, checked, ...props }, ref) => (
//   <DropdownMenuPrimitive.CheckboxItem
//     ref={ref}
//     className={cn(
//       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
//       className
//     )}
//     checked={checked}
//     {...props}
//   >
//     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
//       <DropdownMenuPrimitive.ItemIndicator>
//         <Check className="h-4 w-4" />
//       </DropdownMenuPrimitive.ItemIndicator>
//     </span>
//     {children}
//   </DropdownMenuPrimitive.CheckboxItem>
// ));
// DropdownMenuCheckboxItem.displayName =
//   DropdownMenuPrimitive.CheckboxItem.displayName;

// const DropdownMenuRadioItem = React.forwardRef<
//   React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
//   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
// >(({ className, children, ...props }, ref) => (
//   <DropdownMenuPrimitive.RadioItem
//     ref={ref}
//     className={cn(
//       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
//       className
//     )}
//     {...props}
//   >
//     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
//       <DropdownMenuPrimitive.ItemIndicator>
//         <Circle className="h-2 w-2 fill-current" />
//       </DropdownMenuPrimitive.ItemIndicator>
//     </span>
//     {children}
//   </DropdownMenuPrimitive.RadioItem>
// ));
// DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

// const DropdownMenuLabel = React.forwardRef<
//   React.ElementRef<typeof DropdownMenuPrimitive.Label>,
//   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
//     inset?: boolean;
//   }
// >(({ className, inset, ...props }, ref) => (
//   <DropdownMenuPrimitive.Label
//     ref={ref}
//     className={cn(
//       "px-2 py-1.5 text-sm font-semibold",
//       inset && "pl-8",
//       className
//     )}
//     {...props}
//   />
// ));
// DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

// const DropdownMenuSeparator = React.forwardRef<
//   React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
//   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
// >(({ className, ...props }, ref) => (
//   <DropdownMenuPrimitive.Separator
//     ref={ref}
//     className={cn("-mx-1 my-1 h-px bg-muted", className)}
//     {...props}
//   />
// ));
// DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

// const DropdownMenuShortcut = ({
//   className,
//   ...props
// }: React.HTMLAttributes<HTMLSpanElement>) => {
//   return (
//     <span
//       className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
//       {...props}
//     />
//   );
// };
// DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// export {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuCheckboxItem,
//   DropdownMenuRadioItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuGroup,
//   DropdownMenuPortal,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuRadioGroup,
// };

// export interface TextareaProps
//   extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
//   ({ className, ...props }, ref) => {
//     return (
//       <textarea
//         className={cn(
//           "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     );
//   }
// );
// Textarea.displayName = "Textarea";

// interface UseAutoResizeTextareaProps {
//   minHeight: number;
//   maxHeight?: number;
// }

// function useAutoResizeTextarea({
//   minHeight,
//   maxHeight,
// }: UseAutoResizeTextareaProps) {
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const adjustHeight = useCallback(
//     (reset?: boolean) => {
//       const textarea = textareaRef.current;
//       if (!textarea) return;

//       if (reset) {
//         textarea.style.height = `${minHeight}px`;
//         return;
//       }

//       textarea.style.height = `${minHeight}px`;

//       const newHeight = Math.max(
//         minHeight,
//         Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
//       );

//       textarea.style.height = `${newHeight}px`;
//     },
//     [minHeight, maxHeight]
//   );

//   useEffect(() => {
//     const textarea = textareaRef.current;
//     if (textarea) {
//       textarea.style.height = `${minHeight}px`;
//     }
//   }, [minHeight]);

//   useEffect(() => {
//     const handleResize = () => adjustHeight();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [adjustHeight]);

//   return { textareaRef, adjustHeight };
// }

// const OPENAI_ICON = (
//   <>
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="20"
//       height="20"
//       viewBox="0 0 256 260"
//       aria-label="OpenAI Icon"
//       className="w-4 h-4 dark:hidden block"
//     >
//       <title>OpenAI Icon Light</title>
//       <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
//     </svg>
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="20"
//       height="20"
//       viewBox="0 0 256 260"
//       aria-label="OpenAI Icon"
//       className="w-4 h-4 hidden dark:block"
//     >
//       <title>OpenAI Icon Dark</title>
//       <path
//         fill="#fff"
//         d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"
//       />
//     </svg>
//   </>
// );

// interface UploadedFile {
//   id: string;
//   file: File;
//   type: "audio" | "document" | "image" | "video";
//   preview?: string;
//   audioUrl?: string;
// }

// interface AudioRecording {
//   id: string;
//   blob: Blob;
//   duration: number;
//   timestamp: Date;
// }

// interface VoiceRecorderProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onRecordingComplete: (recording: AudioRecording) => void;
// }

// interface AudioPreviewProps {
//   file: UploadedFile;
//   isRecording?: AudioRecording;
//   onRemove: () => void;
// }

// function AudioPreview({ file, isRecording, onRemove }: AudioPreviewProps) {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef<HTMLAudioElement>(null);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio || !file.audioUrl) return;

//     const handleEnded = () => setIsPlaying(false);
//     audio.addEventListener("ended", handleEnded);

//     return () => {
//       audio.removeEventListener("ended", handleEnded);
//     };
//   }, [file.audioUrl]);

//   const togglePlayPause = () => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     if (isPlaying) {
//       audio.pause();
//       setIsPlaying(false);
//     } else {
//       audio.play();
//       setIsPlaying(true);
//     }
//   };

//   return (
//     <>
//       <audio ref={audioRef} src={file.audioUrl} preload="metadata" />

//       <div className="flex items-center gap-2 w-full">
//         <div className="w-8 h-8 rounded bg-black/10 dark:bg-white/10 flex items-center justify-center">
//           <Music className="w-4 h-4" />
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="text-xs text-black/50 dark:text-white/50">
//             {formatFileSize(file.file.size)}
//           </p>
//         </div>
//         <button
//           onClick={togglePlayPause}
//           className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
//           aria-label={isPlaying ? "Stop" : "Play"}
//         >
//           {isPlaying ? (
//             <Pause className="w-4 h-4 text-black/70 dark:text-white/70" />
//           ) : (
//             <Play className="w-4 h-4 text-black/70 dark:text-white/70" />
//           )}
//         </button>
//         <button
//           onClick={onRemove}
//           className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
//           aria-label="Remove file"
//         >
//           <X className="w-4 h-4 text-white" />
//         </button>
//       </div>
//     </>
//   );
// }

// function VoiceRecorder({
//   isOpen,
//   onClose,
//   onRecordingComplete,
// }: VoiceRecorderProps) {
//   const [isRecording, setIsRecording] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [duration, setDuration] = useState(0);
//   const [volume, setVolume] = useState(0);
//   const [waveformData, setWaveformData] = useState<number[]>(Array(32).fill(0));
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);
//   const intervalRef = useRef<number | null>(null);
//   const animationRef = useRef<number | null>(null);
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const analyserRef = useRef<AnalyserNode | null>(null);

//   useEffect(() => {
//     if (isRecording) {
//       intervalRef.current = window.setInterval(() => {
//         setDuration((prev) => prev + 1);
//       }, 1000);

//       // Start audio analysis for waveform
//       if (analyserRef.current) {
//         const updateWaveform = () => {
//           const dataArray = new Uint8Array(
//             analyserRef.current!.frequencyBinCount
//           );
//           analyserRef.current!.getByteFrequencyData(dataArray);

//           const waveform = Array(32)
//             .fill(0)
//             .map((_, i) => {
//               const index = Math.floor((i / 32) * dataArray.length);
//               return (dataArray[index] / 255) * 100;
//             });

//           setWaveformData(waveform);
//           setVolume(Math.max(...waveform));

//           if (isRecording) {
//             animationRef.current = requestAnimationFrame(updateWaveform);
//           }
//         };
//         updateWaveform();
//       }
//     } else {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//       setWaveformData(Array(32).fill(0));
//       setVolume(0);
//     }

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     };
//   }, [isRecording]);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           sampleRate: 44100,
//         },
//       });

//       // Setup audio context for visualization
//       audioContextRef.current = new (window.AudioContext ||
//         (window as any).webkitAudioContext)();
//       analyserRef.current = audioContextRef.current.createAnalyser();
//       const source = audioContextRef.current.createMediaStreamSource(stream);
//       source.connect(analyserRef.current);
//       analyserRef.current.fftSize = 256;

//       // Check for supported MIME types
//       const mimeTypes = [
//         "audio/webm;codecs=opus",
//         "audio/webm",
//         "audio/mp4",
//         "audio/wav",
//       ];

//       let selectedMimeType = "audio/wav";
//       for (const mimeType of mimeTypes) {
//         if (MediaRecorder.isTypeSupported(mimeType)) {
//           selectedMimeType = mimeType;
//           break;
//         }
//       }

//       mediaRecorderRef.current = new MediaRecorder(stream, {
//         mimeType: selectedMimeType,
//       });
//       audioChunksRef.current = [];

//       mediaRecorderRef.current.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorderRef.current.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, {
//           type: selectedMimeType,
//         });
//         const recording: AudioRecording = {
//           id: Math.random().toString(36).substr(2, 9),
//           blob: audioBlob,
//           duration,
//           timestamp: new Date(),
//         };
//         onRecordingComplete(recording);

//         // Cleanup
//         stream.getTracks().forEach((track) => track.stop());
//         if (
//           audioContextRef.current &&
//           audioContextRef.current.state !== "closed"
//         ) {
//           audioContextRef.current.close();
//         }
//       };

//       mediaRecorderRef.current.onerror = (event) => {
//         console.error("MediaRecorder error:", event);
//         setIsRecording(false);
//         setIsProcessing(false);
//       };

//       mediaRecorderRef.current.start(100); // Collect data every 100ms
//       setIsRecording(true);
//     } catch (error) {
//       console.error("Error starting recording:", error);
//       alert("Could not access microphone. Please check permissions.");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       setIsRecording(false);
//       mediaRecorderRef.current.stop();
//       onClose();
//     }
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const getStatusText = () => {
//     if (isProcessing) return "Processing...";
//     if (isRecording) return "Recording...";
//     return "Tap to start recording";
//   };

//   if (!isOpen) return null;

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       onClick={onClose}
//     >
//       <motion.div
//         className="bg-black/90 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden"
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Background effects */}
//         <div className="absolute inset-0 overflow-hidden">
//           <motion.div
//             className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"
//             animate={{
//               scale: isRecording ? [1, 1.2, 1] : [1, 1.1, 1],
//               opacity: isRecording ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1],
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />
//         </div>

//         <div className="relative z-10 flex flex-col items-center space-y-6">
//           {/* Close button */}
//           <button
//             onClick={onClose}
//             className="absolute -top-2 -right-2 p-2 text-white/60 hover:text-white transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>

//           {/* Main recording button */}
//           <motion.div className="relative z-10">
//             <motion.button
//               onClick={!isRecording ? startRecording : stopRecording}
//               className={cn(
//                 "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300",
//                 "bg-gradient-to-br from-white/20 to-white/10 border-2",
//                 isRecording
//                   ? "border-red-500 shadow-lg shadow-red-500/25"
//                   : isProcessing
//                   ? "border-yellow-500 shadow-lg shadow-yellow-500/25"
//                   : "border-white/20 hover:border-white/40"
//               )}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               animate={{
//                 boxShadow: isRecording
//                   ? [
//                       "0 0 0 0 rgba(239, 68, 68, 0.4)",
//                       "0 0 0 20px rgba(239, 68, 68, 0)",
//                     ]
//                   : undefined,
//               }}
//               transition={{
//                 duration: 1.5,
//                 repeat: isRecording ? Infinity : 0,
//               }}
//               aria-label={!isRecording ? "Start recording" : "Stop recording"}
//             >
//               <AnimatePresence mode="popLayout">
//                 {isRecording ? (
//                   <motion.div
//                     key="recording"
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.8 }}
//                     className="flex items-center justify-center w-full h-full"
//                   >
//                     <div className="w-12 h-12 bg-red-500 rounded-md pointer-events-none" />
//                     <AnimatePresence>
//                       {isRecording && (
//                         <>
//                           <motion.div
//                             className="absolute inset-0 rounded-full border-2 border-red-500/30"
//                             initial={{ scale: 1, opacity: 0.6 }}
//                             animate={{ scale: 1.5, opacity: 0 }}
//                             transition={{
//                               duration: 1.5,
//                               repeat: Infinity,
//                               ease: "easeOut",
//                             }}
//                           />
//                           <motion.div
//                             className="absolute inset-0 rounded-full border-2 border-red-500/20"
//                             initial={{ scale: 1, opacity: 0.4 }}
//                             animate={{ scale: 2, opacity: 0 }}
//                             transition={{
//                               duration: 1.5,
//                               repeat: Infinity,
//                               ease: "easeOut",
//                               delay: 0.5,
//                             }}
//                           />
//                         </>
//                       )}
//                     </AnimatePresence>
//                   </motion.div>
//                 ) : (
//                   <motion.div
//                     key="idle"
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.8 }}
//                   >
//                     <Mic className="w-8 h-8 text-white" />
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.button>
//           </motion.div>

//           {/* Waveform visualizer */}
//           <div className="flex items-center justify-center space-x-1 h-12">
//             {waveformData.map((height, index) => (
//               <motion.div
//                 key={index}
//                 className={cn(
//                   "w-1 rounded-full transition-colors duration-300",
//                   isRecording ? "bg-red-500" : "bg-white/30"
//                 )}
//                 animate={{
//                   height: `${Math.max(4, height * 0.4)}px`,
//                   opacity: isRecording ? 1 : 0.3,
//                 }}
//                 transition={{
//                   duration: 0.1,
//                   ease: "easeOut",
//                 }}
//               >
//                 <div className="w-1 h-1 bg-white/30 rounded-full" />
//               </motion.div>
//             ))}
//           </div>

//           {/* Status and timer */}
//           <div className="text-center space-y-2">
//             <motion.p
//               className={cn(
//                 "text-lg font-medium transition-colors",
//                 isRecording
//                   ? "text-red-400"
//                   : isProcessing
//                   ? "text-yellow-400"
//                   : "text-white/70"
//               )}
//               animate={{ opacity: [1, 0.7, 1] }}
//               transition={{
//                 duration: 2,
//                 repeat: isRecording || isProcessing ? Infinity : 0,
//               }}
//             >
//               {getStatusText()}
//             </motion.p>

//             <p className="text-sm text-white/50 font-mono">
//               {formatTime(duration)}
//             </p>

//             {volume > 0 && (
//               <motion.div
//                 className="flex items-center justify-center space-x-2"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//               >
//                 <VolumeX className="w-4 h-4 text-white/50" />
//                 <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
//                   <motion.div
//                     className="h-full bg-red-500 rounded-full"
//                     animate={{ width: `${volume}%` }}
//                     transition={{ duration: 0.1 }}
//                   />
//                 </div>
//                 <Volume2 className="w-4 h-4 text-white/50" />
//               </motion.div>
//             )}
//           </div>

//           <p className="text-xs text-white/40 text-center">
//             {isRecording
//               ? "Tap the button to stop recording"
//               : "Tap the microphone to start recording"}
//           </p>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// interface AI_PromptProps {
//   onSendMessage?: (message: string, files?: UploadedFile[]) => void;
//   isLoading?: boolean;
//   disabled?: boolean;
// }

// export function AI_Prompt({
//   onSendMessage,
//   isLoading = false,
//   disabled = false,
// }: AI_PromptProps) {
//   const [value, setValue] = useState("");
//   const textareaScrollRef = useRef<HTMLDivElement | null>(null);
//   const { textareaRef, adjustHeight } = useAutoResizeTextarea({
//     minHeight: 72,
//     maxHeight: 300,
//   });
//   const [selectedModel, setSelectedModel] = useState("GPT-4-1 Mini");
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const [isDragOver, setIsDragOver] = useState(false);
//   const [isVoiceRecorderOpen, setIsVoiceRecorderOpen] = useState(false);
//   const [audioRecordings, setAudioRecordings] = useState<AudioRecording[]>([]);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const AI_MODELS = [
//     "o3-mini",
//     "Gemini 2.5 Flash",
//     "Claude 3.5 Sonnet",
//     "GPT-4-1 Mini",
//     "GPT-4-1",
//   ];

//   const getFileType = (
//     file: File
//   ): "audio" | "document" | "image" | "video" => {
//     const type = file.type;
//     if (type.startsWith("audio/")) return "audio";
//     if (type.startsWith("image/")) return "image";
//     if (type.startsWith("video/")) return "video";
//     return "document";
//   };

//   const getFileIcon = (type: "audio" | "document" | "image" | "video") => {
//     switch (type) {
//       case "audio":
//         return <Music className="w-4 h-4" />;
//       case "image":
//         return <Image className="w-4 h-4" />;
//       case "video":
//         return <Video className="w-4 h-4" />;
//       default:
//         return <FileText className="w-4 h-4" />;
//     }
//   };

//   const handleFileUpload = (files: FileList | null) => {
//     if (!files) return;

//     Array.from(files).forEach((file) => {
//       const fileType = getFileType(file);
//       const newFile: UploadedFile = {
//         id: Math.random().toString(36).substr(2, 9),
//         file,
//         type: fileType,
//       };

//       // Create preview for images
//       if (fileType === "image") {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           setUploadedFiles((prev) =>
//             prev.map((f) =>
//               f.id === newFile.id
//                 ? { ...f, preview: e.target?.result as string }
//                 : f
//             )
//           );
//         };
//         reader.readAsDataURL(file);
//       }

//       // Create audio URL for audio files
//       if (fileType === "audio") {
//         const audioUrl = URL.createObjectURL(file);
//         newFile.audioUrl = audioUrl;
//       }

//       setUploadedFiles((prev) => [...prev, newFile]);
//     });
//   };

//   const handleRecordingComplete = (recording: AudioRecording) => {
//     setAudioRecordings((prev) => [...prev, recording]);

//     // Convert recording to file and add to uploaded files
//     const audioFile = new File(
//       [recording.blob],
//       `recording-${recording.id}.wav`,
//       {
//         type: recording.blob.type || "audio/wav",
//       }
//     );

//     // Create audio URL for playback
//     const audioUrl = URL.createObjectURL(recording.blob);

//     const newFile: UploadedFile = {
//       id: recording.id,
//       file: audioFile,
//       type: "audio",
//       audioUrl: audioUrl,
//     };

//     setUploadedFiles((prev) => [...prev, newFile]);
//   };

//   const removeAudioRecording = (recordingId: string) => {
//     setAudioRecordings((prev) => prev.filter((r) => r.id !== recordingId));
//     removeFile(recordingId);
//   };

//   const removeFile = (fileId: string) => {
//     setUploadedFiles((prev) => {
//       const fileToRemove = prev.find((f) => f.id === fileId);
//       if (fileToRemove?.audioUrl) {
//         URL.revokeObjectURL(fileToRemove.audioUrl);
//       }
//       return prev.filter((f) => f.id !== fileId);
//     });
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragOver(true);
//   };

//   const handleDragLeave = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragOver(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragOver(false);
//     handleFileUpload(e.dataTransfer.files);
//   };

//   const handleSendMessage = () => {
//     if ((!value.trim() && uploadedFiles.length === 0) || disabled || isLoading)
//       return;

//     // Call the parent's onSendMessage function
//     if (onSendMessage) {
//       onSendMessage(value, uploadedFiles);
//     }

//     // Clear the form
//     setValue("");
//     setUploadedFiles([]);
//     setAudioRecordings([]);
//     adjustHeight(true);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (
//       e.key === "Enter" &&
//       !e.shiftKey &&
//       (value.trim() || uploadedFiles.length > 0)
//     ) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="flex flex-col w-full bg-white">
//       <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-1">
//         <div className="relative">
//           <div className="relative flex flex-col">
//             <div
//               className="overflow-y-auto"
//               style={{ maxHeight: "400px" }}
//               onDragOver={handleDragOver}
//               onDragLeave={handleDragLeave}
//               onDrop={handleDrop}
//             >
//               {/* File Previews */}
//               <AnimatePresence>
//                 {uploadedFiles.length > 0 && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="px-4 pt-3 pb-2"
//                   >
//                     <div className="flex flex-wrap gap-2">
//                       {uploadedFiles.map((file) => {
//                         const isAudioRecording = audioRecordings.find(
//                           (r) => r.id === file.id
//                         );

//                         return (
//                           <motion.div
//                             key={file.id}
//                             initial={{ opacity: 0, scale: 0.8 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             exit={{ opacity: 0, scale: 0.8 }}
//                             className={cn(
//                               "bg-black/10 dark:bg-white/10 rounded-lg p-2",
//                               file.type === "audio" ? "max-w-sm" : "max-w-xs",
//                               file.type === "audio"
//                                 ? "flex flex-col gap-2"
//                                 : "flex items-center gap-2"
//                             )}
//                           >
//                             {file.type === "audio" ? (
//                               <AudioPreview
//                                 file={file}
//                                 isRecording={isAudioRecording}
//                                 onRemove={() =>
//                                   isAudioRecording
//                                     ? removeAudioRecording(file.id)
//                                     : removeFile(file.id)
//                                 }
//                               />
//                             ) : (
//                               <>
//                                 {file.type === "image" && file.preview ? (
//                                   <img
//                                     src={file.preview}
//                                     alt={file.file.name}
//                                     className="w-8 h-8 rounded object-cover"
//                                   />
//                                 ) : (
//                                   <div className="w-8 h-8 rounded bg-black/10 dark:bg-white/10 flex items-center justify-center">
//                                     {getFileIcon(file.type)}
//                                   </div>
//                                 )}
//                                 <div className="flex-1 min-w-0">
//                                   {file.type !== "image" && (
//                                     <p className="text-xs font-medium truncate dark:text-white">
//                                       {file.file.name}
//                                     </p>
//                                   )}
//                                   <p className="text-xs text-black/50 dark:text-white/50">
//                                     {formatFileSize(file.file.size)}
//                                   </p>
//                                 </div>
//                                 <button
//                                   onClick={() => removeFile(file.id)}
//                                   className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
//                                   aria-label="Remove file"
//                                 >
//                                   <X className="w-4 h-4 text-white" />
//                                 </button>
//                               </>
//                             )}
//                           </motion.div>
//                         );
//                       })}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               <Textarea
//                 id="ai-input-15"
//                 value={value}
//                 placeholder={
//                   uploadedFiles.length > 0
//                     ? "Add a message..."
//                     : "What can I do for you?"
//                 }
//                 className={cn(
//                   "w-full px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
//                   "min-h-[72px]",
//                   uploadedFiles.length > 0
//                     ? "rounded-none"
//                     : "rounded-xl rounded-b-none",
//                   isDragOver &&
//                     "bg-blue-50 dark:bg-blue-950/20 border-2 border-dashed border-blue-300 dark:border-blue-600"
//                 )}
//                 onKeyDown={handleKeyDown}
//                 ref={textareaRef}
//                 onChange={(e) => {
//                   setValue(e.target.value);
//                   adjustHeight();
//                 }}
//                 disabled={disabled || isLoading}
//               />
//             </div>

//             <div className="h-16 bg-black/5 dark:bg-white/5 rounded-b-xl flex items-center">
//               <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
//                 <div className="flex items-center gap-2">
//                   <label
//                     className={cn(
//                       "rounded-lg p-2 bg-black/5 dark:bg-white/5 cursor-pointer",
//                       "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
//                       "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white",
//                       (disabled || isLoading) && "opacity-50 cursor-not-allowed"
//                     )}
//                     aria-label="Attach file"
//                   >
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       className="hidden"
//                       multiple
//                       accept="audio/*,video/*,image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.pptx"
//                       onChange={(e) => handleFileUpload(e.target.files)}
//                       disabled={disabled || isLoading}
//                     />
//                     <Paperclip className="w-7 h-7 transition-colors" />
//                   </label>
//                   <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-0.5" />
//                   <button
//                     onClick={() => setIsVoiceRecorderOpen(true)}
//                     className={cn(
//                       "rounded-lg p-2 bg-black/5 dark:bg-white/5 cursor-pointer",
//                       "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
//                       "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white",
//                       (disabled || isLoading) && "opacity-50 cursor-not-allowed"
//                     )}
//                     aria-label="Record voice message"
//                     disabled={disabled || isLoading}
//                   >
//                     <Mic className="w-7 h-7 transition-colors" />
//                   </button>
//                 </div>
//                 <button
//                   type="button"
//                   className={cn(
//                     "rounded-lg p-1 bg-black/5 dark:bg-white/5",
//                     "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
//                     (disabled || isLoading) && "opacity-50 cursor-not-allowed"
//                   )}
//                   aria-label="Send message"
//                   disabled={
//                     (!value.trim() && uploadedFiles.length === 0) ||
//                     disabled ||
//                     isLoading
//                   }
//                   onClick={handleSendMessage}
//                 >
//                   {isLoading ? (
//                     <Loader2 className="w-7 h-7 dark:text-white animate-spin" />
//                   ) : (
//                     <ArrowRight
//                       className={cn(
//                         "w-8 h-8 dark:text-white transition-opacity duration-200",
//                         value.trim() || uploadedFiles.length > 0
//                           ? "opacity-100"
//                           : "opacity-30"
//                       )}
//                     />
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <AnimatePresence>
//         {isVoiceRecorderOpen && (
//           <VoiceRecorder
//             isOpen={isVoiceRecorderOpen}
//             onClose={() => setIsVoiceRecorderOpen(false)}
//             onRecordingComplete={handleRecordingComplete}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default function AI_Prompt_Demo() {
//   return <AI_Prompt />;
// }

"use client";

import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Paperclip,
  ChevronRight,
  Circle,
  X,
  FileText,
  Music,
  Video,
  Image,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  Play,
  Pause,
  Square,
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { cn, formatFileSize } from "@/lib/utils";
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
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

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
        className
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
      className
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
      className
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
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
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
      className
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
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

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
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
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

const OPENAI_ICON = (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 256 260"
      aria-label="OpenAI Icon"
      className="w-4 h-4 dark:hidden block"
    >
      <title>OpenAI Icon Light</title>
      <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 256 260"
      aria-label="OpenAI Icon"
      className="w-4 h-4 hidden dark:block"
    >
      <title>OpenAI Icon Dark</title>
      <path
        fill="#fff"
        d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"
      />
    </svg>
  </>
);

interface UploadedFile {
  id: string;
  file: File;
  type: "audio" | "document" | "image" | "video";
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
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
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

function VoiceRecorder({
  isOpen,
  onClose,
  onRecordingComplete,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>(Array(32).fill(0));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      // Start audio analysis for waveform
      if (analyserRef.current) {
        const updateWaveform = () => {
          const dataArray = new Uint8Array(
            analyserRef.current!.frequencyBinCount
          );
          analyserRef.current!.getByteFrequencyData(dataArray);

          const waveform = Array(32)
            .fill(0)
            .map((_, i) => {
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
          sampleRate: 44100,
        },
      });

      // Setup audio context for visualization
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Check for supported MIME types
      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/wav",
      ];

      let selectedMimeType = "audio/wav";
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: selectedMimeType,
        });
        const recording: AudioRecording = {
          id: Math.random().toString(36).substr(2, 9),
          blob: audioBlob,
          duration,
          timestamp: new Date(),
        };
        onRecordingComplete(recording);

        // Cleanup
        stream.getTracks().forEach((track) => track.stop());
        if (
          audioContextRef.current &&
          audioContextRef.current.state !== "closed"
        ) {
          audioContextRef.current.close();
        }
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setIsRecording(false);
        setIsProcessing(false);
      };

      mediaRecorderRef.current.start(100); // Collect data every 100ms
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsRecording(false);
      mediaRecorderRef.current.stop();
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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
              opacity: isRecording ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
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
          <motion.div className="relative z-10">
            <motion.button
              onClick={!isRecording ? startRecording : stopRecording}
              className={cn(
                "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300",
                "bg-gradient-to-br from-white/20 to-white/10 border-2",
                isRecording
                  ? "border-red-500 shadow-lg shadow-red-500/25"
                  : isProcessing
                  ? "border-yellow-500 shadow-lg shadow-yellow-500/25"
                  : "border-white/20 hover:border-white/40"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
              aria-label={!isRecording ? "Start recording" : "Stop recording"}
            >
              <AnimatePresence mode="popLayout">
                {isRecording ? (
                  <motion.div
                    key="recording"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-center w-full h-full"
                  >
                    <div className="w-12 h-12 bg-red-500 rounded-md pointer-events-none" />
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
          </motion.div>

          {/* Waveform visualizer */}
          <div className="flex items-center justify-center space-x-1 h-12">
            {waveformData.map((height, index) => (
              <motion.div
                key={index}
                className={cn(
                  "w-1 rounded-full transition-colors duration-300",
                  isRecording ? "bg-red-500" : "bg-white/30"
                )}
                animate={{
                  height: `${Math.max(4, height * 0.4)}px`,
                  opacity: isRecording ? 1 : 0.3,
                }}
                transition={{
                  duration: 0.1,
                  ease: "easeOut",
                }}
              >
                <div className="w-1 h-1 bg-white/30 rounded-full" />
              </motion.div>
            ))}
          </div>

          {/* Status and timer */}
          <div className="text-center space-y-2">
            <motion.p
              className={cn(
                "text-lg font-medium transition-colors",
                isRecording
                  ? "text-red-400"
                  : isProcessing
                  ? "text-yellow-400"
                  : "text-white/70"
              )}
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{
                duration: 2,
                repeat: isRecording || isProcessing ? Infinity : 0,
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
            {isRecording
              ? "Tap the button to stop recording"
              : "Tap the microphone to start recording"}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface AI_PromptProps {
  onSendMessage?: (message: string, files?: UploadedFile[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function AI_Prompt({
  onSendMessage,
  isLoading = false,
  disabled = false,
}: AI_PromptProps) {
  const [value, setValue] = useState("");
  const textareaScrollRef = useRef<HTMLDivElement | null>(null);
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

  // Mobile keyboard handling
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [initialViewportHeight, setInitialViewportHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const AI_MODELS = [
    "o3-mini",
    "Gemini 2.5 Flash",
    "Claude 3.5 Sonnet",
    "GPT-4-1 Mini",
    "GPT-4-1",
  ];

  // Mobile keyboard detection effect
  useEffect(() => {
    const initialHeight = window.visualViewport?.height || window.innerHeight;
    setInitialViewportHeight(initialHeight);

    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDifference = initialHeight - currentHeight;

      // If height difference is significant (usually > 150px), keyboard is likely open
      const keyboardThreshold = 150;
      const keyboardOpen = heightDifference > keyboardThreshold;

      setIsKeyboardOpen(keyboardOpen);

      // Scroll input into view when keyboard opens
      if (keyboardOpen && containerRef.current) {
        setTimeout(() => {
          containerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    };

    const handleFocus = () => {
      // Additional scroll on focus for iOS devices
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300); // Delay to allow keyboard to open
    };

    // Use visual viewport API if available
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportChange);
    } else {
      // Fallback for older browsers
      window.addEventListener("resize", handleViewportChange);
    }

    // Add focus listener to textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("focus", handleFocus);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleViewportChange
        );
      } else {
        window.removeEventListener("resize", handleViewportChange);
      }

      if (textarea) {
        textarea.removeEventListener("focus", handleFocus);
      }
    };
  }, []);

  const getFileType = (
    file: File
  ): "audio" | "document" | "image" | "video" => {
    const type = file.type;
    if (type.startsWith("audio/")) return "audio";
    if (type.startsWith("image/")) return "image";
    if (type.startsWith("video/")) return "video";
    return "document";
  };

  const getFileIcon = (type: "audio" | "document" | "image" | "video") => {
    switch (type) {
      case "audio":
        return <Music className="w-4 h-4" />;
      case "image":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const fileType = getFileType(file);
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        type: fileType,
      };

      // Create preview for images
      if (fileType === "image") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id
                ? { ...f, preview: e.target?.result as string }
                : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      // Create audio URL for audio files
      if (fileType === "audio") {
        const audioUrl = URL.createObjectURL(file);
        newFile.audioUrl = audioUrl;
      }

      setUploadedFiles((prev) => [...prev, newFile]);
    });
  };

  const handleRecordingComplete = (recording: AudioRecording) => {
    setAudioRecordings((prev) => [...prev, recording]);

    // Convert recording to file and add to uploaded files
    const audioFile = new File(
      [recording.blob],
      `recording-${recording.id}.wav`,
      {
        type: recording.blob.type || "audio/wav",
      }
    );

    // Create audio URL for playback
    const audioUrl = URL.createObjectURL(recording.blob);

    const newFile: UploadedFile = {
      id: recording.id,
      file: audioFile,
      type: "audio",
      audioUrl: audioUrl,
    };

    setUploadedFiles((prev) => [...prev, newFile]);
  };

  const removeAudioRecording = (recordingId: string) => {
    setAudioRecordings((prev) => prev.filter((r) => r.id !== recordingId));
    removeFile(recordingId);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove?.audioUrl) {
        URL.revokeObjectURL(fileToRemove.audioUrl);
      }
      return prev.filter((f) => f.id !== fileId);
    });
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
    handleFileUpload(e.dataTransfer.files);
  };

  const handleSendMessage = () => {
    if ((!value.trim() && uploadedFiles.length === 0) || disabled || isLoading)
      return;

    // Call the parent's onSendMessage function
    if (onSendMessage) {
      onSendMessage(value, uploadedFiles);
    }

    // Clear the form
    setValue("");
    setUploadedFiles([]);
    setAudioRecordings([]);
    adjustHeight(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      (value.trim() || uploadedFiles.length > 0)
    ) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col w-full bg-white transition-all duration-300",
        isKeyboardOpen && "mb-4" // Add margin when keyboard is open
      )}
      style={{
        // Use CSS custom properties for dynamic viewport handling
        minHeight: isKeyboardOpen ? "auto" : undefined,
      }}
    >
      <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-1">
        <div className="relative">
          <div className="relative flex flex-col">
            <div
              className="overflow-y-auto"
              style={{
                maxHeight: isKeyboardOpen ? "200px" : "400px", // Reduce max height when keyboard is open
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* File Previews */}
              <AnimatePresence>
                {uploadedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pt-3 pb-2"
                  >
                    <div className="flex flex-wrap gap-2">
                      {uploadedFiles.map((file) => {
                        const isAudioRecording = audioRecordings.find(
                          (r) => r.id === file.id
                        );

                        return (
                          <motion.div
                            key={file.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={cn(
                              "bg-black/10 dark:bg-white/10 rounded-lg p-2",
                              file.type === "audio" ? "max-w-sm" : "max-w-xs",
                              file.type === "audio"
                                ? "flex flex-col gap-2"
                                : "flex items-center gap-2"
                            )}
                          >
                            {file.type === "audio" ? (
                              <AudioPreview
                                file={file}
                                isRecording={isAudioRecording}
                                onRemove={() =>
                                  isAudioRecording
                                    ? removeAudioRecording(file.id)
                                    : removeFile(file.id)
                                }
                              />
                            ) : (
                              <>
                                {file.type === "image" && file.preview ? (
                                  <img
                                    src={file.preview}
                                    alt={file.file.name}
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-black/10 dark:bg-white/10 flex items-center justify-center">
                                    {getFileIcon(file.type)}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  {file.type !== "image" && (
                                    <p className="text-xs font-medium truncate dark:text-white">
                                      {file.file.name}
                                    </p>
                                  )}
                                  <p className="text-xs text-black/50 dark:text-white/50">
                                    {formatFileSize(file.file.size)}
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeFile(file.id)}
                                  className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                                  aria-label="Remove file"
                                >
                                  <X className="w-4 h-4 text-white" />
                                </button>
                              </>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Textarea
                id="ai-input-15"
                value={value}
                placeholder={
                  uploadedFiles.length > 0
                    ? "Add a message..."
                    : "What can I do for you?"
                }
                className={cn(
                  "w-full px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                  "min-h-[72px]",
                  uploadedFiles.length > 0
                    ? "rounded-none"
                    : "rounded-xl rounded-b-none",
                  isDragOver &&
                    "bg-blue-50 dark:bg-blue-950/20 border-2 border-dashed border-blue-300 dark:border-blue-600"
                )}
                onKeyDown={handleKeyDown}
                ref={textareaRef}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
                onFocus={() => {
                  // Additional focus handling for better mobile experience
                  if ("scrollIntoViewIfNeeded" in document.documentElement) {
                    // Safari-specific method
                    setTimeout(() => {
                      (textareaRef.current as any)?.scrollIntoViewIfNeeded?.(
                        false
                      );
                    }, 100);
                  }
                }}
                disabled={disabled || isLoading}
              />
            </div>

            <div className="h-16 bg-black/5 dark:bg-white/5 rounded-b-xl flex items-center">
              <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
                <div className="flex items-center gap-2">
                  <label
                    className={cn(
                      "rounded-lg p-2 bg-black/5 dark:bg-white/5 cursor-pointer",
                      "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                      "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white",
                      (disabled || isLoading) && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label="Attach file"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      multiple
                      accept="audio/*,video/*,image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.pptx"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      disabled={disabled || isLoading}
                    />
                    <Paperclip className="w-7 h-7 transition-colors" />
                  </label>
                  <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-0.5" />
                  <button
                    onClick={() => setIsVoiceRecorderOpen(true)}
                    className={cn(
                      "rounded-lg p-2 bg-black/5 dark:bg-white/5 cursor-pointer",
                      "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                      "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white",
                      (disabled || isLoading) && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label="Record voice message"
                    disabled={disabled || isLoading}
                  >
                    <Mic className="w-7 h-7 transition-colors" />
                  </button>
                </div>
                <button
                  type="button"
                  className={cn(
                    "rounded-lg p-1 bg-black/5 dark:bg-white/5",
                    "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                    (disabled || isLoading) && "opacity-50 cursor-not-allowed"
                  )}
                  aria-label="Send message"
                  disabled={
                    (!value.trim() && uploadedFiles.length === 0) ||
                    disabled ||
                    isLoading
                  }
                  onClick={handleSendMessage}
                >
                  {isLoading ? (
                    <Loader2 className="w-7 h-7 dark:text-white animate-spin" />
                  ) : (
                    <ArrowRight
                      className={cn(
                        "w-8 h-8 dark:text-white transition-opacity duration-200",
                        value.trim() || uploadedFiles.length > 0
                          ? "opacity-100"
                          : "opacity-30"
                      )}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default function AI_Prompt_Demo() {
  return <AI_Prompt />;
}
