"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VoiceChat } from "@/components/ui/voice-chat";

interface VoiceRecorderDialogProps {
  onAudioCaptured?: (audioBlob: Blob) => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceRecorderDialog({
  onAudioCaptured,
  disabled = false,
  className
}: VoiceRecorderDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleVoiceRecordingStart = () => {
    setIsRecording(true);
  };

  const handleVoiceRecordingStop = (duration: number) => {
    setIsRecording(false);
  };

  const handleAudioCaptured = (audioBlob: Blob) => {
    onAudioCaptured?.(audioBlob);
    setIsOpen(false);
    setIsRecording(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className={className}
          title="Record voice message"
        >
          <Mic className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Voice Recording</DialogTitle>
        </DialogHeader>
        <VoiceChat
          onStart={handleVoiceRecordingStart}
          onStop={handleVoiceRecordingStop}
          onAudioCaptured={handleAudioCaptured}
          isRecording={isRecording}
          onToggleRecording={() => setIsRecording(!isRecording)}
          className="min-h-[300px]"
        />
      </DialogContent>
    </Dialog>
  );
}