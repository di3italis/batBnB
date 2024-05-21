import { createSelector } from 'reselect';

// Assuming state structure is known and consistent
export const spotSelector = (state, spotId) => state.spots[spotId];
export const userSelector = (state) => state.session.user;
const reviewsSelector = (state, spotId) => state.reviews[spotId];

export const getSpot = createSelector(
    spotSelector,
    (spot) => spot
);

export const getCurrentUser = createSelector(
    userSelector,
    (user) => user
);

export const getSpotReviewsArray = createSelector(
    reviewsSelector,
    (reviews) => reviews ? Object.values(reviews) : []
);

export const getPreviewImage = createSelector(
    spotSelector,
    (spot) => spot?.SpotImages?.find((image) => image.preview)
);

