"use client";

import { useState } from "react";
import { AppSidebar, NavigationItem } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHomeComponent } from "@/components/dashboard/pages/DashboardHomeComponent";
import { ManageSectionsComponent } from "@/components/dashboard/pages/ManageSectionsComponent";
import { ManageSubjectsComponent } from "@/components/dashboard/pages/ManageSubjectsComponent";
import { TeacherLoadsComponent } from "@/components/dashboard/pages/TeacherLoadsComponent";
import { GradeMonitoringComponent } from "@/components/dashboard/pages/GradeMonitoringComponent";
import { AttendanceOverviewComponent } from "@/components/dashboard/pages/AttendanceOverviewComponent";
import { ReportsComponent } from "@/components/dashboard/pages/ReportsComponent";
import { SettingsComponent } from "@/components/dashboard/pages/SettingsComponent";
import { useAuth } from "@/contexts/auth.context";

export default function TeacherDashboard() {
  const [activeView, setActiveView] = useState<NavigationItem>("dashboard");
  const { user } = useAuth();

  const handleNavigation = (item: NavigationItem) => {
    setActiveView(item);
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardHomeComponent />;
      case "manage-sections":
        return <ManageSectionsComponent />;
      case "manage-subjects":
        return <ManageSubjectsComponent />;
      case "teacher-loads":
        return <TeacherLoadsComponent />;
      case "grade-monitoring":
        return <GradeMonitoringComponent />;
      case "attendance-overview":
        return <AttendanceOverviewComponent />;
      case "reports":
        return <ReportsComponent />;
      case "settings":
        return <SettingsComponent />;
      default:
        return <DashboardHomeComponent />;
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }>
      <AppSidebar
        variant="inset"
        onNavigate={handleNavigation}
        activeItem={activeView}
        role={user?.role}
      />
      <SidebarInset>
        <SiteHeader activeItem={activeView} />
        <div className="flex flex-1 flex-col">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
