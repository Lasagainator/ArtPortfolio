
import React from 'react'
import { Outlet } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Outlet />
    </Layout>
  )
}
