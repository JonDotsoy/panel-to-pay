import React, { FC, useState } from "react";
import classNames from "classnames";
import { DocumentSnapshot } from "firebase/firestore";
import { useDeleteCharge } from "./delete-charge.hook";
import { CheckSolid } from "./icons/solid/check";
import { SpinIcon } from "./spin-icon";
import { TrashSolid } from "./icons/solid/trash";
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Button } from "./button";

export const ButtonDeleteCharge: FC<{ doc: DocumentSnapshot }> = ({ doc }) => {
  const { loading: deletingLoading, deleted, deleteCharge } = useDeleteCharge(doc);

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <Button
            className="flex justify-center items-center"
            typeStyle='danger-hover'
            disabled={(deletingLoading || deleted)}
          // onClick={() => deleteCharge()}
          >
            {
              deleted
                ? <><CheckSolid className="mr-2" /> Eliminado</>
                : <><SpinIcon spinning={deletingLoading} className="mr-2" ><TrashSolid className="mr-2" /></SpinIcon> Eliminar</>
            }
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content className="bg-gray-700 bg-opacity-30 fixed flex justify-center items-center inset-0">
          <div className="min-w-md w-auto bg-white p-5 shadow-lg rounded">
            <AlertDialog.Title className="">¿Estás seguro?</AlertDialog.Title>
            {/* <AlertDialog.Description>
              Ok
            </AlertDialog.Description> */}
            <div className="flex space-x-2 justify-end">
              <AlertDialog.Cancel asChild>
                <button
                  className={classNames(
                    "transition-all flex border justify-center items-center px-4 py-2",
                    "border-gray-300 hover:border-blue-400 hover:text-white hover:shadow-md hover:bg-blue-400",
                    "border-gray-300 focus:border-blue-400 focus:text-white focus:shadow-md focus:bg-blue-400",
                  )}
                >Cancelar</button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  className={classNames(
                    "transition-all flex border justify-center items-center px-4 py-2",
                    "border-gray-300 hover:border-red-400 hover:text-white hover:shadow-md hover:bg-red-400",
                    "border-gray-300 focus:border-red-400 focus:text-white focus:shadow-md focus:bg-red-400",
                  )}
                  onClick={() => deleteCharge()}
                >
                  <TrashSolid className="mr-2" />
                  Eliminar
                </button>
              </AlertDialog.Action>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  )
}
