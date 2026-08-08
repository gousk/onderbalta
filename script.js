import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

const canvas = document.querySelector("#roomCanvas");
const roomStage = document.querySelector(".room-stage");
const loadingScreen = document.querySelector("#loadingScreen");
const webglFallback = document.querySelector("#webglFallback");
const viewCursor = document.querySelector("#viewCursor");
const siteHeader = document.querySelector("#siteHeader");
const headerWordmark = document.querySelector("#headerWordmark");
const projectPanel = document.querySelector("#projectPanel");
const projectClose = document.querySelector("#projectClose");
const projectMeta = document.querySelector("#projectMeta");
const projectTitle = document.querySelector("#projectTitle");
const projectDescription = document.querySelector("#projectDescription");
const projectPreview = document.querySelector("#projectPreview");
const projectPreviewVideo = document.querySelector("#projectPreviewVideo");
const projectPreviewImage = document.querySelector("#projectPreviewImage");
const projectPreviewLabel = document.querySelector("#projectPreviewLabel");
const projectLink = document.querySelector("#projectLink");
const cleanView = document.querySelector("#cleanView");
const cleanViewClose = document.querySelector("#cleanViewClose");
const cleanViewTitle = document.querySelector("#cleanViewTitle");
const cleanVideo = document.querySelector("#cleanVideo");
const cleanImage = document.querySelector("#cleanImage");
const cleanGalleryNav = document.querySelector("#cleanGalleryNav");
const cleanGalleryPrev = document.querySelector("#cleanGalleryPrev");
const cleanGalleryNext = document.querySelector("#cleanGalleryNext");
const cleanGalleryCount = document.querySelector("#cleanGalleryCount");

const ROOM_WIDTH = 18;
const ROOM_HEIGHT = 6;
const ROOM_DEPTH = 18;
const EYE_HEIGHT = 2.82;
const TV_TARGET_HEIGHT = 1.6;
const TV_WALL_Z = -ROOM_DEPTH / 2 + 0.04;
const TV_HORIZONTAL_GAP = 0.015;
const TV_VERTICAL_GAP = -0.035;
const TV_WALL_ROWS = [
  { offsetX: -0.08, scales: [1, 0.98, 1.01, 0.97, 0.99] },
  { offsetX: 0.12, scales: [0.98, 1, 0.97, 1.01, 0.98] },
  { offsetX: -0.04, scales: [0.99, 0.97, 1, 0.98] },
];
const SOCIAL_LINKS = {
  socialLinkedin: {
    label: "linkedin",
    url: "https://www.linkedin.com/in/onderbalta/",
    iconPath: "M6.94 8.5H3.56V19.5h3.38V8.5Zm.22-3.4a1.96 1.96 0 1 0-3.92 0 1.96 1.96 0 0 0 3.92 0ZM20.44 12.74c0-3.31-1.76-4.85-4.12-4.85-1.9 0-2.75 1.06-3.23 1.8V8.5H9.72c.04.79 0 11 0 11h3.37v-6.14c0-.33.02-.66.12-.89.27-.66.88-1.35 1.9-1.35 1.34 0 1.88 1.03 1.88 2.55v5.83h3.37v-6.76Z",
  },
  socialGithub: {
    label: "github",
    url: "https://github.com/Gousk",
    iconPath: "M12 2C6.48 2 2 6.58 2 12.24c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-1.03-.01-1.87-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.15-4.56-5.12 0-1.13.39-2.06 1.03-2.79-.1-.26-.45-1.32.1-2.75 0 0 .84-.28 2.75 1.07A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.36 1.91-1.35 2.75-1.07 2.75-1.07.55 1.43.2 2.49.1 2.75.64.73 1.03 1.66 1.03 2.79 0 3.98-2.34 4.86-4.58 5.11.36.32.68.94.68 1.9 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z",
  },
  socialItch: {
    label: "itch.io",
    url: "https://gousk.itch.io/",
    iconSrc: "assets/itchio-logo-textless-white.png",
  },
};
const EXTERNAL_SCREEN_LINKS = {
  deliveryGuy: {
    label: "steam",
    url: "https://store.steampowered.com/app/3377340/Delivery_Guy_Simulator/",
  },
};
const TV_SCREEN_LAYOUT = [
  ["scene01", "socialItch", "bicycleVideo", "static", "scene03"],
  ["static", "scene02", "static", "socialGithub", "static"],
  ["socialLinkedin", "static", "nullGame", "deliveryGuy"],
];
const TV_SCREEN_MEDIA = {
  scene01: {
    type: "video",
    src: "assets/optimized-media/scene-01-horse.mp4",
  },
  scene02: {
    type: "video",
    src: "assets/optimized-media/scene-02-blob-tracking.mp4",
  },
  scene03: {
    type: "video",
    src: "assets/optimized-media/scene-03-bicycle-intro.mp4",
  },
  bicycleVideo: {
    type: "video",
    src: "assets/optimized-media/bicycle-club-intro.mp4",
  },
  deliveryGuy: {
    type: "video",
    src: "assets/optimized-media/delivery-guy-official-trailer-720p.mp4",
  },
  nullGame: {
    type: "image",
    src: "assets/optimized-media/null-game-preview.png",
  },
};
const TV_PROJECTS = {
  scene01: {
    title: "scene 01",
    meta: "environment   2026",
    description:
      "A Unity environment study built around procedural god rays bird flocks and horse systems",
  },
  scene02: {
    title: "scene 02",
    meta: "environment   2026",
    description:
      "A Unity experiment focused on procedural blob tracking and responsive motion",
  },
  scene03: {
    title: "scene 03",
    meta: "environment   2026",
    description:
      "A test intro sequence created for Bicycle Club games and videos",
  },
  bicycleVideo: {
    title: "bicycle club",
    meta: "website   2026",
    description:
      "A dense terminal inspired platform built with React Vite Supabase and an interface shaped by ASCII imagery",
    url: "https://bicycleclub.net",
    gallery: [
      {
        src: "assets/optimized-media/bicycle-club-site.webp",
        alt: "Bicycle Club website interface",
      },
    ],
  },
  nullGame: {
    title: "null",
    meta: "game   prototype",
    description:
      "A fast paced level based movement shooter currently being developed as a playable prototype",
    url: "https://gousk.itch.io/null",
  },
};

let renderer;

try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
} catch (error) {
  loadingScreen.classList.add("is-hidden");
  webglFallback.hidden = false;
  throw error;
}

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.82;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
RectAreaLightUniformsLib.init();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x171819);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(0, EYE_HEIGHT, 0);
camera.lookAt(0, EYE_HEIGHT, -ROOM_DEPTH / 2);

const pointerTarget = new THREE.Vector2();
const smoothedPointer = new THREE.Vector2();
const pointerNdc = new THREE.Vector2(2, 2);
const raycaster = new THREE.Raycaster();
const interactiveScreenMeshes = [];
const allScreenEntries = [];
const introLetterScreenEntries = [];
const homeCameraPosition = new THREE.Vector3();
const homeLookTarget = new THREE.Vector3();
const focusCameraPosition = new THREE.Vector3();
const focusLookTarget = new THREE.Vector3();
const movingFocusCameraPosition = new THREE.Vector3();
const movingFocusLookTarget = new THREE.Vector3();
const finalLookTarget = new THREE.Vector3();
const interactionWorldPosition = new THREE.Vector3();
const focusedScreenBounds = new THREE.Box3();
const projectedScreenCorner = new THREE.Vector3();
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const FOCUS_RELEASE_THRESHOLD = 0.03;
let hoveredScreen = null;
let focusedScreen = null;
let focusAmount = 0;
let focusTarget = 0;
let projectPanelSideOffset = null;
let cleanViewMode = null;
let cleanGalleryItems = [];
let cleanGalleryIndex = 0;
let previousFrameTime = performance.now() * 0.001;

function handlePointerMove(event) {
  const pointerX = THREE.MathUtils.clamp(
    (event.clientX / window.innerWidth) * 2 - 1,
    -1,
    1,
  );
  const pointerY = THREE.MathUtils.clamp(
    1 - (event.clientY / window.innerHeight) * 2,
    -1,
    1,
  );

  pointerTarget.set(pointerX, pointerY);
  pointerNdc.set(pointerX, pointerY);
  viewCursor.style.transform = `translate3d(${event.clientX + 16}px, ${event.clientY + 16}px, 0)`;
}

function resetPointerTarget() {
  pointerTarget.set(0, 0);
  pointerNdc.set(2, 2);
  setHoveredScreen(null);
}

window.addEventListener("pointermove", handlePointerMove, { passive: true });
document.documentElement.addEventListener("mouseleave", resetPointerTarget);

const smoothWhiteMaterial = new THREE.MeshStandardMaterial({
  color: 0xf7f7f4,
  roughness: 1,
  metalness: 0,
  side: THREE.DoubleSide,
});

const concreteTextureLoader = new THREE.TextureLoader();

function loadConcreteTexture(src, colorSpace = THREE.NoColorSpace) {
  const texture = concreteTextureLoader.load(src, render);
  texture.colorSpace = colorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = Math.min(
    renderer.capabilities.getMaxAnisotropy(),
    8,
  );
  return texture;
}

const concreteColorTexture = loadConcreteTexture(
  "assets/optimized-media/concrete-layers-02-diff-4k.jpg",
  THREE.SRGBColorSpace,
);
const concreteNormalTexture = loadConcreteTexture(
  "assets/optimized-media/concrete-layers-02-normal-gl-2k.jpg",
);
const concreteRoughnessTexture = loadConcreteTexture(
  "assets/optimized-media/concrete-layers-02-rough-2k.jpg",
);
const CONCRETE_TILE_SIZE = 6;

function createConcreteMaterial(width, height) {
  const colorTexture = concreteColorTexture.clone();
  const normalTexture = concreteNormalTexture.clone();
  const roughnessTexture = concreteRoughnessTexture.clone();
  const repeatX = width / CONCRETE_TILE_SIZE;
  const repeatY = height / CONCRETE_TILE_SIZE;

  [colorTexture, normalTexture, roughnessTexture].forEach((texture) => {
    texture.repeat.set(repeatX, repeatY);
    texture.needsUpdate = true;
  });

  return new THREE.MeshStandardMaterial({
    color: 0xd8d5cf,
    map: colorTexture,
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(0.72, 0.72),
    roughness: 0.92,
    roughnessMap: roughnessTexture,
    metalness: 0,
    side: THREE.DoubleSide,
  });

}

function createSurface(
  width,
  height,
  position,
  rotation = [0, 0, 0],
  useConcrete = false,
) {
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = useConcrete
    ? createConcreteMaterial(width, height)
    : smoothWhiteMaterial;
  const surface = new THREE.Mesh(geometry, material);

  surface.position.set(...position);
  surface.rotation.set(...rotation);
  surface.receiveShadow = true;
  scene.add(surface);

  return surface;
}

// Back and front walls.
createSurface(
  ROOM_WIDTH,
  ROOM_HEIGHT,
  [0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2],
  [0, 0, 0],
  true,
);
createSurface(
  ROOM_WIDTH,
  ROOM_HEIGHT,
  [0, ROOM_HEIGHT / 2, ROOM_DEPTH / 2],
  [0, Math.PI, 0],
  true,
);

// Left and right walls.
createSurface(
  ROOM_DEPTH,
  ROOM_HEIGHT,
  [-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0],
  [0, Math.PI / 2, 0],
  true,
);
createSurface(
  ROOM_DEPTH,
  ROOM_HEIGHT,
  [ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0],
  [0, -Math.PI / 2, 0],
  true,
);

// Floor and ceiling.
createSurface(
  ROOM_WIDTH,
  ROOM_DEPTH,
  [0, 0, 0],
  [-Math.PI / 2, 0, 0],
  true,
);
createSurface(
  ROOM_WIDTH,
  ROOM_DEPTH,
  [0, ROOM_HEIGHT, 0],
  [Math.PI / 2, 0, 0],
  true,
);

const ambientLight = new THREE.HemisphereLight(0xcfd6da, 0x6f6962, 0.24);
scene.add(ambientLight);

const KEY_LIGHT_BASE_INTENSITY = 82;
const keyLight = new THREE.SpotLight(
  0xffffff,
  KEY_LIGHT_BASE_INTENSITY,
  18,
  Math.PI / 2.8,
  0.86,
  2,
);
keyLight.position.set(0, ROOM_HEIGHT - 0.36, -1.5);
keyLight.target.position.set(0, 0.5, -5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.near = 0.2;
keyLight.shadow.camera.far = 18;
keyLight.shadow.bias = -0.00025;
keyLight.shadow.normalBias = 0.035;
keyLight.shadow.radius = 4;
scene.add(keyLight, keyLight.target);

const ceilingPanelMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  toneMapped: false,
});
const ceilingPanelBaseColor = ceilingPanelMaterial.color.clone();
const ceilingFixtures = [];
let ceilingLightPower = 1;
const ceilingHousingMaterial = new THREE.MeshStandardMaterial({
  color: 0x292b2b,
  roughness: 0.78,
  metalness: 0.18,
});

function createCeilingFixture(z, intensity) {
  const housing = new THREE.Mesh(
    new THREE.BoxGeometry(3.65, 0.1, 0.72),
    ceilingHousingMaterial,
  );
  housing.position.set(0, ROOM_HEIGHT - 0.075, z);
  housing.castShadow = true;
  scene.add(housing);

  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(3.35, 0.48),
    ceilingPanelMaterial,
  );
  panel.position.set(0, ROOM_HEIGHT - 0.132, z);
  panel.rotation.x = Math.PI / 2;
  scene.add(panel);

  const areaLight = new THREE.RectAreaLight(
    0xffffff,
    intensity,
    3.35,
    0.48,
  );
  areaLight.position.set(0, ROOM_HEIGHT - 0.16, z);
  areaLight.lookAt(0, 0, z);
  scene.add(areaLight);
  ceilingFixtures.push({ areaLight, baseIntensity: intensity });
}

createCeilingFixture(3.8, 2.1);
createCeilingFixture(-1.5, 2.8);
createCeilingFixture(-6.7, 2.35);

const tvGlowLight = new THREE.PointLight(0x91b6c8, 3.2, 5.5, 2);
tvGlowLight.position.set(0, 2.25, TV_WALL_Z + 1.45);
scene.add(tvGlowLight);

const interactionLight = new THREE.PointLight(0xc8efd1, 0, 3.2, 2);
interactionLight.position.set(0, EYE_HEIGHT, TV_WALL_Z + 0.8);
scene.add(interactionLight);

const activeScreenVideos = [];
const screenVideoByMediaKey = new Map();
const screenTextureCache = new Map();
const screenMediaAspectCache = new Map();
const crtScreenMaterials = [];
const screenGlowEntries = [];
const sampledScreenLightCache = new Map();
const screenLightSampleCanvas = document.createElement("canvas");
screenLightSampleCanvas.width = 12;
screenLightSampleCanvas.height = 12;
const screenLightSampleContext = screenLightSampleCanvas.getContext("2d", {
  willReadFrequently: true,
});
let nextScreenLightSampleAt = 0;

