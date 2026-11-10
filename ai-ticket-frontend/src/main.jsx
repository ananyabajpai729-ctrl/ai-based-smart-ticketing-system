import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, Routes} from 'react-router-dom'
import CheckAuth from './components/CheckAuth.jsx'
import Tickets from "./pages/Tickets.jsx"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
        path = '/'
        element = {
          <CheckAuth protected= {true}>
            <Tickets></Tickets>
          </CheckAuth>
        }
         />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
