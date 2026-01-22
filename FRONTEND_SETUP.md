# Setup Guide - Ride Sharing Application

## Project Overview

This is a React 19.2.0 frontend application for a ride-sharing service that connects to a backend API server. The application supports three user roles: Riders, Drivers, and Administrators.

## Prerequisites

- **Node.js 18+** (required for Vite 7.x)
- **npm** (comes with Node.js)
- **Backend API server** running on `http://localhost:8080`
- **Google Maps API key** for mapping functionality

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# Copy from example if available
cp .env.example .env
```

Add your Google Maps API key to `.env`:

```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Get your API key from: https://developers.google.com/maps/documentation/javascript/get-api-key

### 3. Backend Setup

Ensure your backend API server is running on `http://localhost:8080`. The frontend requires the following:

- **CORS configured** to allow requests from the frontend (typically `http://localhost:5173`)
- **Session management** with cookie support
- **API endpoints** for authentication, rides, drivers, users, and admin operations

### 4. Run Development Server

```bash
npm run dev
```

The application will typically start at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (outputs to `dist/` folder)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint code linting

## Application Features

### User Roles & Routes

- **RIDER** (`/rider/*`)
  - Request rides
  - View ride history
  - Manage profile

- **DRIVER** (`/driver/*`)
  - View allocated rides
  - Accept/decline ride requests
  - Manage driver profile

- **ADMIN** (`/admin/*`)
  - Manage users and drivers
  - View system statistics
  - Administrative operations

### Core Functionality

- **Authentication** with session-based login/logout
- **Role-based access control** for protected routes
- **Google Maps integration** for location services
- **Real-time ride management** system
- **User profiles** and ride history tracking
- **Admin dashboard** for system management

## Configuration Details

### Backend Requirements

Your backend must implement these API patterns:

```
Authentication:
POST /api/auth/signin
POST /api/auth/signout
GET  /api/auth/user

Rides:
GET    /api/rides
POST   /api/rides
GET    /api/rides/:id
PATCH  /api/rides/:id

Drivers:
GET    /api/drivers/rides
PATCH  /api/drivers/rides/:id

Users:
GET    /api/users/profile
PUT    /api/users/profile

Admin:
GET    /api/admin/stats
GET    /api/admin/users
GET    /api/admin/drivers
GET    /api/admin/rides
```

### CORS Configuration

Backend must accept:
- **Origin**: `http://localhost:5173` (or your Vite dev server port)
- **Credentials**: `true` (for session cookies)

### Google Maps APIs

Ensure these APIs are enabled in your Google Cloud Console:
- Maps JavaScript API
- Places API (for location search functionality)

## Troubleshooting

### Common Issues

**Backend Connection Errors**
- Verify backend is running on port 8080
- Check browser Network tab for failed API requests

**CORS Errors**
- Ensure backend allows requests from your frontend origin
- Verify credentials are enabled in CORS config

**Google Maps Errors**
- Confirm API key is valid and properly configured
- Check that required APIs are enabled in Google Cloud Console

**Authentication Issues**
- Verify session handling in backend
- Check that cookies are being sent with requests (`withCredentials: true`)

### Development Tips

- Use browser DevTools to monitor API calls
- Check console for authentication state and API errors
- Vite handles most development configuration automatically

## Production Deployment

For production deployment:

1. **Update backend URL** in `src/api/axios.js` to point to production backend
2. **Set environment variables** for production
3. **Configure HTTPS** for secure connections
4. **Optimize Google Maps usage** to control API costs
5. **Consider implementing error boundaries** for better error handling

## Project Structure

```
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/         # Page components for each route
│   ├── api/           # API configuration and utilities
│   ├── context/       # React context providers
│   ├── hooks/         # Custom React hooks
│   └── utils/         # Helper functions
├── public/            # Static assets
└── dist/              # Production build output
```

This frontend is designed as a comprehensive connectivity test for a ride-sharing backend system with full user role management and real-time features.