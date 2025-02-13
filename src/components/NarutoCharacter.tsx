/**
 * Importing React, the Loader component, the NarutoType component, and the Link component.
 */
import React, { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import narutoList from "../data/narutocharacters.json";
import Loader from "./Loader";
import * as THREE from "three";
import "../css/narutocharacter.css";
import NarutoType from "./NarutoType";
import { Link } from "react-router-dom";

/**
 * Interface for the NarutoProps type, which includes the Character ID.
 */
interface NarutoProps {
  narutoId: string;
}

/**
 * Interface for the NarutoModelProps type, which includes the model path and Character ID.
 */
interface NarutoModelProps {
  modelPath: string;
}

/**
 * Component that renders a 3D model of a Naruto Character using the provided model path and Character ID.
 * It handles loading the model, playing idle animations, and adjusting the model's scale and materials.
 *
 * @component
 * @param {NarutoModelProps} props - The properties for the NarutoModel component.
 * @param {string} props.modelPath - The path to the 3D model file.
 * @returns {JSX.Element} The rendered 3D model of the Naruto Character.
 */
const NarutoModel: React.FC<NarutoModelProps> = ({ modelPath }) => {
  const { scene, animations } = useGLTF(modelPath);
  const mixer = new THREE.AnimationMixer(scene);

  useEffect(() => {
    if (animations.length > 0) {
      const idleAnimation = animations.find(
        (clip) =>
          clip.name.toLowerCase().includes("idle") ||
          clip.name.toLowerCase().includes("wait") ||
          clip.name === "0"
      );
      const action = mixer.clipAction(idleAnimation || animations[0]);
      action.play();
    }

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
    };
  }, [animations, mixer, scene]);

  useFrame((_, delta) => {
    mixer.update(delta);
  });

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      box.getSize(size);

      const delta = Math.min(1.0 / size.x, 1.0 / size.y, 1.0 / size.z);
      scene.scale.set(delta, delta, delta);
      scene.rotation.y = -0.5;
    }
  }, [scene]);

  return <primitive object={scene} scale={0.25} position={[0, -2, 0.5]} />;
};

/**
 *  Component that renders a Naruto Character page with a 3D model, description, and type information.
 * @param narutoId The ID of the Character to display.
 * @returns The Naruto Character page with the 3D model, description, and type information.
 */
const NarutoCharacter: React.FC<NarutoProps> = ({ narutoId }) => {
  const narutocharacter = narutoList.find((p) => p.id === parseInt(narutoId));
  const [loading, setLoading] = React.useState(true);

  const narutocharacterName = narutocharacter ? narutocharacter.name : "";

  const modelPath = useMemo(
    () =>
      `${
        import.meta.env.BASE_URL
      }models/${narutocharacterName}/${narutocharacterName}.glb?v=${new Date().getTime()}`,
    [narutocharacterName]
  );

  useEffect(() => {
    const loader = document.querySelector(".loader");
    if (loader) {
      loader.classList.remove("animation");
    }
    setLoading(false);
  }, [modelPath]);

  if (!narutocharacter) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        The Naruto Character does not exist
        <Link to="/">Go back to the NarutoDex</Link>
      </div>
    );
  }

  useEffect(() => {
    const loader = document.querySelector(".loader");
    if (loader && !loading) {
      setTimeout(() => {
        loader.classList.add("animation");
      }, 1500);
    }
  });

  return (
    <div
      id="naruto-overlay"
      style={{
        backgroundImage: `url(${
          import.meta.env.BASE_URL
        }backgrounds/${narutocharacter.village
          .toLowerCase()
          .replace(/ /g, "-")}.png)`,
        backgroundPosition: "bottom",
        backgroundSize: "cover",
      }}
    >
      <Loader />
      <div className="naruto-description">
        <h2>{narutocharacter.name}</h2>
        <p>{narutocharacter.description}</p>
      </div>
      <div className="naruto-types">
        {narutocharacter.clan.map((clanItem) => (
          <NarutoType key={clanItem} type={clanItem} />
        ))}
      </div>

      <Canvas style={{ background: "transparent" }} shadows key={modelPath}>
        <ambientLight intensity={1} />
        <directionalLight position={[-5, 5, 5]} intensity={2} castShadow />
        <directionalLight position={[5, 5, -5]} intensity={2} castShadow />
        <OrbitControls
          enableDamping
          dampingFactor={0.25}
          minDistance={2}
          maxDistance={6}
        />
        <NarutoModel modelPath={modelPath} />
      </Canvas>
    </div>
  );
};

export default NarutoCharacter;
