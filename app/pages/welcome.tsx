import { Link } from "react-router";
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

export function Welcome() {
  return (
    <Card className="w-[34rem]">
      <CardHeader>
        <CardTitle>Your Draft</CardTitle>
        <CardDescription>
          Your draft is stored locally.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {[1,2,3].map(() => (
            <Button variant={'neutral'} size={'sm'}>
              Jastin Linggar Tama <span className="text-xs">- 17/04/2025</span>
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full" asChild>
          <Link to={'/app'}>New Draft</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
