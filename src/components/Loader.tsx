/**
 * Importing React and the loader CSS.
 */
import React from "react";
import "../css/loader.css";

/**
 * Props for the Loader component.
 */
interface LoaderProps {
  /** Plays the closing animation (the black disc shrinks to the center). */
  closing: boolean;
  /** Called once the closing animation is over, for the page to remove the loader. */
  onClosed: () => void;
}

/**
 * Loader component that displays a loading animation.
 *
 * This component includes:
 * - A Mario Star animation.
 *
 * @component
 * @example
 * return (
 *   <Loader />
 * )
 */
const Loader: React.FC<LoaderProps> = ({ closing, onClosed }) => {
  return (
    <div
      className={`loader${closing ? " animation" : ""}`}
      onAnimationEnd={(event) => {
        // The inner animation loops forever: only the disc's own closing animation counts.
        if (event.target === event.currentTarget && closing) {
          onClosed();
        }
      }}
    >
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
