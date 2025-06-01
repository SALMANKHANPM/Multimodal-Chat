"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  SendHorizontal,
  ImagePlus,
  Bot,
  Music,
  Trash2,
  Sparkles,
  X,
  ChevronDown,
  Check,
  Paperclip,
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
import { AudioRecorder } from "@/components/AudioRecorder";
import { ChatMessage } from "./chat-messages";
import { TextShimmer } from "@/components/ui/text-shimmer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AI_MODELS = [
  "GPT-4-1 Mini",
  "GPT-4-1",
  "Claude 3.5 Sonnet",
  "Gemini 2.5 Flash",
];

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
  const [selectedModel, setSelectedModel] = useState("GPT-4-1 Mini");

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

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
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
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
      <div className="flex items-center justify-between border-b px-6 py-4">
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

      <ScrollArea className="flex-1 px-6 py-6">
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

      <div className="border-t bg-background px-6 py-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          {(selectedImages.length > 0 || selectedAudio) && (
            <div className="mb-4 rounded-lg border bg-background/50 p-4">
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

          <div className="relative rounded-xl border bg-background shadow-sm">
            {/* <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Message Conversational AI..."
              className="min-h-[60px] w-full resize-none border-0 bg-transparent px-6 py-4 pr-24 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-sm"
              disabled={isRecording}
            /> */}
            
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-1">

                <div className="flex">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-muted/50"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isRecording}
                  >
                    <ImagePlus className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-muted/50"
                    onClick={() => audioInputRef.current?.click()}
                    disabled={isRecording}
                  >
                    <Music className="h-4 w-4" />
                  </Button>
                  <AudioRecorder
                    onAudioCaptured={handleAudioCaptured}
                    onRecordingStateChange={setIsRecording}
                    sourceLang={sourceLang}
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="icon"
                className="h-8 w-8"
                disabled={
                  isLoading ||
                  isRecording ||
                  (!input.trim() && !selectedImages.length && !selectedAudio)
                }
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
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
        </form>
      </div>
    </div>
  );
}