import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
// import './SignupFormModal.css'
import "../../context/Modal.css";

function SignupFormModal() {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();


    const handleSubmit = (e) => {
        e.preventDefault();
        //start
        if (password !== confirmPassword) {
            setErrors({
                ...errors,
                confirmPassword:
                    "Confirm Password field must be the same as the Password field",
            });
            //end
        } else {
            //new 240410
            setErrors({});
            return dispatch(
                sessionActions.signup({
                    username,
                    firstName,
                    lastName,
                    email,
                    password,
                })
            )
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    if (data?.errors) setErrors(data.errors);
                });
        }
        return setErrors;
    };

    // Form JSX
    return (
        <>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    <li>
                        <label>
                            Username
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            {errors.username && <p>{errors.username}</p>}
                        </label>
                    </li>
                    <li>
                        <label>
                            First Name
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            {errors.firstName && <p>{errors.firstName}</p>}
                        </label>
                    </li>
                    <li>
                        <label>
                            Last Name
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                            {errors.lastName && <p>{errors.lastName}</p>}
                        </label>
                    </li>
                    <li>
                        <label>
                            Email
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {errors.email && <p>{errors.email}</p>}
                        </label>
                    </li>
                    <li>
                        <label>
                            Password
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {errors.password && <p>{errors.password}</p>}
                        </label>
                    </li>
                    <li>
                        <label>
                            Confirm Password
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />
                            {errors.confirmPassword && (
                                <p>{errors.confirmPassword}</p>
                            )}
                        </label>
                    </li>
                    <button type="submit">Sign Up</button>
                </ul>
            </form>
        </>
    );
}

export default SignupFormModal;
