// CreateSpot.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as spotActions from "../../store/spots";
import { useNavigate } from "react-router-dom";
import styles from "./CreateSpot.module.css";

export default function CreateSpot() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const spot = null;
    const update = false; 
    const [formData, setFormData] = useState({
        country: "",
        address: "",
        city: "",
        state: "",
        lat: "",
        lng: "",
        description: "",
        name: "",
        price: "",
        previewImg: "",
        img2: "",
        img3: "",
        img4: "",
        img5: "",
    });

    // inputs to  be refactored into useForm.js
    const inputNames = Object.keys(formData);


    const placeholders = [
        "Country",
        "Address",
        "City",
        "State",
        "Latitude",
        "Longitude",
        "Please write at least 30 characters", // no label
        "Name",
        "Price per night (USD)", // no label
        "Preview Image URL", // no label
        "Image URL", // no label
        "Image URL", // no label
        "Image URL", // no label
        "Image URL", // no label
    ];

    // const inputs = inputNames.map((name, index) => ({
    //     name,
    //     label: (index === 6 || index > 7) ? null :
    //             (index === 1) ? "Street Address" :
    //             placeholders[index],
    //     placeholder: update ? spot[name] : placeholders[index],
    //     // type: type[index],
    //     type: name === 'description' ? 'textarea' :
    //           name === 'price' ? 'number' :
    //           'text',
    // }));



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const fieldCheck = {};

        Object.keys(formData).forEach((key) => {
            if (!formData[key].length) {
                if (key === "description") {
                    fieldCheck[key] = "Please write at least 30 characters";
                } else if (key === "previewImg") {
                    fieldCheck[key] = "Preview image is required";
                } else if (key === "lat") {
                    fieldCheck[key] = "Latitude is required";
                } else if (key === "lng") {
                    fieldCheck[key] = "Longitude is required";
                } else if (key.slice(0, 3) !== "img") {
                    fieldCheck[key] = `${key[0].toUpperCase()}${key.slice(
                        1
                    )} is required`;
                }
            }
            if (formData[key].length && (key === "previewImg" || key.slice(0, 3) === "img") && !formData[key].match(/\.(png|jpe?g)$/i)) {
                fieldCheck[key] = "Image URL must end in .png, .jpg, or .jpeg.";
            }
        });

        const urls = [
            formData.previewImg,
            formData.img2,
            formData.img3,
            formData.img4,
            formData.img5,
        ];

        if (!Object.keys(fieldCheck).length) {
            const payload = {};
            Object.entries(formData).forEach(([key, value]) => {
                // Corrected this line
                if (key !== "previewImg" && key.slice(0, 3) !== "img") {
                    payload[key] = value;
                }
            });
            console.log("payload:", payload);
            // Moved this line inside the if condition to ensure it's executed only when there are no errors
            const newSpot = await dispatch(spotActions.postSpotThunk(payload)); // lets go bake this cake

            const newSpotId = Number(newSpot?.id);

            if (!isNaN(newSpotId)) {
                const imagePayloads = urls.map((url, index) => ({
                    url,
                    preview: index === 0
                }));
                imagePayloads.forEach((payload) => {
                    dispatch(spotActions.postImageThunk(newSpotId, payload));
                });
                navigate(`/spots/${newSpotId}`);
            } else {
                console.error("Invalid spot id", newSpotId);
            }

            // check this
            // if (!newSpot?.message) 
            navigate(`/spots/${newSpotId}`);
            // } else console.log(newSpot.message);
        }

        setErrors(fieldCheck);
    };

    const inputs = inputNames.map((name, index) => (
        <div key={name} className={styles[name]}>
            {(index !== 6 && index <= 7) && <label htmlFor={name}>{placeholders[index]}</label>}
            {name === "description" ? (
                <textarea
                    name={name}
                    value={formData[name]}
                    placeholder={placeholders[index]}
                    onChange={handleInputChange}
                />
            ) : (
                <input
                    name={name}
                    type={name === "price" ? "number" : "text"}
                    value={formData[name]}
                    placeholder={placeholders[index]}
                    onChange={handleInputChange}
                />
            )}
            {errors[name] && <span className={styles.error}>{errors[name]}</span>}
        </div>
    ));

    return (
        <div className={styles.createSpotPage}>
            <div className={styles.createSpotContainer}>
                <h2 id="title">Create a new Spot</h2>
                <h3>Where's your spot located?</h3>
                <p>Guests will only get your exact address once they booked a reservation.</p>
                <div className={styles.formContainer}>
                <form className={styles.form} onSubmit={handleSubmit}>

                    {inputs[0]}
                    {inputs[1]}
                    {inputs[2]}
                    {inputs[3]}
                    <div className={styles.latlng}>
                    {inputs[4]}
                    {inputs[5]}
                    </div>
                    <h3>Describe your place to guests</h3>
                    <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                    {inputs[6]}
                    <h3>Create a title for your spot</h3>
                    <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    {inputs[7]}
                    <h3>Set a base price for your spot</h3>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    {inputs[8]}
                    <h3>Liven up your spot with photos</h3>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    {inputs[9]}
                    {inputs[10]}
                    {inputs[11]}
                    {inputs[12]}
                    {inputs[13]}
                    <button className={styles.button} type="submit">
                        Create Spot
                    </button>
                </form>
                </div>
            </div>
        </div>
    );

} // default
