"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "@/lib/types";
import {
  Search,
  MessageSquare,
  Bot,
  User,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHistoryProps {
  messages: Message[];
  onSelectChat?: (index: number) => void;
  currentChatIndex?: number;
}

export function ChatHistory({
  messages,
  onSelectChat,
  currentChatIndex,
}: ChatHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const chats = messages.reduce(
    (
      acc: { title: string; preview: string; timestamp: string }[],
      message,
      index
    ) => {
      if (message.role === "user" && (!acc.length || index > 0)) {
        const content =
          typeof message.content === "string"
            ? message.content
            : "Media message";
        const title = content.slice(0, 30) + (content.length > 30 ? "..." : "");
        const preview = messages[index + 1]?.content || "";
        const previewText =
          typeof preview === "string" ? preview : "AI Response";

        acc.push({
          title,
          preview:
            previewText.slice(0, 40) + (previewText.length > 40 ? "..." : ""),
          timestamp: new Date().toLocaleTimeString(),
        });
      }
      return acc;
    },
    []
  );

  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 border-r bg-muted/10">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="h-5 w-5" />
          <h2 className="font-semibold">translations.chatHistory</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="translations.searchConversations"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-2">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat, index) => (
              <button
                key={index}
                onClick={() => onSelectChat?.(index)}
                className={cn(
                  "w-full text-left p-3 rounded-lg mb-2 hover:bg-muted/50 transition-colors",
                  currentChatIndex === index && "bg-muted"
                )}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{chat.title}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{chat.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {chat.preview}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mb-2" />
              <p className="text-sm">translations.noConversationsFound</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
