// NarutoLayout.tsx
import React from "react";
import NavBar from "./NavBar";
import Slider from "./Slider";
import { useParams } from "react-router-dom";
import NarutoCharacter from "./NarutoCharacter";

/**
 * `NarutoLayout` is a React functional component that renders the layout for displaying a Naruto Character.
 * It uses the `useParams` hook to extract the `narutoId` from the URL parameters.
 *
 * The component includes:
 * - A `NavBar` component at the top.
 * - A `Slider` component with direction "left" if the `narutoId` is not "1".
 * - A `NarutoCharacter` component that displays the Character based on the `narutoId` or a default ID if `narutoId` is not available.
 * - A `Slider` component with direction "right" if the `narutoId` is not "151".
 *
 * @returns {JSX.Element} The rendered layout for the Naruto Character page.
 */
const NarutoLayout: React.FC = () => {
  const { narutoId } = useParams<{ narutoId: string }>();

  return (
    <>
      <NavBar />
      {narutoId !== "1" && <Slider direction="left" />}
      <NarutoCharacter narutoId={narutoId || "defaultId"} />
      {narutoId !== "53" && <Slider direction="right" />}
    </>
  );
};

export default NarutoLayout;
