import { ChatBubbleIcon, EyeOpenIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { SidebarItem } from "./sidebar-item";

const menuItems = [
  {
    name: "Chat with Merlin",
    path: "/",
    icon: <ChatBubbleIcon />,
  },
  {
    name: "My Thinking Style Report",
    path: "/report",
    icon: <EyeOpenIcon />,
  },
  {
    name: "Retake Thinking Style Quiz",
    path: "/quiz",
    icon: <QuestionMarkCircledIcon />,
  },
];

export async function SidebarList() {
  return (
    <div className="flex-1 overflow-auto">
      {menuItems?.length ? (
        <div className="space-y-2 px-2">
          {menuItems.map((item) => item && <SidebarItem key={item?.path} menuItem={item} />)}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No Menu</p>
        </div>
      )}
    </div>
  );
}
