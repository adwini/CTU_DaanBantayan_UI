import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "@/components/dashboard/nav-user";
import { NavigationItem } from "./app-sidebar";

// Map navigation items to display titles
const getPageTitle = (activeItem: NavigationItem): string => {
  const titleMap: Record<NavigationItem, string> = {
    dashboard: "Dashboard",
    "manage-users-reusable": "Manage Users",
    "manage-sections": "Manage Sections",
    "manage-subjects": "Manage Subjects",
    "teacher-loads": "Teacher Loads",
    "grade-monitoring": "Grade Monitoring",
    "attendance-overview": "Attendance Overview",
    reports: "Reports",
    settings: "Settings",
  };

  return titleMap[activeItem] || "Dashboard";
};

interface SiteHeaderProps {
  activeItem?: NavigationItem;
}

export function SiteHeader({ activeItem = "dashboard" }: SiteHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getPageTitle(activeItem)}</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex">
            <NavUser
              asHeader
              user={{
                name: "shadcn",
                email: "m@example.com",
                avatar: "/avatars/shadcn.jpg",
              }}
            />
          </div>
          {/* Mobile user (visible on small screens) */}
          <div className="sm:hidden">
            <NavUser
              asHeader
              user={{
                name: "shadcn",
                email: "m@example.com",
                avatar: "/avatars/shadcn.jpg",
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