const sharedTitleCanvas = document.createElement("canvas");
const sharedTitleContext = sharedTitleCanvas.getContext("2d");
const FLOATING_TITLE_ENABLED = false;
const INTRO_HANDOFF_DURATION = 0.92;
const INTRO_FADE_DURATION = 0.9;
const INTRO_POWER_DURATION = 1.15;
const INTRO_CAMERA_PULL_DURATION = INTRO_HANDOFF_DURATION + INTRO_FADE_DURATION;
const GRAYSCALE_FADE_DELAY = 0.34;
const GRAYSCALE_FADE_DURATION = 0.82;
const CRT_SCREEN_ASPECT = 1.3126972362;
const INTRO_HOVER_OUTER_RANGE = 1.55;
const INTRO_CAMERA_Z = -1.35;
const INTRO_CAMERA_HEIGHT = 2.38;
let sharedTitleWallAspect = 1.6;
let sharedTitleTexture;
let introTitleTexture;
let introLetterTitleBounds = null;
let introHoverHitArea = null;
let introStage = "waiting";
let introStageStartedAt = 0;
let introSequenceStartedAt = 0;
let introCompletedAt = 0;
let siteHeaderVisible = false;
const introWaveOrigin = new THREE.Vector2(0.5, 0.5);
let floatingTitleGroup = null;
let floatingTitleHitArea = null;
const floatingTitleLetters = [];
let titleTransferAmount = 0;
let titleTransferTarget = 0;

function getIntroTitleLayout(context, canvasWidth, canvasHeight) {
  const preferredFontSize = canvasHeight * 0.43;
  context.font = `500 ${preferredFontSize}px "Onder Medium", sans-serif`;
  const widestLine = Math.max(
    context.measureText("onder").width,
    context.measureText("balta").width,
  );
  const fontSize = preferredFontSize * Math.min(
    1,
    (canvasWidth * 0.86) / widestLine,
  );

  return {
    fontSize,
    lines: [
      { text: "onder", y: canvasHeight * 0.27 },
      { text: "balta", y: canvasHeight * 0.73 },
    ],
  };
}

function drawIntroTvLetters(context, canvasWidth, canvasHeight, withGlow = false) {
  if (!introLetterTitleBounds || introLetterScreenEntries.length === 0) {
    return false;
  }

  const boundsWidth = introLetterTitleBounds.max.x - introLetterTitleBounds.min.x;
  const boundsHeight = introLetterTitleBounds.max.y - introLetterTitleBounds.min.y;
  if (boundsWidth <= 0 || boundsHeight <= 0) return false;

  const fontSize = canvasHeight * 0.34;
  const screenBounds = new THREE.Box3();
  const screenCenter = new THREE.Vector3();
  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `500 ${fontSize}px "Onder Medium", sans-serif`;
  context.fillStyle = "#ffffff";
  context.shadowColor = withGlow ? "rgba(255, 255, 255, 0.76)" : "transparent";
  context.shadowBlur = withGlow ? Math.max(18, canvasHeight * 0.022) : 0;

  introLetterScreenEntries.forEach((entry) => {
    const word = entry.rowIndex === 1 ? "onder" : "balta";
    const character = word[entry.unitIndex];
    if (!character) return;

    screenBounds.setFromObject(entry.mesh);
    screenBounds.getCenter(screenCenter);
    const normalizedX = (screenCenter.x - introLetterTitleBounds.min.x) / boundsWidth;
    const normalizedY = (screenCenter.y - introLetterTitleBounds.min.y) / boundsHeight;
    context.fillText(
      character,
      normalizedX * canvasWidth,
      (1 - normalizedY) * canvasHeight,
    );
  });
  context.restore();
  return true;
}

function drawSharedTitleTexture(wallAspect = sharedTitleWallAspect) {
  sharedTitleWallAspect = wallAspect;
  const canvasWidth = 2048;
  const canvasHeight = THREE.MathUtils.clamp(
    Math.round(canvasWidth / wallAspect),
    960,
    1600,
  );

  sharedTitleCanvas.width = canvasWidth;
  sharedTitleCanvas.height = canvasHeight;
  sharedTitleContext.clearRect(0, 0, canvasWidth, canvasHeight);

  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = canvasWidth;
  maskCanvas.height = canvasHeight;
  const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
  maskContext.clearRect(0, 0, canvasWidth, canvasHeight);
  if (!drawIntroTvLetters(maskContext, canvasWidth, canvasHeight)) {
    const titleLayout = getIntroTitleLayout(maskContext, canvasWidth, canvasHeight);
    maskContext.textAlign = "center";
    maskContext.textBaseline = "middle";
    maskContext.font = `500 ${titleLayout.fontSize}px "Onder Medium", sans-serif`;
    maskContext.fillStyle = "#ffffff";
    titleLayout.lines.forEach(({ text, y }) => {
      maskContext.fillText(text, canvasWidth * 0.5, y);
    });
  }

  const maskPixels = maskContext.getImageData(
    0,
    0,
    canvasWidth,
    canvasHeight,
  ).data;
  const characters = ".`',:;~-+=*#%@";
  const accentCharacters = [".", "`", "'", ":", ";"];
  const cellSize = Math.max(10, Math.round(canvasHeight / 80));
  const characterAccents = [];
  sharedTitleContext.textAlign = "center";
  sharedTitleContext.textBaseline = "middle";
  sharedTitleContext.font = `700 ${cellSize * 0.88}px Menlo, Monaco, monospace`;
  sharedTitleContext.shadowColor = "rgba(255, 255, 255, 0.52)";
  sharedTitleContext.shadowBlur = 5;

  for (let y = cellSize * 0.5; y < canvasHeight; y += cellSize) {
    for (let x = cellSize * 0.5; x < canvasWidth; x += cellSize) {
      const sampleOffset = cellSize * 0.3;
      const samples = [
        [x, y],
        [x - sampleOffset, y - sampleOffset],
        [x + sampleOffset, y - sampleOffset],
        [x - sampleOffset, y + sampleOffset],
        [x + sampleOffset, y + sampleOffset],
      ];
      let coverage = 0;
      samples.forEach(([sampleX, sampleY]) => {
        const pixelX = Math.max(0, Math.min(canvasWidth - 1, Math.round(sampleX)));
        const pixelY = Math.max(0, Math.min(canvasHeight - 1, Math.round(sampleY)));
        coverage += maskPixels[(pixelY * canvasWidth + pixelX) * 4 + 3] / 255;
      });
      coverage /= samples.length;
      if (coverage < 0.1) continue;

      const noise = ((x * 17 + y * 31) % 29) / 28;
      const textureWave =
        0.5 +
        Math.sin(x * 0.037 + y * 0.021) * 0.22 +
        Math.sin(x * 0.013 - y * 0.043) * 0.18;
      const tonalValue = THREE.MathUtils.clamp(
        coverage * 0.62 + textureWave * 0.25 + noise * 0.13,
        0,
        1,
      );
      const characterIndex = Math.min(
        characters.length - 1,
        Math.floor(tonalValue * characters.length),
      );
      const brightness = THREE.MathUtils.clamp(
        0.5 + coverage * 0.35 + textureWave * 0.15,
        0.48,
        1,
      );
      sharedTitleContext.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      sharedTitleContext.fillText(characters[characterIndex], x, y);

      if (coverage > 0.5 && noise > 0.64) {
        characterAccents.push({
          character: accentCharacters[(characterIndex + Math.round(noise * 7)) % accentCharacters.length],
          x: x + (noise - 0.5) * cellSize * 0.7,
          y: y + (textureWave - 0.5) * cellSize * 0.65,
          opacity: 0.2 + noise * 0.22,
        });
      }
    }
  }

  sharedTitleContext.font = `600 ${cellSize * 0.52}px Menlo, Monaco, monospace`;
  sharedTitleContext.shadowBlur = 2;
  characterAccents.forEach(({ character, x, y, opacity }) => {
    sharedTitleContext.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    sharedTitleContext.fillText(character, x, y);
  });
  sharedTitleContext.shadowBlur = 0;

  if (sharedTitleTexture) {
    sharedTitleTexture.needsUpdate = true;
    render();
  }
}

drawSharedTitleTexture();
sharedTitleTexture = new THREE.CanvasTexture(sharedTitleCanvas);
sharedTitleTexture.colorSpace = THREE.SRGBColorSpace;
sharedTitleTexture.minFilter = THREE.LinearMipmapLinearFilter;
sharedTitleTexture.magFilter = THREE.LinearFilter;
sharedTitleTexture.anisotropy = Math.min(
  renderer.capabilities.getMaxAnisotropy(),
  8,
);

const introTitleCanvas = document.createElement("canvas");
const introTitleContext = introTitleCanvas.getContext("2d");

function drawIntroTitleTexture(wallAspect = sharedTitleWallAspect) {
  const canvasWidth = 2048;
  const canvasHeight = THREE.MathUtils.clamp(
    Math.round(canvasWidth / wallAspect),
    960,
    1600,
  );
  introTitleCanvas.width = canvasWidth;
  introTitleCanvas.height = canvasHeight;
  introTitleContext.clearRect(0, 0, introTitleCanvas.width, introTitleCanvas.height);
  if (drawIntroTvLetters(
    introTitleContext,
    introTitleCanvas.width,
    introTitleCanvas.height,
    true,
  )) {
    if (introTitleTexture) introTitleTexture.needsUpdate = true;
    return;
  }

  const titleLayout = getIntroTitleLayout(
    introTitleContext,
    introTitleCanvas.width,
    introTitleCanvas.height,
  );
  introTitleContext.textAlign = "center";
  introTitleContext.textBaseline = "middle";
  introTitleContext.font = `500 ${titleLayout.fontSize}px "Onder Medium", sans-serif`;
  introTitleContext.fillStyle = "#ffffff";
  introTitleContext.shadowColor = "rgba(255, 255, 255, 0.76)";
  introTitleContext.shadowBlur = Math.max(24, introTitleCanvas.height * 0.025);
  titleLayout.lines.forEach(({ text, y }) => {
    introTitleContext.fillText(text, introTitleCanvas.width * 0.5, y);
  });
  introTitleContext.shadowBlur = 0;

  if (introTitleTexture) introTitleTexture.needsUpdate = true;
}

drawIntroTitleTexture();
introTitleTexture = new THREE.CanvasTexture(introTitleCanvas);
introTitleTexture.colorSpace = THREE.SRGBColorSpace;
introTitleTexture.minFilter = THREE.LinearMipmapLinearFilter;
introTitleTexture.magFilter = THREE.LinearFilter;
introTitleTexture.anisotropy = Math.min(
  renderer.capabilities.getMaxAnisotropy(),
  8,
);

const introLetterTextureCache = new Map();

function drawIntroLetterTextureSet(letterSet) {
  const { character, regularCanvas, asciiCanvas, regularTexture, asciiTexture } = letterSet;
  const width = 800;
  const height = 800;
  regularCanvas.width = width;
  regularCanvas.height = height;
  asciiCanvas.width = width;
  asciiCanvas.height = height;

  const regularContext = regularCanvas.getContext("2d");
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = width;
  maskCanvas.height = height;
  const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
  const fontSize = height * 0.64;

  regularContext.clearRect(0, 0, width, height);
  regularContext.fillStyle = "#ffffff";
  regularContext.shadowColor = "rgba(255, 255, 255, 0.58)";
  regularContext.shadowBlur = 3;

  maskContext.clearRect(0, 0, width, height);
  maskContext.textAlign = "center";
  maskContext.textBaseline = "middle";
  maskContext.font = `500 ${fontSize}px "Onder Medium", sans-serif`;
  maskContext.fillStyle = "#ffffff";
  maskContext.fillText(character, width * 0.5, height * 0.56);

  const maskPixels = maskContext.getImageData(0, 0, width, height).data;
  const asciiContext = asciiCanvas.getContext("2d");
  const characters = ".`',:;~-+=*#%@";
  const cellSize = 16;
  asciiContext.clearRect(0, 0, width, height);
  asciiContext.textAlign = "center";
  asciiContext.textBaseline = "middle";
  asciiContext.font = `700 ${cellSize * 0.88}px Menlo, Monaco, monospace`;
  asciiContext.shadowColor = "rgba(255, 255, 255, 0.5)";
  asciiContext.shadowBlur = 3;

  for (let y = cellSize * 0.5; y < height; y += cellSize) {
    for (let x = cellSize * 0.5; x < width; x += cellSize) {
      const sampleOffset = cellSize * 0.3;
      const samples = [
        [x, y],
        [x - sampleOffset, y - sampleOffset],
        [x + sampleOffset, y - sampleOffset],
        [x - sampleOffset, y + sampleOffset],
        [x + sampleOffset, y + sampleOffset],
      ];
      let coverage = 0;
      samples.forEach(([sampleX, sampleY]) => {
        const pixelX = Math.max(0, Math.min(width - 1, Math.round(sampleX)));
        const pixelY = Math.max(0, Math.min(height - 1, Math.round(sampleY)));
        coverage += maskPixels[(pixelY * width + pixelX) * 4 + 3] / 255;
      });
      coverage /= samples.length;
      if (coverage < 0.1) continue;

      regularContext.fillRect(
        x - cellSize * 0.5,
        y - cellSize * 0.5,
        cellSize,
        cellSize,
      );

      const noise = ((x * 17 + y * 31 + character.charCodeAt(0) * 7) % 29) / 28;
      const textureWave =
        0.5 +
        Math.sin(x * 0.037 + y * 0.021) * 0.22 +
        Math.sin(x * 0.013 - y * 0.043) * 0.18;
      const tonalValue = THREE.MathUtils.clamp(
        coverage * 0.62 + textureWave * 0.25 + noise * 0.13,
        0,
        1,
      );
      const characterIndex = Math.min(
        characters.length - 1,
        Math.floor(tonalValue * characters.length),
      );
      asciiContext.fillStyle = `rgba(255, 255, 255, ${0.52 + coverage * 0.42})`;
      asciiContext.fillText(characters[characterIndex], x, y);
    }
  }
  regularContext.shadowBlur = 0;
  asciiContext.shadowBlur = 0;

  if (regularTexture) regularTexture.needsUpdate = true;
  if (asciiTexture) asciiTexture.needsUpdate = true;
}

function getIntroLetterTextureSet(character) {
  if (introLetterTextureCache.has(character)) {
    return introLetterTextureCache.get(character);
  }

  const letterSet = {
    character,
    regularCanvas: document.createElement("canvas"),
    asciiCanvas: document.createElement("canvas"),
    regularTexture: null,
    asciiTexture: null,
  };
  drawIntroLetterTextureSet(letterSet);

  letterSet.regularTexture = new THREE.CanvasTexture(letterSet.regularCanvas);
  letterSet.asciiTexture = new THREE.CanvasTexture(letterSet.asciiCanvas);
  [letterSet.regularTexture, letterSet.asciiTexture].forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  });
  introLetterTextureCache.set(character, letterSet);
  return letterSet;
}

