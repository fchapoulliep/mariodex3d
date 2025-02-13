/**
 * Importing React and the MarioType CSS.
 */
import React from "react";
import "../css/mariotype.css";

/**
 * Interface for the MarioTypeProps type, which includes the Mario Character type.
 */
interface MarioTypeProps {
  type: string;
}

/**
 * A React functional component that displays a Mario Character type icon and its name.
 *
 * @component
 * @param {MarioTypeProps} props - The properties object.
 * @param {string} props.type - The type of the Mario Character.
 * @returns {JSX.Element} A div containing an image of the Mario Character type and its name.
 */
const MarioType: React.FC<MarioTypeProps> = ({ type }) => {
  return (
    <div className={`type-div`}>
      <img
        className="mario-type"
        id={type
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()}
        src={`${import.meta.env.BASE_URL}/type_icons/${type
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()}.png`}
        alt={type}
      />
      <p>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
    </div>
  );
};

export default MarioType;
