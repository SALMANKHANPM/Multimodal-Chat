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
  RiZoomInLine,
  RiImageLine,
  RiVolumeUpLine,
  RiCloseLine,
} from "@remixicon/react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";

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
        "flex items-start gap-2 sm:gap-4 text-sm sm:text-[15px] leading-relaxed",
        isUser && "justify-end"
      )}
    >
      <img
        className={cn(
          "rounded-full w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0",
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
          "max-w-[85%] sm:max-w-[80%] min-w-0",
          isUser
            ? "bg-muted px-3 py-2 sm:px-4 sm:py-3 rounded-xl"
            : isError
            ? "bg-destructive/10 px-3 py-2 sm:px-4 sm:py-3 rounded-xl space-y-3 sm:space-y-4"
            : "space-y-3 sm:space-y-4"
        )}
      >
        <div className="flex flex-col gap-2 sm:gap-3">
          <p className="sr-only">
            {isUser ? "You" : isError ? "Error" : "Bart"} said:
          </p>

          {isError && (
            <div className="flex items-center gap-2 text-destructive font-medium mb-1">
              <RiArticleLine size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
              <span className="text-sm">Error</span>
            </div>
          )}

          <div className="break-words overflow-wrap-anywhere">
            {children}
          </div>

          {media && media.length > 0 && (
            <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
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
    return <AudioPlayer media={media} />;
  } else if (media.type === "document") {
    return <DocumentPreview media={media} />;
  }

  return null;
}

