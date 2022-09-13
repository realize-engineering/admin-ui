import axios from "axios"
import Cookies from "js-cookie"
import Router from "next/router"

const UNAUTHORIZED = 401

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PIPEBIRD_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const fetcher = (url: string) => api.get(url).then((res) => res.data)

api.interceptors.request.use((req) => {
  req.headers = {
    ...req.headers,
    Authorization: `Bearer ${Cookies.get("pipebird-admin-auth")}`,
  }
  return req
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === UNAUTHORIZED) {
      Cookies.remove("pipebird-admin-auth")
      Router.replace("/login")
    }
    return Promise.reject(err)
  },
)
