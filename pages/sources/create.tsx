import { NextPage } from "next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { BaseLayout } from "@/components/layout"
import { ControlledInput } from "@/components/forms"
import { z } from "zod"
import axios from "axios"
import Router from "next/router"
import { XCircleIcon } from "@heroicons/react/solid"
import { api } from "@/utils/api"

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
  nickname: z.string().optional(),
  sourceType: z.enum([
    "POSTGRES",
    "MYSQL",
    "MARIADB",
    "COCKROACHDB",
    "REDSHIFT",
    "SNOWFLAKE",
    "BIGQUERY",
    "MSSQL",
  ]),
  host: z.string().min(1, { message: "Host is required" }),
  port: z
    .string()
    .min(1, { message: "Port is required" })
    .transform((p) => parseInt(p)),
  schema: z.string().optional(),
  database: z.string().min(1, { message: "Database is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().optional(),
})

type FormData = z.infer<typeof formData> & { apiError?: string }

const CreateSource: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(formData),
    reValidateMode: "onSubmit",
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      await api.post("/sources", data)
      Router.push("/")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return setError("apiError", {
          message: (err.response?.data as { message: string }).message,
        })
      }
    }
  })

  return (
    <BaseLayout>
      <div className="border border-gray-200 bg-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 p-6">
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Create a Source
                </h3>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  Sources are the start of a pipeline. You can use them to
                  create views which specify the tables and columns you want to
                  share with your customers.
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
                  <div className="bg-white px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="type"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Database Type
                        </label>
                        <select
                          id="type"
                          autoComplete="database-type"
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          {...register("sourceType")}
                        >
                          {sources.map((src) => (
                            <option key={src} value={src}>
                              {src}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <ControlledInput
                          id="nickname"
                          label="Nickname"
                          type="text"
                          autoComplete="nickname"
                          {...register("nickname")}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <ControlledInput
                          id="host"
                          label="Host"
                          type="text"
                          autoComplete="host"
                          {...register("host")}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <ControlledInput
                          id="port"
                          label="Port"
                          type="text"
                          autoComplete="port"
                          {...register("port")}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <ControlledInput
                          id="schema"
                          label="Schema"
                          type="text"
                          autoComplete="schema"
                          {...register("schema")}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <ControlledInput
                          id="database"
                          label="Database"
                          type="text"
                          autoComplete="database"
                          {...register("database")}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <ControlledInput
                          id="username"
                          label="Username"
                          type="text"
                          autoComplete="username"
                          {...register("username")}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <ControlledInput
                          id="password"
                          label="Password"
                          type="password"
                          autoComplete="password"
                          {...register("password")}
                        />
                      </div>
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

export default CreateSource