function ImagePreview({ media }: { media: MessageMedia }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = media.url;
    link.download = media.name || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="bg-background rounded-lg p-2 sm:p-3 border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Image Icon */}
          <div className="flex-shrink-0">
            <RiImageLine size={20} className="sm:w-6 sm:h-6 text-blue-500" />
          </div>
          
          {/* File Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-foreground truncate">
              {media.name || 'Image'}
            </p>
            {media.size && (
              <p className="text-xs text-muted-foreground">
                {formatFileSize(media.size)}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Preview Button */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={handlePreviewClick}
                    className="text-muted-foreground hover:text-foreground p-1 sm:p-1.5 rounded-full transition-colors hover:bg-muted/50"
                  >
                    <RiZoomInLine size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="sr-only">Preview image</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Preview image</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Download Button */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleDownload}
                    className="text-muted-foreground hover:text-foreground p-1 sm:p-1.5 rounded-full transition-colors hover:bg-muted/50"
                  >
                    <RiDownloadLine size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="sr-only">Download image</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Download image</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Image Preview Dialog - Mobile optimized */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] sm:max-w-6xl p-0 bg-black/95 border-0 shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Image preview</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button - Mobile optimized */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-black/50 hover:bg-black/70 text-white border-white/20 h-8 w-8 sm:h-10 sm:w-10"
            >
              <RiCloseLine size={18} className="sm:w-5 sm:h-5" />
            </Button>
            
            {/* Image */}
            <img
              src={media.url}
              alt={media.alt || media.name || "Image preview"}
              className="max-w-full max-h-full object-contain p-4"
            />
            
            {/* Download button - Mobile optimized */}
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-colors border border-white/20 text-white"
                    >
                      <RiDownloadLine size={14} className="sm:w-4 sm:h-4" />
                      <span className="sr-only">Download image</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Download image</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DocumentPreview({ media }: { media: MessageMedia }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getFileIcon = (fileName?: string) => {
    if (!fileName) return <RiFileTextLine size={20} className="sm:w-6 sm:h-6" />;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      return <RiFilePdfLine size={20} className="sm:w-6 sm:h-6 text-red-500" />;
    }
    return <RiFileTextLine size={20} className="sm:w-6 sm:h-6" />;
  };

  const isPDF = media.name?.toLowerCase().endsWith('.pdf');

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPDF) {
      setIsDialogOpen(true);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = media.url;
    link.download = media.name || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="bg-background rounded-lg p-2 sm:p-3 border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-shrink-0">
            {getFileIcon(media.name)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-foreground truncate">
              {media.name || 'Document'}
            </p>
            {media.size && (
              <p className="text-xs text-muted-foreground">
                {formatFileSize(media.size)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Preview Button (for PDFs) */}
            {isPDF && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={handlePreviewClick}
                      className="text-muted-foreground hover:text-foreground p-1 sm:p-1.5 rounded-full transition-colors hover:bg-muted/50"
                    >
                      <RiZoomInLine size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span className="sr-only">Preview document</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Preview document</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Download Button */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleDownload}
                    className="text-muted-foreground hover:text-foreground p-1 sm:p-1.5 rounded-full transition-colors hover:bg-muted/50"
                  >
                    <RiDownloadLine size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="sr-only">Download document</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Download document</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* PDF Preview Dialog - Mobile optimized */}
      {isPDF && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] sm:max-w-6xl p-0 bg-background border shadow-2xl">
            <DialogHeader className="sr-only">
              <DialogTitle>PDF preview</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-full flex flex-col">
              {/* Header with close and download - Mobile optimized */}
              <div className="flex items-center justify-between p-2 sm:p-4 border-b bg-muted/50">
                <h3 className="text-sm sm:text-lg font-semibold truncate flex-1 mr-2">{media.name}</h3>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleDownload}
                          className="inline-flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 hover:bg-muted rounded-full transition-colors"
                        >
                          <RiDownloadLine size={14} className="sm:w-4 sm:h-4" />
                          <span className="sr-only">Download PDF</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Download PDF</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsDialogOpen(false)}
                    className="h-8 w-8 sm:h-9 sm:w-9"
                  >
                    <RiCloseLine size={16} className="sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </div>
              
              {/* PDF Viewer */}
              <div className="flex-1 w-full">
                <iframe
                  src={media.url}
                  className="w-full h-full border-0"
                  title={`PDF preview: ${media.name}`}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function AudioPlayer({ media }: { media: MessageMedia }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const handleDurationChange = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener("durationchange", handleDurationChange);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("durationchange", handleDurationChange);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  const togglePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = media.url;
    link.download = media.name || 'audio';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-background rounded-lg p-2 sm:p-3 border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <audio ref={audioRef} src={media.url} className="hidden" />

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Audio Icon */}
        <div className="flex-shrink-0">
          <RiVolumeUpLine size={20} className="sm:w-6 sm:h-6 text-green-500" />
        </div>
        
        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-foreground truncate">
            {media.name || 'Audio'}
          </p>
          <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
            {media.size && <span>{formatFileSize(media.size)}</span>}
            {duration > 0 && (
              <>
                {media.size && <span>•</span>}
                <span>{formatTime(duration)}</span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Play/Pause Button */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={togglePlayPause}
                  className="bg-primary text-primary-foreground rounded-full p-1.5 sm:p-2 hover:bg-primary/90 transition-colors"
                >
                  {isPlaying ? <RiPauseFill size={14} className="sm:w-4 sm:h-4" /> : <RiPlayFill size={14} className="sm:w-4 sm:h-4" />}
                  <span className="sr-only">{isPlaying ? 'Pause' : 'Play'} audio</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">{isPlaying ? 'Pause' : 'Play'} audio</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Download Button */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleDownload}
                  className="text-muted-foreground hover:text-foreground p-1 sm:p-1.5 rounded-full transition-colors hover:bg-muted/50"
                >
                  <RiDownloadLine size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="sr-only">Download audio</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Download audio</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
          className="relative text-muted-foreground/80 hover:text-foreground transition-colors size-6 sm:size-8 flex items-center justify-center before:absolute before:inset-y-1 sm:before:inset-y-1.5 before:left-0 before:w-px before:bg-border first:before:hidden first-of-type:rounded-s-lg last-of-type:rounded-e-lg focus-visible:z-10 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring/70"
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
        <ActionButton icon={<RiCodeSSlashLine size={14} className="sm:w-4 sm:h-4" />} label="Show code" />
        <ActionButton icon={<RiBookLine size={14} className="sm:w-4 sm:h-4" />} label="Bookmark" />
        <ActionButton icon={<RiLoopRightFill size={14} className="sm:w-4 sm:h-4" />} label="Refresh" />
        <ActionButton icon={<RiCheckLine size={14} className="sm:w-4 sm:h-4" />} label="Approve" />
      </TooltipProvider>
    </div>
  );
}