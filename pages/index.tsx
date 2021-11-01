import React, { FC, useEffect } from "react";
import Link from 'next/link'
import { useAuth } from "../components/auth.hook";
import { ViewGridAddSolid } from "../components/icons/solid/view-grid-add";
import { ViewGridSolid } from "../components/icons/solid/view-grid";
import { useCharges } from "../components/charges.hook";
import { useCreateCharge } from "../components/create-charge.hook";
import { ChangeCard } from "../components/change-card";
import { SpinIcon } from "../components/spin-icon";
import { Button } from "../components/button";

export const IndexPage: FC = () => {
  const { user } = useAuth();
  const { loading, docs, pull } = useCharges();
  const { loading: loadingCreateChange, createCharge } = useCreateCharge();

  useEffect(() => {
    pull();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>
    <div className="container m-auto p-2" style={{ maxWidth: 900 }}>
      <div className="pb-10">
        {
          user
            ? <>
              <h1 className="text-7xl">Hello <span className="text-blue-500">{user.displayName}</span></h1>
              <div>
                <Link href="/sign-out">
                  <a className="text-2xl transition-all text-blue-400 hover:text-blue-600">Cerrar sesion</a>
                </Link>
              </div>
            </>
            : <>
              <h1 className="text-7xl">Hello, need to <Link href="/sign-in"><a className="text-blue-500">login</a></Link>.</h1>
            </>
        }
      </div>
      {
        user &&
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
              {loading && <span className="inline-flex justify-center items-center ml-4 text-gray-500 text-lg"><SpinIcon spinning className="mr-2" /> Loading...</span>}
            </h2>
          </div>

          <div>
            <div className="space-y-4">
              {docs.map(doc => <ChangeCard key={doc.id} doc={doc} />)}
            </div>
          </div>
        </>
      }
    </div>
  </>
}

export default IndexPage;
