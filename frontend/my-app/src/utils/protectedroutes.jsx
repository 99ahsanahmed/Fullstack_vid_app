import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";
import { useContext } from "react";
import Spinner from "../components/Spinner"
const ProtectedRoute = ()=>{
    const {user, loading} = useContext(AuthContext); // extracting user only from AuthContext
    if (loading) {
        return <Spinner/>
    }
    return user ? <Outlet /> : <Navigate to="/"  />; 
}

export default ProtectedRoute