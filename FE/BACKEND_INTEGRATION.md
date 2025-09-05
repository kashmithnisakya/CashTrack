# Backend API Integration

## Overview
CashTrack frontend now integrates with the backend API for authentication. The application uses JWT tokens for secure user sessions.

## API Endpoints Used

### Authentication
- **POST** `{{HOST}}/user/register/` - User registration
- **POST** `{{HOST}}/user/login/` - User login

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
```

For production, update the URL to your deployed backend:
```env
VITE_API_URL=https://your-api-domain.com
```

## Features Implemented

### ✅ **Authentication System**
- **JWT Token Management** - Automatic storage and retrieval
- **Session Persistence** - Login state persists across browser sessions
- **Token Expiration** - Automatic logout when token expires
- **Secure Storage** - Tokens stored in localStorage with validation

### ✅ **API Service Layer**
- **Centralized API calls** via `apiService`
- **Error handling** with proper error types
- **Request/Response logging** for debugging
- **Network error detection**

### ✅ **User Experience**
- **Loading states** during authentication
- **Error messages** for failed requests
- **Success notifications** for successful operations
- **Form validation** before API calls

### ✅ **Security Features**
- **Automatic token expiration** checking
- **Secure token storage** with validation
- **Error boundary** for API failures
- **Input validation** before sending to API

## API Response Format

### Login/Register Success Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "68bb53ee1268834cc9958557",
    "email": "user@example.com", 
    "root_id": "68bb53ee1268834cc9958556",
    "is_activated": true,
    "is_admin": false,
    "expiration": 1757150384,
    "state": "4jcIoRkZ"
  }
}
```

## File Structure

```
src/
├── types/
│   └── api.ts              # API type definitions
├── services/
│   └── api.ts              # API service layer
├── hooks/
│   └── use-auth.tsx        # Authentication context & hooks
├── components/
│   ├── LandingPage.tsx     # Updated with real API calls
│   └── Dashboard.tsx       # Shows authenticated user data
└── pages/
    └── Index.tsx           # Main app with auth routing
```

## Usage

### Starting Development
1. Ensure backend is running on `http://localhost:8000`
2. Start frontend: `npm run dev`
3. Access app at `http://localhost:8080`

### Testing Authentication
1. Try registering a new account
2. Check browser console for API request logs
3. Verify token is stored in localStorage
4. Test logout and login functionality

## Debugging

### Console Logs
The application provides detailed console logging:
- 🌐 **API Requests** - Shows HTTP method and URL
- 📊 **API Responses** - Shows status code
- ✅ **Success** - Shows successful operations
- ❌ **Errors** - Shows error details
- 🔑 **Auth Events** - Shows login/logout events

### Common Issues
1. **CORS Errors** - Ensure backend allows frontend domain
2. **Network Errors** - Check if backend is running
3. **401 Unauthorized** - Check token validity
4. **404 Not Found** - Verify API endpoints match backend

## Production Deployment
1. Update `VITE_API_URL` to production backend URL
2. Run `npm run build` 
3. Deploy `dist/` folder to your hosting service
4. Ensure backend accepts requests from your frontend domain