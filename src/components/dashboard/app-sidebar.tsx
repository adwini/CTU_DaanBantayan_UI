"use client";

import * as React from "react";
import {
  IconChartBar,
  IconFileDescription,
  IconCalendar,
  IconListDetails,
  IconReport,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export type NavigationItem =
  | "dashboard"
  | "manage-users-reusable"
  | "manage-sections"
  | "manage-subjects"
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
                className="data-[slot=sidebar-menu-button]:!p-2 cursor-pointer flex items-center gap-3">
                <img
                  src="/logo1.jpg"
                  alt="Academia de San Martin logo"
                  className="h-8 w-auto"
                />

                <span className="text-base font-semibold">SAAS Dashboard</span>
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
                  onClick={() => handleNavigation("manage-users-reusable")}
                  className={
                    activeItem === "manage-users-reusable"
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
                  onClick={() => handleNavigation("manage-subjects")}
                  className={
                    activeItem === "manage-subjects"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "cursor-pointer"
                  }>
                  <IconFileDescription />
                  <span>Manage Subjects</span>
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
