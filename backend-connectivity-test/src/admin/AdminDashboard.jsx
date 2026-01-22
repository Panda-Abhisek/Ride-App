import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminDashboard = () => {
  return (
    <>
      <h1>Admin Dashboard</h1>
      <Outlet />
    </>
  )
}

export default AdminDashboard