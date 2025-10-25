import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Users,
  Calendar,
  BookOpen,
  DollarSign,
  UserCheck,
  Bell,
  Settings,
  BarChart3,
  GraduationCap,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
    roles: ["admin", "teacher", "student", "hr", "accountant"],
  },
  // ... your other navigation items
];

function NavItem({ item, level = 0 }: { item: NavItem; level?: number }) {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  if (!user || !item.roles.includes(user.roles[0] as UserRole)) {
    return null;
  }

  const isActive = location.pathname === item.url;
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-between",
            isActive && "bg-brand-primary text-white"
          )}
        >
          <div className="flex items-center">
            <item.icon className="mr-3 h-4 w-4" />
            {!isCollapsed && <span>{item.title}</span>}
          </div>
          {!isCollapsed && (
            isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </SidebarMenuButton>
        {isOpen && !isCollapsed && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children!.map(child => (
              <NavItem key={child.url} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink
          to={item.url}
          className={({ isActive }) =>
            cn(
              "flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors",
              isActive
                ? "bg-brand-primary text-white"
                : "text-foreground hover:bg-muted"
            )
          }
        >
          <item.icon className="mr-3 h-4 w-4" />
          {!isCollapsed && <span>{item.title}</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const { user } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  if (!user) return null;

  return (
    <Sidebar className={cn(isCollapsed ? "w-16" : "w-64")} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold">EduManage</h2>
                <p className="text-xs text-muted-foreground">School Management</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <NavItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && (
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {`${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.roles.length > 0 ? user.roles[0] : "User"}
                </p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
