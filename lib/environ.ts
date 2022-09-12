import { z } from "zod"
import { logger } from "./logger"

const Environ = z.object({
  NODE_ENV: z.union([
    z.literal("development"),
    z.literal("production"),
    z.literal("test"),
  ]),
  NEXT_PUBLIC_PIPEBIRD_BASE_URL: z.string(),
})

export type Environ = z.infer<typeof Environ>
const environParseResult = Environ.safeParse(process.env)

if (!environParseResult.success) {
  logger.error({ environError: environParseResult.error })
  process.exit(1)
}

export const environ = environParseResult.data
