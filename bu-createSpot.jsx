import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "./store/spots";
import { useNavigate } from "react-router-dom";

export default function MySpotPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const ownerId = useSelector((state) => state.session.user.id);
    const [formData, setFormData] = useState({
        country: "",
        address: "",
        city: "",
        state: "",
        lat: "",
        lng: "",
        name: "",
        description: "",
        price: "",
        previewImg: "",
        img2: "",
        img3: "",
        img4: "",
        img5: "",

    });
    const [errors, setErrors] = useState({});

    const inputs = [
        { name: 'country', label: 'Country', type: 'text' },
        { name: 'address', label: 'Street Address', type: 'text' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'state', label: 'State', type: 'text' },
        { name: 'lat', label: 'Latitude', type: 'text' },
        { name: 'lng', label: 'Longitude', type: 'text' },
        { name: 'name', label: 'Name of your spot', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'price', label: 'Price per night (USD)', type: 'number' },
        { name: 'previewImg', label: 'Preview Image URL', type: 'text' },
        { name: 'img2', label: 'Image URL', type: 'text' },
        { name: 'img3', label: 'Image URL', type: 'text' },
        { name: 'img4', label: 'Image URL', type: 'text' },
        { name: 'img5', label: 'Image URL', type: 'text' },
    ];

    // const locationSection = [
    //     { name: 'country', label: 'Country', type: 'text' },
    //     { name: 'address', label: 'Street Address', type: 'text' },
    //     { name: 'city', label: 'City', type: 'text' },
    //     { name: 'state', label: 'State', type: 'text' },
    //     { name: 'lat', label: 'Latitude', type: 'text' },
    //     { name: 'lng', label: 'Longitude', type: 'text' },
    // ];
    //
    // const descriptionSection = [
    //     { name: 'description', label: 'Description', type: 'textarea' },
    // ];
    //
    // const nameSection = [
    //     { name: 'name', label: 'Name of your spot', type: 'text' },
    // ];
    //
    // const priceSection = [
    //     { name: 'price', label: 'Price per night (USD)', type: 'number' },
    // ];
    //
    // const imageSection = [
    //     { name: 'previewImg', label: 'Preview Image URL', type: 'text' },
    //     { name: 'img2', label: 'Image URL', type: 'text' },
    //     { name: 'img3', label: 'Image URL', type: 'text' },
    //     { name: 'img4', label: 'Image URL', type: 'text' },
    //     { name: 'img5', label: 'Image URL', type: 'text' },
    // ];
    //
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));

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
                    fieldCheck[key] = "Preview image is required"
                } else if (key.slice(0,3) !== "img") {
                    fieldCheck[key] = `${key[0].toUpperCase()} is required`;
                }
            }
        });

        const urlValidator = (url) => {
            const regex = /\.(png|jpe?g)$/i;
            return regex.test(url);
        };

        const urls = [formData.previewImg, formData.img2, formData.img3, formData.img4, formData.img5];

        const urlErrors = urls.forEach((url, index) => {
            if (!urlValidator(url) && url) {
                fieldCheck[url] = "Please submit a valid image URL."
            }
        });

        if (!Object.keys(fieldCheck).length) {
            const payload = {};
            Object.entries(formData)((key, value) => {
                if (key !== "previewImg" && key.slice(0,3) !== "img") {
                    payload[key] = value;
                }
            });
            };

            const newSpot = await dispatch(spotActions.postSpot(payload)); // lets go bake this cake

            const newSpotId = newSpot?.id;

            const imagePayload = {
                    urls.forEach((url, index) => {
                        if (url) {
                            dispatch(
                                spotActions.postImage({
                                    url,
                                    preview: index === 0 ? true : false,
                                    spotId: newSpotId,
                                })
                            );
                        }
                    });
            };

            // check this
            // if (!newSpot?.message) {
                navigate(`/spots/${newSpot.id}`);
            // } else console.log(newSpot.message);

        setErrors(fieldCheck);
    }; //handleSubmit

    return (
        <div className={styles.createSpotPage}>
            <form className={styles.createSpotForm} onSubmit={handleSubmit}>
                <section className={styles.formSection}>
                    <h1>Create a newSpot</h1>
                    <h3>Where&apos;s your spot located?</h3>
                    <p>
                        Guests will only get your exact address once they booked a reservation.
                    </p>
                    <div className={styles.inputs}>
                        {inputs.map((input) => (
                            <label htmlFor={input.name} key={input.name}>
                                {input.label + " "}{errors[input.name] && <span className={styles.e}>{errors[input.name]}</span>}
                                <input
                                    name={input.name}
                                    type={input.type}
                                    value={formData[input.name]}
                                    placeholder={input.label}
                                    onChange={handleInputChange}
                                />
                            </label>

                        ))}
                    </div>
                </section>
                <section className={styles.formSection}>
                    <h3>Describe your place to guests</h3>
                    <p>
                        Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.
                    </p>
                    <div className={styles.inputs}>
                        {descriptionSection.map((input) => (
                                <textarea
                                    name={input.name}
                                    type={input.type}
                                    value={formData[input.name]}
                                    placeholder={input.label}
                                    onChange={handleInputChange}
                                />
                            {errors[input.name] && <span className={styles.errorMsg}>{errors[input.name]}</span>}
                        ))}
                    </div>
                </section>
                <section className={styles.formSection}>
                    <h3>Create a title for your spot</h3>
                    <p>
                       Catch guests' attention with a spot title that highlights what makes your place special. 
                    </p>
                    <div className={styles.inputs}>
                        {nameSection.map((input) => (
                            <input
                                name={input.name}
                                type={input.type}
                                value={formData[input.name]}
                                placeholder={input.label}
                                onChange={handleInputChange}
                            />
                            {errors[input.name] && <span className={styles.errorMsg}>{errors[input.name]}</span>}
                        ))}
                    </div>
                </section>
                <section className={styles.formSection}>
                    <h3>Set a base price for your spot</h3>
                    <p>
                        Competitive pricing can help your listing stand out and rank higher in search results.
                    </p>
                    <div className={styles.inputs}>
                        {priceSection.map((input) => (
                            ${" "}
                            <input
                                name={input.name}
                                type={input.type}
                                value={formData[input.name]}
                                placeholder={input.label}
                                onChange={handleInputChange}
                            />
                            {errors[input.name] && <span className={styles.errorMsg}>{errors[input.name]}</span>}
                        ))}
                    </div>
                </section>
                <section className={styles.formSection}>
                    <h3>Show off your spot with photos</h3>
                    <p>
                        First impressions matter! Upload photos that showcase your spot's best features.
                    </p>
                    <div className={styles.inputs}>
                        {imageSection.map((input) => (
                            <input
                                name={input.name}
                                type={input.type}
                                value={formData[input.name]}
                                placeholder={input.label}
                                onChange={handleInputChange}
                            />
                            {errors[input.name] && <span className={styles.errorMsg}>{errors[input.name]}</span>}
                        ))}
                    </div>
            </form>
        </div>
    )
}; // default