function drawFloatingTitleLetter(letterEntry) {
  const { canvas, character, texture } = letterEntry;
  const context = canvas.getContext("2d");
  const fontSize = 240;
  context.font = `500 ${fontSize}px "Onder Medium", sans-serif`;
  const measuredWidth = context.measureText(character).width;
  canvas.width = Math.ceil(measuredWidth + 104);
  canvas.height = 340;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `500 ${fontSize}px "Onder Medium", sans-serif`;
  context.fillStyle = "#ffffff";
  context.shadowColor = "rgba(255, 255, 255, 0.82)";
  context.shadowBlur = 34;
  context.fillText(character, canvas.width * 0.5, canvas.height * 0.51);
  context.shadowBlur = 0;

  if (texture) texture.needsUpdate = true;
}

function redrawFloatingTitleLetters() {
  floatingTitleLetters.forEach((entry) => drawFloatingTitleLetter(entry));
}

const socialScreenCanvases = new Map();
const socialScreenTextures = new Map();
const socialAsciiScreenCanvases = new Map();
const socialAsciiScreenTextures = new Map();
const socialIconImages = new Map();
const SOCIAL_ASCII_CHARACTERS = ".`',:;~-+=*#%@";

function drawSocialIconMask(mediaKey, maskCanvas) {
  const social = SOCIAL_LINKS[mediaKey];
  const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
  maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  maskContext.fillStyle = "#ffffff";

  const iconSize = Math.min(maskCanvas.width, maskCanvas.height) * 0.36;
  const iconX = (maskCanvas.width - iconSize) * 0.5;
  const iconY = (maskCanvas.height - iconSize) * 0.5;

  if (social.iconPath) {
    const scale = iconSize / 24;
    maskContext.save();
    maskContext.translate(iconX, iconY);
    maskContext.scale(scale, scale);
    maskContext.fill(new Path2D(social.iconPath));
    maskContext.restore();
    return true;
  }

  const iconImage = socialIconImages.get(mediaKey);
  if (!iconImage?.complete || !iconImage.naturalWidth) return false;

  const imageAspect = iconImage.naturalWidth / iconImage.naturalHeight;
  const drawWidth = imageAspect >= 1 ? iconSize : iconSize * imageAspect;
  const drawHeight = imageAspect >= 1 ? iconSize / imageAspect : iconSize;
  maskContext.drawImage(
    iconImage,
    (maskCanvas.width - drawWidth) * 0.5,
    (maskCanvas.height - drawHeight) * 0.5,
    drawWidth,
    drawHeight,
  );
  return true;
}

function drawSocialScreenTexture(mediaKey) {
  const social = SOCIAL_LINKS[mediaKey];
  const pixelCanvas = socialScreenCanvases.get(mediaKey);
  const asciiCanvas = socialAsciiScreenCanvases.get(mediaKey);
  if (!social || !pixelCanvas || !asciiCanvas) return;

  const pixelContext = pixelCanvas.getContext("2d");
  const asciiContext = asciiCanvas.getContext("2d");
  [pixelContext, asciiContext].forEach((context) => {
    context.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
    context.fillStyle = "#020303";
    context.fillRect(0, 0, pixelCanvas.width, pixelCanvas.height);
  });

  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = pixelCanvas.width;
  maskCanvas.height = pixelCanvas.height;
  if (drawSocialIconMask(mediaKey, maskCanvas)) {
    const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
    const maskPixels = maskContext.getImageData(
      0,
      0,
      maskCanvas.width,
      maskCanvas.height,
    ).data;
    const socialCharacterColumns = 64;
    const cellSize = pixelCanvas.width / socialCharacterColumns;

    pixelContext.fillStyle = "#ffffff";
    pixelContext.shadowColor = "rgba(255, 255, 255, 0.58)";
    pixelContext.shadowBlur = 3;
    asciiContext.textAlign = "center";
    asciiContext.textBaseline = "middle";
    asciiContext.font = `700 ${cellSize * 0.88}px Menlo, Monaco, monospace`;
    asciiContext.shadowColor = "rgba(255, 255, 255, 0.5)";
    asciiContext.shadowBlur = 3;

    for (let y = cellSize * 0.5; y < pixelCanvas.height; y += cellSize) {
      for (let x = cellSize * 0.5; x < pixelCanvas.width; x += cellSize) {
        let coverage = 0;
        const sampleOffset = cellSize * 0.28;
        const samples = [
          [x, y],
          [x - sampleOffset, y - sampleOffset],
          [x + sampleOffset, y - sampleOffset],
          [x - sampleOffset, y + sampleOffset],
          [x + sampleOffset, y + sampleOffset],
        ];

        samples.forEach(([sampleX, sampleY]) => {
          const pixelX = Math.max(0, Math.min(pixelCanvas.width - 1, Math.round(sampleX)));
          const pixelY = Math.max(0, Math.min(pixelCanvas.height - 1, Math.round(sampleY)));
          coverage += maskPixels[(pixelY * pixelCanvas.width + pixelX) * 4 + 3] / 255;
        });
        coverage /= samples.length;
        if (coverage < 0.1) continue;

        pixelContext.fillRect(
          x - cellSize * 0.5,
          y - cellSize * 0.5,
          cellSize,
          cellSize,
        );

        const noise = ((x * 17 + y * 31 + mediaKey.length * 13) % 29) / 28;
        const textureWave =
          0.5 +
          Math.sin(x * 0.037 + y * 0.021) * 0.22 +
          Math.sin(x * 0.013 - y * 0.043) * 0.18;
        const tonalValue = THREE.MathUtils.clamp(
          coverage * 0.62 + textureWave * 0.25 + noise * 0.13,
          0,
          1,
        );
        const characterIndex = Math.min(
          SOCIAL_ASCII_CHARACTERS.length - 1,
          Math.floor(tonalValue * SOCIAL_ASCII_CHARACTERS.length),
        );
        asciiContext.fillStyle = `rgba(255, 255, 255, ${0.52 + coverage * 0.42})`;
        asciiContext.fillText(SOCIAL_ASCII_CHARACTERS[characterIndex], x, y);
      }
    }
    pixelContext.shadowBlur = 0;
    asciiContext.shadowBlur = 0;
  }

  const pixelTexture = socialScreenTextures.get(mediaKey);
  const asciiTexture = socialAsciiScreenTextures.get(mediaKey);
  if (pixelTexture) pixelTexture.needsUpdate = true;
  if (asciiTexture) asciiTexture.needsUpdate = true;
}

Object.keys(SOCIAL_LINKS).forEach((mediaKey) => {
  const socialCanvas = document.createElement("canvas");
  socialCanvas.width = 800;
  socialCanvas.height = 800;
  const socialAsciiCanvas = document.createElement("canvas");
  socialAsciiCanvas.width = 800;
  socialAsciiCanvas.height = 800;
  socialScreenCanvases.set(mediaKey, socialCanvas);
  socialAsciiScreenCanvases.set(mediaKey, socialAsciiCanvas);

  const socialTexture = new THREE.CanvasTexture(socialCanvas);
  const socialAsciiTexture = new THREE.CanvasTexture(socialAsciiCanvas);
  [socialTexture, socialAsciiTexture].forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  });
  socialScreenTextures.set(mediaKey, socialTexture);
  socialAsciiScreenTextures.set(mediaKey, socialAsciiTexture);
  screenMediaAspectCache.set(mediaKey, socialCanvas.width / socialCanvas.height);
  drawSocialScreenTexture(mediaKey);

  const iconSrc = SOCIAL_LINKS[mediaKey].iconSrc;
  if (iconSrc) {
    const iconImage = new Image();
    iconImage.decoding = "async";
    iconImage.addEventListener("load", () => drawSocialScreenTexture(mediaKey));
    socialIconImages.set(mediaKey, iconImage);
    iconImage.src = iconSrc;
  }
});

function drawHeaderAsciiWordmark() {
  if (!headerWordmark) return;

  const width = 880;
  const height = 184;
  const cellSize = 8;
  const context = headerWordmark.getContext("2d");
  const maskCanvas = document.createElement("canvas");
  const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });

  headerWordmark.width = width;
  headerWordmark.height = height;
  maskCanvas.width = width;
  maskCanvas.height = height;

  maskContext.clearRect(0, 0, width, height);
  maskContext.fillStyle = "#ffffff";
  const wordmarkText = "onder balta";
  const initialFontSize = 112;
  maskContext.font = `500 ${initialFontSize}px "Onder Medium", sans-serif`;
  const initialMetrics = maskContext.measureText(wordmarkText);
  const fittedFontSize = initialFontSize * Math.min(
    1,
    (width - 96) / Math.max(initialMetrics.width, 1),
  );
  maskContext.font = `500 ${fittedFontSize}px "Onder Medium", sans-serif`;
  const fittedMetrics = maskContext.measureText(wordmarkText);
  const ascent = fittedMetrics.actualBoundingBoxAscent || fittedFontSize * 0.72;
  const descent = fittedMetrics.actualBoundingBoxDescent || fittedFontSize * 0.2;
  const wordmarkBaseline = (height + ascent - descent) * 0.5;
  maskContext.textAlign = "center";
  maskContext.textBaseline = "alphabetic";
  maskContext.fillText(wordmarkText, width * 0.5, wordmarkBaseline);

  const maskPixels = maskContext.getImageData(0, 0, width, height).data;
  const characters = ".,:;-=+*#%@";
  context.clearRect(0, 0, width, height);
  context.font = `700 ${cellSize * 0.92}px Menlo, Monaco, monospace`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.shadowColor = "rgba(236, 245, 239, 0.42)";
  context.shadowBlur = 3;

  for (let y = cellSize * 0.5; y < height; y += cellSize) {
    for (let x = cellSize * 0.5; x < width; x += cellSize) {
      const sampleRadius = cellSize * 0.3;
      const samplePoints = [
        [x, y],
        [x - sampleRadius, y - sampleRadius],
        [x + sampleRadius, y - sampleRadius],
        [x - sampleRadius, y + sampleRadius],
        [x + sampleRadius, y + sampleRadius],
      ];
      let coverage = 0;

      samplePoints.forEach(([sampleX, sampleY]) => {
        const pixelX = Math.max(0, Math.min(width - 1, Math.round(sampleX)));
        const pixelY = Math.max(0, Math.min(height - 1, Math.round(sampleY)));
        coverage += maskPixels[(pixelY * width + pixelX) * 4 + 3] / 255;
      });
      coverage /= samplePoints.length;
      if (coverage < 0.08) continue;

      const noise = ((x * 19 + y * 37) % 43) / 42;
      const texture =
        0.5 +
        Math.sin(x * 0.073 + y * 0.041) * 0.19 +
        Math.sin(x * 0.021 - y * 0.067) * 0.14;
      const tone = THREE.MathUtils.clamp(
        coverage * 0.68 + texture * 0.2 + noise * 0.12,
        0,
        1,
      );
      const characterIndex = Math.min(
        characters.length - 1,
        Math.floor(tone * characters.length),
      );

      context.fillStyle = `rgba(244, 248, 245, ${0.48 + coverage * 0.5})`;
      context.fillText(characters[characterIndex], x, y);
    }
  }

  context.shadowBlur = 0;
}

drawHeaderAsciiWordmark();

document.fonts?.load('500 160px "Onder Medium"').then(() => {
  drawSharedTitleTexture();
  drawIntroTitleTexture();
  introLetterTextureCache.forEach(drawIntroLetterTextureSet);
  redrawFloatingTitleLetters();
  Object.keys(SOCIAL_LINKS).forEach(drawSocialScreenTexture);
  drawHeaderAsciiWordmark();
});

const blankScreenTexture = new THREE.DataTexture(
  new Uint8Array([0, 0, 0, 255]),
  1,
  1,
  THREE.RGBAFormat,
);
blankScreenTexture.needsUpdate = true;
blankScreenTexture.colorSpace = THREE.SRGBColorSpace;
blankScreenTexture.flipY = true;

function updateScreenMediaAspect(mediaKey, aspect) {
  if (!Number.isFinite(aspect) || aspect <= 0) return;

  screenMediaAspectCache.set(mediaKey, aspect);
  crtScreenMaterials.forEach((material) => {
    if (material.userData.mediaKey === mediaKey) {
      material.uniforms.uMediaAspect.value = aspect;
    }
  });
}

function createScreenVideoTexture(mediaKey, src) {
  const video = document.createElement("video");
  video.src = src;
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  video.preload = "auto";
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.addEventListener("loadedmetadata", () => {
    updateScreenMediaAspect(mediaKey, video.videoWidth / video.videoHeight);
  });
  activeScreenVideos.push(video);
  screenVideoByMediaKey.set(mediaKey, video);

  const texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.flipY = true;

  return texture;
}

function getScreenTexture(mediaKey) {
  if (mediaKey === "static") return blankScreenTexture;
  if (socialScreenTextures.has(mediaKey)) {
    return socialScreenTextures.get(mediaKey);
  }

  if (screenTextureCache.has(mediaKey)) {
    return screenTextureCache.get(mediaKey);
  }

  const media = TV_SCREEN_MEDIA[mediaKey];
  if (!media) return blankScreenTexture;

  const texture = media.type === "video"
    ? createScreenVideoTexture(mediaKey, media.src)
    : new THREE.TextureLoader().load(media.src, (loadedTexture) => {
        const { width, height } = loadedTexture.image;
        updateScreenMediaAspect(mediaKey, width / height);
        render();
      });

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.flipY = true;
  screenTextureCache.set(mediaKey, texture);

  return texture;
}

function sampleScreenLight(mediaKey, texture) {
  if (mediaKey === "static") {
    return {
      color: new THREE.Color(0x9fadb8),
      luminance: 0.16,
    };
  }

  const source = texture?.image;
  if (!source || !screenLightSampleContext) return null;
  if (source instanceof HTMLVideoElement && source.readyState < 2) return null;
  if (source instanceof HTMLImageElement && !source.complete) return null;

  try {
    screenLightSampleContext.clearRect(
      0,
      0,
      screenLightSampleCanvas.width,
      screenLightSampleCanvas.height,
    );
    screenLightSampleContext.drawImage(
      source,
      0,
      0,
      screenLightSampleCanvas.width,
      screenLightSampleCanvas.height,
    );
    const pixels = screenLightSampleContext.getImageData(
      0,
      0,
      screenLightSampleCanvas.width,
      screenLightSampleCanvas.height,
    ).data;

    let red = 0;
    let green = 0;
    let blue = 0;
    let weightTotal = 0;
    let luminanceTotal = 0;
    let visiblePixels = 0;

    for (let index = 0; index < pixels.length; index += 4) {
      const alpha = pixels[index + 3] / 255;
      if (alpha <= 0.01) continue;

      const pixelRed = pixels[index] / 255;
      const pixelGreen = pixels[index + 1] / 255;
      const pixelBlue = pixels[index + 2] / 255;
      const luminance =
        pixelRed * 0.2126 + pixelGreen * 0.7152 + pixelBlue * 0.0722;
      const emissionWeight = (0.035 + luminance * luminance) * alpha;

      red += pixelRed * emissionWeight;
      green += pixelGreen * emissionWeight;
      blue += pixelBlue * emissionWeight;
      weightTotal += emissionWeight;
      luminanceTotal += luminance * alpha;
      visiblePixels += alpha;
    }

    if (weightTotal <= 0 || visiblePixels <= 0) return null;

    const color = new THREE.Color();
    color.setRGB(
      red / weightTotal,
      green / weightTotal,
      blue / weightTotal,
      THREE.SRGBColorSpace,
    );

    return {
      color,
      luminance: THREE.MathUtils.clamp(
        0.1 + Math.sqrt(luminanceTotal / visiblePixels) * 0.72,
        0.12,
        0.82,
      ),
    };
  } catch (error) {
    return null;
  }
}

