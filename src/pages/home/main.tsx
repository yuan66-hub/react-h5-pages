import React from 'react'
import 'normalize.css'
import { createRoot } from 'react-dom/client'
const root = document.getElementById('root')
const App = React.lazy(() => import('./App'))
if (root) {
  createRoot(root).render(<App />)
}
