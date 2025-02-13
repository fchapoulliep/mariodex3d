/**
 * Importing React and the loader CSS.
 */
import React from "react";
import "../css/loader.css";

/**
 * Loader component that displays a loading animation.
 *
 * This component includes:
 * - A Sharingan Radar animation.
 *
 * @component
 * @example
 * return (
 *   <Loader />
 * )
 */
const Loader: React.FC = () => {
  return (
    <div className="loader">
      <div className="eye">
        <svg className="sharingan" viewBox="0 0 100 100">
          <g id="full_pupil">
            <circle id="iris" r="30" cx="50%" cy="50%"></circle>
            <circle id="pupil" r="10" cx="50%" cy="50%"></circle>

            <text
              id="iris_anomaly"
              className="iris_anomaly"
              transform="rotate(180 30,8)"
            >
              ,
            </text>
            <use
              href="#iris_anomaly"
              transform="rotate(120 50,50)"
              fill="black"
            ></use>
            <use
              href="#iris_anomaly"
              transform="rotate(240 50,50)"
              fill="black"
            ></use>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Loader;
