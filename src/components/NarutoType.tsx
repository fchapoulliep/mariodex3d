/**
 * Importing React and the NarutoType CSS.
 */
import React from "react";
import "../css/narutotype.css";

/**
 * Interface for the NarutoTypeProps type, which includes the Naruto Character type.
 */
interface NarutoTypeProps {
  type: string;
}

/**
 * A React functional component that displays a Naruto Character type icon and its name.
 *
 * @component
 * @param {NarutoTypeProps} props - The properties object.
 * @param {string} props.type - The type of the Naruto Character.
 * @returns {JSX.Element} A div containing an image of the Naruto Character type and its name.
 */
const NarutoType: React.FC<NarutoTypeProps> = ({ type }) => {
  return (
    <div className={`type-div`}>
      {type !== "Unknown" && type !== "Artificial Human" ? (
        <img
          className="naruto-type"
          id={type
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()}
          src={`${import.meta.env.BASE_URL}/type_icons/${type
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace("first ", "")
            .replace("second ", "")
            .replace("third ", "")
            .replace("fourth ", "")
            .replace("fifth ", "")
            .replace("sixth ", "")
            .replace("seventh ", "")}.png`}
          alt={type}
        />
      ) : null}
      <p>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
    </div>
  );
};

export default NarutoType;
