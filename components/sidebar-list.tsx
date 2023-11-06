import { SidebarItem } from "./sidebar-item";

const menuItems = [
  {
    name: "My profile",
    path: "/profile",
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
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  );
}
