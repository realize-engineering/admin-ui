import clsx from "clsx"

type Size = "xs" | "sm" | "md" | "lg" | "xl"
const sizes: Record<Size, string> = {
  xs: "px-2.5 py-1.5 text-xs",
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-4 py-2 text-base",
  xl: "px-6 py-3 text-base",
}

export function PrimaryButton({
  type,
  disabled = false,
  width = "content",
  size = "md",
  onClick,
  children,
  customSize,
}: {
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"]
  disabled?: boolean
  width?: "content" | "full"
  size?: Size
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
  customSize?: string
}) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center border border-transparent font-medium rounded-md shadow-sm text-white bg-pb-purple disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500",
        width === "full" && "w-full justify-center",
        customSize || sizes[size],
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