function configureScreenGlowLights() {
  const screenBounds = new THREE.Box3();
  const screenCenter = new THREE.Vector3();

  allScreenEntries.forEach((entry, index) => {
    screenBounds.setFromObject(entry.mesh);
    screenBounds.getCenter(screenCenter);

    const light = new THREE.PointLight(0xcbd4da, 0, 3.4, 2);
    light.position.copy(screenCenter);
    light.position.z += 0.48;
    scene.add(light);

    entry.glowLight = light;
    screenGlowEntries.push({
      entry,
      light,
      phase: index * 1.731 + entry.rowIndex * 0.47,
      targetColor: new THREE.Color(0xcbd4da),
    });
  });
}

function updateScreenGlowLights(elapsedTime, deltaTime) {
  if (elapsedTime >= nextScreenLightSampleAt) {
    nextScreenLightSampleAt = elapsedTime + 0.34;

    screenGlowEntries.forEach(({ entry }) => {
      const isVideo = TV_SCREEN_MEDIA[entry.mediaKey]?.type === "video";
      if (sampledScreenLightCache.has(entry.mediaKey) && !isVideo) {
        return;
      }

      const sample = sampleScreenLight(
        entry.mediaKey,
        entry.material.uniforms.uMedia.value,
      );
      if (sample) sampledScreenLightCache.set(entry.mediaKey, sample);
    });
  }

  const intensityEase = 1 - Math.exp(-deltaTime * 3.8);
  const colorEase = 1 - Math.exp(-deltaTime * 2.6);

  screenGlowEntries.forEach(({ entry, light, phase, targetColor }) => {
    const material = entry.material;
    const sample = sampledScreenLightCache.get(entry.mediaKey) ?? {
      color: new THREE.Color(0xb9c4ca),
      luminance: 0.2,
    };
    const hoverAmount = material.uniforms.uHoverAmount.value;
    const grayscaleReveal = material.uniforms.uGrayscaleReveal.value;
    const powerAmount = material.uniforms.uPowerAmount.value;
    const titleAmount = Math.max(
      material.uniforms.uIntroTitleOnScreenAmount.value,
      material.uniforms.uTitleOnScreenAmount.value,
    );
    const dimAmount = material.uniforms.uDimAmount.value;
    const isStatic = entry.mediaKey === "static";

    if (titleAmount > 0.01) {
      targetColor.set(0xdde3e6);
    } else if (isStatic) {
      targetColor.copy(sample.color);
    } else {
      const filteredColorAmount = THREE.MathUtils.lerp(
        1,
        0.45,
        grayscaleReveal,
      );
      const contentColorAmount = Math.max(hoverAmount, filteredColorAmount);
      targetColor.set(0xd3d7d8).lerp(sample.color, contentColorAmount);
    }

    light.color.lerp(targetColor, colorEase);

    const subtleFlicker = isStatic
      ? 0.91 + Math.sin(elapsedTime * 8.7 + phase) * 0.045
      : 0.97 +
        Math.sin(elapsedTime * 2.3 + phase) * 0.018 +
        Math.sin(elapsedTime * 7.1 + phase * 1.7) * 0.009;
    const visibleAmount = Math.max(powerAmount, titleAmount * 0.78);
    const baseIntensity = isStatic
      ? 0.62
      : 1.05 + sample.luminance * 2.35;
    const targetIntensity =
      baseIntensity *
      subtleFlicker *
      visibleAmount *
      THREE.MathUtils.lerp(1, 0.42, dimAmount);

    light.intensity += (targetIntensity - light.intensity) * intensityEase;
  });
}

