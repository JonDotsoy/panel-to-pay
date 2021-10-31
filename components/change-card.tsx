import React, { FC, useMemo } from 'react'
import { inspect } from 'util'
import { DocumentSnapshot } from 'firebase/firestore'
import { useChange } from './change.hook'
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

export const ChangeCard: FC<{ doc: DocumentSnapshot }> = ({ doc }) => {
  const data = useChange(doc);
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
        <button
          className={classNames(
            "transition-all flex border justify-center items-center px-4 py-2",
            {
              "bg-gray-50 text-gray-200 border-gray-100": !changed && !loadingUpdateCharge && !updated,
              "border-green-400 text-green-500": changed && !loadingUpdateCharge && !updated,
              "hover:border-green-400 hover:shadow-md hover:bg-green-400 hover:text-white": changed && !loadingUpdateCharge && !updated,
              "border-green-400 bg-green-400 text-white cursor-default": loadingUpdateCharge || updated,
              // "border-green-400 bg-green-400 text-white cursor-default": updated,
            },
          )}
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
        </button>
        <ButtonDeleteCharge doc={doc} />
      </div>
      {/* <Code src={{ changed, values:values.toJS() }}></Code> */}
    </form>
  </div>
}