import React, { FC } from "react";
import classNames from "classnames";
import { DocumentSnapshot } from "firebase/firestore";
import { useDeleteCharge } from "./delete-charge.hook";
import { CheckSolid } from "./icons/solid/check";
import { SpinIcon } from "./spin-icon";
import { TrashSolid } from "./icons/solid/trash";

export const ButtonChargeCharge: FC<{ doc: DocumentSnapshot }> = ({ doc }) => {
  const { loading: deletingLoading, deleted, deleteCharge } = useDeleteCharge(doc);

  return (
    <button
      className={classNames(
        "transition-all flex border justify-center items-center px-4 py-2",
        {
          "border-gray-300 hover:border-red-400 hover:text-white hover:shadow-md hover:bg-red-400": !deletingLoading && !deleted,
          "border-red-400 text-white bg-red-400 cursor-default": deletingLoading && !deleted,
          "bg-green-400 text-white cursor-default": deleted,
        },
      )}
      disabled={deletingLoading || deleted}
      onClick={() => deleteCharge()}
    >
      {
        deleted
          ? <><CheckSolid className="mr-2" /> Eliminado</>
          : <><SpinIcon spinning={deletingLoading} className="mr-2" ><TrashSolid className="mr-2" /></SpinIcon> Eliminar</>
      }
    </button>
  )
}
