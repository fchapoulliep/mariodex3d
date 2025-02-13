/**
 * Importing react and the Tilt component. As long as the css
 */
import React from "react";
import Tilt from "react-parallax-tilt";
import "../css/narutocard.css";

import { Link } from "react-router-dom";
import NarutoType from "./NarutoType";

/**
 * Props for the NarutoCard component.
 *
 * @interface NarutoCardProps
 * @property {number} id - The unique identifier for the Naruto Character.
 * @property {string} name - The name of the Naruto Character.
 * @property {string} clan - The clan of the Naruto Character.
 * @property {string} village - The village of the Naruto Character.
 */
interface NarutoCardProps {
  id: number;
  name: string;
  clan: string[];
  village: string;
}

/**
 * NarutoCard component that displays a Naruto Character card with its name, ID, types, and image.
 */
const NarutoCard: React.FC<NarutoCardProps> = (narutocharacter) => {
  return (
    <Tilt
      className={`background-stripes naruto-cards ${narutocharacter.village.toLowerCase()}`}
      glareEnable
      glareMaxOpacity={0.3}
      glareColor="white"
      glarePosition="all"
      glareBorderRadius="20px"
      scale={1.1}
    >
      <div className="inner-element">
        <Link to={`/${narutocharacter.id}`}>
          <div className="naruto-types">
            {narutocharacter.clan.map((clanItem) => (
              <NarutoType key={clanItem} type={clanItem} />
            ))}
          </div>
          <p>{narutocharacter.name}</p>
          <img
            className="naruto-character-image"
            src={`${import.meta.env.BASE_URL}/sprites/${
              narutocharacter.name
            }.png`}
            alt={narutocharacter.name}
          />
        </Link>
      </div>
    </Tilt>
  );
};

export default NarutoCard;
