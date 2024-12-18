import {Outlet,Navigate} from "react-router-dom"

const ProtectedRoutes = () => {
    const token = localStorage.getItem("jwtToken");
    const user= token?true:false;
    console.log("printing "+user);
  return user ? <Outlet/> : <Navigate to="/login"/>
}

export default ProtectedRoutes
