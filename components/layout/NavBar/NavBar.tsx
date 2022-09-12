import { Disclosure } from "@headlessui/react"
import Link from "next/link"
import { PipebirdLogo } from "@/components/icons"

export const NavBar = () => {
  return (
    <Disclosure as="header" className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
        <div className="relative h-16 flex justify-between">
          <div className="relative z-10 px-2 flex lg:px-0">
            <Link href="/">
              <div className="flex-shrink-0 flex items-center mt-2 cursor-pointer">
                <PipebirdLogo />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Disclosure>
  )
}
