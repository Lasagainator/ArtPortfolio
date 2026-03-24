import React from 'react'
import ReactDOM from 'react-dom/client'
// change Browser -> Hash
import { createHashRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import RouterErrorPage from './components/RouterErrorPage.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouterErrorPage />,
    children: [
        { index: true, element: <Home /> },
        { path: 'project/:slug', element: <ProjectPage /> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
