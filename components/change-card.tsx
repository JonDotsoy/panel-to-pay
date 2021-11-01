import React, { FC, useMemo } from 'react'
import { inspect } from 'util'
import { DocumentSnapshot } from 'firebase/firestore'
import { useCharge } from './charge.hook'
import { useValuesChanges } from './values-changes'
import { ButtonDeleteCharge } from './button-delete-charge'
import classNames from 'classnames'
import { SaveSolid } from './icons/solid/save'
import { useUpdateCharge } from './update-charge.hook'
import { SpinIcon } from './spin-icon'
import { CheckSolid } from './icons/solid/check'
import { InputSelectRepeats } from './input-select-repeats'
import { dateFormat } from './date-format'
import { Code } from './code'
import { Button } from './button'

export const ChangeCard: FC<{ doc: DocumentSnapshot }> = ({ doc }) => {
  const data = useCharge(doc);
  const { changed, set, values } = useValuesChanges(data, ['name', 'period'], [doc]);
  const { loading: loadingUpdateCharge, updated, updateCharge } = useUpdateCharge(doc);

  if (!data) return <div>Sin info</div>;

  const { name, createdAt, period } = data;

  return <div className="border p-4">
    <form
      onSubmit={e => {
        e.preventDefault();
        updateCharge(values.toJS());
      }}
    >
      <div>
        <input
          type="text"
          name="name"
          defaultValue={name}
          onChange={(e) => set('name')(e.target.value)}
          className={classNames(
            "w-full border p-2 border-gray-200",
            "hover:border-gray-300"
          )}
          placeholder="Titulo Cobro"
          autoComplete="off"
        />
      </div>
      <div>
        <InputSelectRepeats
          defaultValue={period}
          onChange={(value) => set('period')(value)}
        />
      </div>
      {changed && <div>* Con cambios</div>}
      <div className="text-sm text-gray-500">
        Creado el {dateFormat.format(createdAt)}
        {data.updatedAt && <> y actualizado por ultima vez el {dateFormat.format(data.updatedAt)}</>}
      </div>
      <div className="flex space-x-2">
        <Button
          className={classNames(
            "transition-all flex justify-center items-center",
          )}
          typeStyle={!changed ? 'disabled' : 'primary'}
          disabled={!changed}
        >
          {
            updated
              ? <>
                <CheckSolid className="mr-2" />
                Cambio guardados
              </>
              : <>
                <SpinIcon className="mr-2" spinning={loadingUpdateCharge}><SaveSolid className="mr-2" /></SpinIcon>
                Guardar Cambios
              </>
          }
        </Button>
        <ButtonDeleteCharge doc={doc} />
      </div>
      {/* <Code src={{ changed, values:values.toJS() }}></Code> */}
    </form>
  </div>
}