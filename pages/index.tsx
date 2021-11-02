import React, { FC, useEffect } from "react";
import Link from 'next/link'
import { useAuth } from "../components/auth.hook";
import { useCharges, useInitializePullCharges } from "../components/charges.hook";
import { PanelCharges } from "../components/panels/panel-charges";

export const IndexPage: FC = () => {
  useInitializePullCharges();

  const { user } = useAuth();

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
      {user && <PanelCharges user={user} />}
    </div>
  </>
}

export default IndexPage;
