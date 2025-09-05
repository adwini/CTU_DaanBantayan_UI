import { DataTable } from "@/components/dashboard/data-table";
import { SectionCards } from "@/components/dashboard/section-cards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  IconBook,
  IconUsers,
  IconChalkboard,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboard.service";
import {
  DashboardStats,
  SubjectsByGradeData,
  StudentsPerSectionData,
  TeacherLoadStatusData,
} from "@/types/api";

interface DashboardHomeProps {
  data?: Array<{
    id: number;
    header: string;
    type: string;
    status: string;
    target: string;
    limit: string;
    reviewer: string;
  }>;
}

// Dashboard data interfaces
interface DashboardData {
  stats: DashboardStats;
  subjectsOverview: Array<{
    id: string;
    subject: string;
    grade: string;
    teacher: string;
    sections: number;
    students: number;
  }>;
  teacherLoadsOverview: Array<{
    id: string;
    teacher: string;
    subject: string;
    section: string;
    schedule: string;
    status: string;
  }>;
  sectionsOverview: Array<{
    id: string;
    section: string;
    grade: string;
    adviser: string;
    students: number;
    status: string;
  }>;
  subjectsByGrade: SubjectsByGradeData[];
  studentsPerSection: StudentsPerSectionData[];
  teacherLoadStatus: TeacherLoadStatusData[];
}

// Sample data for overview tables
const subjectsOverview = [
  {
    id: 1,
    subject: "Mathematics",
    grade: "Grade 7",
    teacher: "Dr. Maria Santos",
    sections: 2,
    students: 64,
  },
  {
    id: 2,
    subject: "English",
    grade: "Grade 7",
    teacher: "Prof. Juan Dela Cruz",
    sections: 2,
    students: 68,
  },
  {
    id: 3,
    subject: "Science",
    grade: "Grade 8",
    teacher: "Ms. Ana Rodriguez",
    sections: 3,
    students: 78,
  },
  {
    id: 4,
    subject: "Filipino",
    grade: "Grade 8",
    teacher: "Mr. Carlos Mendoza",
    sections: 2,
    students: 52,
  },
  {
    id: 5,
    subject: "Social Studies",
    grade: "Grade 9",
    teacher: "Dr. Elena Reyes",
    sections: 1,
    students: 35,
  },
];

const teacherLoadsOverview = [
  {
    id: 1,
    teacher: "Dr. Maria Santos",
    subject: "Mathematics",
    section: "Grade 7-A",
    schedule: "8:00 AM - 9:00 AM",
    status: "Assigned",
  },
  {
    id: 2,
    teacher: "Prof. Juan Dela Cruz",
    subject: "English",
    section: "Grade 7-B",
    schedule: "9:00 AM - 10:00 AM",
    status: "Assigned",
  },
  {
    id: 3,
    teacher: "Ms. Ana Rodriguez",
    subject: "Science",
    section: "Grade 8-A",
    schedule: "10:00 AM - 11:00 AM",
    status: "Pending",
  },
  {
    id: 4,
    teacher: "Mr. Carlos Mendoza",
    subject: "Physical Education",
    section: "Grade 9-A",
    schedule: "2:00 PM - 3:00 PM",
    status: "Assigned",
  },
  {
    id: 5,
    teacher: "Dr. Elena Reyes",
    subject: "Social Studies",
    section: "Grade 9-B",
    schedule: "11:00 AM - 12:00 PM",
    status: "Pending",
  },
];

const sectionsOverview = [
  {
    id: 1,
    section: "Grade 7-A",
    adviser: "Dr. Maria Santos",
    students: 32,
    subjects: 8,
    room: "Room 101",
  },
  {
    id: 2,
    section: "Grade 7-B",
    adviser: "Prof. Juan Dela Cruz",
    students: 35,
    subjects: 8,
    room: "Room 102",
  },
  {
    id: 3,
    section: "Grade 8-A",
    adviser: "Ms. Ana Rodriguez",
    students: 28,
    subjects: 9,
    room: "Room 201",
  },
  {
    id: 4,
    section: "Grade 8-B",
    adviser: "Mr. Carlos Mendoza",
    students: 30,
    subjects: 9,
    room: "Room 202",
  },
  {
    id: 5,
    section: "Grade 9-A",
    adviser: "Dr. Elena Reyes",
    students: 25,
    subjects: 10,
    room: "Room 301",
  },
];

// Chart data with gradient colors
const studentsPerSectionData = [
  { name: "Grade 7-A", value: 32, fill: "url(#blueGradient)" },
  { name: "Grade 7-B", value: 35, fill: "url(#greenGradient)" },
  { name: "Grade 8-A", value: 28, fill: "url(#purpleGradient)" },
  { name: "Grade 8-B", value: 30, fill: "url(#orangeGradient)" },
  { name: "Grade 9-A", value: 25, fill: "url(#redGradient)" },
];

