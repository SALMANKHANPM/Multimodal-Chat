import { useSidebar } from "./ui/sidebar";
import { useNavigation } from "@/hooks/use-navigation";
import { DropdownMenu } from "./ui/dropdown-menu";
import { SidebarMenuButton } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Profile({
  user,
  items,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  items?: any[];
}) {
  const { isMobile } = useSidebar();
  const navigate = useNavigation();

  return (
    <DropdownMenu>
      <SidebarMenuButton
        onClick={() => navigate.toProfile()}
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar className="h-8 w-8 rounded-lg grayscale">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="rounded-lg">SK</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{user.name}</span>
          <span className="text-muted-foreground truncate text-xs">
            {user.email}
          </span>
        </div>
      </SidebarMenuButton>
    </DropdownMenu>
  );
}
