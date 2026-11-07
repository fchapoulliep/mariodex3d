/**
 * Importing react and the Tilt component. As long as the css
 */
import React, { useEffect, useRef } from "react";
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
 * The tilt library sizes its glare once, when the pointer enters the card.
 * The active card keeps growing after that (a 0.3 s height transition), so a
 * pointer arriving during the growth got a glare sized on the smaller card,
 * which left the corners bare until it came back. The card is measured again
 * whenever its layout size changes. setSize is internal to the library (not in
 * its types): it is called only if present.
 */
function useGlareFollowsSize() {
  const ref = useRef<Tilt>(null);
  useEffect(() => {
    const tilt = ref.current as unknown as {
      setSize?: () => void;
      wrapperEl?: { node: HTMLElement | null };
    } | null;
    const node = tilt?.wrapperEl?.node;
    if (!tilt || !node || typeof tilt.setSize !== "function" || typeof ResizeObserver === "undefined") {
      return;
    }
    // The card can be gone (another page opened) by the time the observer reports
    const observer = new ResizeObserver(() => {
      if (tilt.wrapperEl?.node) tilt.setSize?.();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/**
 * MarioCard component that displays a Mario Character card with its name, ID, types, and image.
 */
const MarioCard: React.FC<MarioCardProps> = (mariocharacter) => {
  const glareRef = useGlareFollowsSize();
  return (
    <Tilt
      ref={glareRef}
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
            }.webp`}
            alt={mariocharacter.name}
          />
        </Link>
      </div>
    </Tilt>
  );
};

export default MarioCard;
