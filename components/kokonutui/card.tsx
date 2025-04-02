import { cn } from "@/lib/utils";
import Image from "next/image";


interface CardProps {
    name?: string;
    role?: string;
    avatar?: string;
}

export default function Card({
    name,
    role,
    avatar,
}: CardProps) {

    return (
        <div className="block w-full max-w-[280px] group">
            <div
                className={cn(
                    "relative overflow-hidden rounded-2xl",
                    "bg-white/80 dark:bg-zinc-900/80",
                    "backdrop-blur-xl",
                    "border border-zinc-200/50 dark:border-zinc-800/50",
                    "shadow-xs",
                    "transition-all duration-300",
                    "hover:shadow-md",
                    "hover:border-zinc-300/50 dark:hover:border-zinc-700/50"
                )}
            >
                <div className="relative h-[320px] overflow-hidden">
                    <Image
                        src={avatar || '/placeholder-avatar.png'}
                        alt={name || 'Profile image'}
                        fill
                        className="object-cover"
                    />
                </div>

                <div
                    className={cn(
                        "absolute inset-0",
                        "bg-linear-to-t from-black/90 via-black/40 to-transparent"
                    )}
                />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center justify-between gap-3">
                        <div className="space-y-1.5">
                            <h3 className="text-lg font-semibold text-white dark:text-zinc-100 leading-snug">
                                {name}
                            </h3>
                            <p className="text-sm text-zinc-200 dark:text-zinc-300 line-clamp-2">
                                {role}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
