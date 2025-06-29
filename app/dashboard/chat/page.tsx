"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Trash2,
  AlertTriangle,
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
import {
  RiShining2Line,
} from "@remixicon/react";
import { ChatMessage } from "./chat-messages";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { AI_Prompt, UploadedFile } from "@/components/ui/ai-prompt";

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [alert, setAlert] = useState<{
    title: string;
    description: string;
    variant?: "default" | "destructive";
  } | null>(null);
  const [sourceLang, setSourceLang] = useState<string>("tel");
  const [targetLang, setTargetLang] = useState<string>("eng");
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

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

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: "GET",
          signal: AbortSignal.timeout(5000),
        });
        setApiStatus(response.ok ? 'available' : 'unavailable');
      } catch (error) {
        setApiStatus('unavailable');
      }
    };

    checkApiStatus();
  }, []);

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

  const handleSendMessage = async (messageText: string, files?: UploadedFile[]) => {
    // Always show the user message immediately, regardless of API status
    const newMessage: Message = {
      role: "user",
      content: messageText,
      images: files?.filter(f => f.type === 'image' && f.preview).map(f => f.preview!) || undefined,
      audio: files?.find(f => f.type === 'audio')?.audioUrl || undefined,
    };
    setMessages((prev) => [...prev, newMessage]);

    // If API is unavailable, show a message but don't prevent the user message from appearing
    if (apiStatus === 'unavailable') {
      const errorMessage: Message = {
        role: "error",
        content: "API server is unavailable. Your message has been saved but cannot be processed right now. Please ensure the backend service is running and try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    try {
      setIsLoading(true);

      let options: ProcessOptions = {
        sourceLang,
        targetLang,
      };

      // Handle image files
      const imageFiles = files?.filter(f => f.type === 'image');
      if (imageFiles && imageFiles.length > 0) {
        const response = await fetch(imageFiles[0].preview!);
        const blob = await response.blob();
        const base64Image = await convertBlobToBase64(blob);
        options.image_data = base64Image;
      }

      // Handle audio files
      const audioFiles = files?.filter(f => f.type === 'audio');
      if (audioFiles && audioFiles.length > 0) {
        const base64Audio = await convertBlobToBase64(audioFiles[0].file);
        options.audio_data = base64Audio;
      }

      const result = (await processPrompt(messageText, options)) as ProcessResponse;

      if (result.status === "success") {
        if (audioFiles && audioFiles.length > 0) {
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
      const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred.";
      
      setAlert({
        title: "Connection Error",
        description: errorMsg,
        variant: "destructive",
      });

      const errorMessage: Message = {
        role: "error",
        content: errorMsg,
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Update API status if connection failed
      if (errorMsg.includes("Unable to connect") || errorMsg.includes("API server is not available")) {
        setApiStatus('unavailable');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

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
            media={[
              ...(message.images?.map(img => ({ type: 'image' as const, url: img })) || []),
              ...(message.audio ? [{ type: 'audio' as const, url: message.audio }] : [])
            ]}
          >
            {typeof message.content === "string" ? (
              <p>{message.content}</p>
            ) : (
              message.content
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
            {/* API Status Indicator */}
            <div className="flex items-center gap-1">
              {apiStatus === 'checking' && (
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" title="Checking API status..." />
              )}
              {apiStatus === 'available' && (
                <div className="w-2 h-2 bg-green-500 rounded-full" title="API server is available" />
              )}
              {apiStatus === 'unavailable' && (
                <div className="w-2 h-2 bg-red-500 rounded-full" title="API server is unavailable" />
              )}
            </div>
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

      {/* API Status Warning */}
      {apiStatus === 'unavailable' && (
        <div className="px-4 md:px-6 lg:px-8 py-2">
          <Alert variant="destructive" className="max-w-3xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Backend API Unavailable</AlertTitle>
            <AlertDescription>
              The backend API server is not running or accessible. You can still send messages, but they won't be processed until the server is available at{" "}
              {process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Alert */}
      {alert && (
        <div className="px-4 md:px-6 lg:px-8 py-2">
          <Alert variant={alert.variant} className="max-w-3xl mx-auto">
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.description}</AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAlert(null)}
              className="absolute top-2 right-2"
            >
              ×
            </Button>
          </Alert>
        </div>
      )}

      <ScrollArea>
        <div className="flex-grow overflow-y-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mt-6 space-y-6 pb-6">
            {renderChatMessages()}
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>
        </div>
      </ScrollArea>

      {/* AI Prompt Component */}
      <div className="sticky bottom-0 left-0 right-0 z-10 mt-auto">
        <div className="max-w-3xl mx-auto w-full px-2 py-2">
          <AI_Prompt 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder="Type your message or upload files..."
          />
        </div>
      </div>
    </div>
  );
}