import { createFileRoute } from '@tanstack/react-router';
import { TableList } from '~/components/tableList/TableList';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      <TableList />
    </main>
  );
}
