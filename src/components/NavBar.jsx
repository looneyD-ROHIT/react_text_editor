import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

const NavBar = (props, ref) => {
    return (
    <>
        <div>
            <ul className="flex flex-row space-x-8 px-8 py-4 bg-gray-200">
                <li className="text-blue-500 underline hover:cursor-pointer hover:bg-blue-200"><Link to={''}>Home</Link></li>
                <li className="text-blue-500 underline hover:cursor-pointer hover:bg-blue-200"><Link to={'editor'}>Editor</Link></li>
                <li className="text-blue-500 underline hover:cursor-pointer hover:bg-blue-200"><Link to={'about'}>About</Link></li>
            </ul>
        </div>
        <div>
            <Outlet/>
        </div>
    </>
    )
}

export default NavBar;