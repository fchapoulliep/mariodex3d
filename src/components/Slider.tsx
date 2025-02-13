/**
 * Importing React and the slider CSS.
 */
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../css/slider.css";

import leftArrow from "../assets/arrows/arrowLeft.png";
import rightArrow from "../assets/arrows/arrowRight.png";

/**
 * Props for the Slider component.
 */
interface SliderProps {
  direction: "left" | "right";
}

/**
 * Slider component that displays a left or right arrow to navigate between Mario Character.
 * Uses the URL parameter to determine the current Mario Character ID.
 */
const Slider: React.FC<SliderProps> = ({ direction }) => {
  const { marioId } = useParams<{ marioId: string }>();
  const [newId, setNewId] = React.useState(marioId);

  useEffect(() => {
    if (direction === "left") {
      setNewId(`${parseInt(marioId || "0") - 1}`);
    } else {
      setNewId(`${parseInt(marioId || "0") + 1}`);
    }
  }, [marioId]);

  return (
    <div
      style={{ cursor: "pointer" }}
      id="slider"
      className={`slider-${direction}`}
    >
      <Link
        to={`/${newId}`}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {direction === "left" ? (
          <img className={direction} src={leftArrow} alt="Left arrow" />
        ) : (
          <img className={direction} src={rightArrow} alt="Left arrow" />
        )}
      </Link>
    </div>
  );
};

export default Slider;
