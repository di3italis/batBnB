// UpdateSpot.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import * as formActions from "../../hooks/useForm";
import * as spotActions from "../../store/spots";
import styles from "./UpdateSpot.module.css";

export default function UpdateSpot() {
    const dispatch = useDispatch();
    const { spotId: spotIdParam } = useParams();
    const spotId = Number(spotIdParam);
    const spot = useSelector((state) => state.spots[spotId]);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(spotActions.getSpotDetailsThunk(spotId));
    }, [dispatch, spotId]);

    // const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    // const update = true;
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

    useEffect(() => {
        const fetchSpot = async () => {
            await dispatch(spotActions.getSpotDetailsThunk(spotId));
            // setLoading(false);
        };
        if (!spot) {
            fetchSpot();
        } else {
            if (spot.SpotImages) {
                setFormData({
                    country: spot?.country,
                    address: spot?.address,
                    city: spot?.city,
                    state: spot?.state,
                    lat: spot?.lat.toString(),
                    lng: spot?.lng.toString(),
                    description: spot?.description,
                    name: spot?.name,
                    price: spot?.price.toString(),
                    previewImg: spot?.SpotImages[0]?.url,
                    img2: spot?.SpotImages[1]?.url || "",
                    img3: spot?.SpotImages[2]?.url || "",
                    img4: spot?.SpotImages[3]?.url || "",
                    img5: spot?.SpotImages[4]?.url || "",
                });
                // setLoading(false);
            }
        }
    }, [dispatch, spotId, spot /*setFormData*/]);

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // inputs to  be refactored into useForm.js
    const inputNames = Object.keys(formData);

    // const placeholders = [
    //     "Country",
    //     "Address",
    //     "City",
    //     "State",
    //     "Latitude",
    //     "Longitude",
    //     "Please write at least 30 characters", // no label
    //     "Name",
    //     "Price per night (USD)", // no label
    //     "Preview Image URL", // no label
    //     "Image URL", // no label
    //     "Image URL", // no label
    //     "Image URL", // no label
    //     "Image URL", // no label
    // ];

    // const inputs = inputNames.map((name, index) => ({
    //     name,
    //     label: (index === 6 || index > 7) ? null :
    //             (index === 1) ? "Street Address" :
    //             placeholders[index],
    //     placeholder: update && spot ? spot[name] : placeholders[index],
    //     // type: type[index],
    //     type:
    //         name === "description"
    //             ? "textarea"
    //             : index === 4 || index === 5 || index === 8
    //             ? "number"
    //             : "text",
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
            if (
                formData[key].length &&
                (key === "previewImg" || key.slice(0, 3) === "img") &&
                !formData[key].match(/\.(png|jpe?g)$/i)
            ) {
                fieldCheck[key] = "Image URL must end in .png, .jpg, or .jpeg.";
            }
        });

        if (!Object.keys(fieldCheck).length) {
            const payload = {};
            Object.entries(formData).forEach(([key, value]) => {
                // Corrected this line
                if (key !== "previewImg" && key.slice(0, 3) !== "img") {
                    payload[key] = value;
                }
            });
            const ownerId = spot.ownerId;
            payload.ownerId = ownerId;
            console.log("payload:", payload);
            // Moved this line inside the if condition to ensure it's executed only when there are no errors
            dispatch(spotActions.updateSpotThunk(payload, spotId));
            navigate(`/spots/${spotId}`);
        }

        setErrors(fieldCheck);
    };

    const inputs = inputNames.map((name) => (
        <div key={name} className={styles[name]}>
            {(name !== "description" && name !== "previewImg" && name.slice(0, 3) !== "img") && (
                <label htmlFor={name}>
                    {name[0].toUpperCase() + name.slice(1)}
                </label>
            )}
            {name === "description" ? (
                <textarea
                    name={name}
                    value={formData[name]}
                    placeholder={spot ? spot[name] : ""}
                    onChange={handleInputChange}
                />
            ) : (
                <input
                    name={name}
                    type={name === "price" ? "number" : "text"}
                    value={formData[name]}
                    placeholder={spot ? spot[name] : ""}
                    onChange={handleInputChange}
                />
            )}
            {errors[name] && <span className={styles.error}>{errors[name]}</span>}
        </div>
    ));


        return (
        <div className={styles.updateSpotPage}>
            <div className={styles.updateSpotContainer}>
                <h2 id="title">Update your Spot</h2>
                <h3>Where&apos;s your spot located?</h3>
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
                    <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
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
