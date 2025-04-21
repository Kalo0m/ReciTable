import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/table/$tableId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { tableId } = Route.useParams();
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="border-2 p-4 w-full h-full bg-gray-900">
        Table {tableId}
      </div>
    </main>
  );
}
