import { User } from "firebase/auth";
import React, { FC } from "react";
import { Button } from "../button";
import { ChargeCard } from "../charge-card";
import { useCharges } from "../charges.hook";
import { useCreateCharge } from "../create-charge.hook";
import { ViewGridSolid } from "../icons/solid/view-grid";
import { ViewGridAddSolid } from "../icons/solid/view-grid-add";
import { SpinIcon } from "../spin-icon";

interface Props {
  user: User;
}

export const PanelCharges: FC<Props> = () => {
  const { loading, docs } = useCharges();
  const { loading: loadingCreateChange, createCharge } = useCreateCharge();

  return (
    <>
      <div className="pb-10">
        <Button
          typeStyle="secondary"
          className="flex justify-center items-center"
          disabled={loadingCreateChange}
          onClick={createCharge}
        >
          <span>Agregar Cobro</span>
          {loadingCreateChange && <ViewGridSolid className="ml-2 animate-spin" size="6" />}
          {!loadingCreateChange && <ViewGridAddSolid className="ml-2" size="6" />}
        </Button>
      </div>

      <div>
        <h2 className="text-2xl inline-flex justify-start items-end">
          <span className="inline-flex justify-start items-center">
            <ViewGridSolid className="mr-2" />
            Cobros
          </span>
          {
            loading &&
            <span className="inline-flex justify-center items-center ml-4 text-gray-500 text-lg"><SpinIcon spinning className="mr-2" /> Loading...</span>
          }
        </h2>
      </div>

      <div className="pb-2">
        <div className="space-y-4">
          {docs.map(doc => <ChargeCard key={doc.id} doc={doc} />)}
        </div>
      </div>
    </>
  )
}
