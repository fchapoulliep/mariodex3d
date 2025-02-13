// MarioLayout.tsx
import React from "react";
import NavBar from "./NavBar";
import Slider from "./Slider";
import { useParams } from "react-router-dom";
import MarioCharacter from "./MarioCharacter";

/**
 * `MarioLayout` is a React functional component that renders the layout for displaying a Mario Character.
 * It uses the `useParams` hook to extract the `marioId` from the URL parameters.
 *
 * The component includes:
 * - A `NavBar` component at the top.
 * - A `Slider` component with direction "left" if the `marioId` is not "1".
 * - A `MarioCharacter` component that displays the Character based on the `marioId` or a default ID if `marioId` is not available.
 * - A `Slider` component with direction "right" if the `marioId` is not "151".
 *
 * @returns {JSX.Element} The rendered layout for the Mario Character page.
 */
const MarioLayout: React.FC = () => {
  const { marioId } = useParams<{ marioId: string }>();

  return (
    <>
      <NavBar />
      {marioId !== "1" && <Slider direction="left" />}
      <MarioCharacter marioId={marioId || "defaultId"} />
      {marioId !== "53" && <Slider direction="right" />}
    </>
  );
};

export default MarioLayout;
