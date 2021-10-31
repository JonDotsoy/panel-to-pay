import type { AppProps /*, AppContext */ } from 'next/app'
import React from 'react'
import 'tailwindcss/tailwind.css'
import { AuthProvider } from '../components/auth.hook'
import { ChangesProvider } from '../components/charges.hook'

function MyApp({ Component, pageProps }: AppProps) {
  return <AuthProvider>
    <ChangesProvider>
      <Component {...pageProps} />
    </ChangesProvider>
  </AuthProvider>
}

export default MyApp