import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

export default function SkeletonCard() {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="mt-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </CardContent>
    </Card>
  );
}
