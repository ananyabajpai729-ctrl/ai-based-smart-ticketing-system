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
import Profile from "./pages/Profile.jsx";
import Mentors from "./pages/Mentor.jsx";
import CreateProject from "./pages/CreateProject.jsx";
import ProjectCandidates from "./pages/ProjectCandidates.jsx";
import MyProjects from "./pages/MyProjects.jsx";
import ProjectInvitations from "./pages/ProjectInvitations.jsx";
import SentProjectInvitations from "./pages/SentProjectInvitations.jsx";
import ProjectDetails from "./pages/ProjectDetails.jsx";
import ReceivedRequests from "./pages/ReceivedRequests.jsx";
import SentRequests from "./pages/SentRequests.jsx";
import AssignedTickets from "./pages/AssignedTickets.jsx";
import MentoringTickets from "./pages/MentoringTickets.jsx";
import AllTickets from "./pages/AllTickets.jsx";
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
        <Route
          path="/profile"
          element={
            <CheckAuth protectedRoute={true}>
              <Profile />
            </CheckAuth>
          }
        />
        <Route
          path="/mentors"
          element={
            <CheckAuth protectedRoute={true}>
              <Mentors />
            </CheckAuth>
          }
        />
        <Route
          path="/requests/received"
          element={
            <CheckAuth protectedRoute={true}>
              <ReceivedRequests />
            </CheckAuth>
          }
        />
        <Route
          path="/requests/sent"
          element={
            <CheckAuth protectedRoute={true}>
              <SentRequests />
            </CheckAuth>
          }
        />
        <Route
          path="/assigned"
          element={
            <CheckAuth protectedRoute={true}>
              <AssignedTickets />
            </CheckAuth>
          }
        />

        <Route
          path="/mentoring"
          element={
            <CheckAuth protectedRoute={true}>
              <MentoringTickets />
            </CheckAuth>
          }
        />

        <Route
          path="/all-doubts"
          element={
            <CheckAuth protectedRoute={true}>
              <AllTickets />
            </CheckAuth>
          }
        />
        <Route
            path="/projects/create"
            element={
                <CheckAuth protectedRoute={true}>
                    <CreateProject />
                </CheckAuth>
            }
        />

        <Route
            path="/my-projects"
            element={
                <CheckAuth protectedRoute={true}>
                    <MyProjects />
                </CheckAuth>
            }
        />
        <Route
            path="/projects/:projectId/candidates"
            element={
                <CheckAuth protectedRoute={true}>
                    <ProjectCandidates />
                </CheckAuth>
            }
        />
        <Route
            path="/project-invitations"
            element={
                <CheckAuth protectedRoute={true}>
                    <ProjectInvitations />
                </CheckAuth>
            }
        />
        <Route
            path="/sent-project-invitations"
            element={
                <CheckAuth protectedRoute={true}>
                    <SentProjectInvitations />
                </CheckAuth>
            }
        />
        <Route
            path="/projects/:projectId"
            element={
                <CheckAuth protectedRoute={true}>
                    <ProjectDetails />
                </CheckAuth>
            }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
