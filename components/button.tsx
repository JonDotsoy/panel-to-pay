import { DOMAttributes, FC } from "react";
import classNames from "classnames";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  typeStyle?: 'primary-solid' | 'default-solid' | 'default' | 'primary' | 'secondary' | 'danger' | 'danger-hover' | "danger-solid" | 'disabled' | 'primary-hover'
}

export const Button: FC<Props> = ({ className, typeStyle = 'default', children, ...props }) => {
  return (
    <button
      {...props}
      className={classNames(
        "border px-4 py-2 transition-all",
        typeStyle === 'primary-solid' && [
          "border-gray-400",
          "hover:border-green-400 hover:bg-green-400 hover:shadow-md hover:text-white",
          "hover:border-green-400 focus:bg-green-400 focus:shadow-md focus:text-white",
        ],
        typeStyle === 'default-solid' && [
          "border-gray-400",
          "hover:border-gray-400 hover:bg-gray-400 hover:shadow-md hover:text-white",
          "hover:border-gray-400 focus:bg-gray-400 focus:shadow-md focus:text-white",
        ],
        typeStyle === 'default' && [
          "border-gray-400 text-gray-500",
          "hover:border-gray-600 hover:shadow-md hover:text-gray-900",
          "focus:border-gray-600 focus:shadow-md focus:text-gray-900",
        ],
        typeStyle === 'secondary' && [
          "border-blue-400 text-blue-500",
          "hover:border-blue-600 hover:shadow-md hover:bg-blue-500 hover:text-white",
          "focus:border-blue-600 focus:shadow-md focus:bg-blue-500 focus:text-white",
        ],
        typeStyle === 'primary' && [
          "border-green-400 text-green-500",
          "hover:border-green-600 hover:shadow-md hover:bg-green-500 hover:text-white",
          "focus:border-green-600 focus:shadow-md focus:bg-green-500 focus:text-white",
        ],
        typeStyle === 'primary-hover' && [
          "border-gray-400 text-gray-500",
          "hover:border-green-600 hover:shadow-md hover:bg-green-500 hover:text-white",
          "focus:border-green-600 focus:shadow-md focus:bg-green-500 focus:text-white",
        ],
        typeStyle === 'danger-solid' && [
          "border-red-400 text-red-500",
          "hover:border-red-400 hover:bg-red-400 hover:shadow-md hover:text-white",
          "hover:border-red-400 focus:bg-red-400 focus:shadow-md focus:text-white",
        ],
        typeStyle === 'danger' && [
          "border-red-400 text-red-500",
          "hover:border-red-400 hover:bg-red-400 hover:shadow-md hover:text-white",
          "hover:border-red-400 focus:bg-red-400 focus:shadow-md focus:text-white",
        ],
        typeStyle === 'danger-hover' && [
          "border-gray-400 text-gray-500",
          "hover:border-red-400 hover:bg-red-400 hover:shadow-md hover:text-white",
          "hover:border-red-400 focus:bg-red-400 focus:shadow-md focus:text-white",
        ],
        typeStyle === 'disabled' && [
          "border-gray-300 text-gray-300 cursor-default",
        ],
        className,
      )}
    >
      {children}
    </button>
  )
}