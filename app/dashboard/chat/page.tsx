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
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
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
import {
  RiCodeSSlashLine,
  RiShareLine,
  RiShareCircleLine,
  RiShining2Line,
  RiAttachment2,
  RiMicLine,
  RiLeafLine,
} from "@remixicon/react";
import { ChatMessage } from "./chat-messages";
import { TextShimmer } from "@/components/ui/text-shimmer";
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
  const [isPreparing, setIsPreparing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [alert, setAlert] = useState<{
    title: string;
    description: string;
    variant?: "default" | "destructive";
  } | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [sourceLang, setSourceLang] = useState<string>("tel");
  const [targetLang, setTargetLang] = useState<string>("eng");

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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
          // Add transcription message
          const transcriptionResponse =
            result.response as TranscriptionResponse;
          console.log("=============  Transcription Response  ==========");
          console.log(transcriptionResponse);
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
        setAlert({
          title: "Error",
          description:
            typeof result.response === "string"
              ? result.response
              : "An error occurred while processing your request.",
          variant: "destructive",
        });

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
      setAlert({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        variant: "destructive",
      });

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

    if (files.length > 1) {
      setAlert({
        title: "Warning",
        description: "Only the first image will be processed by the AI.",
        variant: "default",
      });
    }

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

  const clearChat = () => {
    setMessages([]);
    setInput("");
    setSelectedImages([]);
    setSelectedAudio(null);
    setSelectedAudioBlob(null);
  };

  const handleAudioCaptured = (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    setSelectedAudio(audioUrl);
    setSelectedAudioBlob(audioBlob);
  };

  // Render chat messages dynamically based on the messages state
  const renderChatMessages = () => {
    if (messages.length === 0) {
      return (
        <div className="text-center my-8">
          <div className="inline-flex items-center bg-white rounded-full border border-black/[0.08] shadow-xs text-xs font-medium py-1 px-3 text-foreground/80">
            <RiShining2Line
              className="me-1.5 text-muted-foreground/70 -ms-1"
              size={14}
              aria-hidden="true"
            />
            Start a conversation
          </div>
          {/* <ChatMessage isUser={false}></ChatMessage> */}
        </div>
      );
    }

    return (
      <>
        <div className="text-center my-8">
          <div className="inline-flex items-center bg-white rounded-full border border-black/[0.08] shadow-xs text-xs font-medium py-1 px-3 text-foreground/80">
            <RiShining2Line
              className="me-1.5 text-muted-foreground/70 -ms-1"
              size={14}
              aria-hidden="true"
            />
            Today
          </div>
        </div>
        {messages.map((message, index) => (
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
            {message.images && message.images.length > 0 && (
              <div className="mt-2">
                {message.images.map((img, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={img}
                    alt={`Uploaded ${imgIndex + 1}`}
                    className="max-h-60 rounded-md mt-2 hover:opacity-90 transition-opacity cursor-pointer"
                  />
                ))}
              </div>
            )}
            {message.audio && (
              <div className="mt-2">
                <audio
                  controls
                  src={message.audio}
                  className="w-full rounded-md bg-background"
                />
              </div>
            )}
          </ChatMessage>
        ))}
        {isLoading && (
          <ChatMessage>
            <TextShimmer className="font-mono text-sm" duration={1}>
              Generating response...
            </TextShimmer>
          </ChatMessage>
        )}
      </>
    );
  };

  return (
    <div className="sticky top-0 w-full h-full flex flex-col shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
      {/* Header */}
      <div className="py-5 sticky bg-background top-0 z-10 px-4 md:px-6 lg:px-8 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-black/[0.06] before:via-black/10 before:to-black/[0.06]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">translations.aiAssistant</h1>
          </div>

          <div className="flex items-center justify-center">
            {messages.length > 0 ? (
              <Button
                variant="ghost"
                onClick={clearChat}
                className="text-muted-foreground h-10 w-10 p-0"
                title="Clear chat"
              >
                <Trash2 className="h-6 w-6" />
                <span className="sr-only">Clear</span>
              </Button>
            ) : (
              <div className="w-10 h-10"></div>
            )}
          </div>
        </div>
      </div>
      <ScrollArea>
        <div className="flex-grow overflow-y-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mt-6 space-y-6 pb-6">
            {renderChatMessages()}
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>
        </div>
      </ScrollArea>

      <div
        className="sticky bottom-0 left-0 right-0 z-10 bg-background shadow-sm flex-shrink-0 border-t mt-auto p-10
        md:px-6 lg:px-8 py-4 max-w-3xl mx-auto w-full"
      >
        <form
          onSubmit={handleSubmit}
          className="px-4 md:px-6 lg:px-8 py-3 max-w-3xl mx-auto w-full"
        >
          {(selectedImages.length > 0 || selectedAudio) && (
            <div className="mb-3 p-3 bg-muted/70 rounded-lg border border-muted">
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
                        className="absolute -top-2 -le h-6 w-6 rounded-full opacity-90 shadow-sm"
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
          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-l-md rounded-r-none border-r-0"
                title="Upload Image"
                disabled={isRecording}
              >
                <ImagePlus className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => audioInputRef.current?.click()}
                className="rounded-none border-x-0 "
                title="Upload Audio"
                disabled={isRecording}
              >
                <Music className="h-5 w-5" />
              </Button>
              <div>
                <AudioRecorder
                  onAudioCaptured={handleAudioCaptured}
                  onRecordingStateChange={setIsRecording}
                  sourceLang={sourceLang}
                />
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
            </div>

            <div className="flex-1 flex items-center gap-2 w-full">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 shadow-sm"
                disabled={isRecording}
                placeholder="Type your message..."
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
                disabled={
                  isLoading ||
                  isRecording ||
                  (!input.trim() && !selectedImages.length && !selectedAudio)
                }
                className="bg-primary hover:bg-primary/90 shadow-sm"
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
