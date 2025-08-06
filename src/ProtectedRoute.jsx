import React from 'react'
import { useAuth } from './context/AuthProvider'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const {user,loading}=useAuth();

    if (loading) {
        return (


           <div>
             <p>Checkinng Auth</p>
           </div>
        )
    }

    if (!user) {
            return <Navigate to="/login" replace/>
    }
  return  children
}

export default ProtectedRoute
