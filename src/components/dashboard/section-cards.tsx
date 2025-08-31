import {
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
  IconListDetails,
  IconFileWord,
  IconChartBar,
  IconCalendar,
  IconUsersGroup,
} from "@tabler/icons-react";
// import SmallIcon from "@/components/ui/icon";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MotionCard } from "../utils/motion-wrapper";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card h-28 flex flex-col justify-between bg-gradient-to-t from-primary/5 to-card dark:bg-card">
        <CardHeader className="p-3">
          <CardDescription className="text-md flex items-center gap-2">
            <IconUsers className="h-4 w-4" />
            <span>Total Students</span>
          </CardDescription>
          <CardTitle className="text-lg font-semibold tabular-nums">
            66
          </CardTitle>
          <CardAction />
        </CardHeader>
      </Card>
      <Card className="@container/card h-28 flex flex-col justify-between bg-gradient-to-t from-primary/5 to-card dark:bg-card">
        <CardHeader className="p-3">
          <CardDescription className="text-md flex items-center gap-2">
            <IconUsersGroup className="h-4 w-4" />
            <span>Total Teachers</span>
          </CardDescription>
          <CardTitle className="text-lg font-semibold tabular-nums">
            64
          </CardTitle>
          <CardAction />
        </CardHeader>
      </Card>
      <Card className="@container/card h-28 flex flex-col justify-between bg-gradient-to-t from-primary/5 to-card dark:bg-card">
        <CardHeader className="p-3">
          <CardDescription className="text-md flex items-center gap-2">
            <IconListDetails className="h-4 w-4" />
            <span>Total Sections</span>
          </CardDescription>
          <CardTitle className="text-lg font-semibold tabular-nums">
            16
          </CardTitle>
          <CardAction />
        </CardHeader>
      </Card>
      <Card className="@container/card h-28 flex flex-col justify-between bg-gradient-to-t from-primary/5 to-card dark:bg-card">
        <CardHeader className="p-2">
          <CardDescription className="text-md flex items-center gap-2">
            <IconFileWord className="h-4 w-4" />
            <span>Total Subjects Offered</span>
          </CardDescription>
          <CardTitle className="text-lg font-semibold tabular-nums">
            11
          </CardTitle>
          <CardAction />
        </CardHeader>
      </Card>

      <Card className="@container/card h-35 flex flex-col justify-between bg-gradient-to-t from-primary/5 to-card dark:bg-card">
        <CardHeader className="p-2">
          <CardDescription className="text-md flex items-center gap-2">
            <IconChartBar className="h-6 w-5" />
            <span>Pending Teacher Load Assignments</span>
          </CardDescription>
          <CardTitle className="text-lg font-semibold tabular-nums">
            12
          </CardTitle>
          <CardAction />
        </CardHeader>
      </Card>
    </div>
  );
}
