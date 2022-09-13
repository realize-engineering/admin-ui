import Link from "next/link"
import useSWR from "swr"

import { View } from "@/lib/types"
import { fetcher } from "@/utils/api"
import { Spinner } from "@/components/layout/Spinner/Spinner"

export const Views = () => {
  const { data } = useSWR<{ content: View[] }>("/views", fetcher)

  if (!data) {
    return (
      <div className="mt-8 flex flex-col">
        <div className="h-5 w-5 text-white">
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Views</h1>
          <p className="mt-2 text-sm text-gray-700">
            View of a table created from some source
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link href="/views/create">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add View
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                  >
                    Table Name
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Source ID
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Columns
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.content.map((e) => (
                  <tr key={e.id}>
                    <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                      {e.tableName}
                    </td>
                    <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                      {e.sourceId}
                    </td>
                    <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                      <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-500">
                        {e.columns.map((c) => c.name).join(" | ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
