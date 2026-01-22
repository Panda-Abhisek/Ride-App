import React from 'react'
import { Outlet } from 'react-router-dom'

const DriverDashboard = () => {
  return (
    <>
      <h2>Driver Dashboard</h2>
      <Outlet />
    </>
  )
}

export default DriverDashboard;