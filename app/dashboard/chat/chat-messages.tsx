import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  RiCodeSSlashLine,
  RiBookLine,
  RiLoopRightFill,
  RiCheckLine,
  RiArticleLine,
  RiPlayFill,
  RiPauseFill,
  RiDownloadLine,
  RiFilePdfLine,
  RiFileTextLine,
  RiExpandDiagonalLine,
  RiZoomInLine,
} from "@remixicon/react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

type MessageMedia = {
  type: "image" | "audio" | "document";
  url: string;
  alt?: string;
  name?: string;
  size?: number;
};

type ChatMessageProps = {
  isUser?: boolean;
  isError?: boolean;
  children: React.ReactNode;
  media?: MessageMedia[];
  timestamp?: string;
};

export function ChatMessage({
  isUser,
  isError,
  children,
  media,
  timestamp,
}: ChatMessageProps) {
  return (
    <article
      className={cn(
        "flex items-start gap-4 text-[15px] leading-relaxed",
        isUser && "justify-end"
      )}
    >
      <img
        className={cn(
          "rounded-full",
          isUser ? "order-1" : "border border-black/[0.08] shadow-sm"
        )}
        src={
          isUser
            ? "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"
            : "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-01_i5l7tp.png"
        }
        alt={isUser ? "User profile" : "Bart logo"}
        width={40}
        height={40}
      />
      <div
        className={cn(
          "max-w-[80%]",
          isUser
            ? "bg-muted px-4 py-3 rounded-xl"
            : isError
            ? "bg-destructive/10 px-4 py-3 rounded-xl space-y-4"
            : "space-y-4"
        )}
      >
        <div className="flex flex-col gap-3">
          <p className="sr-only">
            {isUser ? "You" : isError ? "Error" : "Bart"} said:
          </p>

          {isError && (
            <div className="flex items-center gap-2 text-destructive font-medium mb-1">
              <RiArticleLine size={18} />
              <span>Error</span>
            </div>
          )}

          {children}

          {media && media.length > 0 && (
            <div className="mt-3 space-y-3">
              {media.map((item, index) => (
                <MediaRenderer key={index} media={item} />
              ))}
            </div>
          )}

          {timestamp && (
            <span className="text-xs text-muted-foreground mt-1">
              {timestamp}
            </span>
          )}
        </div>

        {!isUser && !isError && <MessageActions />}
      </div>
    </article>
  );
}

type MediaRendererProps = {
  media: MessageMedia;
};

function MediaRenderer({ media }: MediaRendererProps) {
  if (media.type === "image") {
    return <ImagePreview media={media} />;
  } else if (media.type === "audio") {
    return <AudioPlayer url={media.url} />;
  } else if (media.type === "document") {
    return <DocumentPreview media={media} />;
  }

  return null;
}

function ImagePreview({ media }: { media: MessageMedia }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="group relative">
      {/* Image Container */}
      <div className="relative rounded-xl overflow-hidden bg-muted/30 border border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="relative aspect-video max-h-80 bg-gradient-to-br from-muted/50 to-muted/80">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            </div>
          )}
          
          {hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <RiArticleLine size={32} className="mb-2" />
              <span className="text-sm">Failed to load image</span>
            </div>
          ) : (
            <img
              src={media.url}
              alt={media.alt || media.name || "Shared image"}
              className={cn(
                "w-full h-full object-cover transition-all duration-300",
                "group-hover:scale-[1.02]",
                isLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          )}
        </div>

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200">
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {/* Zoom/View Full Size */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90 border border-border/50"
                >
                  <RiExpandDiagonalLine size={14} />
                  <span className="sr-only">View full size</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-0 shadow-none">
                <DialogHeader className="sr-only">
                  <DialogTitle>Full size image</DialogTitle>
                </DialogHeader>
                <div className="relative w-full max-h-[90vh] bg-black/90 rounded-lg overflow-hidden">
                  <img
                    src={media.url}
                    alt={media.alt || media.name || "Full size image"}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-4 right-4">
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={media.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-10 w-10 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background/90 transition-colors border border-border/50"
                          >
                            <RiDownloadLine size={16} />
                            <span className="sr-only">Download image</span>
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="left">Download image</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Download */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-8 w-8 bg-background/80 backdrop-blur-sm rounded-md hover:bg-background/90 transition-colors border border-border/50"
                  >
                    <RiDownloadLine size={14} />
                    <span className="sr-only">Download image</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="left">Download image</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Image Info */}
      {(media.name || media.size) && (
        <div className="mt-2 px-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {media.name && (
              <span className="truncate font-medium">{media.name}</span>
            )}
            {media.size && (
              <span className="ml-2 flex-shrink-0">{formatFileSize(media.size)}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentPreview({ media }: { media: MessageMedia }) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName?: string) => {
    if (!fileName) return <RiFileTextLine size={24} />;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      return <RiFilePdfLine size={24} className="text-red-500" />;
    }
    return <RiFileTextLine size={24} />;
  };

  return (
    <div className="bg-background rounded-lg p-3 border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {getFileIcon(media.name)}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {media.name || 'Document'}
          </p>
          {media.size && (
            <p className="text-xs text-muted-foreground">
              {formatFileSize(media.size)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground p-1.5 rounded-full transition-colors hover:bg-muted/50"
                >
                  <RiDownloadLine size={18} />
                  <span className="sr-only">Download document</span>
                </a>
              </TooltipTrigger>
              <TooltipContent side="top">Download document</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

function AudioPlayer({ url }: { url: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleDurationChange = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("durationchange", handleDurationChange);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("durationchange", handleDurationChange);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="bg-background rounded-lg p-3 border border-border shadow-sm">
      <audio ref={audioRef} src={url} className="hidden" />

      <div className="flex items-center gap-3">
        <button
          onClick={togglePlayPause}
          className="bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors"
        >
          {isPlaying ? <RiPauseFill size={20} /> : <RiPlayFill size={20} />}
        </button>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSliderChange}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={url}
                download
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-full transition-colors"
              >
                <RiDownloadLine size={18} />
                <span className="sr-only">Download audio</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="top">Download audio</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

type ActionButtonProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className="relative text-muted-foreground/80 hover:text-foreground transition-colors size-8 flex items-center justify-center before:absolute before:inset-y-1.5 before:left-0 before:w-px before:bg-border first:before:hidden first-of-type:rounded-s-lg last-of-type:rounded-e-lg focus-visible:z-10 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring/70"
        >
          {icon}
          <span className="sr-only">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="dark px-2 py-1 text-xs">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function MessageActions() {
  return (
    <div className="relative inline-flex bg-white rounded-md border border-black/[0.08] shadow-sm -space-x-px">
      <TooltipProvider delayDuration={0}>
        <ActionButton icon={<RiCodeSSlashLine size={16} />} label="Show code" />
        <ActionButton icon={<RiBookLine size={16} />} label="Bookmark" />
        <ActionButton icon={<RiLoopRightFill size={16} />} label="Refresh" />
        <ActionButton icon={<RiCheckLine size={16} />} label="Approve" />
      </TooltipProvider>
    </div>
  );
}