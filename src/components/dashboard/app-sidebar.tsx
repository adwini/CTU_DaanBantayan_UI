"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconCalendar,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavUser } from "@/components/dashboard/nav-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

export type NavigationItem =
  | "dashboard"
  | "manage-users"
  | "manage-sections"
  | "subject-management"
  | "teacher-loads"
  | "grade-monitoring"
  | "attendance-overview"
  | "reports"
  | "settings";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onNavigate?: (item: NavigationItem) => void;
  activeItem?: NavigationItem;
}

export function AppSidebar({
  onNavigate,
  activeItem,
  ...props
}: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();

  const handleNavigation = (item: NavigationItem) => {
    onNavigate?.(item);
    // Close sidebar on mobile after navigation
    setOpenMobile(false);
  };
  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleNavigation("dashboard")}
                className="data-[slot=sidebar-menu-button]:!p-1.5 cursor-pointer">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">CTU Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {/* Management Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("manage-users")}
                  className={
                    activeItem === "manage-users"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "cursor-pointer"
                  }>
                  <IconUsers />
                  <span>Manage Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("manage-sections")}
                  className={
                    activeItem === "manage-sections"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "cursor-pointer"
                  }>
                  <IconListDetails />
                  <span>Manage Sections</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("subject-management")}
                  className={
                    activeItem === "subject-management"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "cursor-pointer"
                  }>
                  <IconFileDescription />
                  <span>Subject Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* Monitoring Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("teacher-loads")}
                  className={
                    activeItem === "teacher-loads"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "cursor-pointer"
                  }>
                  <IconChartBar />
                  <span>Teacher Loads</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("grade-monitoring")}
                  className={
                    activeItem === "grade-monitoring"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "cursor-pointer"
                  }>
                  <IconReport />
                  <span>Grade Monitoring</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("attendance-overview")}
                  className={
                    activeItem === "attendance-overview"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "cursor-pointer"
                  }>
                  <IconCalendar />
                  <span>Attendance Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* Reports and Settings */}
          <SidebarGroup>
            <SidebarGroupLabel>Reports and Settings</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("reports")}
                  className={
                    activeItem === "reports"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "cursor-pointer"
                  }>
                  <IconReport />
                  <span>Reports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("settings")}
                  className={
                    activeItem === "settings"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "cursor-pointer"
                  }>
                  <IconSettings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
