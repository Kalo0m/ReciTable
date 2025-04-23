import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card'
import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  FlaskRoundIcon as Flask,
  Languages,
  HistoryIcon,
  Calculator,
  Database,
  ChevronRight,
} from 'lucide-react'
import './TableList.css'
import { useTablesQuery } from '~/api/tables'

export function TableList() {
  const { data: tables } = useTablesQuery()
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Mathematics':
        return <Calculator className="h-5 w-5" />
      case 'Chemistry':
        return <Flask className="h-5 w-5" />
      case 'Languages':
        return <Languages className="h-5 w-5" />
      case 'History':
        return <HistoryIcon className="h-5 w-5" />
      case 'Computer Science':
        return <Database className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tables.map((table) => (
        <Link
          to={`/table/$tableId`}
          params={{ tableId: table.id }}
          key={table.id}
          className="block"
        >
          <div className="simple-border-card">
            <Card className="h-full border-0 bg-gray-800/70 hover:bg-blue-900/80 transition-all duration-300 overflow-hidden rounded-sm shadow-md">
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-50"></div>

              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-blue-50 hover:text-blue-300 transition-colors">
                    {table.slug}
                  </h3>
                  <div className="flex items-center space-x-1">
                    {/* <span
                      className={`text-lg font-bold ${
                        table.mark >= 8
                          ? 'text-green-400'
                          : table.mark >= 6
                            ? 'text-yellow-400'
                            : 'text-red-400'
                      }`}
                    >
                      {table.mark}
                    </span> */}
                    <span className="text-blue-200/70 text-sm">/10</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center space-x-2 text-blue-200/80 mb-2">
                  <span className="text-blue-300">
                    {getCategoryIcon('Chemistry')}
                  </span>
                  <span>{'Biology'}</span>
                </div>

                <div className="w-full bg-blue-800/30 rounded-none h-1 mt-4">
                  {/* <div
                    className={`h-1 ${
                      table.mark >= 8
                        ? 'bg-green-500'
                        : table.mark >= 6
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${table.mark * 10}%` }}
                  ></div> */}
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm text-blue-300/60">
                    Click to practice
                  </span>
                  <ChevronRight className="h-5 w-5 text-blue-300 transform hover:translate-x-1 transition-transform" />
                </div>
              </CardFooter>
            </Card>
          </div>
        </Link>
      ))}
    </div>
  )
}
