import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import as spotActions from "./store/spots";
import { useNavigate } from "react-router-dom";

export default function CreateSpot() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const ownerId = useSelector((state) => state.session.user.id);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [lat, setLat] = useState();
    const [lng, setLng] = useState();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState();
    const [previewImg, setPreviewImg] = useState("");
    const [img2, setImg2] = useState("");
    const [img3, setImg3] = useState("");
    const [img4, setImg4] = useState("");
    const [img5, setImg5] = useState("");
    const [errors, setErrors] = useState({});

    const HandleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const fieldCheck = {};

        if (!address.length) {
            fieldCheck.address = "Address is required";
        }
        if (!city.length) {
            fieldCheck.city = "City is required";
        }
        if (!state.length) {
            fieldCheck.state = "State is required";
        }
        if (!country.length) {
            fieldCheck.country = "Country is required";
        }
        if (!lat) {
            fieldCheck.lat = "Latitude is required";
        }
        if (!lng) {
            fieldCheck.lng = "Longitude is required";
        }
        if (!name.length) {
            fieldCheck.name = "Name is required";
        }
        if (!price) {
            fieldCheck.price = "Price is required";
        }
        if (!previewUrl.length) {
            fieldCheck.previewUrl = "Preview image is required";
        }
        if (description.length < 30) {
            fieldCheck.description =
                "Description needs a minimum of 30 characters";
        }

        const urlValidator = (url) => {
            const regex = /\.(png|jpe?g)$/i;
            return regex.test(url);
        };

        const urls = [previewImg, img2, img3, img4, img5];

        urls.forEach((url, index) => {
            if (!urlValidator && url.length) {
                fieldCheck[url]] = "Please submit a valid image URL."
            }
        })

        setErrors(fieldCheck);

        if (!Object.keys(fieldCheck).length) {
            const payload = {
                ownerId,
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
            };

            const newSpot = await dispatch(spotActions.postSpot(payload)); // lets go bake this cake

            const newSpotId = newSpot?.id;

            const imagePayload = {
                if (urls.length) {
                    urls.forEach((url, index) => {
                        if (url.length) {
                            dispatch(
                                spotActions.postImage({
                                    imageableType: "Spot",
                                    imageableId: newSpotId,
                                    url,
                                    preview: index === 0 ? true : false,
                                })
                            );
                        }
                    });
                }
            };

            // check this
            if (!newSpot?.message) {
                navigate(`/spots/${newSpot.id}`); 
            } else console.log(newSpot.message);
        }
    }; //handleSubmit
} // default 
