import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import logo from "../../images/whiteTrans.png";
import "./Navigation.css";
// import styles from "./Navigation.module.css";

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    return (
        <ul className="navContainer">
            <li>
                <NavLink to="/">
                    <div className="logoLink">
                        <img className="logo" src={logo} alt="BatBnB" />
                    </div>
                </NavLink>
            </li>
            <ul className="navLinks">
            <li>
                {sessionUser && (
                    <NavLink className="createSpot" to="/create-spot">
                        Create a New Spot
                    </NavLink>
                )}
            </li>
            <li>
                <ProfileButton user={sessionUser} />
            </li>
            </ul>
        </ul>
    );
}

export default Navigation;
