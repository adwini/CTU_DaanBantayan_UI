// Usage examples for the dynamic Maintenance component
import {
  Maintenance,
  GradeMonitoringMaintenance,
  ReportsMaintenance,
  AttendanceMaintenance,
  SettingsMaintenance,
} from "@/components/MaintainancePage";

// Example 1: Basic usage with default props
export function BasicMaintenanceExample() {
  return <Maintenance />;
}

// Example 2: Custom maintenance page for a specific feature
export function CustomMaintenanceExample() {
  return (
    <Maintenance
      title="User Management System"
      subtitle="Advanced User Administration"
      description="We're developing a comprehensive user management system with role-based access control, advanced permissions, and user analytics."
      colorScheme="purple"
      features={[
        "Role-based access control",
        "Advanced user permissions",
        "User activity analytics",
        "Bulk user operations",
        "Audit trail logging",
      ]}
    />
  );
}

// Example 3: Maintenance with custom content
export function MaintenanceWithCustomContent() {
  return (
    <Maintenance
      title="API Integration"
      subtitle="Third-party Service Integration"
      description="We're working on integrating with external APIs to provide enhanced functionality."
      colorScheme="blue"
      showFeatures={false}
      customContent={
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">
            Integration Partners:
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Google Classroom API</li>
            <li>• Microsoft Teams Integration</li>
            <li>• Zoom Meeting Integration</li>
            <li>• Canvas LMS API</li>
          </ul>
        </div>
      }
    />
  );
}

// Example 4: Using pre-configured variants
export function PreConfiguredExamples() {
  return (
    <div className="space-y-8">
      <GradeMonitoringMaintenance />
      <ReportsMaintenance />
      <AttendanceMaintenance />
      <SettingsMaintenance />
    </div>
  );
}
