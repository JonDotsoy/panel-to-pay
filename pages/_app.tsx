import type { AppProps /*, AppContext */ } from 'next/app'
import React from 'react'
import 'tailwindcss/tailwind.css'
import { AuthProvider } from '../components/auth.hook'
import { ChangesProvider } from '../components/charges.hook'
import { Temporal } from '@js-temporal/polyfill'

// @ts-ignore
globalThis.Temporal = Temporal

function MyApp({ Component, pageProps }: AppProps) {
  return <AuthProvider>
    <ChangesProvider>
      <Component {...pageProps} />
    </ChangesProvider>
  </AuthProvider>
}

export default MyApp