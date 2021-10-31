import { FC } from "react"
import { inspect } from 'util'

export const Code: FC<{ src: any }> = ({ src }) => {
  return (
    <pre><code>{inspect(src, { depth: Infinity })}</code></pre>
  )
}