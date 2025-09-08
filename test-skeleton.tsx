/**
 * Test file to verify skeleton components are working
 * This file is for testing purposes only
 */

import React from "react";
import {
  ManageUsersPageSkeleton,
  ManageSectionsPageSkeleton,
  ManageSubjectsPageSkeleton,
  TeacherLoadsPageSkeleton,
  GradeMonitoringPageSkeleton,
  AttendanceOverviewPageSkeleton,
  ReportsPageSkeleton,
  SettingsPageSkeleton,
} from "./src/components/utils";

export default function SkeletonTest() {
  return (
    <div className="p-4 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">ManageUsersPageSkeleton</h2>
        <ManageUsersPageSkeleton />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">ManageSectionsPageSkeleton</h2>
        <ManageSectionsPageSkeleton />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">ManageSubjectsPageSkeleton</h2>
        <ManageSubjectsPageSkeleton />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">TeacherLoadsPageSkeleton</h2>
        <TeacherLoadsPageSkeleton />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">GradeMonitoringPageSkeleton</h2>
        <GradeMonitoringPageSkeleton />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">
          AttendanceOverviewPageSkeleton
        </h2>
        <AttendanceOverviewPageSkeleton />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">ReportsPageSkeleton</h2>
        <ReportsPageSkeleton />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">SettingsPageSkeleton</h2>
        <SettingsPageSkeleton />
      </div>
    </div>
  );
}
