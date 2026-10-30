// MarioLayout.tsx
import React, { useEffect } from "react";
import NavBar from "./NavBar";
import Slider from "./Slider";
import { useParams } from "react-router-dom";
import MarioCharacter from "./MarioCharacter";
import marioList from "../data/mariocharacters.json";

// Read from the data rather than hardcoded, so the right arrow stays correct when characters are added.
const lastId = String(Math.max(...marioList.map((c) => c.id)));

/**
 * `MarioLayout` is a React functional component that renders the layout for displaying a Mario Character.
 * It uses the `useParams` hook to extract the `marioId` from the URL parameters.
 *
 * The component includes:
 * - A `NavBar` component at the top.
 * - A `Slider` component with direction "left" if the character exists and the `marioId` is not "1".
 * - A `MarioCharacter` component that displays the Character based on the `marioId` or a default ID if `marioId` is not available.
 * - A `Slider` component with direction "right" if the character exists and is not the last one.
 *
 * @returns {JSX.Element} The rendered layout for the Mario Character page.
 */
const MarioLayout: React.FC = () => {
  const { marioId } = useParams<{ marioId: string }>();
  const character = marioList.find((c) => c.id === Number(marioId));

  // The tab title follows in-app navigation; the built page of each character already has it.
  useEffect(() => {
    document.title = character ? `${character.name} | MarioDex 3D` : "MarioDex 3D";
  }, [character]);

  // No arrows on an unknown id: they would lead to other unknown ids.
  return (
    <>
      <NavBar />
      {character && marioId !== "1" && <Slider direction="left" />}
      <MarioCharacter marioId={marioId || "defaultId"} />
      {character && marioId !== lastId && <Slider direction="right" />}
    </>
  );
};

export default MarioLayout;
