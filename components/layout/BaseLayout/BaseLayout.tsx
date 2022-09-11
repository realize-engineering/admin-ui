import { NavBar } from "@/components/layout"

export const BaseLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="h-full">
      <div className="min-h-full">
        <NavBar />
        <div className="py-10">
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
