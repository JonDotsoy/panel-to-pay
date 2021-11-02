import { Map } from 'immutable'
import { DependencyList, useMemo, useState } from 'react'

/**
 * @deprecated
 */
export const useValuesChanges = <O>(initialValues: O, fields: (O extends object ? keyof O : never)[], deps: DependencyList) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialValue = useMemo(() => Map(fields.reduce((a, field) => ({ ...a, [field]: initialValues[field] }), {})), deps);

  const [values, setValues] = useState(initialValue);

  const changed = useMemo(() => !initialValue.equals(values), [values, initialValue]);

  const set = (...path: string[]) => (value: any) => {
    setValues(v => v.setIn(path, value))
  }

  return {
    changed,
    values,
    set,
  };
}
