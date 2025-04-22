import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import { getFakeTableData, TableData } from '../../lib/fakeTableData'; // Use relative path
import { InteractiveTable } from '../../components/InteractiveTable'; // Use relative path

export const Route = createFileRoute('/table/$tableId')({
  loader: ({ params }) => {
    const tableData = getFakeTableData(params.tableId);
    if (!tableData) {
      throw new Error(`Table with ID "${params.tableId}" not found.`);
    }
    return tableData;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const tableData = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-4 text-center text-white">
        Table: {tableData.id}
      </h1>
      <InteractiveTable data={tableData} />
    </main>
  );
}
