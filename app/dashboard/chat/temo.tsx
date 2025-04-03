// "use client";

// import { useState, useRef, useEffect } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import {
//   SendHorizontal,
//   ImagePlus,
//   Bot,
//   User,
//   AlertCircle,
//   Music,
//   Trash2,
//   HelpCircle,
//   Sparkles,
//   PanelLeftClose,
//   PanelLeftOpen,
//   ChevronRight,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { validateText, processPrompt } from "@/lib/api";
// import { LLMResponse, Message, ProcessOptions } from "@/lib/types";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AudioRecorder } from "@/components/AudioRecorder";
// import { ChatHistory } from "@/components/ChatHistory";

// interface TranscriptionResponse {
//   transcription: string;
//   translation: string;
// }

// interface ProcessResponse {
//   status: string;
//   response: string | TranscriptionResponse | LLMResponse;
// }

// export default function ChatProvider() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const audioInputRef = useRef<HTMLInputElement>(null);
//   const [selectedImages, setSelectedImages] = useState<string[]>([]);
//   const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
//   const [selectedAudioBlob, setSelectedAudioBlob] = useState<Blob | null>(null);
//   const [isPreparing, setIsPreparing] = useState(false);
//   const scrollAreaRef = useRef<HTMLDivElement>(null);
//   const [alert, setAlert] = useState<{
//     title: string;
//     description: string;
//     variant?: "default" | "destructive";
//   } | null>(null);
//   const [showHelp, setShowHelp] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(true);
//   const [isRecording, setIsRecording] = useState(false);
//   const [sourceLang, setSourceLang] = useState<string>("tel");
//   const [targetLang, setTargetLang] = useState<string>("eng");

//   useEffect(() => {
//     if (scrollAreaRef.current) {
//       scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
//     }
//   }, [messages]);

//   useEffect(() => {
//     if (alert) {
//       const timer = setTimeout(() => {
//         setAlert(null);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [alert]);

//   const convertBlobToBase64 = (blob: Blob): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64String = reader.result as string;
//         resolve(base64String.split(",")[1]);
//       };
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   };

//   const handleLanguageSelect = (source: string, target: string) => {
//     setSourceLang(source);
//     setTargetLang(target);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim() && selectedImages.length === 0 && !selectedAudio) return;

//     try {
//       setIsLoading(true);
//       const newMessage: Message = {
//         role: "user",
//         content: input,
//         images: selectedImages.length > 0 ? selectedImages : undefined,
//         audio: selectedAudio || undefined,
//       };
//       setMessages((prev) => [...prev, newMessage]);
//       setInput("");
//       setSelectedImages([]);

//       let options: ProcessOptions = {
//         sourceLang,
//         targetLang,
//       };

//       if (selectedImages.length > 0) {
//         const response = await fetch(selectedImages[0]);
//         const blob = await response.blob();
//         const base64Image = await convertBlobToBase64(blob);
//         options.image_data = base64Image;
//       }

//       if (selectedAudioBlob) {
//         const base64Audio = await convertBlobToBase64(selectedAudioBlob);
//         options.audio_data = base64Audio;
//       }

//       const result = (await processPrompt(input, options)) as ProcessResponse;

