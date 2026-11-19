import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Navbar from "./components/Navbar.jsx";
import './index.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import CheckAuth from './components/CheckAuth.jsx'
import Tickets from "./pages/Tickets.jsx"
import Ticket from './pages/Ticket.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Admin from './pages/Admin.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path = '/'
          element = {
            <CheckAuth protectedRoute= {true}>
              <Tickets />
            </CheckAuth>
          }
        />
        <Route
          path = '/tickets/:id'
          element = {
            <CheckAuth protectedRoute= {true}>
              <Ticket />
            </CheckAuth>
          }
        />
        <Route
          path = '/login'
          element = {
            <CheckAuth protectedRoute= {false}>
              <Login />
            </CheckAuth>
          }
        />
        <Route
          path = '/signup'
          element = {
            <CheckAuth protectedRoute= {false}>
              <Signup />
            </CheckAuth>
          }
        />
        <Route
          path = '/admin'
          element = {
            <CheckAuth protectedRoute= {true}>
              <Admin />
            </CheckAuth>
          }
        />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
