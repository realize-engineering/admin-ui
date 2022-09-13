import React from "react"
import axios from "axios"
import Router from "next/router"
import Cookies from "js-cookie"
import { NextPage } from "next"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { PipebirdLogo } from "@/components/icons"
import { ControlledInput } from "@/components/forms"
import { Spinner } from "@/components/layout"
import { PrimaryButton } from "@/components/buttons"
import { api } from "@/utils/api"
import { environ } from "@/lib/environ"

const formData = z.object({
  secretKey: z
    .string()
    .min(67, { message: "Please provide a valid secret key" }),
})

type FormData = z.infer<typeof formData> & { apiError?: string }

const Login: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(formData),
    reValidateMode: "onSubmit",
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      Cookies.set("pipebird-admin-auth", data.secretKey, {
        secure: environ.NEXT_PUBLIC_TLS === "TLS" ? true : false,
      })

      // ping server without error
      await api.get("/destinations")

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
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-pb-purple h-3"></div>
      <div className="flex flex-col flex-1 justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex h-12 w-auto justify-center">
            <PipebirdLogo className="justify-center" />
          </div>

          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login to Pipebird
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={onSubmit}>
              <ControlledInput
                id="secretKey"
                label="Secret Key"
                type="text"
                autoComplete="secretKey"
                {...register("secretKey")}
              />

              <div>
                <PrimaryButton
                  type="submit"
                  disabled={isSubmitting || isSubmitSuccessful}
                  width="full"
                >
                  {isSubmitting || isSubmitSuccessful ? (
                    <div className="h-5 w-5 text-white">
                      <Spinner />
                    </div>
                  ) : (
                    "Continue"
                  )}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
