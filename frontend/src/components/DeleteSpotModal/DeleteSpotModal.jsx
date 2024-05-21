// DeleteSpotModal.jsx
import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal";
import * as spotActions from "../../store/spots";
import styles from "./DeleteSpotModal.module.css"

export default function DeleteSpotModal({ spotId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleDelete = async () => {
        await dispatch(spotActions.deleteSpotThunk(spotId));
        closeModal();
    }

    const handleKeepSpot = () => {
        closeModal();
    }

  return (
    <div className={styles.deleteSpotModal}>
      <h2>Confirm Delete</h2>
      <div className={styles.deleteSpotModalContainer}>
        <p>Are you sure you want to remove this spot from the listings?</p>
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