const subjectsPerGradeData = [
  { grade: "Grade 7", subjects: 8 },
  { grade: "Grade 8", subjects: 9 },
  { grade: "Grade 9", subjects: 10 },
  { grade: "Grade 10", subjects: 11 },
];

const teacherLoadStatusData = [
  { month: "Jan", assigned: 45, pending: 12 },
  { month: "Feb", assigned: 52, pending: 8 },
  { month: "Mar", assigned: 48, pending: 15 },
  { month: "Apr", assigned: 58, pending: 6 },
  { month: "May", assigned: 62, pending: 4 },
  { month: "Jun", assigned: 55, pending: 10 },
];

// Chart configurations
const pieChartConfig: ChartConfig = {
  students: {
    label: "Students",
  },
};

const barChartConfig: ChartConfig = {
  subjects: {
    label: "Subjects",
  },
};

const lineChartConfig: ChartConfig = {
  assigned: {
    label: "Assigned",
  },
  pending: {
    label: "Pending",
  },
};

export function DashboardHomeComponent({ data }: DashboardHomeProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chart configurations
  const pieChartConfig: ChartConfig = {
    students: {
      label: "Students",
    },
  };

  const barChartConfig: ChartConfig = {
    subjects: {
      label: "Subjects",
    },
  };

  const lineChartConfig: ChartConfig = {
    assigned: {
      label: "Assigned",
    },
    pending: {
      label: "Pending",
    },
  };

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const apiData = await dashboardService.getAllDashboardData();
        setDashboardData(apiData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-600">
              Loading dashboard data...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading dashboard data</p>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show dashboard with real data
  if (!dashboardData) {
    return null;
  }
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />

        {/* Overview Tables Section */}
        <div className="px-4 lg:px-6 space-y-6">
          {/* Subjects Overview */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBook className="h-5 w-5" />
                Overview of Subjects
              </CardTitle>
              <CardDescription>
                Current subject assignments and coverage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Sections</TableHead>
                      <TableHead>Students</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.subjectsOverview.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell className="font-medium">
                          {subject.subject}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{subject.grade}</Badge>
                        </TableCell>
                        <TableCell>{subject.teacher}</TableCell>
                        <TableCell>{subject.sections}</TableCell>
                        <TableCell>{subject.students}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Loads Overview */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconChalkboard className="h-5 w-5" />
                Overview of Teacher Loads
              </CardTitle>
              <CardDescription>
                Current teacher assignments and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.teacherLoadsOverview.map((load) => (
                      <TableRow key={load.id}>
                        <TableCell className="font-medium">
                          {load.teacher}
                        </TableCell>
                        <TableCell>{load.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{load.section}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {load.schedule}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              load.status === "Assigned"
                                ? "default"
                                : "secondary"
                            }>
                            {load.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Sections Overview */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUsers className="h-5 w-5" />
                Overview of Sections
              </CardTitle>
              <CardDescription>
                Section details and student distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section</TableHead>
                      <TableHead>Adviser</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Room</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.sectionsOverview.map((section) => (
                      <TableRow key={section.id}>
                        <TableCell className="font-medium">
                          <Badge variant="outline">{section.section}</Badge>
                        </TableCell>
                        <TableCell>{section.adviser}</TableCell>
                        <TableCell>{section.students}</TableCell>
                        <TableCell>8</TableCell>
                        <TableCell>
                          Room {Math.floor(Math.random() * 300) + 100}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="px-4 lg:px-6 space-y-6">
          {/* Pie Chart - Students per Section */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconTrendingUp className="h-5 w-5" />
                Students per Section
              </CardTitle>
              <CardDescription>
                Distribution of students across sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={pieChartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient
                        id="blueGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                      <linearGradient
                        id="greenGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient
                        id="purpleGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                      <linearGradient
                        id="orangeGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                      <linearGradient
                        id="redGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={dashboardData.studentsPerSection}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value">
                      {studentsPerSectionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Bar Chart - Subjects per Grade Level */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBook className="h-5 w-5" />
                Subjects per Grade Level
              </CardTitle>
              <CardDescription>
                Number of subjects taught per grade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={barChartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.subjectsByGrade}>
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="subjects" fill="url(#barGradient)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Line Chart - Teacher Load Status */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconChalkboard className="h-5 w-5" />
                Teacher Load Status (Assigned vs Pending)
              </CardTitle>
              <CardDescription>
                Assigned vs Pending teacher loads over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={lineChartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.teacherLoadStatus}>
                    <defs>
                      <linearGradient
                        id="assignedGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient
                        id="pendingGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="assigned"
                      stroke="url(#assignedGradient)"
                      strokeWidth={3}
                      name="Assigned"
                    />
                    <Line
                      type="monotone"
                      dataKey="pending"
                      stroke="url(#pendingGradient)"
                      strokeWidth={3}
                      name="Pending"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
