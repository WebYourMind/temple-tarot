"use client";

import { ChatBubbleIcon, EyeOpenIcon, PersonIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { SidebarItem } from "./sidebar-item";
import { IconUsers } from "components/ui/icons";
import { useSession } from "next-auth/react";

const menuItems = [
  {
    name: "Chat with IBIS",
    path: "/",
    icon: <ChatBubbleIcon />,
  },
  {
    name: "My Profile",
    path: "/profile",
    icon: <PersonIcon />,
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

const teamItem = {
  name: "Teams",
  path: "/team",
  icon: <IconUsers />,
};

export function SidebarList() {
  const { data: session } = useSession() as any;
  return (
    <div className="flex-1 overflow-auto">
      {menuItems?.length ? (
        <div className="space-y-2 px-2">
          {menuItems.map((item) => item && <SidebarItem key={item?.path} menuItem={item} />)}
          {session?.user?.role === "admin" && <SidebarItem menuItem={teamItem} />}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No Menu</p>
        </div>
      )}
    </div>
  );
}
