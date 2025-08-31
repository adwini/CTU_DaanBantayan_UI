import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TeacherLoadsComponent() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Teacher Loads</CardTitle>
            <CardDescription>
              Monitor and manage teacher workloads and subject assignments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Teacher loads monitoring functionality will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