//       if (result.status === "success") {
//         if (selectedAudioBlob) {
//           // Add transcription message
//           const transcriptionResponse = result.response as
//             | ProcessResponse
//             | TranscriptionResponse
//             | any;
//           console.log("=============  Transcription Response  ==========");
//           console.log(transcriptionResponse);
//           const transcriptionMessage: Message = {
//             role: "assistant",
//             content: (
//               <div className="space-y-2">
//                 <div className="flex flex-col gap-1">
//                   <div className="flex items-center gap-2">
//                     <span className="font-medium text-primary">Telugu: </span>
//                     <span className="text-foreground">
//                       {transcriptionResponse.tel}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="font-medium text-primary">English: </span>
//                     <span className="text-foreground">
//                       {transcriptionResponse.eng}
//                     </span>
//                   </div>
//                   <div className="mt-2 text-foreground">
//                     {transcriptionResponse.generation}
//                   </div>
//                 </div>
//               </div>
//             ),
//           };
//           setMessages((prev) => [...prev, transcriptionMessage]);
//         } else {
//           const llmResponse = result.response as ProcessResponse | any;
//           const aiResponse: Message = {
//             role: "assistant",
//             content: (
//               <div className="space-y-2">
//                 <div className="flex flex-col gap-1">
//                   <div className="mt-2 text-foreground">
//                     {llmResponse.generation}
//                   </div>
//                 </div>
//               </div>
//             ),
//           };
//           setMessages((prev) => [...prev, aiResponse]);
//         }
//       } else {
//         const errorMessage: Message = {
//           role: "error",
//           content: (
//             <>
//               <AlertCircle className="w-6 h-6 inline-block mr-2 text-destructive" />
//               {result.response ||
//                 "An error occurred while processing your request."}
//             </>
//           ),
//         };
//         setMessages((prev) => [...prev, errorMessage]);
//       }
//     } catch (error) {
//       const errorMessage: Message = {
//         role: "error",
//         content:
//           error instanceof Error
//             ? error.message
//             : "An unexpected error occurred.",
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//       setSelectedAudio(null);
//       setSelectedAudioBlob(null);
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     if (files.length > 1) {
//       setAlert({
//         title: "Warning",
//         description: "Only the first image will be processed by the AI.",
//         variant: "default",
//       });
//     }

//     const newImages = Array.from(files)
//       .slice(0, 1)
//       .map((file) => URL.createObjectURL(file));
//     setSelectedImages(newImages);
//   };

//   const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     const audioFile = files[0];
//     const audioUrl = URL.createObjectURL(audioFile);
//     setSelectedAudio(audioUrl);
//     setSelectedAudioBlob(audioFile);
//   };

//   const clearChat = () => {
//     setMessages([]);
//     setInput("");
//     setSelectedImages([]);
//     setSelectedAudio(null);
//     setSelectedAudioBlob(null);
//   };

//   const handleAudioCaptured = (audioBlob: Blob) => {
//     const audioUrl = URL.createObjectURL(audioBlob);
//     setSelectedAudio(audioUrl);
//     setSelectedAudioBlob(audioBlob);
//   };

//   return (
//     <>
//       <div className="flex h-screen bg-gradient-to-b from-background to-background/90">
//         <div className="flex-1 flex flex-col h-screen p-2 md:p-4 overflow-hidden">
//           <div className="flex items-center justify-between mb-4 px-2">
//             <div className="flex items-center gap-2 overflow-hidden">
//               <Sparkles className="h-6 w-6 text-primary flex-shrink-0" />
//               <h1 className="text-lg md:text-xl font-semibold truncate">
//                 translations.aiAssistant
//               </h1>
//               <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full ring-1 ring-primary/20 hover:ring-primary/30 transition-shadow duration-200 shadow-sm hover:shadow flex-shrink-0">
//                 <span className="uppercase">{sourceLang}</span>
//                 <ChevronRight className="h-3.5 w-3.5" />
//                 <span className="uppercase">{targetLang}</span>
//               </div>
//             </div>
//             <div className="flex gap-2 flex-shrink-0">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => setShowHelp(!showHelp)}
//                 className="relative"
//               >
//                 <HelpCircle className="h-5 w-5" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={clearChat}
//                 className="relative"
//               >
//                 <Trash2 className="h-5 w-5" />
//               </Button>
//             </div>
//           </div>

//           {alert && (
//             <Alert
//               variant={alert.variant}
//               className="mb-4 animate-in fade-in slide-in-from-top-2 mx-auto max-w-3xl"
//             >
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>{alert.title}</AlertTitle>
//               <AlertDescription>{alert.description}</AlertDescription>
//             </Alert>
//           )}

//           {showHelp && (
//             <Card className="p-4 mb-4 bg-muted/50 mx-auto max-w-3xl">
//               <h2 className="font-semibold mb-2">
//                 translations.availableFeatures
//               </h2>
//               <ul className="grid grid-cols-2 gap-2 text-sm">
//                 <li className="flex items-center gap-2">
//                   <div className="bg-primary/10 p-1.5 rounded-full">
//                     <ImagePlus className="h-4 w-4 text-primary" />
//                   </div>
//                   translations.uploadImages
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <div className="bg-primary/10 p-1.5 rounded-full">
//                     <Music className="h-4 w-4 text-primary" />
//                   </div>
//                   translations.uploadAudio
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <div className="bg-primary/10 p-1.5 rounded-full">
//                     <Bot className="h-4 w-4 text-primary" />
//                   </div>
//                   translations.recordVoice
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <div className="bg-primary/10 p-1.5 rounded-full">
//                     <SendHorizontal className="h-4 w-4 text-primary" />
//                   </div>
//                   translations.sendMessage
//                 </li>
//               </ul>
//             </Card>
//           )}

//           <Card className="flex-1 flex flex-col bg-background border-muted mb-4 shadow-md overflow-hidden h-[calc(100vh-9rem)]">
//             <ScrollArea className="flex-1 p-3 md:p-5" ref={scrollAreaRef}>
//               <div className="space-y-6 max-w-3xl mx-auto">
//                 {messages.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
//                     <div className="bg-primary/5 p-6 rounded-full mb-4">
//                       <Bot className="h-12 w-12 text-primary/60" />
//                     </div>
//                     <p className="text-lg font-medium mb-2">
//                       translations.howCanIHelp
//                     </p>
//                     <p className="text-sm text-center max-w-md">
//                       translations.sendMessage
//                     </p>
//                   </div>
//                 ) : (
//                   messages.map((message, index) => (
//                     <div
//                       key={index}
//                       className={cn(
//                         "flex gap-3 p-4 rounded-xl transition-colors w-full overflow-hidden break-words",
//                         message.role === "assistant"
//                           ? "bg-muted shadow-sm"
//                           : message.role === "error"
//                           ? "bg-destructive/10 border border-destructive/20"
//                           : "bg-primary/5 shadow-sm"
//                       )}
//                     >
//                       <div className="flex-shrink-0 w-8 h-8">
//                         {message.role === "assistant" ? (
//                           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                             <Bot className="w-5 h-5 text-primary" />
//                           </div>
//                         ) : message.role === "error" ? (
//                           <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
//                             <AlertCircle className="w-5 h-5 text-destructive" />
//                           </div>
//                         ) : (
//                           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                             <User className="w-5 h-5 text-primary" />
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex-1 min-w-0 space-y-2">
//                         <div
//                           className={cn(
//                             "text-sm whitespace-pre-wrap break-words overflow-hidden max-w-full",
//                             message.role === "error"
//                               ? "text-destructive"
//                               : "text-foreground"
//                           )}
//                         >
//                           {message.content}
//                         </div>
//                         {message.images && (
//                           <div className="grid grid-cols-1 gap-2 mt-2">
//                             {message.images.map((img, imgIndex) => (
//                               <div
//                                 key={imgIndex}
//                                 className="rounded-md overflow-hidden border border-border/50 shadow-sm"
//                               >
//                                 <img
//                                   src={img}
//                                   alt={`Uploaded ${imgIndex + 1}`}
//                                   className="w-full max-h-60 object-cover hover:opacity-90 transition-opacity cursor-pointer"
//                                   onClick={() => window.open(img, "_blank")}
//                                 />
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                         {message.audio && (
//                           <div className="mt-2 border border-border/50 rounded-md overflow-hidden shadow-sm">
//                             <audio
//                               controls
//                               src={message.audio}
//                               className="w-full rounded-md bg-background"
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))
//                 )}
//                 {isLoading && (
//                   <div className="flex gap-3 p-4 rounded-xl bg-muted animate-pulse">
//                     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                       <Bot className="w-5 h-5 text-primary/70" />
//                     </div>
//                     <div className="flex-1 space-y-2">
//                       <div className="h-4 bg-primary/10 rounded w-3/4"></div>
//                       <div className="h-4 bg-primary/10 rounded w-1/2"></div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </ScrollArea>

//             <form
//               onSubmit={handleSubmit}
//               className="p-3 md:p-4 border-t border-border/50 max-w-3xl mx-auto w-full"
//             >
//               {(selectedImages.length > 0 || selectedAudio) && (
//                 <div className="mb-4 p-3 bg-muted/60 rounded-lg border border-border/30">
//                   <div className="flex flex-wrap gap-2">
//                     {selectedImages.map((img, index) => (
//                       <div key={index} className="relative">
//                         <img
//                           src={img}
//                           alt={`Preview ${index + 1}`}
//                           className="h-20 w-20 object-cover rounded-md border border-border/50 shadow-sm"
//                         />
//                         <Button
//                           type="button"
//                           variant="destructive"
//                           size="icon"
//                           className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md"
//                           onClick={() => setSelectedImages([])}
//                         >
//                           ×
//                         </Button>
//                       </div>
//                     ))}
//                     {selectedAudio && (
//                       <div className="flex-1 min-w-[200px]">
//                         <div className="flex items-center gap-2 p-2 bg-background rounded-md border border-border/50 shadow-sm">
//                           <audio
//                             controls
//                             src={selectedAudio}
//                             className="flex-1"
//                           />
//                           <Button
//                             type="button"
//                             variant="destructive"
//                             size="icon"
//                             className="h-6 w-6 rounded-full flex-shrink-0 shadow-sm"
//                             onClick={() => {
//                               setSelectedAudio(null);
//                               setSelectedAudioBlob(null);
//                             }}
//                           >
//                             ×
//                           </Button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="flex gap-2">
//                 <div className="flex items-center gap-1">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="icon"
//                     onClick={() => fileInputRef.current?.click()}
//                     className="rounded-l-md rounded-r-none border-r-0"
//                     title="Upload Image"
//                     disabled={isRecording}
//                   >
//                     <ImagePlus className="h-5 w-5" />
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="icon"
//                     onClick={() => audioInputRef.current?.click()}
//                     className="rounded-none border-x-0"
//                     title="Upload Audio"
//                     disabled={isRecording}
//                   >
//                     <Music className="h-5 w-5" />
//                   </Button>
//                   <div className="border-l-0">
//                     <AudioRecorder
//                       onAudioCaptured={handleAudioCaptured}
//                       onRecordingStateChange={setIsRecording}
//                       sourceLang={sourceLang}
//                     />
//                   </div>
//                 </div>

//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleImageUpload}
//                   accept="image/*"
//                   className="hidden"
//                 />
//                 <input
//                   type="file"
//                   ref={audioInputRef}
//                   onChange={handleAudioUpload}
//                   accept="audio/*"
//                   className="hidden"
//                 />

//                 <Input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   placeholder="translations.typeMessage"
//                   className="flex-1 shadow-sm focus-visible:ring-primary"
//                   disabled={isRecording}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" && !e.shiftKey) {
//                       e.preventDefault();
//                       handleSubmit(e);
//                     }
//                   }}
//                 />

//                 <Button
//                   type="submit"
//                   size="icon"
//                   disabled={
//                     isLoading ||
//                     isRecording ||
//                     (!input.trim() && !selectedImages.length && !selectedAudio)
//                   }
//                   className="bg-primary hover:bg-primary/90 shadow-sm"
//                 >
//                   <SendHorizontal className="h-5 w-5" />
//                 </Button>
//               </div>
//             </form>
//           </Card>
//         </div>
//       </div>
//     </>
//   );
// }
