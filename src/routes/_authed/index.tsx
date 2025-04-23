import React, { Suspense, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { TableList } from '~/components/tableList/TableList'

// Import shadcn/ui components
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { tableOptions, useCreateTableMutation } from '~/api/tables'

export const Route = createFileRoute('/_authed/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(tableOptions.tables)
    return { userId: context.userId }
  },
})

function RouteComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [tableName, setTableName] = useState('')
  const createTableMutation = useCreateTableMutation()
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = async (e) => {
      const content = e.target?.result as string
      setFileContent(content)
    }

    reader.readAsText(file)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!fileContent || !tableName) return

    createTableMutation.mutate({
      csvContent: fileContent,
      tableName,
    })
  }

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      setFileContent(null)
      setTableName('')
    }
    setIsModalOpen(open)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-800 to-gray-900 p-8 text-white">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-white text-center">
          Reci<span className="text-blue-300">Table</span>
        </h1>
        <p className="text-blue-200/80 mb-10 text-center">
          Master your knowledge with your tables
        </p>

        <div className="flex justify-end mb-6">
          <Button onClick={() => setIsModalOpen(true)}>Add New Table</Button>
        </div>

        <Suspense>
          <TableList />
        </Suspense>
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
              <DialogDescription>
                Choose a name and upload a CSV file.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="table-name" className="text-right">
                  Table Name
                </Label>
                <Input
                  id="table-name"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="col-span-3"
                  required
                  disabled={createTableMutation.isPending}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="csv-upload" className="text-right">
                  CSV File
                </Label>
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="col-span-3"
                  required
                  disabled={createTableMutation.isPending}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={createTableMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !fileContent || !tableName || createTableMutation.isPending
                }
              >
                {createTableMutation.isPending ? 'Uploading...' : 'Upload'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}
