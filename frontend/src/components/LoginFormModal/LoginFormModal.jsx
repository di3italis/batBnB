import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
// import './LoginFormModal.css'
import styles from "../../context/Modal.module.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(
            sessionActions.login({
                credential,
                password,
            })
        )
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                console.log("DATA!!!:", data);
                if (data?.message) setErrors({ message: data.message });
            });
        // return setErrors;
    };

    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <div className={styles.loginError}>
                    {errors.message && (
                        <e>The provided credentials were invalid</e>
                    )}
                </div>
                <button type="submit">Log In</button>
            </form>
        </>
    );
}

export default LoginFormModal;
