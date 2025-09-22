"use client";

import { Suspense } from "react";
import TeacherDashboard from "@/components/dashboard/pages/TeacherDashboard";
import { withRole } from "@/contexts/auth.context";
import { Role } from "@/types/auth";

// Simple loading component for Suspense fallback
function LoadingDashboard() {
  return <div>Loading dashboard...</div>;
}

const ProtectedTeacherDashboard = withRole(
  function Dashboard() {
    return (
      <div className="w-full">
        <Suspense fallback={<LoadingDashboard />}>
          <TeacherDashboard />
        </Suspense>
      </div>
    );
  },
  [Role.TEACHER]
);

export default ProtectedTeacherDashboard;
