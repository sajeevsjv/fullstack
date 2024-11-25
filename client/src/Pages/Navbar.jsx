import { Link } from "react-router-dom";
function Navbar() {
    return (
        <>
            <nav>
                <a href=""><Link to={'/adduser'}>Add User</Link></a>
                <a href=""><Link to={'/getallusers'}>Get All Users</Link></a>
                <a href=""><Link>Logout</Link></a>
            </nav>
        </>
    )
}
export default Navbar;