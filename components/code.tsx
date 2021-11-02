import { FC } from "react"
import { inspect } from 'util'

export const Code: FC<{ src: any }> = ({ src }) => {
  return (
    <pre
      className="p-2 bg-gray-100 border border-gray-300"
    ><code>{inspect(src, { depth: Infinity, maxArrayLength: Infinity })}</code></pre>
  )
}