const CRT_VERTEX_SHADER = `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

const CRT_FRAGMENT_SHADER = `
    uniform sampler2D uMedia;
    uniform sampler2D uSocialAsciiCanvas;
    uniform sampler2D uTitleCanvas;
    uniform sampler2D uIntroTitleCanvas;
    uniform float uTime;
    uniform float uStaticAmount;
    uniform float uPhase;
    uniform float uMediaAspect;
    uniform float uScreenAspect;
    uniform float uTitleAspect;
    uniform float uAsciiAmount;
    uniform float uSocialAmount;
    uniform float uSocialHoverActive;
    uniform float uHoverAmount;
    uniform float uGrayscaleReveal;
    uniform float uInteractiveAmount;
    uniform float uDimAmount;
    uniform float uPowerAmount;
    uniform float uIntroTitleOnScreenAmount;
    uniform float uTitleOnScreenAmount;
    uniform float uTitleFadeProgress;
    uniform float uIntroHoverAmount;
    uniform float uIntroIdlePatternAmount;
    uniform float uIntroWaveProgress;
    uniform vec4 uTitleUvRect;
    uniform vec2 uIntroPointerUv;
    uniform vec2 uIntroGridOffset;
    uniform vec2 uIntroGridScale;
    uniform vec2 uIntroWaveOrigin;
    uniform vec2 uSocialPointerUv;
    uniform vec2 uScreenUvMin;
    uniform vec2 uScreenUvMax;
    varying vec2 vUv;

    float random(vec2 point) {
      return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float asciiCharacter(float characterCode, vec2 position) {
      vec2 pixel = floor(position * vec2(4.0, -4.0) + 2.5);

      if (
        pixel.x >= 0.0 && pixel.x <= 4.0 &&
        pixel.y >= 0.0 && pixel.y <= 4.0
      ) {
        float bitPosition = pixel.x + 5.0 * pixel.y;
        return mod(floor(characterCode / exp2(bitPosition)), 2.0);
      }

      return 0.0;
    }

    void main() {
      vec2 screenUv = clamp(
        (vUv - uScreenUvMin) / (uScreenUvMax - uScreenUvMin),
        vec2(0.0),
        vec2(1.0)
      );
      vec2 centeredUv = screenUv - 0.5;
      float distanceFromCenter = dot(centeredUv, centeredUv);
      vec2 curvedUv = centeredUv * (1.0 + distanceFromCenter * 0.16) + 0.5;

      if (
        curvedUv.x < 0.0 || curvedUv.x > 1.0 ||
        curvedUv.y < 0.0 || curvedUv.y > 1.0
      ) {
        gl_FragColor = vec4(0.002, 0.002, 0.002, 1.0);
        return;
      }

      float jitterTimeA = mix(uTime * 2.4, uTime * 7.0, 1.0 - uStaticAmount);
      float jitterTimeB = mix(uTime * 1.6, uTime * 4.0, 1.0 - uStaticAmount);
      float horizontalJitter = (
        sin(curvedUv.y * 91.0 + jitterTimeA + uPhase) * 0.00045 +
        sin(curvedUv.y * 247.0 - jitterTimeB + uPhase) * 0.0002
      );
      vec2 jitteredUv = curvedUv + vec2(horizontalJitter, 0.0);
      float hoverZoom = mix(1.0, 1.035, uHoverAmount);
      jitteredUv = (jitteredUv - 0.5) / hoverZoom + 0.5;

      vec3 color;
      vec2 mediaUv = jitteredUv;

      if (uMediaAspect > uScreenAspect) {
        float visibleWidth = uScreenAspect / uMediaAspect;
        mediaUv.x = (jitteredUv.x - 0.5) * visibleWidth + 0.5;
      } else {
        float visibleHeight = uMediaAspect / uScreenAspect;
        mediaUv.y = (jitteredUv.y - 0.5) * visibleHeight + 0.5;
      }

      mediaUv = clamp(mediaUv, vec2(0.001), vec2(0.999));

      if (uStaticAmount > 0.5) {
        vec2 staticCell = floor(curvedUv * vec2(480.0, 360.0));
        float staticFrame = floor((uTime + uPhase) * 12.0);
        float staticNoise = random(
          staticCell + vec2(staticFrame, uPhase * 7.0)
        );
        float staticLuminance = 0.035 + staticNoise * 0.19;
        color = vec3(
          staticLuminance * 0.78,
          staticLuminance * 0.84,
          staticLuminance * 0.9
        );
      } else {
        vec2 sampleUv = mediaUv;
        vec2 asciiGrid = vec2(
          112.0,
          max(8.0, floor(112.0 / (uMediaAspect * (10.0 / 6.0))))
        );

        if (uAsciiAmount > 0.5) {
          sampleUv = (floor(mediaUv * asciiGrid) + 0.5) / asciiGrid;
        }

        if (uAsciiAmount > 0.5) {
          vec3 sourceColor = texture2D(uMedia, sampleUv).rgb;
          float luminance = dot(
            sourceColor,
            vec3(0.2126, 0.7152, 0.0722)
          );
          float rampIndex = floor(luminance * 9.0 + 0.5);
          float characterCode = 0.0;

          if (rampIndex > 0.5) characterCode = 4325376.0;
          if (rampIndex > 1.5) characterCode = 131200.0;
          if (rampIndex > 2.5) characterCode = 14336.0;
          if (rampIndex > 3.5) characterCode = 459200.0;
          if (rampIndex > 4.5) characterCode = 145536.0;
          if (rampIndex > 5.5) characterCode = 332772.0;
          if (rampIndex > 6.5) characterCode = 11512810.0;
          if (rampIndex > 7.5) characterCode = 27070835.0;
          if (rampIndex > 8.5) characterCode = 13199452.0;

          vec2 characterPosition = fract(mediaUv * asciiGrid) - 0.5;
          float character = asciiCharacter(characterCode, characterPosition);
          float glow = max(
            max(
              asciiCharacter(characterCode, characterPosition + vec2(0.16, 0.0)),
              asciiCharacter(characterCode, characterPosition - vec2(0.16, 0.0))
            ),
            max(
              asciiCharacter(characterCode, characterPosition + vec2(0.0, 0.16)),
              asciiCharacter(characterCode, characterPosition - vec2(0.0, 0.16))
            )
          );
          vec3 originalAsciiGreen = vec3(112.0, 211.0, 122.0) / 255.0;
          color = originalAsciiGreen * (character * 0.92 + glow * 0.12);
        } else {
          float colorSeparation = (
            0.0022 + distanceFromCenter * 0.003
          ) * mix(1.0, 0.28, uHoverAmount);
          float red = texture2D(
            uMedia,
            sampleUv + vec2(colorSeparation, 0.0)
          ).r;
          float green = texture2D(uMedia, sampleUv).g;
          float blue = texture2D(
            uMedia,
            sampleUv - vec2(colorSeparation, 0.0)
          ).b;
          color = vec3(red, green, blue);
        }
      }

      vec2 socialStableUv = screenUv;
      if (uMediaAspect > uScreenAspect) {
        float socialVisibleWidth = uScreenAspect / uMediaAspect;
        socialStableUv.x = (screenUv.x - 0.5) * socialVisibleWidth + 0.5;
      } else {
        float socialVisibleHeight = uMediaAspect / uScreenAspect;
        socialStableUv.y = (screenUv.y - 0.5) * socialVisibleHeight + 0.5;
      }
      vec2 socialCharacterCell = floor(socialStableUv * vec2(64.0));
      vec2 socialCharacterUv = (socialCharacterCell + 0.5) / 64.0;
      vec2 socialCellScreenUv = socialCharacterUv;
      if (uMediaAspect > uScreenAspect) {
        float socialVisibleWidth = uScreenAspect / uMediaAspect;
        socialCellScreenUv.x =
          (socialCharacterUv.x - 0.5) / socialVisibleWidth + 0.5;
      } else {
        float socialVisibleHeight = uMediaAspect / uScreenAspect;
        socialCellScreenUv.y =
          (socialCharacterUv.y - 0.5) / socialVisibleHeight + 0.5;
      }
      float socialCharacterNoise = random(
        socialCharacterCell + vec2(uPhase * 4.13, uPhase * 6.71)
      );
      float socialPatternCoordinate = fract(
        socialCellScreenUv.x * 0.82 +
        socialCellScreenUv.y * 0.38 -
        uTime * 0.075 +
        uPhase * 0.027
      );
      float socialPatternBand = 1.0 - smoothstep(
        0.04,
        0.32,
        abs(socialPatternCoordinate - 0.5)
      );
      float socialPatternTexture =
        0.78 +
        0.14 * sin(
          socialCharacterCell.x * 0.31 +
          socialCharacterCell.y * 0.47 +
          uTime * 0.32
        );
      float socialPatternField = clamp(
        0.81 +
        socialPatternBand * 0.07 +
        (socialPatternTexture - 0.78) * 0.18,
        0.79,
        0.9
      );
      float socialAsciiField = mix(
        socialPatternField,
        1.0,
        smoothstep(0.0, 1.0, uSocialHoverActive)
      );
      float socialConversionThreshold = 0.04 + socialCharacterNoise * 0.92;
      float socialAsciiMix =
        step(socialConversionThreshold, socialAsciiField) * uSocialAmount;
      float socialColorSeparation = 0.0016 + distanceFromCenter * 0.0024;
      vec2 socialRedUv = clamp(
        mediaUv + vec2(socialColorSeparation, 0.0),
        vec2(0.001),
        vec2(0.999)
      );
      vec2 socialBlueUv = clamp(
        mediaUv - vec2(socialColorSeparation, 0.0),
        vec2(0.001),
        vec2(0.999)
      );
      vec3 socialAsciiColor = vec3(
        texture2D(uSocialAsciiCanvas, socialRedUv).r,
        texture2D(uSocialAsciiCanvas, mediaUv).g,
        texture2D(uSocialAsciiCanvas, socialBlueUv).b
      );
      color = mix(color, socialAsciiColor, socialAsciiMix);

      // Grade the source image before the CRT pass so scanlines, rolling
      // luminance, noise and phosphor glow remain visible above the filter.
      float grayscaleLuminance = dot(
        max(color, vec3(0.0)),
        vec3(0.2126, 0.7152, 0.0722)
      );
      float grayscaleContrast = clamp(
        (grayscaleLuminance - 0.5) * 1.12 + 0.56,
        0.0,
        1.0
      );
      float colorReveal = smoothstep(0.04, 0.96, uHoverAmount);
      float grayscaleAmount =
        (1.0 - uStaticAmount) *
        uGrayscaleReveal *
        mix(0.55, 0.0, colorReveal);
      color = mix(color, vec3(grayscaleContrast), grayscaleAmount);

      float scanlineMotion = uTime * 2.6;
      float scanlineStrength = mix(0.12, 0.055, uHoverAmount);
      float scanline = 1.0 - scanlineStrength + scanlineStrength * sin(
        curvedUv.y * 720.0 + scanlineMotion
      );
      float verticalMask = 0.97 + 0.03 * sin(curvedUv.x * 1050.0);

      float rollingLineSpeed = mix(0.055, 0.075, 1.0 - uStaticAmount);
      float rollingLineWidth = mix(12.0, 35.0, 1.0 - uStaticAmount);
      float rollingLinePosition = fract(
        uTime * rollingLineSpeed + uPhase * 0.11
      );
      float rollingLine = exp(
        -pow(
          (curvedUv.y - rollingLinePosition) * rollingLineWidth,
          2.0
        )
      );
      float rollingLineStrength = mix(0.018, 0.055, 1.0 - uStaticAmount);

      float noiseTime = floor((uTime + uPhase) * 24.0);
      float noise = random(
        curvedUv * vec2(912.0, 517.0) + noiseTime
      );
      float noiseStrength = mix(0.018, 0.035, 1.0 - uStaticAmount) *
        mix(1.0, 0.24, uHoverAmount);

      float idleSweepPosition = fract(uTime * 0.065 + uPhase * 0.17);
      float idleSweep = exp(
        -pow((curvedUv.y - idleSweepPosition) * 42.0, 2.0)
      ) * uInteractiveAmount * (1.0 - uHoverAmount);

      float powerAmount = clamp(uPowerAmount, 0.0, 1.0);
      float distanceToCenterLine = abs(curvedUv.y - 0.5);
      float revealHeight = powerAmount * 0.58;
      float powerMask = 1.0 - smoothstep(
        revealHeight,
        revealHeight + 0.022,
        distanceToCenterLine
      );
      float ignitionEnvelope =
        smoothstep(0.015, 0.12, powerAmount) *
        (1.0 - smoothstep(0.38, 0.82, powerAmount));
      float ignitionLine = exp(
        -pow((distanceToCenterLine - revealHeight) * 82.0, 2.0)
      ) * ignitionEnvelope;
      color = color * powerMask * step(0.001, powerAmount) +
        vec3(0.52, 0.61, 0.64) * ignitionLine * 0.42;

      vec2 titleLocalUv = jitteredUv;
      vec2 stableTitleLocalUv = screenUv;
      if (uTitleAspect > uScreenAspect) {
        float titleVisibleWidth = uScreenAspect / uTitleAspect;
        titleLocalUv.x = (jitteredUv.x - 0.5) * titleVisibleWidth + 0.5;
        stableTitleLocalUv.x = (screenUv.x - 0.5) * titleVisibleWidth + 0.5;
      } else {
        float titleVisibleHeight = uTitleAspect / uScreenAspect;
        titleLocalUv.y = (jitteredUv.y - 0.5) * titleVisibleHeight + 0.5;
        stableTitleLocalUv.y = (screenUv.y - 0.5) * titleVisibleHeight + 0.5;
      }
      vec2 titleUv = mix(uTitleUvRect.xy, uTitleUvRect.zw, titleLocalUv);
      titleUv = clamp(titleUv, vec2(0.001), vec2(0.999));
      vec4 introTitleSample = texture2D(uIntroTitleCanvas, titleUv);
      vec4 titleSample = texture2D(uTitleCanvas, titleUv);
      float introTitleColorSeparation = (
        0.0022 + distanceFromCenter * 0.003
      ) * mix(1.0, 0.28, uHoverAmount);
      vec2 introTitleRedUv = clamp(
        titleUv + vec2(introTitleColorSeparation, 0.0),
        vec2(0.001),
        vec2(0.999)
      );
      vec2 introTitleBlueUv = clamp(
        titleUv - vec2(introTitleColorSeparation, 0.0),
        vec2(0.001),
        vec2(0.999)
      );
      vec4 introTitleRedSample = texture2D(
        uIntroTitleCanvas,
        introTitleRedUv
      );
      vec4 introTitleBlueSample = texture2D(
        uIntroTitleCanvas,
        introTitleBlueUv
      );
      vec4 titleRedSample = texture2D(uTitleCanvas, introTitleRedUv);
      vec4 titleBlueSample = texture2D(uTitleCanvas, introTitleBlueUv);
      vec3 introTitleCrtColor = vec3(
        introTitleRedSample.r,
        introTitleSample.g,
        introTitleBlueSample.b
      );
      vec3 titleCrtColor = vec3(
        titleRedSample.r,
        titleSample.g,
        titleBlueSample.b
      );
      float introTitleCrtAlpha = max(
        introTitleSample.a,
        max(introTitleRedSample.a, introTitleBlueSample.a)
      );
      float titleCrtAlpha = max(
        titleSample.a,
        max(titleRedSample.a, titleBlueSample.a)
      );
      vec2 titleCharacterCell = floor(stableTitleLocalUv * vec2(50.0));
      vec2 titleCharacterUv = (titleCharacterCell + 0.5) / 50.0;
      vec2 titleCellScreenUv = titleCharacterUv;
      if (uTitleAspect > uScreenAspect) {
        float titleVisibleWidth = uScreenAspect / uTitleAspect;
        titleCellScreenUv.x =
          (titleCharacterUv.x - 0.5) / titleVisibleWidth + 0.5;
      } else {
        float titleVisibleHeight = uTitleAspect / uScreenAspect;
        titleCellScreenUv.y =
          (titleCharacterUv.y - 0.5) / titleVisibleHeight + 0.5;
      }
      float titleCharacterNoise = random(
        titleCharacterCell + vec2(uPhase * 3.17, uPhase * 7.31)
      );
      float introHoverDistance = length(
        (titleCellScreenUv - uIntroPointerUv) * vec2(uScreenAspect, 1.0)
      );
      float introHoverNoise = random(
        titleCharacterCell + vec2(uPhase * 8.17 + 19.4, uPhase * 2.63 + 5.8)
      );
      float introHoverPattern = clamp(
        0.48 +
        0.16 * sin(titleCharacterCell.x * 0.57 + titleCharacterCell.y * 0.83) +
        0.12 * sin(titleCharacterCell.x * 1.19 - titleCharacterCell.y * 0.41) +
        0.14 * (introHoverNoise - 0.5),
        0.22,
        0.82
      );
      float introHoverCore = 1.0 - smoothstep(
        0.018,
        0.3,
        introHoverDistance
      );
      float introHoverDensity = clamp(
        introHoverPattern + pow(introHoverCore, 1.05) * 0.52,
        0.22,
        1.0
      );
      float introHoverMask =
        (1.0 - smoothstep(
          0.1,
          ${INTRO_HOVER_OUTER_RANGE.toFixed(2)},
          introHoverDistance
        )) *
        introHoverDensity *
        uIntroHoverAmount;
      vec2 introGlobalUv =
        uIntroGridOffset + titleCellScreenUv * uIntroGridScale;
      vec2 introWaveDelta =
        (introGlobalUv - uIntroWaveOrigin) * vec2(2.5, 1.0);
      float introWaveRadius = uIntroWaveProgress * 2.75;
      float introWaveMask =
        (1.0 - smoothstep(
          introWaveRadius - 0.18,
          introWaveRadius + 0.18,
          length(introWaveDelta)
        )) * smoothstep(0.0, 0.025, uIntroWaveProgress);
      float introPatternCoordinate = fract(
        introGlobalUv.x * 0.82 +
        introGlobalUv.y * 0.38 -
        uTime * 0.075
      );
      float introPatternDistance = abs(introPatternCoordinate - 0.5);
      float introPatternBand = 1.0 - smoothstep(
        0.055,
        0.25,
        introPatternDistance
      );
      float introPatternTexture =
        0.5 +
        0.12 * sin(
          titleCharacterCell.x * 0.31 +
          titleCharacterCell.y * 0.47 +
          uTime * 0.32
        );
      float introIdlePattern =
        introPatternBand * introPatternTexture * uIntroIdlePatternAmount;
      float introAsciiField = max(
        max(introHoverMask, introWaveMask),
        introIdlePattern
      );
      float introConversionThreshold = 0.04 + titleCharacterNoise * 0.92;
      float introAsciiMix = step(
        introConversionThreshold,
        introAsciiField
      );
      float introRegularAmount =
        uIntroTitleOnScreenAmount * (1.0 - introAsciiMix);
      float introAsciiAmount = max(
        uTitleOnScreenAmount,
        uIntroTitleOnScreenAmount * introAsciiMix
      );
      color = mix(
        color,
        introTitleCrtColor,
        introTitleCrtAlpha * introRegularAmount
      );
      float titleDissolveNoise = random(
        titleCharacterCell +
        vec2(uPhase * 5.71 + 13.2, uPhase * 1.83 + 7.4)
      );
      float titleCharacterDelay = 0.02 + titleDissolveNoise * 0.72;
      float titleCharacterVisibility = 1.0 - smoothstep(
        titleCharacterDelay,
        titleCharacterDelay + 0.24,
        uTitleFadeProgress
      );
      color = mix(
        color,
        titleCrtColor,
        titleCrtAlpha * introAsciiAmount * titleCharacterVisibility
      );

      // The media, social logos and intro title now share this exact CRT pass.
      color *= scanline * verticalMask;
      color += rollingLine * rollingLineStrength;
      color += (noise - 0.5) * noiseStrength;
      color += color * idleSweep * 0.085;

      vec2 edgeDistance = abs(curvedUv - 0.5) * 2.0;
      float vignette = 1.0 - pow(
        max(edgeDistance.x, edgeDistance.y),
        2.8
      ) * 0.58;
      color *= clamp(vignette, 0.25, 1.0);

      float edgeMask =
        smoothstep(0.0, 0.018, curvedUv.x) *
        smoothstep(0.0, 0.018, curvedUv.y) *
        smoothstep(0.0, 0.018, 1.0 - curvedUv.x) *
        smoothstep(0.0, 0.018, 1.0 - curvedUv.y);

      color = color * (1.08 + uHoverAmount * 0.16) +
        vec3(0.006, 0.012, 0.014) +
        vec3(0.008, 0.018, 0.011) * uHoverAmount;
      color *= mix(1.0, 0.34, uDimAmount);
      gl_FragColor = vec4(color * edgeMask, 1.0);
    }
  `;

function createCrtScreenMaterial(mediaKey, phase) {
  const material = new THREE.ShaderMaterial({
    name: "CRTScreenShader",
    uniforms: {
      uMedia: { value: getScreenTexture(mediaKey) },
      uSocialAsciiCanvas: {
        value: socialAsciiScreenTextures.get(mediaKey) ?? blankScreenTexture,
      },
      uTitleCanvas: { value: sharedTitleTexture },
      uIntroTitleCanvas: { value: introTitleTexture },
      uTime: { value: 0 },
      uStaticAmount: { value: mediaKey === "static" ? 1 : 0 },
      uPhase: { value: phase },
      uMediaAspect: {
        value: screenMediaAspectCache.get(mediaKey) ?? 16 / 9,
      },
      uScreenAspect: { value: CRT_SCREEN_ASPECT },
      uTitleAspect: { value: introTitleCanvas.width / introTitleCanvas.height },
      uAsciiAmount: { value: mediaKey === "bicycleVideo" ? 1 : 0 },
      uSocialAmount: { value: SOCIAL_LINKS[mediaKey] ? 1 : 0 },
      uSocialHoverActive: { value: 0 },
      uHoverAmount: { value: 0 },
      uGrayscaleReveal: { value: 0 },
      uInteractiveAmount: { value: mediaKey === "static" ? 0 : 1 },
      uDimAmount: { value: 0 },
      uPowerAmount: { value: 0 },
      uIntroTitleOnScreenAmount: { value: 0 },
      uTitleOnScreenAmount: { value: 0 },
      uTitleFadeProgress: { value: 0 },
      uIntroHoverAmount: { value: 0 },
      uIntroIdlePatternAmount: { value: 0 },
      uIntroWaveProgress: { value: 0 },
      uTitleUvRect: { value: new THREE.Vector4(0, 0, 1, 1) },
      uIntroPointerUv: { value: new THREE.Vector2(0.5, 0.5) },
      uIntroGridOffset: { value: new THREE.Vector2() },
      uIntroGridScale: { value: new THREE.Vector2(0.2, 0.5) },
      uIntroWaveOrigin: { value: new THREE.Vector2(0.5, 0.5) },
      uSocialPointerUv: { value: new THREE.Vector2(0.5, 0.5) },
      uScreenUvMin: { value: new THREE.Vector2(0.001689, 0.121829) },
      uScreenUvMax: { value: new THREE.Vector2(0.998311, 0.878171) },
    },
    vertexShader: CRT_VERTEX_SHADER,
    fragmentShader: CRT_FRAGMENT_SHADER,
    toneMapped: false,
  });

  material.userData.mediaKey = mediaKey;
  material.userData.interactionTarget = 0;
  material.userData.socialHoverTarget = 0;
  material.userData.introHoverTarget = 0;
  material.userData.introIdlePatternTarget = 0;
  material.userData.dimTarget = 0;
  material.userData.bootDelay = (
    Math.sin(phase * 12.9898 + 4.37) * 43758.5453
  ) % 1;
  material.userData.bootDelay = Math.abs(material.userData.bootDelay) * 0.6;
  crtScreenMaterials.push(material);
  return material;
}

function applyScreenMaterial(
  tvUnit,
  mediaKey,
  phase,
  rowIndex,
  unitIndex,
) {
  const screenMaterial = createCrtScreenMaterial(mediaKey, phase);
  const isInteractive = mediaKey !== "static";

  const registerScreen = (object, materialIndices) => {
    const screenEntry = {
      mesh: object,
      material: screenMaterial,
      materialIndices,
      mediaKey,
      rowIndex,
      unitIndex,
    };
    allScreenEntries.push(screenEntry);

    if (isInteractive) {
      object.userData.screenInteraction = screenEntry;
      interactiveScreenMeshes.push(object);
    }
  };

  tvUnit.traverse((object) => {
    if (!object.isMesh) return;

    if (Array.isArray(object.material)) {
      const screenMaterialIndices = [];
      object.material = object.material.map((material, materialIndex) => {
        if (material?.name !== "TVScreen") return material;
        screenMaterialIndices.push(materialIndex);
        return screenMaterial;
      });

      if (screenMaterialIndices.length > 0) {
        registerScreen(object, screenMaterialIndices);
      }
      return;
    }

    if (object.material?.name === "TVScreen") {
      object.material = screenMaterial;
      registerScreen(object, [0]);
    }
  });
}

function configureSharedTitleScreens(tvWall) {
  if (allScreenEntries.length === 0) return;

  const wallBounds = new THREE.Box3().makeEmpty();
  const screenBounds = new THREE.Box3();

  allScreenEntries.forEach((entry) => {
    screenBounds.setFromObject(entry.mesh);
    wallBounds.union(screenBounds);
  });

  const wallWidth = wallBounds.max.x - wallBounds.min.x;
  const wallHeight = wallBounds.max.y - wallBounds.min.y;
  if (wallWidth <= 0 || wallHeight <= 0) return;

  introLetterScreenEntries.length = 0;
  introLetterScreenEntries.push(
    ...allScreenEntries.filter((entry) => entry.rowIndex === 0 || entry.rowIndex === 1),
  );
  introLetterTitleBounds = new THREE.Box3().makeEmpty();
  introLetterScreenEntries.forEach((entry) => {
    screenBounds.setFromObject(entry.mesh);
    introLetterTitleBounds.union(screenBounds);
  });

  const introBoundsWidth = introLetterTitleBounds.max.x - introLetterTitleBounds.min.x;
  const introBoundsHeight = introLetterTitleBounds.max.y - introLetterTitleBounds.min.y;
  const introScreenWidth = introBoundsWidth / 5;
  const introScreenHeight = introBoundsHeight / 2;
  const hoverMarginX =
    introScreenWidth *
    (INTRO_HOVER_OUTER_RANGE / CRT_SCREEN_ASPECT) *
    1.06;
  const hoverMarginY =
    introScreenHeight * INTRO_HOVER_OUTER_RANGE * 1.06;

  if (introHoverHitArea) {
    scene.remove(introHoverHitArea);
    introHoverHitArea.geometry.dispose();
    introHoverHitArea.material.dispose();
  }
  introHoverHitArea = new THREE.Mesh(
    new THREE.PlaneGeometry(
      introBoundsWidth + hoverMarginX * 2,
      introBoundsHeight + hoverMarginY * 2,
    ),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      colorWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  introHoverHitArea.name = "Intro TV wall hover area";
  introHoverHitArea.position.set(
    (introLetterTitleBounds.min.x + introLetterTitleBounds.max.x) * 0.5,
    (introLetterTitleBounds.min.y + introLetterTitleBounds.max.y) * 0.5,
    introLetterTitleBounds.max.z + 0.04,
  );
  scene.add(introHoverHitArea);
  introHoverHitArea.updateMatrixWorld(true);

  drawSharedTitleTexture(introBoundsWidth / introBoundsHeight);
  drawIntroTitleTexture(introBoundsWidth / introBoundsHeight);

  allScreenEntries.forEach((entry) => {
    entry.material.uniforms.uTitleUvRect.value.set(0, 0, 1, 1);

    if (entry.rowIndex !== 0 && entry.rowIndex !== 1) return;
    const word = entry.rowIndex === 1 ? "onder" : "balta";
    const character = word[entry.unitIndex];
    if (!character) return;

    const letterTextures = getIntroLetterTextureSet(character);
    entry.material.uniforms.uIntroTitleCanvas.value = letterTextures.regularTexture;
    entry.material.uniforms.uTitleCanvas.value = letterTextures.asciiTexture;
    entry.material.uniforms.uTitleAspect.value = 1;
    entry.material.uniforms.uIntroGridOffset.value.set(
      entry.unitIndex * 0.2,
      entry.rowIndex * 0.5,
    );
    entry.material.userData.introLetterIndex =
      entry.rowIndex === 1 ? entry.unitIndex : entry.unitIndex + 5;
    entry.material.userData.introFadeDelay =
      entry.unitIndex * 0.045 +
      (entry.rowIndex === 0 ? 0.055 : 0) +
      ((entry.unitIndex * 7 + entry.rowIndex * 3) % 5) * 0.004;
  });

  const tvWallBounds = new THREE.Box3().setFromObject(tvWall);
  const title = "onder balta";
  const letterHeight = wallHeight * 0.235;
  const letterGap = letterHeight * 0.025;
  const wordGap = letterHeight * 0.34;
  const titleCenterX = (wallBounds.min.x + wallBounds.max.x) * 0.5;
  const titleCenterY = (wallBounds.min.y + wallBounds.max.y) * 0.5;
  const letterEntries = [];
  let titleWidth = 0;

  [...title].forEach((character, characterIndex) => {
    if (character === " ") {
      titleWidth += wordGap;
      return;
    }

    const canvas = document.createElement("canvas");
    const letterEntry = {
      canvas,
      character,
      characterIndex,
      texture: null,
      mesh: null,
    };
    drawFloatingTitleLetter(letterEntry);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = Math.min(
      renderer.capabilities.getMaxAnisotropy(),
      8,
    );
    letterEntry.texture = texture;

    const letterWidth = letterHeight * (canvas.width / canvas.height);
    letterEntry.width = letterWidth;
    titleWidth += letterWidth + letterGap;
    letterEntries.push(letterEntry);
  });

  titleWidth -= letterGap;
  floatingTitleGroup = new THREE.Group();
  floatingTitleGroup.name = "Floating title signal";
  floatingTitleGroup.visible = FLOATING_TITLE_ENABLED;

  floatingTitleHitArea = new THREE.Mesh(
    new THREE.PlaneGeometry(titleWidth + letterHeight * 0.35, letterHeight * 1.55),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      colorWrite: false,
    }),
  );
  floatingTitleHitArea.position.set(
    titleCenterX,
    titleCenterY,
    tvWallBounds.max.z + 0.28,
  );
  floatingTitleGroup.add(floatingTitleHitArea);

  let letterX = titleCenterX - titleWidth * 0.5;

  letterEntries.forEach((entry, visibleIndex) => {
    const phase = entry.characterIndex * 1.73 + visibleIndex * 0.41;
    const material = new THREE.MeshBasicMaterial({
      map: entry.texture,
      transparent: true,
      opacity: 0.92,
      depthTest: true,
      depthWrite: false,
      toneMapped: false,
    });
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(entry.width, letterHeight),
      material,
    );
    const basePosition = new THREE.Vector3(
      letterX + entry.width * 0.5,
      titleCenterY + Math.sin(phase * 0.82) * letterHeight * 0.055 +
        (visibleIndex - (letterEntries.length - 1) * 0.5) * letterHeight * 0.013,
      tvWallBounds.max.z + 0.2 + Math.sin(phase * 1.31) * 0.055,
    );
    const baseRotation = new THREE.Euler(
      Math.sin(phase * 0.7) * 0.018,
      Math.sin(phase * 1.17) * 0.045,
      Math.sin(phase) * 0.036,
    );
    const outwardDirection = visibleIndex < letterEntries.length * 0.5 ? -1 : 1;
    const scatterOffset = new THREE.Vector3(
      outwardDirection * (0.16 + (visibleIndex % 3) * 0.09),
      Math.sin(phase * 2.13) * 0.24,
      0.12 + ((visibleIndex * 7) % 5) * 0.035,
    );
    const scatterRotation = new THREE.Euler(
      Math.sin(phase * 1.43) * 0.12,
      Math.sin(phase * 0.93) * 0.2,
      Math.sin(phase * 1.77) * 0.18,
    );

    mesh.position.copy(basePosition);
    mesh.rotation.copy(baseRotation);
    mesh.userData.titleLetter = entry;
    floatingTitleGroup.add(mesh);

    Object.assign(entry, {
      mesh,
      material,
      phase,
      basePosition,
      baseRotation,
      scatterOffset,
      scatterRotation,
    });
    floatingTitleLetters.push(entry);
    letterX += entry.width + letterGap;

    if (entry.characterIndex === 4) letterX += wordGap;
  });

  scene.add(floatingTitleGroup);
}

function updateTitleTransferTarget() {
  if (!FLOATING_TITLE_ENABLED || !floatingTitleHitArea) {
    titleTransferTarget = 0;
    return;
  }

  raycaster.setFromCamera(pointerNdc, camera);
  const pointerIsOverTitle = raycaster.intersectObject(
    floatingTitleHitArea,
    false,
  ).length > 0;

  titleTransferTarget = pointerIsOverTitle && !focusedScreen ? 1 : 0;
}

function beginIntroSequence(
  elapsedTime = performance.now() * 0.001,
  pointerHit = getIntroPointerHit(),
) {
  if (
    introStage !== "waiting" ||
    introLetterScreenEntries.length === 0 ||
    !pointerHit
  ) return;

  introWaveOrigin.copy(pointerHit.globalUv);
  crtScreenMaterials.forEach((material) => {
    material.uniforms.uIntroWaveOrigin.value.copy(introWaveOrigin);
    material.userData.introHoverTarget = 0;
  });
  introStage = "handoff";
  introStageStartedAt = elapsedTime;
  introSequenceStartedAt = elapsedTime;
  setHoveredScreen(null);
}

function getIntroPointerHit() {
  if (
    introLetterScreenEntries.length === 0 ||
    !introLetterTitleBounds ||
    !introHoverHitArea
  ) return null;

  raycaster.setFromCamera(pointerNdc, camera);
  const intersection = raycaster.intersectObject(introHoverHitArea, false)[0];
  if (!intersection?.point) return null;

  const boundsWidth = introLetterTitleBounds.max.x - introLetterTitleBounds.min.x;
  const boundsHeight = introLetterTitleBounds.max.y - introLetterTitleBounds.min.y;
  if (boundsWidth <= 0 || boundsHeight <= 0) return null;

  const globalUv = new THREE.Vector2(
    (intersection.point.x - introLetterTitleBounds.min.x) / boundsWidth,
    (intersection.point.y - introLetterTitleBounds.min.y) / boundsHeight,
  );
  const unitIndex = THREE.MathUtils.clamp(Math.floor(globalUv.x * 5), 0, 4);
  const rowIndex = THREE.MathUtils.clamp(Math.floor(globalUv.y * 2), 0, 1);
  const entry = introLetterScreenEntries.find(
    (screenEntry) =>
      screenEntry.unitIndex === unitIndex && screenEntry.rowIndex === rowIndex,
  ) ?? null;
  const localUv = new THREE.Vector2(
    globalUv.x * 5 - unitIndex,
    globalUv.y * 2 - rowIndex,
  );
  return { entry, localUv, globalUv };
}

function isPointerOverIntroTitle() {
  return Boolean(getIntroPointerHit());
}

function smoothProgress(value) {
  const clamped = THREE.MathUtils.clamp(value, 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

function getIntroCameraAmount(elapsedTime) {
  if (introStage === "waiting") return 1;
  if (introSequenceStartedAt <= 0) return 0;

  return 1 - smoothProgress(
    (elapsedTime - introSequenceStartedAt) / INTRO_CAMERA_PULL_DURATION,
  );
}

function updateCeilingFlicker(elapsedTime, deltaTime) {
  const sequenceTime = Math.max(0, elapsedTime - introSequenceStartedAt);
  const flickerIsActive =
    introSequenceStartedAt > 0 &&
    (
      introStage === "handoff" ||
      introStage === "fade" ||
      (introStage === "powering" && sequenceTime < 2.26)
    );
  let targetPower = 1;
  let hardOutageAmount = 0;

  if (flickerIsActive) {
    const sequenceEnvelope =
      smoothProgress(sequenceTime / 0.12) *
      (1 - smoothProgress(
        (sequenceTime - (INTRO_CAMERA_PULL_DURATION - 0.2)) / 0.2,
      ));
    const dropoutA = Math.exp(-Math.pow((sequenceTime - 0.2) / 0.055, 2)) * 0.6;
    const dropoutB = Math.exp(-Math.pow((sequenceTime - 0.48) / 0.075, 2)) * 0.38;
    const dropoutC = Math.exp(-Math.pow((sequenceTime - 0.91) / 0.09, 2)) * 0.72;
    const dropoutD = Math.exp(-Math.pow((sequenceTime - 1.34) / 0.065, 2)) * 0.48;
    const dropoutE = Math.exp(-Math.pow((sequenceTime - 1.58) / 0.095, 2)) * 0.64;
    const hardOutageA =
      smoothProgress((sequenceTime - 0.84) / 0.025) *
      (1 - smoothProgress((sequenceTime - 0.93) / 0.028));
    const hardOutageB =
      smoothProgress((sequenceTime - 1.38) / 0.04) *
      (1 - smoothProgress((sequenceTime - 2.22) / 0.045));
    hardOutageAmount = Math.max(hardOutageA, hardOutageB);
    const electricalFlutter =
      Math.sin(sequenceTime * 47.0 + 0.8) * 0.055 +
      Math.sin(sequenceTime * 83.0 + 2.1) * 0.028;
    const dropout = Math.max(
      dropoutA,
      dropoutB,
      dropoutC,
      dropoutD,
      dropoutE,
    );

    targetPower = THREE.MathUtils.clamp(
      1 - dropout * sequenceEnvelope + electricalFlutter * sequenceEnvelope,
      0.16,
      1,
    ) * (1 - hardOutageAmount);
  }

  const responseSpeed = targetPower < ceilingLightPower ? 32 : 18;
  const responseEase = 1 - Math.exp(-deltaTime * responseSpeed);
  ceilingLightPower += (targetPower - ceilingLightPower) * responseEase;

  const outageMultiplier = 1 - hardOutageAmount;
  const visiblePanelPower =
    (0.14 + ceilingLightPower * 0.86) * outageMultiplier;
  ceilingPanelMaterial.color
    .copy(ceilingPanelBaseColor)
    .multiplyScalar(visiblePanelPower);
  keyLight.intensity =
    KEY_LIGHT_BASE_INTENSITY *
    (0.16 + ceilingLightPower * 0.84) *
    outageMultiplier;

  ceilingFixtures.forEach(({ areaLight, baseIntensity }, fixtureIndex) => {
    const fixtureVariation = flickerIsActive
      ? 1 +
        Math.sin(elapsedTime * (39 + fixtureIndex * 5) + fixtureIndex * 1.7) *
          0.025 *
          (1 - ceilingLightPower)
      : 1;
    areaLight.intensity =
      baseIntensity *
      (0.1 + ceilingLightPower * 0.9) *
      fixtureVariation *
      outageMultiplier;
  });
}

function updateSiteHeaderVisibility() {
  if (!siteHeader) return;

  const shouldShowHeader =
    introStage === "done" && focusTarget === 0 && !focusedScreen;
  if (shouldShowHeader === siteHeaderVisible) return;

  siteHeaderVisible = shouldShowHeader;
  siteHeader.classList.toggle("is-visible", shouldShowHeader);
  siteHeader.setAttribute("aria-hidden", String(!shouldShowHeader));
  siteHeader.inert = !shouldShowHeader;
}

function updateIntroSequence(elapsedTime) {
  if (introLetterScreenEntries.length === 0) return;

  const pointerHit = introStage === "waiting" ? getIntroPointerHit() : null;
  introLetterScreenEntries.forEach((entry) => {
    entry.material.userData.introHoverTarget = 0;
    entry.material.userData.introIdlePatternTarget =
      introStage === "waiting" ? 1 : 0;
  });
  if (pointerHit) {
    introLetterScreenEntries.forEach((entry) => {
      const gridOffsetX = entry.unitIndex * 0.2;
      const gridOffsetY = entry.rowIndex * 0.5;
      entry.material.userData.introHoverTarget = 1;
      entry.material.uniforms.uIntroPointerUv.value.set(
        (pointerHit.globalUv.x - gridOffsetX) / 0.2,
        (pointerHit.globalUv.y - gridOffsetY) / 0.5,
      );
    });
  }

  let regularTitleOnScreens = introStage === "waiting" ? 1 : 0;
  let titleOnScreens = 0;
  let asciiFadeElapsed = null;
  let introWaveProgress = 0;

  if (introStage === "handoff") {
    const progress = smoothProgress(
      (elapsedTime - introStageStartedAt) / INTRO_HANDOFF_DURATION,
    );
    regularTitleOnScreens = 1;
    introWaveProgress = progress;

    if (elapsedTime - introStageStartedAt >= INTRO_HANDOFF_DURATION) {
      introStage = "fade";
      introStageStartedAt = elapsedTime;
    }
  } else if (introStage === "fade") {
    asciiFadeElapsed = elapsedTime - introStageStartedAt;
    titleOnScreens = 1;
    introWaveProgress = 1;

    if (asciiFadeElapsed >= INTRO_FADE_DURATION) {
      introStage = "powering";
      introStageStartedAt = elapsedTime;
    }
  } else if (introStage === "powering") {
    const powerElapsed = elapsedTime - introStageStartedAt;
    crtScreenMaterials.forEach((material) => {
      const localProgress = THREE.MathUtils.clamp(
        (powerElapsed - material.userData.bootDelay) / 0.48,
        0,
        1,
      );
      material.uniforms.uPowerAmount.value = 1 - Math.pow(1 - localProgress, 3);
    });

    if (powerElapsed >= INTRO_POWER_DURATION) {
      introStage = "done";
      introCompletedAt = elapsedTime;
    }
  }

  const grayscaleReveal = introStage === "done"
    ? smoothProgress(
        (elapsedTime - introCompletedAt - GRAYSCALE_FADE_DELAY) /
          GRAYSCALE_FADE_DURATION,
      )
    : 0;

  crtScreenMaterials.forEach((material) => {
    const isIntroLetterScreen = introLetterScreenEntries.some(
      (entry) => entry.material === material,
    );
    material.uniforms.uIntroTitleOnScreenAmount.value = isIntroLetterScreen
      ? regularTitleOnScreens
      : 0;
    let characterFadeProgress = 0;
    if (isIntroLetterScreen && asciiFadeElapsed !== null) {
      const fadeDelay = material.userData.introFadeDelay ?? 0;
      characterFadeProgress = smoothProgress(
        (asciiFadeElapsed - fadeDelay * 0.25) / 0.78,
      );
    }
    material.uniforms.uTitleOnScreenAmount.value = isIntroLetterScreen
      ? titleOnScreens
      : 0;
    material.uniforms.uTitleFadeProgress.value = characterFadeProgress;
    material.uniforms.uIntroWaveProgress.value = isIntroLetterScreen
      ? introWaveProgress
      : 0;
    material.uniforms.uGrayscaleReveal.value = grayscaleReveal;
    if (introStage !== "powering" && introStage !== "done") {
      material.uniforms.uPowerAmount.value = 0;
    } else if (introStage === "done") {
      material.uniforms.uPowerAmount.value = 1;
    }
  });
}

function setHoveredScreen(nextScreen) {
  if (hoveredScreen === nextScreen) return;

  if (
    hoveredScreen &&
    (hoveredScreen !== focusedScreen || focusTarget === 0)
  ) {
    hoveredScreen.material.userData.interactionTarget = 0;
    hoveredScreen.material.userData.socialHoverTarget = 0;
  }

  hoveredScreen = nextScreen;

  if (hoveredScreen) {
    hoveredScreen.material.userData.interactionTarget = 1;
    hoveredScreen.material.userData.socialHoverTarget =
      SOCIAL_LINKS[hoveredScreen.mediaKey] ? 1 : 0;
  }

  const hasHover = Boolean(hoveredScreen);
  const hoveredSocial = hoveredScreen && SOCIAL_LINKS[hoveredScreen.mediaKey];
  const hoveredExternal = hoveredScreen &&
    EXTERNAL_SCREEN_LINKS[hoveredScreen.mediaKey];
  viewCursor.textContent = hoveredSocial?.label ?? hoveredExternal?.label ?? "view";
  roomStage.classList.toggle("is-screen-hovered", hasHover);
  viewCursor.classList.toggle("is-visible", hasHover);
}

function updateHoveredScreen() {
  if (
    introStage !== "done" ||
    focusTarget > 0 ||
    interactiveScreenMeshes.length === 0
  ) {
    setHoveredScreen(null);
    return;
  }

  raycaster.setFromCamera(pointerNdc, camera);
  const intersections = raycaster.intersectObjects(
    interactiveScreenMeshes,
    false,
  );
  const validIntersection = intersections.find((intersection) => {
    const entry = intersection.object.userData.screenInteraction;
    const materialIndex = intersection.face?.materialIndex ?? 0;
    return entry?.materialIndices.includes(materialIndex);
  });

  const validEntry = validIntersection?.object.userData.screenInteraction;
  if (validEntry && SOCIAL_LINKS[validEntry.mediaKey] && validIntersection.uv) {
    const uvMin = validEntry.material.uniforms.uScreenUvMin.value;
    const uvMax = validEntry.material.uniforms.uScreenUvMax.value;
    validEntry.material.uniforms.uSocialPointerUv.value.set(
      THREE.MathUtils.clamp(
        (validIntersection.uv.x - uvMin.x) / (uvMax.x - uvMin.x),
        0,
        1,
      ),
      THREE.MathUtils.clamp(
        (validIntersection.uv.y - uvMin.y) / (uvMax.y - uvMin.y),
        0,
        1,
      ),
    );
  }

  setHoveredScreen(validEntry ?? null);
}

function updateProjectPanelSideOffset(deltaTime, snap = false) {
  if (!focusedScreen || focusTarget === 0) return;

  camera.updateMatrixWorld(true);
  focusedScreenBounds.setFromObject(focusedScreen.mesh);
  let projectedMinX = Infinity;
  let projectedMaxX = -Infinity;

  [focusedScreenBounds.min.x, focusedScreenBounds.max.x].forEach((x) => {
    [focusedScreenBounds.min.y, focusedScreenBounds.max.y].forEach((y) => {
      [focusedScreenBounds.min.z, focusedScreenBounds.max.z].forEach((z) => {
        projectedScreenCorner.set(x, y, z).project(camera);
        const screenX = (projectedScreenCorner.x * 0.5 + 0.5) * window.innerWidth;
        projectedMinX = Math.min(projectedMinX, screenX);
        projectedMaxX = Math.max(projectedMaxX, screenX);
      });
    });
  });

  if (!Number.isFinite(projectedMinX) || !Number.isFinite(projectedMaxX)) return;

  const panelOnLeft = projectPanel.classList.contains("is-left");
  const mirroredScreenGap = panelOnLeft
    ? window.innerWidth - projectedMaxX
    : projectedMinX;
  const targetOffset = THREE.MathUtils.clamp(
    mirroredScreenGap,
    24,
    window.innerWidth * 0.46,
  );

  if (snap || projectPanelSideOffset === null) {
    projectPanelSideOffset = targetOffset;
  } else {
    const offsetEase = 1 - Math.exp(-deltaTime * 11);
    projectPanelSideOffset += (
      targetOffset - projectPanelSideOffset
    ) * offsetEase;
  }

  projectPanel.style.setProperty(
    "--project-side-offset",
    `${projectPanelSideOffset.toFixed(2)}px`,
  );
}

function showProjectPanel(project, panelOnLeft, mediaKey) {
  projectMeta.textContent = project.meta;
  projectTitle.textContent = project.title;
  projectDescription.textContent = project.description;
  projectPanel.classList.toggle("is-left", panelOnLeft);
  roomStage.classList.toggle("is-panel-left", panelOnLeft);
  projectPanel.classList.add("is-visible");
  projectPanel.setAttribute("aria-hidden", "false");
  projectPanel.inert = false;
  roomStage.classList.add("is-project-open");

  const media = TV_SCREEN_MEDIA[mediaKey];
  const gallery = getProjectGallery(project, media);
  const hasGallery = gallery.length > 0;
  const hasVideo = !hasGallery && media?.type === "video";
  projectPreview.hidden = !hasGallery && !hasVideo;

  if (hasGallery) {
    const firstImage = gallery[0];
    projectPreviewVideo.pause();
    projectPreviewVideo.hidden = true;
    projectPreviewImage.hidden = false;
    projectPreviewImage.src = firstImage.src;
    projectPreviewImage.alt = firstImage.alt ?? `${project.title} preview`;
    projectPreviewLabel.textContent = gallery.length > 1 ? "view gallery" : "view";
    projectPreview.setAttribute("aria-label", `View ${project.title}`);
  } else if (hasVideo) {
    projectPreviewImage.hidden = true;
    projectPreviewVideo.hidden = false;
    projectPreviewVideo.muted = true;
    if (projectPreviewVideo.dataset.mediaKey !== mediaKey) {
      projectPreviewVideo.src = media.src;
      projectPreviewVideo.dataset.mediaKey = mediaKey;
      projectPreviewVideo.load();
    }
    projectPreviewVideo.play().catch(() => {});
    projectPreviewLabel.textContent = "watch";
    projectPreview.setAttribute("aria-label", `Watch ${project.title}`);
  }

  if (project.url) {
    projectLink.href = project.url;
    projectLink.hidden = false;
  } else {
    projectLink.hidden = true;
    projectLink.removeAttribute("href");
  }
}

function selectScreen(entry) {
  const social = SOCIAL_LINKS[entry.mediaKey];
  if (social) {
    window.open(social.url, "_blank", "noopener,noreferrer");
    return;
  }

  const external = EXTERNAL_SCREEN_LINKS[entry.mediaKey];
  if (external) {
    window.open(external.url, "_blank", "noopener,noreferrer");
    return;
  }

  const project = TV_PROJECTS[entry.mediaKey];
  if (!project || focusedScreen) return;

  setHoveredScreen(null);
  focusedScreen = entry;
  focusTarget = 1;
  projectPanelSideOffset = null;
  entry.material.userData.interactionTarget = 1;

  new THREE.Box3()
    .setFromObject(entry.mesh)
    .getCenter(interactionWorldPosition);

  const tvOnLeft = interactionWorldPosition.x <= 0;
  focusCameraPosition.set(
    interactionWorldPosition.x,
    interactionWorldPosition.y,
    interactionWorldPosition.z + 2.95,
  );
  focusLookTarget.set(
    interactionWorldPosition.x + (tvOnLeft ? 0.95 : -0.95),
    interactionWorldPosition.y,
    interactionWorldPosition.z,
  );

  crtScreenMaterials.forEach((material) => {
    material.userData.dimTarget = material === entry.material ? 0 : 1;
  });
  showProjectPanel(project, !tvOnLeft, entry.mediaKey);
}

function setCleanViewOrigin() {
  if (!focusedScreen) return;

  focusedScreenBounds
    .setFromObject(focusedScreen.mesh)
    .getCenter(projectedScreenCorner);
  projectedScreenCorner.project(camera);
  cleanView.style.setProperty(
    "--clean-origin-x",
    `${((projectedScreenCorner.x * 0.5 + 0.5) * 100).toFixed(2)}%`,
  );
  cleanView.style.setProperty(
    "--clean-origin-y",
    `${((-projectedScreenCorner.y * 0.5 + 0.5) * 100).toFixed(2)}%`,
  );
}

function setCleanMediaAspect(aspect) {
  if (!Number.isFinite(aspect) || aspect <= 0) return;
  cleanView.style.setProperty("--clean-aspect", aspect.toFixed(6));
}

function getProjectGallery(project, media) {
  if (Array.isArray(project?.gallery) && project.gallery.length > 0) {
    return project.gallery;
  }

  if (media?.type === "image") {
    return [
      {
        src: media.src,
        alt: `${project?.title ?? "project"} image`,
      },
    ];
  }

  return [];
}

function showCleanGalleryItem(index) {
  if (cleanGalleryItems.length === 0) return;

  cleanGalleryIndex = (
    index + cleanGalleryItems.length
  ) % cleanGalleryItems.length;
  const item = cleanGalleryItems[cleanGalleryIndex];

  cleanImage.classList.add("is-changing");
  cleanImage.alt = item.alt ?? `${cleanViewTitle.textContent} image`;
  cleanImage.src = item.src;
  cleanGalleryCount.textContent = `${cleanGalleryIndex + 1} / ${cleanGalleryItems.length}`;

  if (cleanImage.complete && cleanImage.naturalWidth > 0) {
    setCleanMediaAspect(cleanImage.naturalWidth / cleanImage.naturalHeight);
    requestAnimationFrame(() => cleanImage.classList.remove("is-changing"));
  }
}

function openCleanView() {
  if (!focusedScreen) return;

  const mediaKey = focusedScreen.mediaKey;
  const media = TV_SCREEN_MEDIA[mediaKey];
  const project = TV_PROJECTS[mediaKey];
  const gallery = getProjectGallery(project, media);
  if (gallery.length === 0 && media?.type !== "video") return;

  setHoveredScreen(null);
  projectPreviewVideo.pause();
  setCleanViewOrigin();
  cleanViewTitle.textContent = project?.title ?? "media";

  if (gallery.length > 0) {
    cleanViewMode = "gallery";
    cleanGalleryItems = gallery;
    cleanGalleryIndex = 0;
    cleanVideo.pause();
    cleanVideo.hidden = true;
    cleanImage.hidden = false;
    cleanGalleryNav.hidden = gallery.length < 2;
    showCleanGalleryItem(0);
  } else {
    cleanViewMode = "video";
    cleanGalleryItems = [];
    cleanGalleryNav.hidden = true;
    cleanImage.hidden = true;
    cleanVideo.hidden = false;

    if (cleanVideo.dataset.mediaKey !== mediaKey) {
      cleanVideo.src = media.src;
      cleanVideo.dataset.mediaKey = mediaKey;
      cleanVideo.load();
    }

    const roomVideo = screenVideoByMediaKey.get(mediaKey);
    if (roomVideo && Number.isFinite(roomVideo.currentTime)) {
      try {
        cleanVideo.currentTime = roomVideo.currentTime;
      } catch (error) {
        // Metadata may not be ready yet; playback still starts normally.
      }
    }

    cleanVideo.muted = false;
  }

  cleanView.classList.add("is-visible");
  cleanView.setAttribute("aria-hidden", "false");
  cleanView.inert = false;
  projectPanel.inert = true;
  roomStage.classList.add("is-clean-view-open");
  if (cleanViewMode === "video") cleanVideo.play().catch(() => {});
  cleanViewClose.focus({ preventScroll: true });
}

function closeCleanView({ restoreFocus = true } = {}) {
  if (!cleanView.classList.contains("is-visible")) return;

  if (cleanViewMode === "video") {
    const mediaKey = cleanVideo.dataset.mediaKey;
    const roomVideo = screenVideoByMediaKey.get(mediaKey);
    if (roomVideo && Number.isFinite(cleanVideo.currentTime)) {
      try {
        roomVideo.currentTime = cleanVideo.currentTime;
      } catch (error) {
        // The room video can safely continue from its existing frame.
      }
    }
    cleanVideo.pause();
  }

  cleanView.classList.remove("is-visible");
  cleanView.setAttribute("aria-hidden", "true");
  cleanView.inert = true;
  roomStage.classList.remove("is-clean-view-open");

  if (projectPanel.classList.contains("is-visible")) {
    projectPanel.inert = false;
    if (!projectPreview.hidden && !projectPreviewVideo.hidden) {
      projectPreviewVideo.play().catch(() => {});
    }
    if (restoreFocus && !projectPreview.hidden) {
      projectPreview.focus({ preventScroll: true });
    }
  }
}

function closeProject() {
  if (!focusedScreen || focusTarget === 0) return;

  closeCleanView({ restoreFocus: false });

  focusTarget = 0;
  setHoveredScreen(null);
  crtScreenMaterials.forEach((material) => {
    material.userData.interactionTarget = 0;
    material.userData.socialHoverTarget = 0;
    material.userData.dimTarget = 0;
  });
  projectPanel.classList.remove("is-visible");
  projectPanel.setAttribute("aria-hidden", "true");
  projectPanel.inert = true;
  projectPreviewVideo.pause();
  projectClose.blur();
  roomStage.classList.remove("is-project-open");
  roomStage.classList.remove("is-panel-left");
}

canvas.addEventListener("click", () => {
  if (introStage === "waiting") {
    if (isPointerOverIntroTitle()) beginIntroSequence();
    return;
  }

  if (introStage !== "done") return;

  if (focusTarget > 0) {
    closeProject();
    return;
  }

  if (!focusedScreen && hoveredScreen) {
    selectScreen(hoveredScreen);
  }
});
projectClose.addEventListener("click", closeProject);
projectPreview.addEventListener("click", openCleanView);
cleanViewClose.addEventListener("click", () => closeCleanView());
cleanView.addEventListener("click", (event) => {
  if (event.target === cleanView) closeCleanView();
});
cleanVideo.addEventListener("loadedmetadata", () => {
  if (!cleanVideo.videoWidth || !cleanVideo.videoHeight) return;
  setCleanMediaAspect(cleanVideo.videoWidth / cleanVideo.videoHeight);
});
cleanImage.addEventListener("load", () => {
  setCleanMediaAspect(cleanImage.naturalWidth / cleanImage.naturalHeight);
  requestAnimationFrame(() => cleanImage.classList.remove("is-changing"));
});
cleanGalleryPrev.addEventListener("click", () => {
  showCleanGalleryItem(cleanGalleryIndex - 1);
});
cleanGalleryNext.addEventListener("click", () => {
  showCleanGalleryItem(cleanGalleryIndex + 1);
});
window.addEventListener("keydown", (event) => {
  if (cleanView.classList.contains("is-visible") && cleanViewMode === "gallery") {
    if (event.key === "ArrowLeft") {
      showCleanGalleryItem(cleanGalleryIndex - 1);
      return;
    }
    if (event.key === "ArrowRight") {
      showCleanGalleryItem(cleanGalleryIndex + 1);
      return;
    }
  }
  if (event.key !== "Escape") return;
  if (cleanView.classList.contains("is-visible")) {
    closeCleanView();
    return;
  }
  closeProject();
});

function startScreenVideos() {
  let waitingForInteraction = false;

  const retryPlayback = () => {
    activeScreenVideos.forEach((video) => {
      video.play().catch(() => {});
    });
  };

  activeScreenVideos.forEach((video) => {
    video.play().catch(() => {
      if (waitingForInteraction) return;
      waitingForInteraction = true;
      window.addEventListener("pointerdown", retryPlayback, { once: true });
    });
  });
}

const tvLoader = new GLTFLoader();

tvLoader.load(
  "assets/models/crt-tv-timothy-ahene.glb",
  ({ scene: tv }) => {
    tv.traverse((object) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        if (material?.map) {
          material.map.anisotropy = Math.min(
            renderer.capabilities.getMaxAnisotropy(),
            8,
          );
        }
      });
    });

    tv.rotation.y = Math.PI;
    tv.updateMatrixWorld(true);

    const initialBounds = new THREE.Box3().setFromObject(tv);
    const initialSize = initialBounds.getSize(new THREE.Vector3());
    const baseScale = TV_TARGET_HEIGHT / initialSize.y;

    tv.scale.setScalar(baseScale);
    tv.updateMatrixWorld(true);

    const scaledBounds = new THREE.Box3().setFromObject(tv);
    const scaledCenter = scaledBounds.getCenter(new THREE.Vector3());

    tv.position.x -= scaledCenter.x;
    tv.position.y -= scaledBounds.min.y;
    tv.position.z -= scaledBounds.min.z;

    const tvTemplate = new THREE.Group();
    tvTemplate.add(tv);
    tvTemplate.updateMatrixWorld(true);

    const templateBounds = new THREE.Box3().setFromObject(tvTemplate);
    const templateSize = templateBounds.getSize(new THREE.Vector3());

    const tvWall = new THREE.Group();
    let rowBottom = 0;

    TV_WALL_ROWS.forEach(({ offsetX, scales }, rowIndex) => {
      const rowUnits = [];
      let rowWidth = 0;
      let rowHeight = 0;

      scales.forEach((unitScale, unitIndex) => {
        const tvUnit = tvTemplate.clone(true);
        const unitWidth = templateSize.x * unitScale;
        const unitHeight = templateSize.y * unitScale;
        const mediaKey = TV_SCREEN_LAYOUT[rowIndex]?.[unitIndex] ?? "static";

        applyScreenMaterial(
          tvUnit,
          mediaKey,
          rowIndex * 5.73 + unitIndex * 1.91,
          rowIndex,
          unitIndex,
        );

        tvUnit.scale.setScalar(unitScale);
        tvUnit.position.set(
          rowWidth + unitWidth / 2,
          rowBottom,
          TV_WALL_Z,
        );

        rowUnits.push(tvUnit);
        rowWidth += unitWidth + TV_HORIZONTAL_GAP;
        rowHeight = Math.max(rowHeight, unitHeight);
      });

      rowWidth -= TV_HORIZONTAL_GAP;

      rowUnits.forEach((tvUnit) => {
        tvUnit.position.x += offsetX - rowWidth / 2;
        tvWall.add(tvUnit);
      });

      rowBottom += rowHeight + TV_VERTICAL_GAP;
    });

    scene.add(tvWall);
    tvWall.updateMatrixWorld(true);
    configureSharedTitleScreens(tvWall);
    configureScreenGlowLights();
    startScreenVideos();
    render();
    requestAnimationFrame(() => loadingScreen.classList.add("is-hidden"));
  },
  undefined,
  (error) => {
    console.error("CRT TV model could not be loaded.", error);
    requestAnimationFrame(() => loadingScreen.classList.add("is-hidden"));
  },
);

function render() {
  const elapsedTime = performance.now() * 0.001;
  const deltaTime = Math.min(Math.max(elapsedTime - previousFrameTime, 0), 0.05);
  previousFrameTime = elapsedTime;

  const followEase = 1 - Math.exp(-deltaTime * 3.1);
  if (!focusedScreen) {
    smoothedPointer.lerp(pointerTarget, followEase);
  }

  const motionScale = reducedMotionQuery.matches ? 0.18 : 1;
  const irregularDrift =
    Math.sin(elapsedTime * 0.23 + 1.3) *
    Math.sin(elapsedTime * 0.67 + 0.4);
  const handheldX = (
    Math.sin(elapsedTime * 0.61 + 0.8) * 0.014 +
    Math.sin(elapsedTime * 1.43 + 2.1) * 0.006 +
    irregularDrift * 0.004
  ) * motionScale;
  const handheldY = (
    Math.sin(elapsedTime * 0.37 + 1.4) * 0.011 +
    Math.sin(elapsedTime * 1.17 + 0.3) * 0.0045 +
    Math.sin(elapsedTime * 0.19 + 2.8) * 0.006
  ) * motionScale;
  const handheldZ = (
    Math.sin(elapsedTime * 0.33 + 2.7) * 0.011 +
    Math.sin(elapsedTime * 0.89 + 0.5) * 0.004
  ) * motionScale;
  const handheldLookX = (
    Math.sin(elapsedTime * 0.43 + 0.2) * 0.065 +
    Math.sin(elapsedTime * 1.07 + 1.9) * 0.024 +
    Math.sin(elapsedTime * 2.31 + 0.6) * 0.008 +
    irregularDrift * 0.016
  ) * motionScale;
  const handheldLookY = (
    Math.sin(elapsedTime * 0.31 + 2.5) * 0.044 +
    Math.sin(elapsedTime * 0.83 + 0.7) * 0.018 +
    Math.sin(elapsedTime * 2.03 + 1.2) * 0.006
  ) * motionScale;

  const introCameraAmount = getIntroCameraAmount(elapsedTime);
  const introPointerDamping = THREE.MathUtils.lerp(
    1,
    0.56,
    introCameraAmount,
  );
  const activeCameraHeight = THREE.MathUtils.lerp(
    EYE_HEIGHT,
    INTRO_CAMERA_HEIGHT,
    introCameraAmount,
  );

  homeCameraPosition.set(
    (smoothedPointer.x * 0.035 + handheldX) * introPointerDamping,
    activeCameraHeight +
      (smoothedPointer.y * 0.018 + handheldY) * introPointerDamping,
    handheldZ + INTRO_CAMERA_Z * introCameraAmount,
  );
  homeLookTarget.set(
    (smoothedPointer.x * 0.52 + handheldLookX) * introPointerDamping,
    activeCameraHeight +
      (smoothedPointer.y * 0.27 + handheldLookY) * introPointerDamping,
    -ROOM_DEPTH / 2,
  );

  const focusEase = 1 - Math.exp(
    -deltaTime * (reducedMotionQuery.matches ? 9 : 3.8),
  );
  focusAmount += (focusTarget - focusAmount) * focusEase;

  if (
    focusTarget === 0 &&
    focusAmount < FOCUS_RELEASE_THRESHOLD &&
    focusedScreen
  ) {
    focusAmount = 0;
    focusedScreen = null;
  }

  const smoothFocus = focusAmount * focusAmount * (3 - 2 * focusAmount);

  if (focusedScreen) {
    movingFocusCameraPosition.copy(focusCameraPosition);
    movingFocusCameraPosition.x += handheldX * 0.32;
    movingFocusCameraPosition.y += handheldY * 0.32;
    movingFocusCameraPosition.z += handheldZ * 0.2;

    movingFocusLookTarget.copy(focusLookTarget);
    movingFocusLookTarget.x += handheldLookX * 0.22;
    movingFocusLookTarget.y += handheldLookY * 0.22;

    camera.position.lerpVectors(
      homeCameraPosition,
      movingFocusCameraPosition,
      smoothFocus,
    );
    finalLookTarget.lerpVectors(
      homeLookTarget,
      movingFocusLookTarget,
      smoothFocus,
    );
  } else {
    camera.position.copy(homeCameraPosition);
    finalLookTarget.copy(homeLookTarget);
  }

  camera.lookAt(finalLookTarget);
  camera.rotation.z += (
    Math.sin(elapsedTime * 0.27 + 1.1) * 0.003 +
    Math.sin(elapsedTime * 0.73 + 2.4) * 0.0012 +
    Math.sin(elapsedTime * 1.91 + 0.2) * 0.00035
  ) * motionScale * THREE.MathUtils.lerp(1, 0.35, smoothFocus);

  updateProjectPanelSideOffset(deltaTime);
  updateTitleTransferTarget();
  updateHoveredScreen();

  const materialEase = 1 - Math.exp(-deltaTime * 10);
  const socialHoverEase = 1 - Math.exp(-deltaTime * 4.2);
  titleTransferAmount += (
    titleTransferTarget - titleTransferAmount
  ) * materialEase;
  const smoothTitleTransfer =
    titleTransferAmount * titleTransferAmount * (3 - 2 * titleTransferAmount);

  floatingTitleLetters.forEach((entry, letterIndex) => {
    const idleMotion = reducedMotionQuery.matches ? 0 : 1;
    const quietFloatY = Math.sin(elapsedTime * 0.54 + entry.phase) * 0.009 * idleMotion;
    const quietFloatZ = Math.sin(elapsedTime * 0.41 + entry.phase * 1.4) * 0.008 * idleMotion;
    const glitchGate = Math.sin(elapsedTime * 31 + entry.phase * 8.1) > 0.72 ? 1 : 0;
    const horizontalGlitch = glitchGate * smoothTitleTransfer *
      Math.sin(elapsedTime * 53 + letterIndex) * 0.045 * idleMotion;

    entry.mesh.position.copy(entry.basePosition);
    entry.mesh.position.addScaledVector(entry.scatterOffset, smoothTitleTransfer);
    entry.mesh.position.x += horizontalGlitch;
    entry.mesh.position.y += quietFloatY;
    entry.mesh.position.z += quietFloatZ;
    entry.mesh.rotation.set(
      entry.baseRotation.x + entry.scatterRotation.x * smoothTitleTransfer,
      entry.baseRotation.y + entry.scatterRotation.y * smoothTitleTransfer,
      entry.baseRotation.z + entry.scatterRotation.z * smoothTitleTransfer,
    );

    const glitchOpacity = glitchGate && smoothTitleTransfer > 0.08 ? 0.58 : 1;
    entry.material.opacity =
      (0.92 - smoothTitleTransfer * 0.26) *
      glitchOpacity *
      (1 - smoothFocus);
  });

  crtScreenMaterials.forEach((material) => {
    material.uniforms.uTime.value = elapsedTime;
    material.uniforms.uHoverAmount.value += (
      material.userData.interactionTarget -
      material.uniforms.uHoverAmount.value
    ) * materialEase;
    material.uniforms.uSocialHoverActive.value += (
      material.userData.socialHoverTarget -
      material.uniforms.uSocialHoverActive.value
    ) * socialHoverEase;
    material.uniforms.uIntroHoverAmount.value =
      material.userData.introHoverTarget;
    material.uniforms.uIntroIdlePatternAmount.value =
      material.userData.introIdlePatternTarget;
    material.uniforms.uDimAmount.value += (
      material.userData.dimTarget - material.uniforms.uDimAmount.value
    ) * materialEase;
    material.uniforms.uTitleOnScreenAmount.value = 0;
  });

  updateIntroSequence(elapsedTime);
  updateCeilingFlicker(elapsedTime, deltaTime);
  updateSiteHeaderVisibility();
  updateScreenGlowLights(elapsedTime, deltaTime);

  const lightEntry = focusTarget > 0 ? focusedScreen : hoveredScreen;
  const lightTargetIntensity = lightEntry ? (focusTarget > 0 ? 4.2 : 2.6) : 0;
  interactionLight.intensity += (
    lightTargetIntensity - interactionLight.intensity
  ) * materialEase;

  if (lightEntry) {
    lightEntry.mesh.getWorldPosition(interactionWorldPosition);
    interactionWorldPosition.z += 0.65;
    interactionLight.position.lerp(interactionWorldPosition, materialEase);
    if (lightEntry.glowLight) {
      interactionLight.color.lerp(lightEntry.glowLight.color, materialEase);
    }
  }

  renderer.render(scene, camera);
}

function handleResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height, false);
  projectPanelSideOffset = null;
  render();
}

window.addEventListener("resize", handleResize);

renderer.setAnimationLoop(render);
