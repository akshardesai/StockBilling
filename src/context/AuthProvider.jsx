import React, { createContext, useContext, useEffect, useState } from 'react'
import { account } from '../utils/appWrite'


const AuthContext = createContext()
const AuthProvider = ({children}) => {
  const [user,setUser]=useState(null)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    account.get()
    .then(setUser)
    .catch(()=>setUser(null))
    .finally(()=>setLoading(false))
  },[])


  
  return (
    
    <AuthContext.Provider value = {{user,setUser,loading}}>
    {children}
    </AuthContext.Provider>
  )
}

export const useAuth = ()=>useContext(AuthContext)

export default AuthProvider
