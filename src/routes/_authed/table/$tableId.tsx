import { createFileRoute } from '@tanstack/react-router'
import { getTable } from '~/api/tables'
import { InteractiveTable } from '~/components/InteractiveTable' // Use relative path

export const Route = createFileRoute('/_authed/table/$tableId')({
  loader: async ({ params }) => {
    const tableData = await getTable({ data: { tableId: params.tableId } })
    if (!tableData) {
      throw new Error(`Table with ID "${params.tableId}" not found.`)
    }
    return tableData
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { structuredTable, slug } = Route.useLoaderData()

  return (
    <main className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-4 text-center text-white">{slug}</h1>
      <InteractiveTable data={structuredTable} />
    </main>
  )
}
