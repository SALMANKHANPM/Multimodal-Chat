import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  RiCodeSSlashLine,
  RiBookLine,
  RiLoopRightFill,
  RiCheckLine,
  RiArticleLine,
  RiPlayFill,
  RiPauseFill,
  RiDownloadLine,
} from "@remixicon/react";
import { useState, useRef, useEffect } from "react";

type MessageMedia = {
  type: "image" | "audio";
  url: string;
  alt?: string;
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
      <Image
        className={cn(
          "rounded-full",
          isUser ? "order-1" : "border border-black/[0.08] shadow-sm"
        )}
        src={
          isUser
            ? "https://res.cloudinary.com/dlzlfasou/image/upload/v1741345634/user-02_mlqqqt.png"
            : "https://res.cloudinary.com/dlzlfasou/image/upload/v1741345634/user-01_i5l7tp.png"
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
            <div className="mt-2 space-y-3">
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
    return (
      <div className="relative rounded-lg overflow-hidden">
        <div className="relative aspect-video max-h-60 bg-muted/50">
          <img
            src={media.url}
            alt={media.alt || "Shared image"}
            className="rounded-lg object-contain w-full h-full"
          />
        </div>
        <div className="absolute bottom-2 right-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-background/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-background transition-colors"
                >
                  <RiDownloadLine size={16} />
                  <span className="sr-only">View full image</span>
                </a>
              </TooltipTrigger>
              <TooltipContent side="top">View full image</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  } else if (media.type === "audio") {
    return <AudioPlayer url={media.url} />;
  }

  return null;
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
