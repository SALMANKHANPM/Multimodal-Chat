"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ImagePlus,
  Music,
  X,
} from "lucide-react";
import { AudioRecorder } from "@/components/AudioRecorder";
import { AI_Prompt } from "@/components/ui/ai-prompt";

interface EnhancedChatFormProps {
  input: string;
  setInput: (value: string) => void;
  selectedImages: string[];
  setSelectedImages: (images: string[]) => void;
  selectedAudio: string | null;
  setSelectedAudio: (audio: string | null) => void;
  selectedAudioBlob: Blob | null;
  setSelectedAudioBlob: (blob: Blob | null) => void;
  isLoading: boolean;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  sourceLang: string;
  onSubmit: (e: React.FormEvent) => void;
  onAudioCaptured: (audioBlob: Blob) => void;
}

export function EnhancedChatForm({
  input,
  setInput,
  selectedImages,
  setSelectedImages,
  selectedAudio,
  setSelectedAudio,
  selectedAudioBlob,
  setSelectedAudioBlob,
  isLoading,
  isRecording,
  setIsRecording,
  sourceLang,
  onSubmit,
  onAudioCaptured,
}: EnhancedChatFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files)
      .slice(0, 1)
      .map((file) => URL.createObjectURL(file));
    setSelectedImages(newImages);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const audioFile = files[0];
    const audioUrl = URL.createObjectURL(audioFile);
    setSelectedAudio(audioUrl);
    setSelectedAudioBlob(audioFile);
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 bg-background border-t mt-auto">
      <div className="max-w-3xl mx-auto w-full px-4 md:px-6 lg:px-8 py-4">
        
        {/* Show selected media preview */}
        {(selectedImages.length > 0 || selectedAudio) && (
          <div className="mb-4 p-3 bg-muted/70 rounded-lg border border-muted">
            <div className="flex flex-wrap gap-2">
              {selectedImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-md border border-muted shadow-sm"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-90 shadow-sm"
                    onClick={() => setSelectedImages([])}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {selectedAudio && (
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 p-2 bg-background rounded-md border border-muted">
                    <audio
                      controls
                      src={selectedAudio}
                      className="flex-1 max-w-full"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6 rounded-full opacity-90 shadow-sm"
                      onClick={() => {
                        setSelectedAudio(null);
                        setSelectedAudioBlob(null);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Media upload controls */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            title="Upload Image"
            disabled={isRecording}
            className="h-10 w-10"
          >
            <ImagePlus className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => audioInputRef.current?.click()}
            title="Upload Audio"
            disabled={isRecording}
            className="h-10 w-10"
          >
            <Music className="h-5 w-5" />
          </Button>
          <AudioRecorder
            onAudioCaptured={onAudioCaptured}
            onRecordingStateChange={setIsRecording}
            sourceLang={sourceLang}
          />
        </div>

        {/* Hidden file inputs for media upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        <input
          type="file"
          ref={audioInputRef}
          onChange={handleAudioUpload}
          accept="audio/*"
          className="hidden"
        />

        {/* Advanced AI Prompt Component */}
        <AI_Prompt />
      </div>
    </div>
  );
}