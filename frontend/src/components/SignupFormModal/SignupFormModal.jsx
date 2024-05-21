// SignupFormModal.jsx
import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import styles from '../../context/Modal.module.css'
// import styles from './SignupFormModal.css'

function SignupFormModal() {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [submittable, setSubmittable] = useState(false);
    const { closeModal } = useModal();
     const [inputs, setInputs] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });



    const validateForm = useCallback(() => {
        let isValid = true;

        if (!inputs.username.length || inputs.username.length < 4) {
            // setErrors(prevErrors => ({
            //     ...prevErrors,
            //     username: "Username must be at least 4 characters",
            // }));
            isValid = false;
        }
        for (let key in inputs) {
            if (!inputs[key].length) {
                // setErrors(prevErrors => ({
                //     ...prevErrors,
                //     [key]: `${key[0].toUpperCase() + key.slice(1)} required`,
                // }));
                isValid = false;
            }
        }
        if (inputs.password.length < 6) {
            setErrors(prevErrors => ({
                ...prevErrors,
                password:
                    "Password must be at least 6 characters",
            }));
            isValid = false;
        }
        if (inputs.password !== inputs.confirmPassword) {
            setErrors(prevErrors => ({
                ...prevErrors,
                confirmPassword:
                    "Confirm Password field must be the same as the Password field",
            }));
            isValid = false;
        } 

        setSubmittable(isValid);
        return isValid;
    }, [inputs]);

    useEffect(() => {
        validateForm();
    }, [inputs, validateForm]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        //if errors exist, remove them when user starts typing
        if (errors.name) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
        }   
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
            try {
                await dispatch(sessionActions.signup(inputs));
                closeModal();
            } catch (res) {
                const data = await res.json();
                if (data?.errors) {
                    setErrors(data.errors)
                    setSubmittable(false);
                    // clear inputs if there are errors
                    Object.keys(data.errors).forEach((key) => {
                        setInputs(prev => ({...prev, [key]: "" }));
                    });
                }
            }
    };

    // Form JSX
    return (
        <>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    {Object.entries(inputs).map(([key, value]) => (
                        <li key={key}>
                            <label>
                                <input 
                                    className={errors[key] ? styles.inputError : {} }
                                    type={key === "password" || key === "confirmPassword" ? "password" : "text"}
                                    name={key}
                                    placeholder={errors[key]? errors[key] : key[0].toUpperCase() + key.slice(1)}
                                    value={value}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                        </li>
                    ))}
                    <button className={`${!submittable ? styles.disabled : ""} `} type="submit" disabled={!submittable}>Sign Up</button>
                </ul>
            </form>
        </>
    );
}

export default SignupFormModal;
