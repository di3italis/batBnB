import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import logo from "../../images/datum300.png";
import "./Navigation.css";
// import styles from "./Navigation.module.css";

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    return (
        <ul className="navContainer">
            <li>
               <NavLink to="/">
                    <div className="logoLink">
                        <img className="logo" src={logo} alt='BatBnB'/>
                    </div>
                </NavLink>
            </li>
            {sessionUser && <NavLink to="/myspot">Create a New Spot</NavLink>}
            {isLoaded && (
                    <li>
                        <ProfileButton user={sessionUser} />
                    </li>
            )}
        </ul>
    );
}

export default Navigation;
