import { NextPage } from "next"
import { Tab } from "@headlessui/react"
import pluralize from "pluralize"
import clsx from "clsx"

import { BaseLayout } from "@/components/layout"
import { Destinations, Sources, Views } from "@/components/data"

const entities = ["Source", "View", "Destination"]

const Dashboard: NextPage = () => {
  return (
    <BaseLayout>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {entities.map((entity) => (
            <Tab
              key={entity}
              className={({ selected }) =>
                clsx(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-indigo-400",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-pb-purple focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-pb-purple",
                )
              }
            >
              {pluralize(entity)}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel
            className={clsx(
              "rounded-xl bg-white p-3",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400",
            )}
          >
            <Sources />
          </Tab.Panel>
          <Tab.Panel
            className={clsx(
              "rounded-xl bg-white p-3",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400",
            )}
          >
            <Views />
          </Tab.Panel>
          <Tab.Panel
            className={clsx(
              "rounded-xl bg-white p-3",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400",
            )}
          >
            <Destinations />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </BaseLayout>
  )
}

export default Dashboard
