"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  SendHorizontal,
  ImagePlus,
  Bot,
  User,
  AlertCircle,
  Music,
  Trash2,
  HelpCircle,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { validateText, processPrompt } from "@/lib/api";
import {
  LLMResponse,
  Message,
  ProcessOptions,
  ProcessResponse,
  TranscriptionResponse,
} from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AudioRecorder } from "@/components/AudioRecorder";
import { ChatHistory } from "@/components/ChatHistory";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { ChatMessage } from "./chat-messages";

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const [selectedAudioBlob, setSelectedAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sourceLang, setSourceLang] = useState<string>("tel");
  const [targetLang, setTargetLang] = useState<string>("eng");

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && selectedImages.length === 0 && !selectedAudio) return;

    try {
      setIsLoading(true);
      const newMessage: Message = {
        role: "user",
        content: input,
        images: selectedImages.length > 0 ? selectedImages : undefined,
        audio: selectedAudio || undefined,
      };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
      setSelectedImages([]);

      let options: ProcessOptions = {
        sourceLang,
        targetLang,
      };

      if (selectedImages.length > 0) {
        const response = await fetch(selectedImages[0]);
        const blob = await response.blob();
        const base64Image = await convertBlobToBase64(blob);
        options.image_data = base64Image;
      }

      if (selectedAudioBlob) {
        const base64Audio = await convertBlobToBase64(selectedAudioBlob);
        options.audio_data = base64Audio;
      }

      const result = (await processPrompt(input, options)) as ProcessResponse;

      if (result.status === "success") {
        if (selectedAudioBlob) {
          const transcriptionResponse = result.response as TranscriptionResponse;
          const transcriptionMessage: Message = {
            role: "assistant",
            content: (
              <div className="space-y-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">Telugu: </span>
                    <span className="text-foreground">
                      {transcriptionResponse.tel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">English: </span>
                    <span className="text-foreground">
                      {transcriptionResponse.eng}
                    </span>
                  </div>
                  <div className="mt-2 text-foreground">
                    {transcriptionResponse.generation}
                  </div>
                </div>
              </div>
            ),
          };
          setMessages((prev) => [...prev, transcriptionMessage]);
        } else {
          const llmResponse = result.response as LLMResponse;
          const aiResponse: Message = {
            role: "assistant",
            content: llmResponse.generation.toString(),
          };
          setMessages((prev) => [...prev, aiResponse]);
        }
      } else {
        const errorMessage: Message = {
          role: "error",
          content:
            typeof result.response === "string"
              ? result.response
              : "An error occurred while processing your request.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        role: "error",
        content:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectedAudio(null);
      setSelectedAudioBlob(null);
    }
  };

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

  const handleAudioCaptured = (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    setSelectedAudio(audioUrl);
    setSelectedAudioBlob(audioBlob);
  };

  const clearChat = () => {
    setMessages([]);
    setInput("");
    setSelectedImages([]);
    setSelectedAudio(null);
    setSelectedAudioBlob(null);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold">Chat Assistant</h1>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            className="text-muted-foreground"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bot className="mb-4 h-12 w-12 text-muted-foreground" />
              <h2 className="mb-2 text-lg font-medium">How can I help you today?</h2>
              <p className="text-sm text-muted-foreground">
                Ask me anything about learning Telugu or English
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={index}
                isUser={message.role === "user"}
                isError={message.role === "error"}
              >
                {typeof message.content === "string" ? (
                  <p>{message.content}</p>
                ) : (
                  message.content
                )}
                {message.images && (
                  <div className="mt-3 grid gap-3">
                    {message.images.map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img}
                        alt={`Uploaded ${imgIndex + 1}`}
                        className="max-h-60 rounded-lg object-contain"
                      />
                    ))}
                  </div>
                )}
                {message.audio && (
                  <div className="mt-3">
                    <audio
                      controls
                      src={message.audio}
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
              </ChatMessage>
            ))
          )}
          {isLoading && (
            <ChatMessage>
              <TextShimmer className="font-mono text-sm">
                Generating response...
              </TextShimmer>
            </ChatMessage>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          {(selectedImages.length > 0 || selectedAudio) && (
            <div className="mb-4 rounded-lg border bg-background/50 p-3">
              <div className="flex flex-wrap gap-3">
                {selectedImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="h-20 w-20 rounded-lg border object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                      onClick={() => setSelectedImages([])}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {selectedAudio && (
                  <div className="flex-1">
                    <div className="flex items-center gap-2 rounded-lg border bg-background p-2">
                      <audio controls src={selectedAudio} className="flex-1" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedAudio(null);
                          setSelectedAudioBlob(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-l-md rounded-r-none border-r-0"
                disabled={isRecording}
              >
                <ImagePlus className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => audioInputRef.current?.click()}
                className="rounded-none border-x-0"
                disabled={isRecording}
              >
                <Music className="h-5 w-5" />
              </Button>
              <div className="rounded-l-none rounded-r-md border-l-0">
                <AudioRecorder
                  onAudioCaptured={handleAudioCaptured}
                  onRecordingStateChange={setIsRecording}
                  sourceLang={sourceLang}
                />
              </div>
            </div>

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

            <div className="relative flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Conversational AI..."
                className="pr-12"
                disabled={isRecording}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                disabled={
                  isLoading ||
                  isRecording ||
                  (!input.trim() && !selectedImages.length && !selectedAudio)
                }
              >
                <SendHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}