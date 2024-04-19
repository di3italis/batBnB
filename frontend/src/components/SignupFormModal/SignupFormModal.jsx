import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import styles from './SignupFormModal.css'

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
                            <input
                                type="text"
                                placeholder={errors.username ? errors.username : "Username"}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            {errors.username && <e className={styles.e}>{errors.username}</e>}
                    </li>
                    <li>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            {errors.firstName && <e>{errors.firstName}</e>}
                    </li>
                    <li>
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                            {errors.lastName && <e>{errors.lastName}</e>}
                    </li>
                    <li>
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {errors.email && <e>{errors.email}</e>}
                    </li>
                    <li>
                            <input
                                type="text"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {errors.password && <e>{errors.password}</e>}
                    </li>
                    <li>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />
                            {errors.confirmPassword && (
                                <e>{errors.confirmPassword}</e>
                            )}
                    </li>
                    <button type="submit">Sign Up</button>
                </ul>
            </form>
        </>
    );
}

export default SignupFormModal;
