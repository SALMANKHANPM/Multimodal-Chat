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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { validateText, processPrompt } from "@/lib/api";
import { Message } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AudioRecorder } from "@/components/AudioRecorder";
import { ChatHistory } from "@/components/ChatHistory";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ProcessOptions }  from "@/types/index";
import { useLanguage } from "@/contexts/language";

export default function ChatProvider() {
  const { translations } = useLanguage();
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
  const [sourceLang, setSourceLang] = useState<string>('tel');
  const [targetLang, setTargetLang] = useState<string>('eng');

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleLanguageSelect = (source: string, target: string) => {
    setSourceLang(source);
    setTargetLang(target);
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

      const result = await processPrompt(input, options);

      if (result.status === "success") {
        const aiResponse: Message = {
          role: "assistant",
          content: result.response,
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        const errorMessage: Message = {
          role: "error",
          content: (
            <>
              <AlertCircle className="w-6 h-6 inline-block mr-2 text-destructive" />
              {result.response || "An error occurred while processing your request."}
            </>
          ),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        role: "error",
        content: error instanceof Error ? error.message : "An unexpected error occurred.",
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

  return (
    <>
      <LanguageSelector onLanguageSelect={handleLanguageSelect} />
      <div className="flex h-screen">
        {showSidebar && (
          <ChatHistory
            messages={messages}
            currentChatIndex={0}
            onSelectChat={(index) => {
              // Handle chat selection
              console.log('Selected chat:', index);
            }}
          />
        )}
        
        <div className="flex-1 flex flex-col h-screen p-4 max-w-[1200px] mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(!showSidebar)}
                className="mr-2"
              >
                {showSidebar ? (
                  <PanelLeftClose className="h-5 w-5" />
                ) : (
                  <PanelLeftOpen className="h-5 w-5" />
                )}
              </Button>
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">{translations.aiAssistant}</h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full ring-1 ring-primary/20 hover:ring-primary/30 transition-shadow duration-200 shadow-sm hover:shadow">
                <span className="uppercase">{sourceLang}</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="uppercase">{targetLang}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowHelp(!showHelp)}
                className="relative"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={clearChat}
                className="relative"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {alert && (
            <Alert
              variant={alert.variant}
              className="mb-4 animate-in fade-in slide-in-from-top-2"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Alert>
          )}
          
          {showHelp && (
            <Card className="p-4 mb-4 bg-muted/50">
              <h2 className="font-semibold mb-2">{translations.availableFeatures}</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4" /> {translations.uploadImages}
                </li>
                <li className="flex items-center gap-2">
                  <Music className="h-4 w-4" /> {translations.uploadAudio}
                </li>
                <li className="flex items-center gap-2">
                  <Bot className="h-4 w-4" /> {translations.recordVoice}
                </li>
                <li className="flex items-center gap-2">
                  <SendHorizontal className="h-4 w-4" /> {translations.sendMessage}
                </li>
              </ul>
            </Card>
          )}

          <Card className="flex-1 flex flex-col bg-background border-muted mb-4 shadow-lg max-w-[1200px] w-full">
            <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollAreaRef}>
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
                    <Bot className="h-12 w-12 mb-4" />
                    <p className="text-lg font-medium">{translations.howCanIHelp}</p>
                    <p className="text-sm">{translations.sendMessage}</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-3 p-4 rounded-lg transition-colors",
                        message.role === "assistant"
                          ? "bg-muted"
                          : message.role === "error"
                          ? "bg-destructive/10"
                          : "bg-primary/5"
                      )}
                    >
                      <div className="w-6">
                        {message.role === "assistant" ? (
                          <Bot className="w-6 h-6 text-primary" />
                        ) : message.role === "error" ? (
                          <Bot className="w-6 h-6 text-destructive" />
                        ) : (
                          <User className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={cn(
                            "text-sm whitespace-pre-wrap",
                            message.role === "error"
                              ? "text-destructive"
                              : "text-foreground"
                          )}
                        >
                          {message.content}
                        </p>
                        {message.images && (
                          <div className="grid grid-cols-1 gap-2 mt-2">
                            {message.images.map((img, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={img}
                                alt={`Uploaded ${imgIndex + 1}`}
                                className="rounded-md max-h-60 object-cover hover:opacity-90 transition-opacity cursor-pointer"
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
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex gap-3 p-4 rounded-lg bg-muted animate-pulse">
                    <Bot className="w-6 h-6 text-primary" />
                    <div className="flex-1">
                      <div className="h-4 bg-primary/10 rounded w-3/4"></div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 border-t max-w-3xl mx-auto w-full">
              {(selectedImages.length > 0 || selectedAudio) && (
                <div className="mb-4 p-2 bg-muted rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {selectedImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => setSelectedImages([])}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    {selectedAudio && (
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2 p-2 bg-background rounded-md">
                          <audio controls src={selectedAudio} className="flex-1" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6 rounded-full flex-shrink-0"
                            onClick={() => {
                              setSelectedAudio(null);
                              setSelectedAudioBlob(null);
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-l-md rounded-r-none"
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
                    className="rounded-none border-l-0"
                    title="Upload Audio"
                    disabled={isRecording}
                  >
                    <Music className="h-5 w-5" />
                  </Button>
                  <div className="border-l-0">
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

                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={translations.typeMessage}
                  className="flex-1"
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
                  disabled={isLoading || isRecording || (!input.trim() && !selectedImages.length && !selectedAudio)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <SendHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}