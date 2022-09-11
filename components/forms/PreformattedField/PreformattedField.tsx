export const PreformattedField = ({
  label,
  value,
}: {
  label: string
  value: string
}) => (
  <>
    <p className="w-48 font-semibold text-lg">{label}</p>
    <div className="flex flex-1 justify-between items-center bg-gray-200 rounded-md px-3 py-1 overflow-hidden">
      <pre>{value}</pre>
    </div>
  </>
)
