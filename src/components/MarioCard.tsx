/**
 * Importing react and the Tilt component. As long as the css
 */
import React from "react";
import Tilt from "react-parallax-tilt";
import "../css/mariocard.css";

import { Link } from "react-router-dom";
import MarioType from "./MarioType";

/**
 * Props for the MarioCard component.
 *
 * @interface MarioCardProps
 * @property {number} id - The unique identifier for the Mario Character.
 * @property {string} name - The name of the Mario Character.
 * @property {string} city - The city of the Mario Character.
 */
interface MarioCardProps {
  id: number;
  name: string;
  city: string[];
}

/**
 * MarioCard component that displays a Mario Character card with its name, ID, types, and image.
 */
const MarioCard: React.FC<MarioCardProps> = (mariocharacter) => {
  return (
    <Tilt
      className={`background-stripes mario-cards ${mariocharacter.city[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ /g, "-").replace("'s", "")}`}
      glareEnable
      glareMaxOpacity={0.3}
      glareColor="white"
      glarePosition="all"
      glareBorderRadius="20px"
      scale={1.1}
    >
      <div className="inner-element">
        <Link to={`/${mariocharacter.id}`}>
          <div className="mario-types">
            {mariocharacter.city.map((cityItem) => (
              <MarioType key={cityItem} type={cityItem} />
            ))}
          </div>
          <p>{mariocharacter.name}</p>
          <img
            className="mario-character-image"
            src={`${import.meta.env.BASE_URL}/sprites/${
              mariocharacter.name
            }.png`}
            alt={mariocharacter.name}
          />
        </Link>
      </div>
    </Tilt>
  );
};

export default MarioCard;
