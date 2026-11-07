/**
 * Importing React, the Loader component, the MarioType component, and the Link component.
 */
import React, { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  OrbitControls,
  PerspectiveCamera,
  useBounds,
  useGLTF,
} from "@react-three/drei";
import marioList from "../data/mariocharacters.json";
import Loader from "./Loader";
import Onboarding from "./Onboarding";
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
  /** Comes forward from far behind its place, rather than showing up in place. */
  comesForward: boolean;
  /** Called once the model is drawn and its framing has settled. */
  onReady: () => void;
}

/** How long the model takes to come forward to its place, in seconds. */
const ENTRANCE_S = 0.5;

/**
 * How far behind its place the model starts, in camera distances (Bounds sets
 * that distance from the model's size): four more, so that it first shows at
 * a fifth of its size.
 */
const ENTRANCE_DEPTH = 4;

/**
 * Frames the model again when the canvas size or the camera changes, as
 * Bounds' `observe` would, but never during the entrance: measured while the
 * model is still far behind, the framing would throw the camera off. A change
 * meanwhile is applied once the model is in place.
 */
const FitWhenInPlace: React.FC<{ entering: React.MutableRefObject<boolean> }> = ({
  entering,
}) => {
  const bounds = useBounds();
  const size = useThree((state) => state.size);
  const camera = useThree((state) => state.camera);
  const pending = useRef(false);

  useLayoutEffect(() => {
    pending.current = true;
  }, [bounds, size, camera]);

  useFrame(() => {
    if (pending.current && !entering.current) {
      pending.current = false;
      bounds.refresh().reset().fit().clip();
    }
  });

  return null;
};

/**
 * Component that renders a 3D model of a Mario Character using the provided model path and Character ID.
 * It handles loading the model, playing idle animations, and adjusting the model's scale and materials.
 *
 * @component
 * @param {MarioModelProps} props - The properties for the MarioModel component.
 * @param {string} props.modelPath - The path to the 3D model file.
 * @returns {JSX.Element} The rendered 3D model of the Mario Character.
 */
const MarioModel: React.FC<MarioModelProps> = ({
  modelPath,
  comesForward,
  onReady,
}) => {
  const { scene, animations } = useGLTF(modelPath);
  // One mixer per model: created on every render, it restarted the animation
  // each time the page changed state (loader, description), hence the jolts
  const mixer = useMemo(() => new THREE.AnimationMixer(scene), [scene]);
  const frames = useRef(0);
  const group = useRef<THREE.Group>(null);
  const controls = useRef<React.ElementRef<typeof OrbitControls>>(null);
  const entrance = useRef<{ from: THREE.Vector3; elapsed: number } | null>(null);
  const entering = useRef(false);
  const [minZoomDistance, setMinZoomDistance] = React.useState(0);

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

  useFrame(({ camera }, delta) => {
    mixer.update(delta);
    // A few frames let the framing settle (centering, scale, camera fit): only
    // then is the model shown, coming forward from far behind its place.
    frames.current += 1;
    if (frames.current === 5) {
      if (comesForward && controls.current) {
        // Along the line of sight (the camera looks at the orbit target), so
        // that the far-away model stands right behind the loader
        const from = camera.position
          .clone()
          .sub(controls.current.target)
          .multiplyScalar(-ENTRANCE_DEPTH);
        entrance.current = { from, elapsed: 0 };
        entering.current = true;
      }
      onReady();
    }

    const move = entrance.current;
    if (move && group.current) {
      // A long first frame (shader compilation) must not skip half the move
      move.elapsed = Math.min(move.elapsed + Math.min(delta, 1 / 30), ENTRANCE_S);
      const progress = move.elapsed / ENTRANCE_S;
      // Fast at first, then slows down to settle in place
      const eased = 1 - Math.pow(1 - progress, 3);
      group.current.position.copy(move.from).multiplyScalar(1 - eased);
      entering.current = progress < 1;
    }
  });

  useEffect(() => {
    if (scene) {
      scene.scale.set(0.2, 0.2, 0.2);
    }
  }, [scene]);

  useEffect(() => {
    if (scene) {
      // A model already seen comes back from the cache with the position of its
      // last visit: start from the origin so that it is centered the same way.
      scene.position.set(0, 0, 0);
      const box = new THREE.Box3().setFromObject(scene);
      const center = new THREE.Vector3();
      box.getCenter(center);

      scene.position.y -= center.y;

      const size = new THREE.Vector3();
      box.getSize(size);

      setMinZoomDistance(Math.max(size.x, size.y, size.z) * 0.5);
    }

  }, [scene]);

  return (
    <group>
      {/* The camera frames the model at once rather than gliding to it. Bounds
          frames it on mount; FitWhenInPlace takes over its observe option */}
      <Bounds fit clip margin={1.5} maxDuration={0.001}>
        <FitWhenInPlace entering={entering} />
        {/* Only the model moves during its entrance: the camera beside it,
            moved along, would cancel the movement out */}
        <group ref={group}>
          <primitive object={scene} />
        </group>
        <PerspectiveCamera makeDefault position={[0, 10, 50]} />
        <OrbitControls
          ref={controls}
          enableDamping
          dampingFactor={0.25}
          enableRotate
          target={[0, 0, 0]}
          autoRotate
          minDistance={minZoomDistance}
        />
      </Bounds>
    </group>
  );
};

/**
 * Models drawn during this visit. drei keeps them in memory: they show up in
 * place at once, without coming forward again.
 */
const seenModels = new Set<string>();

