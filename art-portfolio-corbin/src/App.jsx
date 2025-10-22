import React from 'react'
import { Outlet } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { LightboxProvider } from './components/Lightbox.jsx'

export default function App() {
  return (
    <LightboxProvider>
      <Layout>
        <Outlet />
      </Layout>
    </LightboxProvider>
  )
}
