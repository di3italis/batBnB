//LoginFormModal.jsx
import { useState, useEffect, useCallback } from "react";
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
    const [submittable, setSubmittable] = useState(false);
    const { closeModal } = useModal();

    const validateForm = useCallback(() => {
        let isValid = true;
        const newErrors = {};

        if (credential.length < 4) {
            newErrors.credential = "Username or Email must be at least 4 characters";
            isValid = false;
        }
        if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setErrors(newErrors);
        setSubmittable(isValid);
        // console.log("submittalbe:", submittable)
        return isValid;
    }, [credential, password]);

    useEffect(() => {
        validateForm();
    }, [credential, password, validateForm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        return dispatch(
            sessionActions.login({
                credential,
                password,
            }),
        )
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                console.log("DATA!!!:", data);
                if (data?.message) {
                    setErrors(...data.errors);
                    setSubmittable(false);
                }
            });
    };

    const handleDemoUserOnClick = () => {
        return dispatch(
            sessionActions.login({
                credential: "Demo-lition",
                password: "password",
            })
        ).then(() => {
            closeModal();
        });
    };

    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username or Email"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className={styles.error}>
                    {errors.message && (
                        <h5>The provided credentials were invalid</h5>
                    )}
                    {errors.credential && <h5>{errors.credential}</h5>}
                    {errors.password && <h5>{errors.password}</h5>}
                </div>
                <button className={`${styles.modalButton} ${!submittable ? styles.disabled : ""}`} 
                    type="submit" 
                    disabled={!submittable}>
                    Log In
                </button>
                <button
                    className={styles.modalButton}
                    type="submit"
                    onClick={handleDemoUserOnClick}
                >
                    Demo User
                </button>
            </form>
        </>
    );
}

export default LoginFormModal;
