import { useDispatch/* , useSelector */ } from "react-redux";
import { useModal } from "../../context/Modal";
import styles from "./DeleteReviewModal.module.css";

import * as reviewActions from '../../store/reviews'
import * as spotActions from "../../store/spots";
import { useEffect } from "react";

export default function DeleteReviewModal({reviewId, spotId}) {

    const { closeModal } = useModal();
    const dispatch = useDispatch()
    // const reviews = useSelector((state)=> state.reviews)

    useEffect(()=> {
      dispatch(reviewActions.getReviewsThunk(Number(spotId)));
      dispatch(spotActions.getSpotDetailsThunk(Number(spotId)));
    },[dispatch, spotId])


    const handleDelete = () => {
        dispatch(reviewActions.deleteReviewThunk(reviewId))
        dispatch(reviewActions.getReviewsThunk(Number(spotId)));
        dispatch(spotActions.getSpotDetailsThunk(Number(spotId)));
        closeModal()
    }

    const handleKeepSpot = () => {
        closeModal()
    }


  return (
    <div className={styles.deleteReviewModalContainer}>
      <h2>Confirm Delete</h2>
      <div className={styles.deleteReviewModalContainer}>
        <p>Are you sure you want to delete this review?</p>
        <button className={styles.deleteYes} onClick={handleDelete}>
          Yes (Delete Review)
        </button>
        <div>
          <button className={styles.deleteNo} onClick={handleKeepSpot}>
            No (Keep Review)
          </button>
        </div>
      </div>
    </div>
  );
}

