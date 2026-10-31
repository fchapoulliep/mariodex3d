/**
 * Importing React and the loader CSS.
 */
import React from "react";
import "../css/loader.css";

/**
 * Props for the Loader component.
 */
interface LoaderProps {
  /** Fades the loader out, while the model comes forward. */
  closing: boolean;
  /** Called once the loader has faded out, for the page to remove it. */
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
      className={`loader${closing ? " closing" : ""}`}
      onAnimationEnd={(event) => {
        // The star's own animation bubbles up too: only the loader's fade-out counts.
        if (event.target === event.currentTarget && event.animationName === "loaderOut") {
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
