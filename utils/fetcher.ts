export const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PIPEBIRD_SECRET_KEY}`,
    },
  }).then((res) => res.json())
