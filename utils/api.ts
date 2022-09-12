import axios from "axios"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PIPEBIRD_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PIPEBIRD_SECRET_KEY}`,
  },
})

export const fetcher = (url: string) => api.get(url).then((res) => res.data)
