import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/table/$tableId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { tableId } = Route.useParams();
  return <main className="min-h-screen">Hello table {tableId}!</main>;
}
