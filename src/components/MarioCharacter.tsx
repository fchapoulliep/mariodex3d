/**
 * Importing React, the Loader component, the MarioType component, and the Link component.
 */
import React, { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import marioList from "../data/mariocharacters.json";
import Loader from "./Loader";
import * as THREE from "three";
import "../css/mariocharacter.css";
import MarioType from "./MarioType";
import { Link } from "react-router-dom";

/**
 * Interface for the MarioProps type, which includes the Character ID.
 */
interface MarioProps {
  marioId: string;
}

/**
 * Interface for the MarioModelProps type, which includes the model path and Character ID.
 */
interface MarioModelProps {
  modelPath: string;
}

/**
 * Component that renders a 3D model of a Mario Character using the provided model path and Character ID.
 * It handles loading the model, playing idle animations, and adjusting the model's scale and materials.
 *
 * @component
 * @param {MarioModelProps} props - The properties for the MarioModel component.
 * @param {string} props.modelPath - The path to the 3D model file.
 * @returns {JSX.Element} The rendered 3D model of the Mario Character.
 */
const MarioModel: React.FC<MarioModelProps> = ({ modelPath }) => {
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
      scene.scale.set(0.2, 0.2, 0.2);
    }
  }, [scene]);

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = new THREE.Vector3();
      box.getCenter(center);

      scene.position.y -= center.y;
    }
  }, [scene]);

  return (
    <group>
      <Bounds fit clip observe margin={1.5}>
        <primitive object={scene} />
        <PerspectiveCamera makeDefault position={[0, 10, 50]} />
        <OrbitControls
          enableDamping
          dampingFactor={0.25}
          enableRotate
          target={[0, 0, 0]}
          autoRotate
        />
      </Bounds>
    </group>
  );
};

/**
 *  Component that renders a Mario Character page with a 3D model, description, and type information.
 * @param marioId The ID of the Character to display.
 * @returns The Mario Character page with the 3D model, description, and type information.
 */
const MarioCharacter: React.FC<MarioProps> = ({ marioId }) => {
  const mariocharacter = marioList.find((p) => p.id === parseInt(marioId));
  const [loading, setLoading] = React.useState(true);

  const mariocharacterName = mariocharacter ? mariocharacter.name : "";

  const modelPath = useMemo(
    () =>
      `${
        import.meta.env.BASE_URL
      }models/${mariocharacterName}/${mariocharacterName}.glb?v=${new Date().getTime()}`,
    [mariocharacterName]
  );

  useEffect(() => {
    const loader = document.querySelector(".loader");
    if (loader) {
      loader.classList.remove("animation");
    }
    setLoading(false);
  }, [modelPath]);

  if (!mariocharacter) {
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
        The Mario Character does not exist
        <Link to="/">Go back to the MarioDex</Link>
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
      id="mario-overlay"
      style={{
        backgroundImage: `url(${
          import.meta.env.BASE_URL
        }backgrounds/${mariocharacter.city[0]
          .normalize("NFD")
          .toLowerCase()
          .replace(/ /g, "-")
          .replace("'s", "")}.webp)`,
        backgroundPosition: "bottom",
        backgroundSize: "cover",
      }}
    >
      <Loader />
      <div className="mario-description">
        <h2>{mariocharacter.name}</h2>
        <p>{mariocharacter.description}</p>
      </div>
      <div className="mario-types">
        {mariocharacter.city.map((cityItem) => (
          <MarioType key={cityItem} type={cityItem} />
        ))}
      </div>

      <Canvas style={{ background: "transparent" }} shadows key={modelPath}>
        <ambientLight intensity={1} />
        <directionalLight position={[-5, 5, 5]} intensity={2} castShadow />
        <directionalLight position={[5, 5, -5]} intensity={2} castShadow />
        <MarioModel modelPath={modelPath} />
      </Canvas>
    </div>
  );
};

export default MarioCharacter;
