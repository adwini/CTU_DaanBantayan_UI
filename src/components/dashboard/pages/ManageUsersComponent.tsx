import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ManageUsersComponent() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
            <CardDescription>
              Add, edit, and manage system users including students and
              teachers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>User management functionality will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
