// ManageSpots.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import * as spotActions from "../../store/spots";
import SpotCard from "../SpotCard";
import styles from "./ManageSpots.module.css";

export default function ManageSpots() {
    const { closeModal } = useModal();
    const navigate = useNavigate();
    // the old state is rendering for a split second before the new state is rendered, so I am implementing a loading state
    const [loading, setLoading] = useState(true);
    const currUserSpots = useSelector((state) => state.spots || {});
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSpots = async () => {
            await dispatch(spotActions.getCurrentUserSpotsThunk());
            setLoading(false);
        };
        fetchSpots();
    }, [dispatch]);

    const userSpotsArray = Object.values(currUserSpots);

    if (loading) {
        return <div>Loading...</div>;
    }

       if (!userSpotsArray.length) {
        return (
            <div className={styles.main}>
                <div>Spots Not Found!</div>
                <button onClick={() => handleDelete}>Create a New Spot</button>
            </div>
        );
    }

    console.log("currUserSpots:", userSpotsArray);

    const handleUpdate = async () => {
        await dispatch(spotActions.updateSpotThunk(spotId))
    }

    return (
        <div className={styles.main}>
            <div className={styles.title}>
                <h1>Manage Your Spots</h1>
            </div>
            <div className={styles.cardsCont}>
                    {Object.values(userSpotsArray).map((spot) => (
                        <div key={spot.id} className={styles.card}>
                            <SpotCard key={spot.id} spot={spot} />
                            <button onClick={() => navigate(`/spots/${spotId}/edit`)}>Update</button>
                            <OpenModalButton
                                buttonText={"Delete"}
                                modalComponent={ <DeleteSpotModal spotId={spot.id} />}
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
}
