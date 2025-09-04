import {
  IconUsers,
  IconListDetails,
  IconFileWord,
  IconChartBar,
  IconUsersGroup,
} from "@tabler/icons-react";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MotionCardDash } from "../utils/motion-wrapper";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <MotionCardDash>
        <Card className="@container/card h-28 flex flex-col justify-between bg-gradient-to-br from-blue-50 to-blue-100 dark:bg-card border-blue-200">
          <CardHeader className="p-3">
            <CardDescription className="text-md flex items-center gap-2">
              <IconUsers className="h-4 w-4 text-blue-600" />
              <span>Total Students</span>
            </CardDescription>
            <CardTitle className="text-lg font-semibold tabular-nums text-blue-700">
              66
            </CardTitle>
            <CardAction />
          </CardHeader>
        </Card>
      </MotionCardDash>

      <MotionCardDash>
        <Card className="@container/card h-28 flex flex-col justify-between bg-gradient-to-br from-green-50 to-green-100 dark:bg-card border-green-200">
          <CardHeader className="p-3">
            <CardDescription className="text-md flex items-center gap-2">
              <IconUsersGroup className="h-4 w-4 text-green-600" />
              <span>Total Teachers</span>
            </CardDescription>
            <CardTitle className="text-lg font-semibold tabular-nums text-green-700">
              64
            </CardTitle>
            <CardAction />
          </CardHeader>
        </Card>
      </MotionCardDash>

      <MotionCardDash>
        <Card className="@container/card h-28 flex flex-col justify-between bg-gradient-to-br from-purple-50 to-purple-100 dark:bg-card border-purple-200">
          <CardHeader className="p-3">
            <CardDescription className="text-md flex items-center gap-2">
              <IconListDetails className="h-4 w-4 text-purple-600" />
              <span>Total Sections</span>
            </CardDescription>
            <CardTitle className="text-lg font-semibold tabular-nums text-purple-700">
              16
            </CardTitle>
            <CardAction />
          </CardHeader>
        </Card>
      </MotionCardDash>

      <MotionCardDash>
        <Card className="@container/card h-28 flex flex-col justify-between bg-gradient-to-br from-orange-50 to-orange-100 dark:bg-card border-orange-200">
          <CardHeader className="p-2">
            <CardDescription className="text-md flex items-center gap-2">
              <IconFileWord className="h-4 w-4 text-orange-600" />
              <span>Total Subjects Offered</span>
            </CardDescription>
            <CardTitle className="text-lg font-semibold tabular-nums text-orange-700">
              11
            </CardTitle>
            <CardAction />
          </CardHeader>
        </Card>
      </MotionCardDash>

      <MotionCardDash>
        <Card className="@container/card h-35 flex flex-col justify-between bg-gradient-to-br from-red-50 to-red-100 dark:bg-card border-red-200">
          <CardHeader className="p-2">
            <CardDescription className="text-md flex items-center gap-2">
              <IconChartBar className="h-6 w-5 text-red-600" />
              <span>Pending Teacher Load Assignments</span>
            </CardDescription>
            <CardTitle className="text-lg font-semibold tabular-nums text-red-700">
              12
            </CardTitle>
            <CardAction />
          </CardHeader>
        </Card>
      </MotionCardDash>
    </div>
  );
}
