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
      <div className="board">
        <div className="corner c-1"></div>
        <div className="corner c-2"></div>
        <div className="corner c-3"></div>
        <div className="corner c-4"></div>
        <div className="corner c-5"></div>

        <div className="arrow a-1"></div>
        <div className="arrow a-2"></div>
        <div className="arrow a-3"></div>
        <div className="arrow a-4"></div>
        <div className="arrow a-5"></div>

        <div className="eye left">
          <div className="iris"></div>
        </div>

        <div className="eye right">
          <div className="iris"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
