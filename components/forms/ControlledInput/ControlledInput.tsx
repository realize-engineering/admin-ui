import React from "react"

export const ControlledInput = React.forwardRef<
  HTMLInputElement,
  {
    as?: React.ElementType
    id: string
    name: string
    label: string
    labelShown?: boolean
    type: React.HTMLInputTypeAttribute
    autoComplete: string
    placeholder?: string
    defaultValue?: string
    disabled?: boolean
    onChange: React.ChangeEventHandler<HTMLInputElement>
    onBlur: React.FocusEventHandler<HTMLInputElement>
  }
>(
  (
    {
      as: AsComponent = "div",
      id,
      name,
      label,
      labelShown = true,
      type,
      autoComplete,
      placeholder,
      defaultValue,
      disabled,
      onChange,
      onBlur,
    },
    ref,
  ) => (
    <AsComponent>
      <label
        htmlFor={id}
        className={
          labelShown ? "block text-sm font-medium text-gray-700" : "sr-only"
        }
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        disabled={disabled}
        className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-200 disabled:text-gray-500"
      />
    </AsComponent>
  ),
)

ControlledInput.displayName = "ControlledInput"
