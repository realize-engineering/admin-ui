import { Spinner } from "../"

export const FullScreenLoader = () => (
  <div className="bg-neutral-50 h-screen flex items-center justify-center">
    <div className="w-12 h-12 text-neutral-600">
      <Spinner />
    </div>
  </div>
)
