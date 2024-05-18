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
                // console.log("DATA!!!:", data);
                if (data?.message) setErrors({ message: data.message });
            });
        // return setErrors;
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
                <div className={styles.loginError}>
                    {errors.message && (
                        <e>The provided credentials were invalid</e>
                    )}
                </div>
                <button className={styles.modalButton} type="submit">Log In</button>
                <button className={styles.modalButton} type="submit" onClick={handleDemoUserOnClick}>Demo User</button>
            </form>
        </>
    );
}

export default LoginFormModal;
