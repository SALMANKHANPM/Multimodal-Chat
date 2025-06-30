import { SiteHeader } from "@/components/sidebar/site-header";
import { MicVocal } from "lucide-react";

export default function Speaking() {
  return (
    <div className="sticky top-0 w-full h-full flex flex-col shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
      {/* Header */}
      <div className="py-5 sticky bg-background top-0 z-10 px-4 md:px-6 lg:px-8 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-black/[0.06] before:via-black/10 before:to-black/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SiteHeader />
            <MicVocal className="h-6 w-6 text-primary" />
            {/* <h1 className="text-xl font-semibold">translations.aiAssistant</h1> */}
            <h1 className="text-xl font-semibold">Practice Speaking</h1>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto px-4">
        <div className="flex items-center justify-center h-full">
          <h1 className="text-2xl font-semibold">Work in Progress</h1>
        </div>
      </div>
    </div>
  );
}
