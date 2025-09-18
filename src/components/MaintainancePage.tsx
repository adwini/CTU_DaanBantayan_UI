import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Clock, Wrench, LucideIcon } from "lucide-react";

/**
 * Dynamic Maintenance Component
 *
 * A reusable maintenance page component that can be customized for different modules.
 *
 * @example
 * // Basic usage
 * <Maintenance />
 *
 * @example
 * // Custom maintenance page
 * <Maintenance
 *   title="Custom Module"
 *   subtitle="Module Description"
 *   description="Detailed description of what's being developed"
 *   colorScheme="blue"
 *   features={["Feature 1", "Feature 2", "Feature 3"]}
 * />
 *
 * @example
 * // Using pre-configured variants
 * <GradeMonitoringMaintenance />
 * <ReportsMaintenance />
 * <AttendanceMaintenance />
 */

interface MaintenanceProps {
  title?: string;
  subtitle?: string;
  description?: string;
  statusText?: string;
  features?: string[];
  icon?: LucideIcon;
  colorScheme?: "amber" | "blue" | "green" | "purple" | "red";
  showFeatures?: boolean;
  customContent?: React.ReactNode;
}

export default Maintenance;
export const GradeMonitoringMaintenance = () => (
  <Maintenance
    title="Grade Monitoring System"
    subtitle="Academic Performance Analytics"
    description="We're developing a comprehensive grade monitoring system that will help track student performance, generate detailed analytics, and provide valuable insights for academic progress."
    features={[
      "Real-time grade tracking and analytics",
      "Student performance reports",
      "Academic progress monitoring",
      "Grade distribution charts",
      "Performance trend analysis",
    ]}
  />
);

export const ReportsMaintenance = () => (
  <Maintenance
    title="Reports System"
    subtitle="Advanced Reporting & Analytics"
    description="Our enhanced reporting system will provide comprehensive analytics, custom report generation, and advanced data visualization capabilities."
    colorScheme="blue"
    features={[
      "Custom report generation",
      "Advanced data visualization",
      "Automated report scheduling",
      "Export capabilities",
      "Real-time analytics dashboard",
    ]}
  />
);

export const AttendanceMaintenance = () => (
  <Maintenance
    title="Attendance System"
    subtitle="Student Attendance Tracking"
    description="We're building a robust attendance tracking system with automated monitoring, detailed analytics, and comprehensive reporting features."
    colorScheme="blue"
    features={[
      "Automated attendance tracking",
      "Real-time attendance monitoring",
      "Detailed attendance reports",
      "Absence pattern analysis",
      "Parent notifications",
    ]}
  />
);

export const SettingsMaintenance = () => (
  <Maintenance
    title="System Settings"
    subtitle="Configuration & Administration"
    description="We're building a comprehensive settings system that will allow administrators to configure system preferences, manage user permissions, and customize the platform."
    colorScheme="blue"
    features={[
      "System-wide configuration",
      "User role management",
      "Permission settings",
      "School information setup",
      "Academic calendar configuration",
    ]}
  />
);

export function Maintenance({
  title = "System Under Maintenance",
  subtitle = "This module is currently under development",
  description = "We're working hard to bring you this feature. It will be available soon with enhanced functionality and improved user experience.",
  statusText = "Currently Under Development",
  features = [
    "Enhanced functionality",
    "Improved user experience",
    "Advanced features",
    "Better performance",
    "Comprehensive analytics",
  ],
  icon: Icon = Wrench,
  colorScheme = "amber",
  showFeatures = true,
  customContent,
}: MaintenanceProps) {
  // Color scheme mapping
  const colorClasses = {
    amber: {
      border: "border-amber-200",
      bg: "bg-amber-50/50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      titleColor: "text-amber-800",
      subtitleColor: "text-amber-700",
      textColor: "text-amber-600",
      statusColor: "text-amber-700",
      alertColor: "text-amber-500",
      featureBg: "bg-amber-100",
      featureTitleColor: "text-amber-800",
      featureTextColor: "text-amber-700",
    },
    blue: {
      border: "border-blue-200",
      bg: "bg-blue-50/50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      titleColor: "text-blue-800",
      subtitleColor: "text-blue-700",
      textColor: "text-blue-600",
      statusColor: "text-blue-700",
      alertColor: "text-blue-500",
      featureBg: "bg-blue-100",
      featureTitleColor: "text-blue-800",
      featureTextColor: "text-blue-700",
    },
    green: {
      border: "border-green-200",
      bg: "bg-green-50/50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      titleColor: "text-green-800",
      subtitleColor: "text-green-700",
      textColor: "text-green-600",
      statusColor: "text-green-700",
      alertColor: "text-green-500",
      featureBg: "bg-green-100",
      featureTitleColor: "text-green-800",
      featureTextColor: "text-green-700",
    },
    purple: {
      border: "border-purple-200",
      bg: "bg-purple-50/50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      titleColor: "text-purple-800",
      subtitleColor: "text-purple-700",
      textColor: "text-purple-600",
      statusColor: "text-purple-700",
      alertColor: "text-purple-500",
      featureBg: "bg-purple-100",
      featureTitleColor: "text-purple-800",
      featureTextColor: "text-purple-700",
    },
    red: {
      border: "border-red-200",
      bg: "bg-red-50/50",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      titleColor: "text-red-800",
      subtitleColor: "text-red-700",
      textColor: "text-red-600",
      statusColor: "text-red-700",
      alertColor: "text-red-500",
      featureBg: "bg-red-100",
      featureTitleColor: "text-red-800",
      featureTextColor: "text-red-700",
    },
  };

  const colors = colorClasses[colorScheme];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-1">
        <Card className={`${colors.border} ${colors.bg}`}>
          <CardHeader className="text-center">
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${colors.iconBg}`}>
              <Icon className={`h-8 w-8 ${colors.iconColor}`} />
            </div>
            <CardTitle className={`text-2xl ${colors.titleColor}`}>
              {title}
            </CardTitle>
            <CardDescription className={colors.subtitleColor}>
              {subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div
              className={`flex items-center justify-center gap-2 ${colors.statusColor}`}>
              <Clock className="h-5 w-5" />
              <span className="font-medium">{statusText}</span>
            </div>

            <div className={`space-y-3 text-sm ${colors.textColor}`}>
              <p className={colors.textColor}>{description}</p>

              <div
                className={`flex items-center justify-center gap-2 ${colors.alertColor}`}>
                <AlertTriangle className="h-4 w-4" />
                <span>This feature will be available soon</span>
              </div>
            </div>

            {customContent}

            {showFeatures && features.length > 0 && (
              <div className={`mt-6 rounded-lg ${colors.featureBg} p-4`}>
                <h4
                  className={`font-semibold ${colors.featureTitleColor} mb-2`}>
                  Coming Soon:
                </h4>
                <ul
                  className={`text-left text-sm ${colors.featureTextColor} space-y-1`}>
                  {features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
