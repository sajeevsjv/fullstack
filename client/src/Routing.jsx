import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddUser from "./Pages/AddUser";
import Login from "./Pages/Login";
import GetAllUsers from "./Pages/GetAllUsers";
import GetSingleUser from "./Pages/GetSingleUser";
// import FetchUserData from "./Pages/FetchUserDatas";
// import { Outlet } from "react-router-dom";

// function UserRoutesWrapper() {
//     return (
//         <FetchUserData>
//             <Outlet />  {/* This will render the nested child routes */}
//         </FetchUserData>
//     );
// }


function Routing() {

    return (
        <>
            <Router>
                <Routes>
                    <Route path={"/"} exact element={<Login />} />
                    <Route path={"/adduser"} exact element={<AddUser />} />
                    <Route path={"/getallusers"} exact element={<GetAllUsers />} />
                    <Route path={"/getsingleuser/:id"} exact element={<GetSingleUser />} />

    
                </Routes>
            </Router>

        </>
    )

}
export default Routing;