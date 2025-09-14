"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IconWorld } from "@tabler/icons-react";

export function SectionCards() {
  const onlineCount = 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card" data-slot="card">
        <CardHeader>
          <CardDescription className="flex items-center">
            <Badge
              className={`h-3 w-3 mr-2 rounded-full px-1 ${
                onlineCount === 0 ? "bg-neutral-400" : "bg-green-500"
              }`}
            />
            Online agora
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 items-center font-medium">
            Total de acessos <IconWorld className="size-4" />
          </div>
          <div className="text-muted-foreground">0</div>
        </CardFooter>
      </Card>
    </div>
  );
}
