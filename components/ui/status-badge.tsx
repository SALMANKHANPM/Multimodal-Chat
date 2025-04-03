import { IconCircleCheckFilled, IconExclamationCircleFilled, IconLoader, type Icon } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  fStatus?: "wip" | "down" | "new"
}

export default function StatusBadge({fStatus = "new"}: StatusBadgeProps) {
  const statusColors = {
    wip: "bg-blue-100 text-blue-700 border-blue-500",
    down: "bg-red-100 text-red-700 border-red-500",
    new: "bg-green-100 text-green-700 border-green-500"
  }

  return (
    <div className={cn("inline-flex items-center justify-center rounded-full w-5 h-5", statusColors[fStatus])} >
      {fStatus === "wip" && <IconLoader className="h-5 w-5" />}
      {fStatus === "down" && <IconExclamationCircleFilled className="h-5 w-5," />}
      {fStatus === "new" && <IconCircleCheckFilled className="h-5 w-5" />}
    </div>
  )
}
