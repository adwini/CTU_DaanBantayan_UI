"use client";

import { useState } from "react";
import { AppSidebar, NavigationItem } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHomeComponent } from "@/components/dashboard/pages/DashboardHomeComponent";
import { ManageUsersComponent } from "@/components/dashboard/pages/ManageUsersComponent";
import { ManageSectionsComponent } from "@/components/dashboard/pages/ManageSectionsComponent";
import { SubjectManagementComponent } from "@/components/dashboard/pages/SubjectManagementComponent";
import { TeacherLoadsComponent } from "@/components/dashboard/pages/TeacherLoadsComponent";
import { GradeMonitoringComponent } from "@/components/dashboard/pages/GradeMonitoringComponent";
import { AttendanceOverviewComponent } from "@/components/dashboard/pages/AttendanceOverviewComponent";
import { ReportsComponent } from "@/components/dashboard/pages/ReportsComponent";
import { SettingsComponent } from "@/components/dashboard/pages/SettingsComponent";

import data from "./data.json";

export default function Page() {
  const [activeView, setActiveView] = useState<NavigationItem>("dashboard");

  const handleNavigation = (item: NavigationItem) => {
    setActiveView(item);
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardHomeComponent data={data} />;
      case "manage-users":
        return <ManageUsersComponent />;
      case "manage-sections":
        return <ManageSectionsComponent />;
      case "subject-management":
        return <SubjectManagementComponent />;
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
        return <DashboardHomeComponent data={data} />;
    }
  };

  return (
    <>
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
        />
        <SidebarInset>
          <SiteHeader activeItem={activeView} />
          <div className="flex flex-1 flex-col">{renderContent()}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
