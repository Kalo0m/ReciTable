import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-background w-full h-screen flex items-center justify-center text-xl">
      <Button
        variant="default"
        className="text-pink-500 bg-purple-500"
        size={"lg"}
      >
        ReciTable
      </Button>
    </div>
  );
}