/**
 * How long a model may take to show before the loader appears: a quick one,
 * such as a model already seen during the visit, needs none.
 */
const LOADER_DELAY_MS = 150;

/**
 *  Component that renders a Mario Character page with a 3D model, description, and type information.
 * @param marioId The ID of the Character to display.
 * @returns The Mario Character page with the 3D model, description, and type information.
 */
const MarioCharacter: React.FC<MarioProps> = ({ marioId }) => {
  const mariocharacter = marioList.find((p) => p.id === parseInt(marioId));

  const mariocharacterName = mariocharacter ? mariocharacter.name : "";

  const modelPath = useMemo(
    () =>
      `${
        import.meta.env.BASE_URL
      }models/${mariocharacterName}/${mariocharacterName}.glb?v=${__BUILD_ID__}`,
    [mariocharacterName]
  );

  // The loader stands where the model will appear, and only once the model
  // has taken more than LOADER_DELAY_MS to show.
  const [loaderPhase, setLoaderPhase] = React.useState<
    "visible" | "closing" | "hidden"
  >("hidden");
  const [drawnPath, setDrawnPath] = React.useState<string | null>(null);
  const [descriptionOpen, setDescriptionOpen] = React.useState(false);
  const modelDrawn = drawnPath === modelPath;
  // Decided once per model, before the effect below marks it as seen
  const comesForward = useMemo(() => !seenModels.has(modelPath), [modelPath]);

  useEffect(() => {
    if (modelDrawn) return;
    const timer = setTimeout(() => setLoaderPhase("visible"), LOADER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [modelDrawn, modelPath]);

  useEffect(() => {
    if (!modelDrawn) return;
    seenModels.add(modelPath);
    // The loader fades out while the model comes forward
    setLoaderPhase((phase) => (phase === "visible" ? "closing" : phase));
  }, [modelDrawn, modelPath]);

  const backgroundPath = mariocharacter
    ? `${import.meta.env.BASE_URL}backgrounds/${mariocharacter.city[0]
        .normalize("NFD")
        .toLowerCase()
        .replace(/ /g, "-")
        .replace("'s", "")}.webp`
    : null;

  // A background shows only once fully loaded and decoded, then fades in over
  // the previous one (or the dark base), which leaves once fully covered
  const [backgrounds, setBackgrounds] = React.useState<{ id: number; path: string }[]>([]);
  const nextBackgroundId = useRef(0);

  useEffect(() => {
    if (!backgroundPath) return;
    let cancelled = false;
    const image = new Image();
    image.src = backgroundPath;
    image
      .decode()
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        // A new id each time, so that coming back to a background fades it in again
        const id = nextBackgroundId.current++;
        setBackgrounds((layers) =>
          layers[layers.length - 1]?.path === backgroundPath
            ? layers
            : [...layers, { id, path: backgroundPath }],
        );
      });
    return () => {
      cancelled = true;
    };
  }, [backgroundPath]);

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

  return (
    <div id="mario-overlay">
      {backgrounds.map((layer) => (
        <div
          key={layer.id}
          className="mario-background"
          style={{ backgroundImage: `url(${layer.path})` }}
          // Once this one has faded in, the layers it covers leave the page
          onAnimationEnd={() =>
            setBackgrounds((layers) => layers.filter((other) => other.id >= layer.id))
          }
        />
      ))}
      {loaderPhase !== "hidden" && (
        <Loader
          closing={loaderPhase === "closing"}
          onClosed={() => setLoaderPhase("hidden")}
        />
      )}
      {/* On phones the description folds into a bar with the name, opened on demand;
          on wider screens it is always open and the toggle is hidden */}
      <div className={`mario-description${descriptionOpen ? " open" : ""}`}>
        <div className="description-head">
          <h2>{mariocharacter.name}</h2>
          <button
            type="button"
            className="description-toggle"
            aria-expanded={descriptionOpen}
            aria-controls="mario-details"
            aria-label={descriptionOpen ? "Hide the description" : "Show the description"}
            onClick={() => setDescriptionOpen((open) => !open)}
          >
            {/* Lucide "chevron-up" icon (ISC license) */}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
        </div>
        <div id="mario-details" className="description-details">
          <p>{mariocharacter.description}</p>
        </div>
      </div>
      <div className="mario-types">
        {mariocharacter.city.map((cityItem) => (
          <MarioType key={cityItem} type={cityItem} />
        ))}
      </div>

      <Canvas style={{
          background: "transparent",
          // Hidden until the model is in place, then faded in
          opacity: modelDrawn ? 1 : 0,
          transition: "opacity 150ms",
        }} shadows key={modelPath}>
        <ambientLight intensity={1} />
        <directionalLight position={[-5, 5, 5]} intensity={2} castShadow />
        <directionalLight position={[5, 5, -5]} intensity={2} castShadow />
        {/* A model still loading suspends the scene only: without this boundary,
            the page itself would wait, and the previous page would stay on screen */}
        <Suspense fallback={null}>
          <MarioModel
            modelPath={modelPath}
            comesForward={comesForward}
            onReady={() => setDrawnPath(modelPath)}
          />
        </Suspense>
      </Canvas>
      <Onboarding
        step="model"
        ready={modelDrawn}
        text={{
          mouse: `Drag to spin ${mariocharacter.name} around, scroll to zoom in.`,
          touch: `Swipe to spin ${mariocharacter.name} around, pinch to zoom in.`,
        }}
        button="Let's go"
      />
    </div>
  );
};

export default MarioCharacter;
