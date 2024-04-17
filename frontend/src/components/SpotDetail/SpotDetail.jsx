import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as spotActions from "../../store/spots";
import SpotReviews from "../SpotReviews";
import NewReviewModal from "../NewReviewModal";
import { TbBat } from "react-icons/tb";
import styles from "./SpotDetail.module.css";

export default function SpotDetail() {
    const { spotId } = useParams();
    const mySpotId = Number(spotId);
    // const state = useSelector((state) => state);
    const spot = useSelector((state) => state.spots[mySpotId]);
    const currentUser = useSelector((state) => state.session.user);
    const thisSpotReviews = useSelector((state) => state.reviews);

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
        dispatch(spotActions.getSpotDetailsThunk(mySpotId));
    }, [dispatch, mySpotId]);

    if (!spot) {
        return <div>Spot not found</div>;
    }

    const previewImage = spot.SpotImages?.find((image) => image.preview);

    //     return (
    //         <div className="spotDetailContainer">
    //             <div className={styles.imageContainer}>
    //                 <div className={styles.largeImageContainer}>
    // <img
    //     src={previewImage?.url}
    //     alt={spot.name}
    //     title="SHOW ME YOUR TIPS"
    //     className={styles.largeImage}/>
    //                 </div>
    //                 <div className={styles.gridContainer}>
    //                     {spot.SpotImages?.slice(0, 4).map((image) => (
    //                         <div className={styles.gridItem} key={image.id}>
    //                             <img
    //                                 src={image.url}
    //                                 alt={spot.name}
    //                                 title="SHOW ME YOUR TIPS"
    //                                 className={styles.gridImage}
    //                             />
    //                         </div>
    //                     ))}
    //                 </div>
    //             </div>
    //             <div className={styles.spotInfo}>
    //                 <div className={styles.spotInfoTop}>
    //                     <span>
    //                         {spot.city}, {spot.state}
    //                     </span>
    //                     <span className={styles.rating}>
    //                         <TbBat className={styles.star} />
    //                         {spot.avgRating.toFixed(1)}
    //                     </span>
    //                 </div>
    //                 <div className={styles.spotInfoBottom}>
    //                     <span className={styles.price}>${spot.price}</span>
    //                     <span className={styles.perNight}>per night</span>
    //                 </div>
    //             </div>
    //             <div className={styles.spotDescriptionContainer}>
    //                 <h2 className={styles.spotOwner}>
    //                     Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
    //                 </h2>
    //                 <div className={styles.spotDescription}>
    //                     {spot?.description}
    //                 </div>
    //             </div>
    //             <div className={styles.reviews}>
    //                 <SpotReviews spotId={mySpotId} />
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className={styles.spotDetailContainer}>
            <h1 className={styles.spotName}>{spot.name}</h1>
            <div className={styles.location}>
                {spot.city}, {spot.state}, {spot.country}
            </div>

            <div className={styles.imageGallery}>
                <div className={styles.mainImage}>
                    <img
                        src={previewImage?.url}
                        alt={spot.name}
                        title={spot.name}
                        className={styles.largeImage}
                    />
                </div>
                <div className={styles.sideImages}>
                    {spot.SpotImages?.slice(1, 5).map((image) => (
                        <div className={styles.gridItem} key={image.id}>
                            <img
                                src={image.url}
                                alt={spot.name}
                                title={spot.name}
                                className={styles.gridImage}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.hostedBy}>
                Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
            </div>
            <div className={styles.description}>
                <p>{spot.description}</p>
                <div className={styles.priceResContainer}>
                    <div className={styles.price}>${spot.price}</div>
                    <div className={styles.reservation}>
                        <button>Reserve</button>
                    </div>
                </div>
            </div>
            <div className={styles.reviews}>
                {/* NewReviewModal */}
                <div className={styles.newReviewContainer}>
                    <NewReviewModal spotId={mySpotId} />
                </div>
                {/* SpotReviews */}
                <div className={styles.rating}>★ 4.5 124 Reviews</div>
                <div className={styles.reviewEntry}>
                    Reviewer Name Month Year
                    <div className={styles.reviewBody}>
                        <SpotReviews spotId={mySpotId} />
                    </div>
                    {/* Add more review entries as needed */}
                </div>
            </div>
        </div>
    );
}
