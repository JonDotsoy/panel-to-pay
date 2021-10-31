import { fromJS, Map, List } from 'immutable'
import { DependencyList, useEffect, useMemo, useState } from 'react'

export const useValuesChanges = <O>(initialValues: O, fields: (O extends object ? keyof O : never)[], deps: DependencyList) => {
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
