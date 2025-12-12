import React, { FC } from "react";

type Props = {
  ratingName: string;
  title: string;
  rating: any;
  setRating: (rating: number) => void;
};

const Rating: FC<Props> = ({ ratingName, title, rating, setRating }) => {
  return (
    <div className="rating_box">
      <span>{title}</span>
      <div className="rating_stars">
        <button onClick={() => setRating({ ...rating, [ratingName]: 1 })}>
          {rating[ratingName] >= 1 ? (
            <i className="fa-solid fa-star"></i>
          ) : (
            <i className="fa-regular fa-star grey_icon"></i>
          )}
        </button>
        <button onClick={() => setRating({ ...rating, [ratingName]: 2 })}>
          {rating[ratingName] >= 2 ? (
            <i className="fa-solid fa-star"></i>
          ) : (
            <i className="fa-regular fa-star grey_icon"></i>
          )}
        </button>
        <button onClick={() => setRating({ ...rating, [ratingName]: 3 })}>
          {rating[ratingName] >= 3 ? (
            <i className="fa-solid fa-star"></i>
          ) : (
            <i className="fa-regular fa-star grey_icon"></i>
          )}
        </button>
        <button onClick={() => setRating({ ...rating, [ratingName]: 4 })}>
          {rating[ratingName] >= 4 ? (
            <i className="fa-solid fa-star"></i>
          ) : (
            <i className="fa-regular fa-star grey_icon"></i>
          )}
        </button>
        <button onClick={() => setRating({ ...rating, [ratingName]: 5 })}>
          {rating[ratingName] >= 5 ? (
            <i className="fa-solid fa-star"></i>
          ) : (
            <i className="fa-regular fa-star grey_icon"></i>
          )}
        </button>
      </div>
    </div>
  );
};

export default Rating;
