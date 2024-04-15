import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import { TbBat } from 'react-icons/tb';
import styles from '../ComponentsCss.module.css';

export default function SpotDetail() {
   const { spotId } = useParams();
   const mySpotId = Number(spotId);
   // const state = useSelector((state) => state);
    const spot = useSelector((state) => state.spots.SpotDetails[mySpotId]);
   const currentUser = useSelector((state) => state.session.user);
   
   console.log("spotId:", spotId);
   console.log("spot:", mySpotId);
   console.log("currentUser:", currentUser);
   // console.log("state.spots:", state.spots);
   // console.log("state.spots.SpotDetails", state.spots.SpotDetails);
   
    const dispatch = useDispatch();

    // useEffect(() => {
    //      dispatch(spotActions.getSpotsThunk()) 
    // }, [dispatch]);

    useEffect(() => {
         dispatch(spotActions.getSpotDetailsThunk(mySpotId)) 
    }, [dispatch]);

    if (!spot) {
        return <div>Spot not found</div>;
    }

    return (
        <div className={styles.spotDetailContainer}>
            <div className={styles.imageContainer}>
                <img src={spot.SpotImages[0].url} alt={spot.name} title="SHOW ME YOUR TIPS"/>
            </div>
            <div className={styles.spotInfo}>
                <div className={styles.spotInfoTop}>
                    <span>{spot.city}, {spot.country}</span>
                    <span className={styles.rating}>
                        <TbBat className={styles.star} />
                        {spot.avgRating.toFixed(1)}
                    </span>
                </div>
                <div className={styles.spotInfoBottom}>
                    <span className={styles.price}>${spot.price}</span>
                    <span className={styles.perNight}>per night</span>
                </div>
            </div>
        </div>
    );
}
