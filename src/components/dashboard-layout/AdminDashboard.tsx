"use client";

import { Sidebar } from "lucide-react";
import ChartsSection from "../dashboard/ChartSections";

import TablesSection from "../dashboard/TableSections";
import Header from "../header/header.component";
import OverviewCards from "../dashboard/OverviewCards";
import QuickActions from "../dashboard/QuickActions";

export default function AdminDashboard() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background font-sans ">
        <div className="flex">
          <div className="pt-15" />
          <Sidebar />
          <main className="flex-1 ml-[220px] p-6 space-y-8">
            <OverviewCards />
            <QuickActions />
            <TablesSection />
            <ChartsSection />
          </main>
        </div>
      </div>
    </>
  );
}
