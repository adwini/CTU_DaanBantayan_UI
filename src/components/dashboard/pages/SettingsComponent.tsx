import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SettingsComponent() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>
              Configure system-wide settings and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>System settings functionality will be implemented here.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Permissions</CardTitle>
            <CardDescription>
              Manage user roles and access permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>User permissions management coming soon.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>School Configuration</CardTitle>
            <CardDescription>
              Configure school information, academic calendar, and policies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>School configuration functionality coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
