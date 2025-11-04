import React from 'react'
import { Outlet } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { LightboxProvider } from './components/Lightbox.jsx'
import { DetailCardProvider } from './components/DetailCard.jsx'

export default function App() {
  return (
    <DetailCardProvider>
      <LightboxProvider>
        <Layout>
          <Outlet />
        </Layout>
      </LightboxProvider>
    </DetailCardProvider>
  )
}
