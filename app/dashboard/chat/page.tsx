"use client";

import { useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { ChatMessage } from "./chat-messages";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Message } from "@/lib/types";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (message: string, files?: File[]) => {
    try {
      setIsLoading(true);
      
      const newMessage: Message = {
        role: "user",
        content: message,
      };

      setMessages((prev) => [...prev, newMessage]);

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          role: "assistant", 
          content: "This is a simulated AI response. The actual integration with your AI backend will go here."
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
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
                {message.content}
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
        <div className="mx-auto max-w-3xl">
          <PromptInputBox 
            onSend={handleSendMessage}
            isLoading={isLoading}
            placeholder="Message Conversational AI..."
          />
        </div>
      </div>
    </div>
  );
}