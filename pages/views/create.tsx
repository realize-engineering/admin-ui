import { NextPage } from "next"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { BaseLayout, Spinner } from "@/components/layout"
import { ControlledInput } from "@/components/forms"
import { z } from "zod"
import axios from "axios"
import Router from "next/router"
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/solid"
import { api, fetcher } from "@/utils/api"
import useSWR from "swr"
import { Source } from "@/lib/types"

const sources = [
  "POSTGRES",
  "MYSQL",
  "MARIADB",
  "COCKROACHDB",
  "REDSHIFT",
  "SNOWFLAKE",
  "BIGQUERY",
  "MSSQL",
]

const formData = z.object({
  sourceId: z.string().transform((s) => parseInt(s)),
  tableName: z.string().min(1, { message: "A table name is required" }),
  columns: z
    .object({
      name: z.string(),
      isPrimaryKey: z.boolean().default(false),
      isLastModified: z.boolean().default(false),
      isTenantColumn: z.boolean().default(false),
    })
    .array()
    .min(3, {
      message:
        "Ensure that you include a primary key column, a last modified column, and a tenant column",
    }),
})

type FormData = z.infer<typeof formData> & { apiError?: string }

const CreateView: NextPage = () => {
  const { data, error } = useSWR<{ content: Source[] }>("/sources", fetcher)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(formData),
    reValidateMode: "onSubmit",
    defaultValues: {
      columns: [
        { name: "id", isPrimaryKey: true },
        { isLastModified: true },
        { isTenantColumn: true },
      ],
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
    rules: { minLength: 3 },
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      await api.post("/views", data)
      Router.push("/")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return setError("apiError", {
          message: (err.response?.data as { message: string }).message,
        })
      }
    }
  })

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
    <BaseLayout>
      <div className="border border-gray-200 bg-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 p-6">
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Create a View
                </h3>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  Select a source database and then provide the table name as
                  well as the columns on that table that you want to make
                  available to your end customers
                </p>
              </div>
              {Object.values(errors).reduce(
                (acc, curr) => (curr !== undefined ? acc + 1 : acc),
                0,
              ) !== 0 && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XCircleIcon
                        className="h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        There were errors with your submission
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul role="list" className="list-disc pl-5 space-y-1">
                          {Object.keys(errors).map((error) => (
                            <li key={error}>
                              {errors[error as keyof typeof errors]?.message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form onSubmit={onSubmit}>
                <div className="overflow-hidden shadow sm:rounded-md">
                  <div className="bg-white px-4 py-5 sm:p-6 space-y-8 divide-y divide-gray-200">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="type"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Source DB
                        </label>
                        <select
                          id="type"
                          autoComplete="database-type"
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          {...register("sourceId")}
                        >
                          {data.content.map((src) => (
                            <option key={src.id} value={src.id}>
                              {src.nickname
                                ? `${src.nickname} (${src.sourceType})`
                                : `Source ${src.id} (${src.sourceType})`}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <ControlledInput
                          id="tableName"
                          label="Table Name"
                          type="text"
                          autoComplete="tableName"
                          {...register("tableName")}
                        />
                      </div>
                    </div>
                    {fields.map((field, index) => (
                      <div
                        className="pt-6 grid grid-cols-6 gap-6"
                        key={field.id}
                      >
                        <div className="col-span-6 sm:col-span-3">
                          <ControlledInput
                            id="columnName"
                            label="Column Name"
                            type="text"
                            autoComplete="columnName"
                            {...register(`columns.${index}.name`)}
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <div className="flex justify-end -mb-4 hover:cursor-pointer">
                            <XCircleIcon
                              onClick={() => remove(index)}
                              className="h-5 w-5 text-red-400"
                              aria-hidden="true"
                            />
                          </div>
                          <fieldset className="space-y-5">
                            <legend className="sr-only">Column Type</legend>
                            <div className="relative flex items-start">
                              <div className="flex h-5 items-center">
                                <input
                                  id="isPrimaryKey"
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  {...register(`columns.${index}.isPrimaryKey`)}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="isPrimaryKey"
                                  className="font-medium text-gray-700"
                                >
                                  Primary Key
                                </label>
                                <p
                                  id="comments-description"
                                  className="text-gray-500"
                                >
                                  Unique identifier for table rows
                                </p>
                              </div>
                            </div>
                            <div className="relative flex items-start">
                              <div className="flex h-5 items-center">
                                <input
                                  id="isLastModified"
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  {...register(
                                    `columns.${index}.isLastModified`,
                                  )}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="isLastModified"
                                  className="font-medium text-gray-700"
                                >
                                  Last Modified
                                </label>
                                <p
                                  id="comments-description"
                                  className="text-gray-500"
                                >
                                  Column indicating last update to a given row
                                </p>
                              </div>
                            </div>
                            <div className="relative flex items-start">
                              <div className="flex h-5 items-center">
                                <input
                                  id="isTenantColumn"
                                  checked={field.isTenantColumn}
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  {...register(
                                    `columns.${index}.isTenantColumn`,
                                  )}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="isTenantColumn"
                                  className="font-medium text-gray-700"
                                >
                                  Tenant Column
                                </label>
                                <p
                                  id="comments-description"
                                  className="text-gray-500"
                                >
                                  Column in table uniquely identifying customer
                                </p>
                              </div>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                    ))}
                    <div className="py-6 text-center">
                      <button
                        onClick={() =>
                          append({
                            name: "",
                            isPrimaryKey: false,
                            isLastModified: false,
                            isTenantColumn: false,
                          })
                        }
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <PlusCircleIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default CreateView
