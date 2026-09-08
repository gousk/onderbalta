import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

const canvas = document.querySelector("#roomCanvas");
const roomStage = document.querySelector(".room-stage");
const metaDescription = document.querySelector("#metaDescription");
const loadingScreen = document.querySelector("#loadingScreen");
const loadingStatus = document.querySelector("#loadingStatus");
const loadingProgressTrack = document.querySelector(".loading-progress-track");
const loadingProgressBar = document.querySelector("#loadingProgressBar");
const loadingPercent = document.querySelector("#loadingPercent");
const loadingActivity = document.querySelector("#loadingActivity");
const webglFallback = document.querySelector("#webglFallback");
const viewCursor = document.querySelector("#viewCursor");
const siteHeader = document.querySelector("#siteHeader");
const headerWordmark = document.querySelector("#headerWordmark");
const primaryNav = document.querySelector("#primaryNav");
const homeButton = document.querySelector("#homeButton");
const aboutMeButton = document.querySelector("#aboutMeButton");
const languageSwitch = document.querySelector("#languageSwitch");
const languageEnglish = document.querySelector("#languageEnglish");
const languageTurkish = document.querySelector("#languageTurkish");
const aboutGameButton = document.querySelector("#aboutGameButton");
const aboutWindow = document.querySelector("#aboutWindow");
const aboutWindowBar = document.querySelector("#aboutWindowBar");
const aboutWindowTitle = document.querySelector("#aboutWindowTitle");
const aboutWindowClose = document.querySelector("#aboutWindowClose");
const headerInfoText = document.querySelector("#headerInfoText");
const projectPanel = document.querySelector("#projectPanel");
const projectWindowTitle = document.querySelector("#projectWindowTitle");
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

const MOBILE_LAYOUT_QUERY = window.matchMedia(
  "(max-width: 760px) and (orientation: portrait)",
);
const FORCE_MOBILE_PREVIEW =
  new URLSearchParams(window.location.search).get("mobile") === "1";
let mobileLayoutActive = FORCE_MOBILE_PREVIEW || MOBILE_LAYOUT_QUERY.matches;

document.documentElement.classList.toggle(
  "is-mobile-preview",
  FORCE_MOBILE_PREVIEW,
);
document.documentElement.classList.toggle(
  "is-mobile-layout",
  mobileLayoutActive,
);

function getStageViewport() {
  const bounds = roomStage.getBoundingClientRect();
  return {
    width: Math.max(1, bounds.width),
    height: Math.max(1, bounds.height),
    left: bounds.left,
    top: bounds.top,
  };
}

function getRendererPixelRatio() {
  const maximumPixelRatio = mobileLayoutActive ? 1.25 : 2;
  return Math.min(window.devicePixelRatio, maximumPixelRatio);
}

const ROOM_WIDTH = 18;
const ROOM_HEIGHT = 6;
const ROOM_DEPTH = 18;
const EYE_HEIGHT = 2.38;
const DEFAULT_CAMERA_Z = -1.35;
const TV_TARGET_HEIGHT = 1.6;
const TV_WALL_Z = -ROOM_DEPTH / 2 + 0.04;
const TV_HORIZONTAL_GAP = 0.015;
const TV_VERTICAL_GAP = -0.035;
const TV_DESKTOP_WALL_ROWS = [
  { offsetX: -0.08, scales: [1, 0.98, 1.01, 0.97, 0.99] },
  { offsetX: 0.12, scales: [0.98, 1, 0.97, 1.01, 0.98] },
  { offsetX: -0.04, scales: [0.99, 0.97, 1, 0.98] },
];
const TV_MOBILE_WALL_ROWS = [
  {
    offsetX: -0.015,
    columns: 3,
    entries: [
      { rowIndex: 1, unitIndex: 4, scale: 0.71, columnIndex: 0 },
      { rowIndex: 2, unitIndex: 3, scale: 0.72, columnIndex: 1 },
      { rowIndex: 0, unitIndex: 4, scale: 0.71, columnIndex: 2 },
    ],
  },
  {
    offsetX: 0.02,
    columns: 3,
    entries: [
      { rowIndex: 1, unitIndex: 3, scale: 0.71, columnIndex: 0 },
      { rowIndex: 2, unitIndex: 2, scale: 0.71, columnIndex: 1 },
      { rowIndex: 0, unitIndex: 3, scale: 0.72, columnIndex: 2 },
    ],
  },
  {
    offsetX: -0.025,
    columns: 3,
    entries: [
      { rowIndex: 1, unitIndex: 2, scale: 0.7, columnIndex: 0 },
      { rowIndex: 2, unitIndex: 1, scale: 0.69, columnIndex: 1 },
      { rowIndex: 0, unitIndex: 2, scale: 0.7, columnIndex: 2 },
    ],
  },
  {
    offsetX: 0.025,
    columns: 3,
    entries: [
      { rowIndex: 1, unitIndex: 1, scale: 0.71, columnIndex: 0 },
      { rowIndex: 2, unitIndex: 0, scale: 0.7, columnIndex: 1 },
      { rowIndex: 0, unitIndex: 1, scale: 0.72, columnIndex: 2 },
    ],
  },
  {
    offsetX: -0.02,
    columns: 3,
    entries: [
      { rowIndex: 1, unitIndex: 0, scale: 0.7, columnIndex: 0 },
      { rowIndex: 0, unitIndex: 0, scale: 0.71, columnIndex: 2 },
    ],
  },
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
    meta: "2025",
    description:
      "A Unity environment study built around procedural god rays, bird flocks, and horse systems.",
  },
  scene02: {
    title: "scene 02",
    meta: "2025",
    description:
      "A Unity experiment focused on procedural blob tracking and responsive motion.",
  },
  scene03: {
    title: "scene 03",
    meta: "2025",
    description:
      "A test intro sequence created for bicycle club games and videos.",
  },
  bicycleVideo: {
    title: "bicycle club",
    meta: "2025",
    description:
      "A dense, terminal-inspired platform built with React, Vite, and Supabase, with an interface shaped by ASCII imagery.",
    url: "https://bicycleclub.net",
    gallery: [
      {
        src: "assets/optimized-media/bicycle-club-site.webp",
        alt: "bicycle club website interface",
      },
    ],
  },
  nullGame: {
    title: "null",
    meta: "2025",
    description:
      "A fast-paced, level-based movement shooter currently being developed as a playable prototype.",
    url: "https://gousk.itch.io/null",
  },
  deliveryGuy: {
    title: "delivery guy simulator",
    meta: "2025",
    description:
      "A delivery game we are currently developing as bicycle club.",
    url: "https://store.steampowered.com/app/3377340/Delivery_Guy_Simulator/",
    previewUrl: "https://www.youtube.com/watch?v=leXbs1gXaL4",
    linkLabel: "wishlist on steam",
  },
};

const UI_COPY = {
  en: {
    documentTitle: "onder balta - game developer",
    metaDescription: "A three-dimensional portfolio space by onder balta.",
    roomLabel: "3D portfolio space",
    canvasLabel: "A concrete room viewed from its center",
    webglFallback: "This 3D space requires WebGL to be enabled in your browser.",
    primaryNavigation: "Primary navigation",
    home: "home",
    aboutMe: "about me",
    switchLanguage: "Switch language to Turkish",
    aboutWindowTitle: "about_me.txt",
    closeAbout: "Close about window",
    aboutText:
      "Hey, Im Önder. I am an information systems engineering graduate and a game developer interested in technical art and stylized graphics. Currently developing our own game, Delivery Guy Simulator, as bicycle club. If you find it interesting, please check it out and consider adding it to your wishlist.",
    showDeliveryGuy: "show delivery guy simulator",
    projectWindowTitle: "project_view.exe",
    closeProject: "Close project view",
    view: "view",
    click: "click",
    viewGallery: "view gallery",
    watch: "watch",
    visitProject: "visit project",
    wishlistOnSteam: "wishlist on steam",
    viewProject: (title) => `View ${title}`,
    watchProject: (title) => `Watch ${title}`,
    backToRoom: "back to room",
    previous: "prev",
    next: "next",
    previousImage: "Previous image",
    nextImage: "Next image",
    imageAlt: (title) => `${title} image`,
    previewAlt: (title) => `${title} preview`,
    media: "media",
  },
  tr: {
    documentTitle: "onder balta - game developer",
    metaDescription: "onder balta tarafından oluşturulan üç boyutlu portfolyo alanı.",
    roomLabel: "3B portfolyo alanı",
    canvasLabel: "Merkezinden görülen beton bir oda",
    webglFallback: "Bu 3B alanı görüntülemek için tarayıcınızda WebGL etkin olmalıdır.",
    primaryNavigation: "Ana navigasyon",
    home: "ana sayfa",
    aboutMe: "hakkımda",
    switchLanguage: "Dili İngilizceye çevir",
    aboutWindowTitle: "hakkımda.txt",
    closeAbout: "Hakkımda penceresini kapat",
    aboutText:
      "Merhabalar ben Önder, bilişim sistemleri mühendisliği mezunu bir oyun geliştiricisiyim. Technical art ve stilize grafikler ile ilgiliyim. Aktif olarak bicycle club adı altında kendi oyunumuz Delivery Guy Simulator’ı geliştiriyoruz. İlginizi çekerse göz atmanız ve istek listenize eklemeniz bizi mutlu eder.",
    showDeliveryGuy: "Delivery Guy Simulator’ı incele",
    projectWindowTitle: "proje_gorunumu.exe",
    closeProject: "Proje görünümünü kapat",
    view: "incele",
    click: "tıkla",
    viewGallery: "galeriyi aç",
    watch: "izle",
    visitProject: "projeyi ziyaret et",
    wishlistOnSteam: "steam istek listesine ekle",
    viewProject: (title) => `${title} projesini görüntüle`,
    watchProject: (title) => `${title} videosunu izle`,
    backToRoom: "odaya dön",
    previous: "önceki",
    next: "sonraki",
    previousImage: "Önceki görsel",
    nextImage: "Sonraki görsel",
    imageAlt: (title) => `${title} görseli`,
    previewAlt: (title) => `${title} önizlemesi`,
    media: "medya",
  },
};

const PROJECT_COPY = {
  en: {
    scene01: {
      title: "scene 01",
      meta: "2025",
      description:
        "A Unity environment study built around procedural god rays, bird flocks, and horse systems.",
    },
    scene02: {
      title: "scene 02",
      meta: "2025",
      description:
        "A Unity experiment focused on procedural blob tracking and responsive motion.",
    },
    scene03: {
      title: "scene 03",
      meta: "2025",
      description: "A test intro sequence created for bicycle club games and videos.",
    },
    bicycleVideo: {
      title: "bicycle club",
      meta: "2025",
      description:
        "A dense, terminal-inspired platform built with React, Vite, and Supabase, with an interface shaped by ASCII imagery.",
      galleryAlts: ["bicycle club website interface"],
    },
    nullGame: {
      title: "null",
      meta: "2025",
      description:
        "A fast-paced, level-based movement shooter currently being developed as a playable prototype.",
    },
    deliveryGuy: {
      title: "delivery guy simulator",
      meta: "2025",
      description: "A delivery game we are currently developing as bicycle club.",
      linkLabel: "wishlist on steam",
    },
  },
  tr: {
    scene01: {
      title: "sahne 01",
      meta: "2025",
      description:
        "Prosedürel tanrı ışınları, kuş sürüleri ve at sistemleri etrafında geliştirilmiş bir Unity çevre çalışması.",
    },
    scene02: {
      title: "sahne 02",
      meta: "2025",
      description:
        "Prosedürel blob takibi ve duyarlı hareket üzerine odaklanan bir Unity deneyi.",
    },
    scene03: {
      title: "sahne 03",
      meta: "2025",
      description:
        "bicycle club oyunları ve videoları için hazırlanmış bir intro sekansı denemesi.",
    },
    bicycleVideo: {
      title: "bicycle club",
      meta: "2025",
      description:
        "React, Vite ve Supabase ile geliştirilmiş, arayüzü ASCII görselleri etrafında şekillenen yoğun ve terminal esintili bir platform.",
      galleryAlts: ["bicycle club web sitesi arayüzü"],
    },
    nullGame: {
      title: "null",
      meta: "2025",
      description:
        "Oynanabilir bir prototip olarak geliştirilen hızlı tempolu, bölüm tabanlı bir hareket nişancı oyunu.",
    },
    deliveryGuy: {
      title: "delivery guy simulator",
      meta: "2025",
      description: "bicycle club olarak geliştirmekte olduğumuz bir teslimat oyunu.",
      linkLabel: "steam istek listesine ekle",
    },
  },
};

const LANGUAGE_STORAGE_KEY = "onderbalta.language";
let currentLanguage = "en";

function getSavedLanguage() {
  try {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return UI_COPY[savedLanguage] ? savedLanguage : "en";
  } catch (error) {
    return "en";
  }
}

function saveLanguage(language) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    // The selected language still works for this visit if storage is unavailable.
  }
}

function getUiCopy() {
  return UI_COPY[currentLanguage];
}

const ONDER_FONT_ASCII_MAP = Object.freeze({
  Ç: "C",
  Ğ: "G",
  İ: "I",
  Ö: "O",
  Ş: "S",
  Ü: "U",
  Â: "A",
  Î: "I",
  Û: "U",
  ç: "c",
  ğ: "g",
  ı: "i",
  ö: "o",
  ş: "s",
  ü: "u",
  â: "a",
  î: "i",
  û: "u",
});

function formatForOnderFont(value) {
  return String(value ?? "").replace(
    /[ÇĞİÖŞÜÂÎÛçğıöşüâîû]/g,
    (character) => ONDER_FONT_ASCII_MAP[character],
  );
}

function getLocalizedProject(mediaKey) {
  const project = TV_PROJECTS[mediaKey];
  if (!project) return null;

  const localizedCopy = PROJECT_COPY[currentLanguage]?.[mediaKey] ?? {};
  const localizedProject = { ...project, ...localizedCopy };
  if (Array.isArray(project.gallery)) {
    localizedProject.gallery = project.gallery.map((item, index) => ({
      ...item,
      alt: localizedCopy.galleryAlts?.[index] ?? item.alt,
    }));
  }
  return localizedProject;
}

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

const initialViewport = getStageViewport();
renderer.setPixelRatio(getRendererPixelRatio());
renderer.setSize(initialViewport.width, initialViewport.height, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.82;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
RectAreaLightUniformsLib.init();

const scene = new THREE.Scene();
const roomBackgroundColor = new THREE.Color(0x171819);
const bootBackgroundColor = new THREE.Color(0x020302);
scene.background = bootBackgroundColor.clone();

const camera = new THREE.PerspectiveCamera(
  mobileLayoutActive ? 52 : 60,
  initialViewport.width / initialViewport.height,
  0.1,
  100,
);
camera.position.set(0, EYE_HEIGHT, DEFAULT_CAMERA_Z);
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
const mobileFocusProjectionCamera = camera.clone();
const mobileFocusBoundsSize = new THREE.Vector3();
const finalLookTarget = new THREE.Vector3();
const interactionWorldPosition = new THREE.Vector3();
const focusedScreenBounds = new THREE.Box3();
const mobileFocusReferenceBounds = new THREE.Box3();
const projectedScreenCorner = new THREE.Vector3();
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let headerInfoHasTyped = false;
let headerInfoTypingTimer = null;
const headerInfoTypingWords = [];
let aboutWindowRequestedOpen = false;
let aboutWindowHasAutoOpened = false;
let aboutWindowAutoOpenTimer = null;
let aboutWindowDragState = null;

function prepareHeaderInfoTypingText() {
  const fullText = headerInfoText.dataset.text ?? "";
  const typingFragment = document.createDocumentFragment();
  headerInfoTypingWords.length = 0;

  fullText.split(/(\s+)/).forEach((textPart) => {
    if (/^\s+$/.test(textPart)) {
      typingFragment.append(document.createTextNode(textPart));
      return;
    }

    const word = document.createElement("span");
    word.className = "header-info-word";
    word.textContent = textPart;
    headerInfoTypingWords.push(word);
    typingFragment.append(word);
  });

  headerInfoText.replaceChildren(typingFragment);
}

function beginHeaderInfoTyping() {
  if (
    headerInfoHasTyped ||
    headerInfoTypingTimer !== null ||
    !aboutWindow.classList.contains("is-visible")
  ) {
    return;
  }

  if (reducedMotionQuery.matches) {
    headerInfoTypingWords.forEach((word) => {
      word.classList.add("is-visible");
    });
    headerInfoHasTyped = true;
    return;
  }

  headerInfoTypingTimer = window.setTimeout(() => {
    headerInfoTypingTimer = null;
    if (!aboutWindow.classList.contains("is-visible")) return;

    headerInfoHasTyped = true;
    let wordIndex = 0;

    const typeNextWord = () => {
      headerInfoTypingWords[wordIndex]?.classList.add("is-visible");
      wordIndex += 1;

      if (wordIndex < headerInfoTypingWords.length) {
        headerInfoTypingTimer = window.setTimeout(typeNextWord, 46);
        return;
      }

      headerInfoTypingTimer = null;
    };

    typeNextWord();
  }, 680);
}

function syncAboutWindowVisibility() {
  const shouldShowAboutWindow =
    aboutWindowRequestedOpen && siteHeaderVisible;
  aboutWindow.classList.toggle("is-visible", shouldShowAboutWindow);
  aboutWindow.setAttribute("aria-hidden", String(!shouldShowAboutWindow));
  aboutWindow.inert = !shouldShowAboutWindow;

  if (shouldShowAboutWindow) beginHeaderInfoTyping();
}

function openAboutWindow() {
  aboutWindowRequestedOpen = true;
  syncAboutWindowVisibility();
}

function closeAboutWindow() {
  aboutWindowRequestedOpen = false;
  syncAboutWindowVisibility();
  aboutMeButton.focus({ preventScroll: true });
}

function clampAboutWindowPosition() {
  if (mobileLayoutActive) {
    aboutWindow.style.removeProperty("left");
    aboutWindow.style.removeProperty("top");
    return;
  }
  if (!aboutWindow.style.left || !aboutWindow.style.top) return;

  const bounds = aboutWindow.getBoundingClientRect();
  const edgeInset = window.innerWidth <= 700 ? 8 : 12;
  const nextLeft = THREE.MathUtils.clamp(
    bounds.left,
    edgeInset,
    Math.max(edgeInset, window.innerWidth - bounds.width - edgeInset),
  );
  const nextTop = THREE.MathUtils.clamp(
    bounds.top,
    edgeInset,
    Math.max(edgeInset, window.innerHeight - bounds.height - edgeInset),
  );
  aboutWindow.style.left = `${nextLeft}px`;
  aboutWindow.style.top = `${nextTop}px`;
}

aboutMeButton.addEventListener("click", openAboutWindow);
aboutWindowClose.addEventListener("click", closeAboutWindow);
aboutGameButton.addEventListener("click", () => {
  const deliveryGuyScreen = allScreenEntries.find(
    (entry) => entry.mediaKey === "deliveryGuy",
  );
  if (!deliveryGuyScreen || focusedScreen) return;

  aboutWindowRequestedOpen = false;
  syncAboutWindowVisibility();
  focusProjectScreen(deliveryGuyScreen);
});

aboutWindowBar.addEventListener("pointerdown", (event) => {
  if (
    mobileLayoutActive ||
    event.button !== 0 ||
    event.target.closest("button")
  ) return;

  const bounds = aboutWindow.getBoundingClientRect();
  aboutWindow.style.left = `${bounds.left}px`;
  aboutWindow.style.top = `${bounds.top}px`;
  aboutWindowDragState = {
    pointerId: event.pointerId,
    pointerX: event.clientX,
    pointerY: event.clientY,
    windowX: bounds.left,
    windowY: bounds.top,
  };
  aboutWindowBar.setPointerCapture(event.pointerId);
  event.preventDefault();
});

aboutWindowBar.addEventListener("pointermove", (event) => {
  if (aboutWindowDragState?.pointerId !== event.pointerId) return;

  const bounds = aboutWindow.getBoundingClientRect();
  const edgeInset = window.innerWidth <= 700 ? 8 : 12;
  const nextLeft = THREE.MathUtils.clamp(
    aboutWindowDragState.windowX +
      event.clientX -
      aboutWindowDragState.pointerX,
    edgeInset,
    Math.max(edgeInset, window.innerWidth - bounds.width - edgeInset),
  );
  const nextTop = THREE.MathUtils.clamp(
    aboutWindowDragState.windowY +
      event.clientY -
      aboutWindowDragState.pointerY,
    edgeInset,
    Math.max(edgeInset, window.innerHeight - bounds.height - edgeInset),
  );
  aboutWindow.style.left = `${nextLeft}px`;
  aboutWindow.style.top = `${nextTop}px`;
});

function finishAboutWindowDrag(event) {
  if (aboutWindowDragState?.pointerId !== event.pointerId) return;
  if (aboutWindowBar.hasPointerCapture(event.pointerId)) {
    aboutWindowBar.releasePointerCapture(event.pointerId);
  }
  aboutWindowDragState = null;
}

aboutWindowBar.addEventListener("pointerup", finishAboutWindowDrag);
aboutWindowBar.addEventListener("pointercancel", finishAboutWindowDrag);

const FOCUS_RELEASE_THRESHOLD = 0.03;
const DESKTOP_FOCUS_OUTWARD_LOOK_OFFSET = 1.12;
const MOBILE_FOCUS_BASE_DISTANCE = 3.08;
const MOBILE_FOCUS_REFERENCE_MEDIA_KEY = "scene02";
const MOBILE_FOCUS_EXTRA_LIFT = {
  bicycleVideo: -28,
  nullGame: -15,
  deliveryGuy: -10,
};
let hoveredScreen = null;
let focusedScreen = null;
let focusAmount = 0;
let focusTarget = 0;
let projectPanelSideOffset = null;
let cleanViewMode = null;
let cleanGalleryItems = [];
let cleanGalleryIndex = 0;
let previousFrameTime = performance.now() * 0.001;
const SCENE_BLOCKING_UI_SELECTOR = [
  ".site-header",
  ".about-window",
  ".project-panel",
  ".clean-view",
].join(",");

function setLanguage(language) {
  if (!UI_COPY[language]) return;
  currentLanguage = language;
  saveLanguage(language);
  const copy = getUiCopy();

  document.documentElement.lang = language;
  document.title = copy.documentTitle;
  metaDescription.content = copy.metaDescription;
  roomStage.setAttribute("aria-label", copy.roomLabel);
  canvas.setAttribute("aria-label", copy.canvasLabel);
  webglFallback.textContent = copy.webglFallback;
  primaryNav.setAttribute("aria-label", copy.primaryNavigation);
  homeButton.textContent = copy.home;
  aboutMeButton.textContent = copy.aboutMe;
  languageSwitch.setAttribute("aria-label", copy.switchLanguage);
  languageEnglish.classList.toggle("is-active", language === "en");
  languageTurkish.classList.toggle("is-active", language === "tr");
  aboutWindowTitle.textContent = copy.aboutWindowTitle;
  aboutWindowClose.setAttribute("aria-label", copy.closeAbout);
  aboutGameButton.textContent = copy.showDeliveryGuy;
  projectWindowTitle.textContent = copy.projectWindowTitle;
  projectClose.setAttribute("aria-label", copy.closeProject);
  cleanViewClose.textContent = copy.backToRoom;
  cleanGalleryPrev.textContent = copy.previous;
  cleanGalleryPrev.setAttribute("aria-label", copy.previousImage);
  cleanGalleryNext.textContent = copy.next;
  cleanGalleryNext.setAttribute("aria-label", copy.nextImage);

  if (headerInfoTypingTimer !== null) {
    window.clearTimeout(headerInfoTypingTimer);
    headerInfoTypingTimer = null;
  }
  headerInfoHasTyped = false;
  headerInfoText.dataset.text = copy.aboutText;
  headerInfoText.setAttribute("aria-label", copy.aboutText);
  prepareHeaderInfoTypingText();
  if (aboutWindow.classList.contains("is-visible")) beginHeaderInfoTyping();

  updateViewCursorLabel();

  if (focusedScreen && projectPanel.classList.contains("is-visible")) {
    const panelOnLeft = projectPanel.classList.contains("is-left");
    showProjectPanel(
      getLocalizedProject(focusedScreen.mediaKey),
      panelOnLeft,
      focusedScreen.mediaKey,
    );
  }

  if (focusedScreen && cleanView.classList.contains("is-visible")) {
    const mediaKey = focusedScreen.mediaKey;
    const project = getLocalizedProject(mediaKey);
    cleanViewTitle.textContent = project?.title ?? copy.media;
    if (cleanViewMode === "gallery") {
      cleanGalleryItems = getProjectGallery(project, TV_SCREEN_MEDIA[mediaKey]);
      showCleanGalleryItem(cleanGalleryIndex);
    }
  }
}

languageSwitch.addEventListener("click", () => {
  setLanguage(currentLanguage === "en" ? "tr" : "en");
});

setLanguage(getSavedLanguage());

function suspendScenePointerInteractions() {
  pointerTarget.set(0, 0);
  pointerNdc.set(2, 2);
  setHoveredScreen(null);
  roomStage.classList.remove("is-screen-hovered");
  viewCursor.classList.remove("is-visible");
}

function handlePointerMove(event) {
  viewCursor.style.transform = `translate3d(${event.clientX + 16}px, ${event.clientY + 16}px, 0)`;
  if (
    event.target instanceof Element &&
    event.target.closest(SCENE_BLOCKING_UI_SELECTOR)
  ) {
    suspendScenePointerInteractions();
    return;
  }

  const viewport = getStageViewport();
  if (
    event.clientX < viewport.left ||
    event.clientX > viewport.left + viewport.width ||
    event.clientY < viewport.top ||
    event.clientY > viewport.top + viewport.height
  ) {
    suspendScenePointerInteractions();
    return;
  }
  const pointerX = THREE.MathUtils.clamp(
    ((event.clientX - viewport.left) / viewport.width) * 2 - 1,
    -1,
    1,
  );
  const pointerY = THREE.MathUtils.clamp(
    1 - ((event.clientY - viewport.top) / viewport.height) * 2,
    -1,
    1,
  );

  pointerTarget.set(pointerX, pointerY);
  pointerNdc.set(pointerX, pointerY);
}

function syncPointerFromEvent(event) {
  const viewport = getStageViewport();
  const pointerX = THREE.MathUtils.clamp(
    ((event.clientX - viewport.left) / viewport.width) * 2 - 1,
    -1,
    1,
  );
  const pointerY = THREE.MathUtils.clamp(
    1 - ((event.clientY - viewport.top) / viewport.height) * 2,
    -1,
    1,
  );
  pointerNdc.set(pointerX, pointerY);
  if (!mobileLayoutActive) pointerTarget.set(pointerX, pointerY);
}

function resetPointerTarget() {
  pointerTarget.set(0, 0);
  pointerNdc.set(2, 2);
  setHoveredScreen(null);
}

window.addEventListener("pointermove", handlePointerMove, { passive: true });
window.addEventListener("pointerover", handlePointerMove, { passive: true });
canvas.addEventListener("pointerdown", syncPointerFromEvent, { passive: true });
document.documentElement.addEventListener("mouseleave", resetPointerTarget);
[siteHeader, aboutWindow, projectPanel, cleanView].forEach((element) => {
  element.addEventListener("pointerenter", suspendScenePointerInteractions);
});
aboutWindow.addEventListener("pointerdown", (event) => event.stopPropagation());
aboutWindow.addEventListener("click", (event) => event.stopPropagation());

const smoothWhiteMaterial = new THREE.MeshStandardMaterial({
  color: 0xf7f7f4,
  roughness: 1,
  metalness: 0,
  side: THREE.DoubleSide,
});

const concreteTextureLoader = new THREE.TextureLoader();
const concreteTextureCopies = new Map();
const concreteTextureLoads = [];

function loadConcreteTexture(src, colorSpace = THREE.NoColorSpace, fallback = "#ffffff") {
  // Keep every surface renderable even while the network is unavailable.
  const placeholder = document.createElement("canvas");
  placeholder.width = placeholder.height = 1;
  const context = placeholder.getContext("2d");
  context.fillStyle = fallback;
  context.fillRect(0, 0, 1, 1);
  const texture = new THREE.Texture(placeholder);
  texture.colorSpace = colorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = Math.min(
    renderer.capabilities.getMaxAnisotropy(),
    8,
  );
  texture.needsUpdate = true;
  const copies = new Set([texture]);
  concreteTextureCopies.set(texture, copies);
  concreteTextureLoads.push(new Promise((resolve) => {
    function attemptLoad(attempt) {
      let finished = false;
      const timeout = window.setTimeout(() => finish(null), 12000);
      function finish(loadedTexture) {
        if (finished) return;
        finished = true;
        window.clearTimeout(timeout);
        if (loadedTexture) {
          // The placeholder has different dimensions. Reallocate GPU storage
          // instead of uploading a large image into its existing 1x1 allocation.
          copies.forEach((copy) => {
            copy.dispose();
            copy.source = loadedTexture.source;
            copy.needsUpdate = true;
          });
          resolve();
        } else if (attempt < 3) {
          window.setTimeout(() => attemptLoad(attempt + 1), attempt * 500);
        } else {
          console.warn(`Concrete texture unavailable; using neutral fallback: ${src}`);
          resolve();
        }
      }
      const url = attempt === 1 ? src : `${src}?retry=${attempt}`;
      concreteTextureLoader.load(url, finish, undefined, () => finish(null));
    }
    attemptLoad(1);
  }));
  return texture;
}

const concreteColorTexture = loadConcreteTexture(
  "assets/optimized-media/concrete-color-2k.jpg",
  THREE.SRGBColorSpace,
);
const concreteNormalTexture = loadConcreteTexture(
  "assets/optimized-media/concrete-normal-2k.jpg",
  THREE.NoColorSpace,
  "#8080ff",
);
const concreteRoughnessTexture = loadConcreteTexture(
  "assets/optimized-media/concrete-roughness-2k.jpg",
);
const CONCRETE_TILE_SIZE = 6;

function createConcreteMaterial(width, height) {
  const colorTexture = concreteColorTexture.clone();
  const normalTexture = concreteNormalTexture.clone();
  const roughnessTexture = concreteRoughnessTexture.clone();
  concreteTextureCopies.get(concreteColorTexture).add(colorTexture);
  concreteTextureCopies.get(concreteNormalTexture).add(normalTexture);
  concreteTextureCopies.get(concreteRoughnessTexture).add(roughnessTexture);
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

const AMBIENT_LIGHT_BASE_INTENSITY = 0.24;
const ambientLight = new THREE.HemisphereLight(0xcfd6da, 0x6f6962, 0);
scene.add(ambientLight);

const KEY_LIGHT_BASE_INTENSITY = 82;
const keyLight = new THREE.SpotLight(
  0xffffff,
  0,
  18,
  Math.PI / 2.8,
  0.86,
  2,
);
keyLight.position.set(0, ROOM_HEIGHT - 0.36, -1.5);
keyLight.target.position.set(0, 0.5, -5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(
  mobileLayoutActive ? 1024 : 2048,
  mobileLayoutActive ? 1024 : 2048,
);
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
ceilingPanelMaterial.color.setScalar(0);
const ceilingFixtures = [];
let ceilingLightPower = 0;
let roomLightLevel = 0.4;
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
  housing.visible = !mobileLayoutActive;
  scene.add(housing);

  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(3.35, 0.48),
    ceilingPanelMaterial,
  );
  panel.position.set(0, ROOM_HEIGHT - 0.132, z);
  panel.rotation.x = Math.PI / 2;
  panel.visible = !mobileLayoutActive;
  scene.add(panel);

  const areaLight = new THREE.RectAreaLight(
    0xffffff,
    0,
    3.35,
    0.48,
  );
  areaLight.position.set(0, ROOM_HEIGHT - 0.16, z);
  areaLight.lookAt(0, 0, z);
  scene.add(areaLight);
  ceilingFixtures.push({
    areaLight,
    baseIntensity: intensity,
    housing,
    panel,
  });
}

createCeilingFixture(3.8, 2.1);
createCeilingFixture(-1.5, 2.8);
createCeilingFixture(-6.7, 2.35);

const TV_GLOW_BASE_INTENSITY = 3.2;
const tvGlowLight = new THREE.PointLight(0x91b6c8, 0, 5.5, 2);
tvGlowLight.position.set(0, 2.25, TV_WALL_Z + 1.45);
scene.add(tvGlowLight);

const interactionLight = new THREE.PointLight(0xc8efd1, 0, 3.2, 2);
interactionLight.position.set(0, EYE_HEIGHT, TV_WALL_Z + 0.8);
scene.add(interactionLight);

const activeScreenVideos = [];
const screenVideoByMediaKey = new Map();
let screenVideosUnlocked = false;
let screenVideoRetryArmed = false;
const screenTextureCache = new Map();
const screenMediaAspectCache = new Map();
const crtScreenMaterials = [];
const screenGlowEntries = [];
const sampledScreenLightCache = new Map();
const greenFilterLightColor = new THREE.Color(0x789b7f);
const screenLightSampleCanvas = document.createElement("canvas");
screenLightSampleCanvas.width = 12;
screenLightSampleCanvas.height = 12;
const screenLightSampleContext = screenLightSampleCanvas.getContext("2d", {
  willReadFrequently: true,
});
let nextScreenLightSampleAt = 0;

const INTRO_HANDOFF_DURATION = 0.92;
const INTRO_FADE_DURATION = 0.9;
const INTRO_POWER_DURATION = 1.15;
const LOADING_OVERLAY_MIN_DURATION = 1.2;
const BOOT_LIGHT_DURATION = 1.72;
const BOOT_SCREEN_LIGHT_OVERLAP_AT = 0.12;
const BOOT_TITLE_SCREEN_OVERLAP_DELAY = 0.18;
const BOOT_SCREEN_POWER_DURATION = 0.52;
const BOOT_SCREEN_STAGGER = 0.1;
const BOOT_TITLE_DURATION = 1.86;
const SOCIAL_ICON_REVEAL_DELAY = 0.18;
const SOCIAL_ICON_REVEAL_DURATION = 1.72;
const INTRO_CAMERA_PULL_DURATION = INTRO_HANDOFF_DURATION + INTRO_FADE_DURATION;
const INTRO_CUE_IDLE_DELAY = 4.2;
const INTRO_CUE_REVEAL_DURATION = 0.28;
const CRT_SCREEN_ASPECT = 1.3126972362;
const INTRO_HOVER_OUTER_RANGE = 1.55;
const INTRO_CAMERA_Z = -1.8;
const INTRO_CAMERA_HEIGHT = 2.38;
const MOBILE_DEFAULT_CAMERA_Z = -0.35;
const MOBILE_INTRO_CAMERA_Z = -1.16;
const MOBILE_DEFAULT_CAMERA_HEIGHT = 3.18;
const MOBILE_INTRO_CAMERA_HEIGHT = 2.72;
let introLetterTitleBounds = null;
let introHoverHitArea = null;
let introClickHitArea = null;
let introStage = "waiting";
let introStageStartedAt = 0;
let introSequenceStartedAt = 0;
let introCueIdleStartedAt = null;
let siteHeaderVisible = false;
let siteAssetsReady = false;
let siteModelReady = false;
let siteFontReady = !document.fonts;
let siteConcreteReady = false;
Promise.all(concreteTextureLoads).then(() => {
  siteConcreteReady = true;
  siteAssetsReady = siteModelReady && siteFontReady && siteConcreteReady;
});
let siteBootStage = "loading";
let siteBootStageStartedAt = performance.now() * 0.001;
let siteBootSequenceStartedAt = 0;
let siteBootScreensStartedAt = 0;
let siteBootTitleStartedAt = 0;
let siteBootLoadingProgress = 0;
let siteBootLightAmount = 0;
let siteBootTitleProgress = 0;
const introWaveOrigin = new THREE.Vector2(0.5, 0.5);

const introCueSpriteTexture = new THREE.TextureLoader().load(
  "assets/optimized-media/chicago95-arrow-cursor.png",
  render,
);
introCueSpriteTexture.colorSpace = THREE.SRGBColorSpace;
introCueSpriteTexture.minFilter = THREE.NearestFilter;
introCueSpriteTexture.magFilter = THREE.NearestFilter;
introCueSpriteTexture.generateMipmaps = false;
introCueSpriteTexture.wrapS = THREE.ClampToEdgeWrapping;
introCueSpriteTexture.wrapT = THREE.ClampToEdgeWrapping;

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
  const fontSize = height * (mobileLayoutActive ? 0.74 : 0.64);

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
  const cellSize = mobileLayoutActive ? 25 : 16;
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

const socialScreenCanvases = new Map();
const socialScreenTextures = new Map();
const socialPixelScreenCanvases = new Map();
const socialPixelScreenTextures = new Map();
const socialAsciiScreenCanvases = new Map();
const socialAsciiScreenTextures = new Map();
const socialIconImages = new Map();
const SOCIAL_ASCII_CHARACTERS = ".`',:;~-+=*#%@";
const SOCIAL_BACKDROP_CHARACTERS = ".:;~-+=*#";
const socialBackdropCanvas = document.createElement("canvas");
socialBackdropCanvas.width = 800;
socialBackdropCanvas.height = 800;
const socialBackdropContext = socialBackdropCanvas.getContext("2d");
socialBackdropContext.fillStyle = "#020303";
socialBackdropContext.fillRect(
  0,
  0,
  socialBackdropCanvas.width,
  socialBackdropCanvas.height,
);
const socialBackdropColumns = 38;
const socialBackdropCell = socialBackdropCanvas.width / socialBackdropColumns;
socialBackdropContext.font =
  `700 ${socialBackdropCell * 0.78}px Menlo, Monaco, monospace`;
socialBackdropContext.textAlign = "center";
socialBackdropContext.textBaseline = "middle";
for (
  let row = 0, y = socialBackdropCell * 0.5;
  y < socialBackdropCanvas.height;
  row += 1, y += socialBackdropCell
) {
  for (
    let column = 0, x = socialBackdropCell * 0.5;
    x < socialBackdropCanvas.width;
    column += 1, x += socialBackdropCell
  ) {
    const wave =
      0.5 +
      Math.sin(column * 0.41 + row * 0.23) * 0.2 +
      Math.sin(column * 0.13 - row * 0.37) * 0.16;
    const noise = Math.abs(
      Math.sin(column * 12.9898 + row * 78.233) * 43758.5453,
    ) % 1;
    const tone = THREE.MathUtils.clamp(wave * 0.72 + noise * 0.28, 0, 1);
    const characterIndex = Math.min(
      SOCIAL_BACKDROP_CHARACTERS.length - 1,
      Math.floor(tone * SOCIAL_BACKDROP_CHARACTERS.length),
    );
    socialBackdropContext.fillStyle =
      `rgba(226, 233, 228, ${0.38 + tone * 0.42})`;
    socialBackdropContext.fillText(
      SOCIAL_BACKDROP_CHARACTERS[characterIndex],
      x,
      y,
    );
  }
}
const socialBackdropTexture = new THREE.CanvasTexture(socialBackdropCanvas);
socialBackdropTexture.colorSpace = THREE.SRGBColorSpace;
socialBackdropTexture.minFilter = THREE.LinearMipmapLinearFilter;
socialBackdropTexture.magFilter = THREE.LinearFilter;
socialBackdropTexture.anisotropy = Math.min(
  renderer.capabilities.getMaxAnisotropy(),
  8,
);

function drawSocialIconMask(mediaKey, maskCanvas, sizeMultiplier = 1) {
  const social = SOCIAL_LINKS[mediaKey];
  const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
  maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  maskContext.fillStyle = "#ffffff";

  const iconSize = Math.min(maskCanvas.width, maskCanvas.height) *
    0.36 * sizeMultiplier;
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
  const solidCanvas = socialScreenCanvases.get(mediaKey);
  const pixelCanvas = socialPixelScreenCanvases.get(mediaKey);
  const asciiCanvas = socialAsciiScreenCanvases.get(mediaKey);
  if (!social || !solidCanvas || !pixelCanvas || !asciiCanvas) return;

  const solidContext = solidCanvas.getContext("2d");
  const pixelContext = pixelCanvas.getContext("2d");
  const asciiContext = asciiCanvas.getContext("2d");
  [solidContext, pixelContext, asciiContext].forEach((context) => {
    context.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
    context.fillStyle = "#020303";
    context.fillRect(0, 0, pixelCanvas.width, pixelCanvas.height);
  });

  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = pixelCanvas.width;
  maskCanvas.height = pixelCanvas.height;
  const solidMaskCanvas = document.createElement("canvas");
  solidMaskCanvas.width = solidCanvas.width;
  solidMaskCanvas.height = solidCanvas.height;
  if (drawSocialIconMask(mediaKey, maskCanvas)) {
    drawSocialIconMask(
      mediaKey,
      solidMaskCanvas,
      mobileLayoutActive ? 0.75 : 1,
    );
    solidContext.save();
    solidContext.shadowColor = "rgba(255, 255, 255, 0.64)";
    solidContext.shadowBlur = mobileLayoutActive ? 16 : 8;
    solidContext.drawImage(solidMaskCanvas, 0, 0);
    solidContext.restore();

    if (mobileLayoutActive) {
      const solidTexture = socialScreenTextures.get(mediaKey);
      const pixelTexture = socialPixelScreenTextures.get(mediaKey);
      const asciiTexture = socialAsciiScreenTextures.get(mediaKey);
      if (solidTexture) solidTexture.needsUpdate = true;
      if (pixelTexture) pixelTexture.needsUpdate = true;
      if (asciiTexture) asciiTexture.needsUpdate = true;
      return;
    }

    const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
    const maskPixels = maskContext.getImageData(
      0,
      0,
      maskCanvas.width,
      maskCanvas.height,
    ).data;
    const socialCharacterColumns = mobileLayoutActive ? 34 : 64;
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

  const solidTexture = socialScreenTextures.get(mediaKey);
  const pixelTexture = socialPixelScreenTextures.get(mediaKey);
  const asciiTexture = socialAsciiScreenTextures.get(mediaKey);
  if (solidTexture) solidTexture.needsUpdate = true;
  if (pixelTexture) pixelTexture.needsUpdate = true;
  if (asciiTexture) asciiTexture.needsUpdate = true;
}

Object.keys(SOCIAL_LINKS).forEach((mediaKey) => {
  const socialCanvas = document.createElement("canvas");
  socialCanvas.width = 800;
  socialCanvas.height = 800;
  const socialPixelCanvas = document.createElement("canvas");
  socialPixelCanvas.width = 800;
  socialPixelCanvas.height = 800;
  const socialAsciiCanvas = document.createElement("canvas");
  socialAsciiCanvas.width = 800;
  socialAsciiCanvas.height = 800;
  socialScreenCanvases.set(mediaKey, socialCanvas);
  socialPixelScreenCanvases.set(mediaKey, socialPixelCanvas);
  socialAsciiScreenCanvases.set(mediaKey, socialAsciiCanvas);

  const socialTexture = new THREE.CanvasTexture(socialCanvas);
  const socialPixelTexture = new THREE.CanvasTexture(socialPixelCanvas);
  const socialAsciiTexture = new THREE.CanvasTexture(socialAsciiCanvas);
  [socialTexture, socialPixelTexture, socialAsciiTexture].forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  });
  socialScreenTextures.set(mediaKey, socialTexture);
  socialPixelScreenTextures.set(mediaKey, socialPixelTexture);
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

let headerWordmarkMaskPixels = null;
let headerWordmarkAnimationStartedAt = null;
let headerWordmarkAnimationComplete = false;
const HEADER_WORDMARK_ANIMATION_DURATION = 1.32;

function drawHeaderAsciiWordmark(animationTime = performance.now(), refreshMask = false) {
  if (!headerWordmark) return;

  const width = 880;
  const height = 184;
  const cellSize = mobileLayoutActive ? 18 : 10;
  const context = headerWordmark.getContext("2d");

  if (headerWordmark.width !== width || headerWordmark.height !== height) {
    headerWordmark.width = width;
    headerWordmark.height = height;
  }

  if (mobileLayoutActive || headerWordmarkAnimationStartedAt === null) {
    context.clearRect(0, 0, width, height);
    const wordmark = "onder balta";
    const preferredFontSize = 118;
    context.font = `500 ${preferredFontSize}px "Onder Medium", sans-serif`;
    const measuredWidth = Math.max(context.measureText(wordmark).width, 1);
    const horizontalPadding = 0;
    const fittedFontSize = preferredFontSize * Math.min(
      1,
      (width - horizontalPadding * 2) / measuredWidth,
    );
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.font = `500 ${fittedFontSize}px "Onder Medium", sans-serif`;
    context.fillStyle = "rgba(248, 250, 247, 0.98)";
    context.shadowColor = "rgba(236, 245, 239, 0.48)";
    context.shadowBlur = 9;
    context.fillText(wordmark, horizontalPadding, height * 0.53);
    context.shadowBlur = 0;
    return;
  }

  if (!headerWordmarkMaskPixels || refreshMask) {
    const maskCanvas = document.createElement("canvas");
    const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
    maskCanvas.width = width;
    maskCanvas.height = height;

    maskContext.clearRect(0, 0, width, height);
    maskContext.fillStyle = "#ffffff";
    const wordmarkText = "onder balta";
    const initialFontSize = 118;
    maskContext.font = `500 ${initialFontSize}px "Onder Medium", sans-serif`;
    const initialMetrics = maskContext.measureText(wordmarkText);
    const fittedFontSize = initialFontSize * Math.min(
      1,
      (width - 8) / Math.max(initialMetrics.width, 1),
    );
    maskContext.font = `500 ${fittedFontSize}px "Onder Medium", sans-serif`;
    maskContext.textAlign = "left";
    maskContext.textBaseline = "middle";
    maskContext.fillText(wordmarkText, 0, height * 0.53);
    headerWordmarkMaskPixels = maskContext.getImageData(0, 0, width, height).data;
  }

  const characters = ".:+*#%@";
  const patternTime = animationTime * 0.0022;
  const animationElapsed = Math.max(
    0,
    (animationTime - headerWordmarkAnimationStartedAt) * 0.001,
  );
  const easeAnimation = (value) => {
    const clamped = THREE.MathUtils.clamp(value, 0, 1);
    return clamped * clamped * (3 - 2 * clamped);
  };
  const asciiAppearProgress = easeAnimation(animationElapsed / 0.42);
  const pixelRiseProgress = easeAnimation((animationElapsed - 0.28) / 0.58);
  const solidRevealProgress = easeAnimation((animationElapsed - 0.82) / 0.5);
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
        coverage +=
          headerWordmarkMaskPixels[(pixelY * width + pixelX) * 4 + 3] / 255;
      });
      coverage /= samplePoints.length;
      if (coverage < 0.08) continue;

      const cellNoise = Math.abs(
        Math.sin(x * 12.9898 + y * 78.233) * 43758.5453,
      ) % 1;
      if (asciiAppearProgress < cellNoise * 0.88) continue;

      const column = x / cellSize;
      const row = y / cellSize;
      const diagonalWave = 0.5 + 0.5 * Math.sin(
        column * 0.58 - row * 0.76 - patternTime * 2.15,
      );
      const crossWave = 0.5 + 0.5 * Math.sin(
        column * 0.19 + row * 0.48 + patternTime * 1.25,
      );
      const tone = THREE.MathUtils.clamp(
        coverage * 0.64 + diagonalWave * 0.24 + crossWave * 0.12,
        0,
        1,
      );
      const characterIndex = Math.min(
        characters.length - 1,
        Math.floor(tone * characters.length),
      );

      const asciiLayerAlpha = (0.48 + coverage * 0.5) *
        (1 - solidRevealProgress);
      if (asciiLayerAlpha > 0.001) {
        context.fillStyle = `rgba(244, 248, 245, ${asciiLayerAlpha})`;
        context.fillText(characters[characterIndex], x, y);
      }

      const bottomUpPosition = 1 - y / height;
      const pixelThreshold = bottomUpPosition + (cellNoise - 0.5) * 0.16;
      if (pixelRiseProgress >= pixelThreshold) {
        const pixelAlpha = (0.72 + coverage * 0.28) *
          (1 - solidRevealProgress);
        context.fillStyle = `rgba(248, 250, 247, ${pixelAlpha})`;
        context.fillRect(
          x - cellSize * 0.5,
          y - cellSize * 0.5,
          cellSize,
          cellSize,
        );
      }
    }
  }

  if (solidRevealProgress > 0) {
    const wordmark = "onder balta";
    const preferredFontSize = 118;
    context.font = `500 ${preferredFontSize}px "Onder Medium", sans-serif`;
    const measuredWidth = Math.max(context.measureText(wordmark).width, 1);
    const fittedFontSize = preferredFontSize * Math.min(
      1,
      (width - 8) / measuredWidth,
    );
    context.save();
    context.globalAlpha = solidRevealProgress;
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.font = `500 ${fittedFontSize}px "Onder Medium", sans-serif`;
    context.fillStyle = "rgba(248, 250, 247, 0.98)";
    context.shadowColor = "rgba(236, 245, 239, 0.48)";
    context.shadowBlur = 9;
    context.fillText(wordmark, 0, height * 0.53);
    context.restore();
  }

  headerWordmarkAnimationComplete =
    animationElapsed >= HEADER_WORDMARK_ANIMATION_DURATION;
  context.shadowBlur = 0;
}

drawHeaderAsciiWordmark();

document.fonts?.load('500 160px "Onder Medium"').then(() => {
  introLetterTextureCache.forEach(drawIntroLetterTextureSet);
  Object.keys(SOCIAL_LINKS).forEach(drawSocialScreenTexture);
  drawHeaderAsciiWordmark(performance.now(), true);
  fitProjectTitle();
  siteFontReady = true;
  siteAssetsReady = siteModelReady && siteFontReady && siteConcreteReady;
}).catch(() => {
  siteFontReady = true;
  siteAssetsReady = siteModelReady && siteFontReady && siteConcreteReady;
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
  video.autoplay = false;
  video.playsInline = true;
  video.preload = "auto";
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.addEventListener("loadedmetadata", () => {
    updateScreenMediaAspect(mediaKey, video.videoWidth / video.videoHeight);
  });
  video.addEventListener("canplay", () => {
    if (!screenVideosUnlocked || !video.paused) return;
    video.play().catch(() => {});
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
  screenGlowEntries.forEach(({ entry, light }) => {
    if (entry.glowLight === light) entry.glowLight = null;
    scene.remove(light);
  });
  screenGlowEntries.length = 0;

  const screenBounds = new THREE.Box3();
  const screenCenter = new THREE.Vector3();
  const lightEntries = mobileLayoutActive
    ? allScreenEntries.filter((entry, index) => (
        entry.mediaKey !== "static" && index % 2 === 0
      )).slice(0, 6)
    : allScreenEntries;

  lightEntries.forEach((entry, index) => {
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

function syncScreenGlowLightPositions() {
  const screenBounds = new THREE.Box3();
  const screenCenter = new THREE.Vector3();

  screenGlowEntries.forEach(({ entry, light }) => {
    screenBounds.setFromObject(entry.mesh);
    screenBounds.getCenter(screenCenter);
    light.position.copy(screenCenter);
    light.position.z += 0.48;
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
    const greenFilterReveal = material.uniforms.uGreenFilterReveal.value;
    const powerAmount = material.uniforms.uPowerAmount.value;
    const titleAmount = Math.max(
      material.uniforms.uIntroTitleOnScreenAmount.value,
      material.uniforms.uTitleOnScreenAmount.value,
    );
    const dimAmount = material.uniforms.uDimAmount.value;
    const isStatic = material.uniforms.uStaticAmount.value > 0.5;
    const isSocial = Boolean(SOCIAL_LINKS[entry.mediaKey]);

    if (titleAmount > 0.01) {
      targetColor.set(0xdde3e6);
    } else if (isStatic) {
      targetColor.copy(sample.color);
    } else {
      const colorReveal = THREE.MathUtils.smoothstep(hoverAmount, 0.04, 0.96);
      const greenFilterAmount = isSocial
        ? 0
        : greenFilterReveal * (1 - colorReveal);
      targetColor
        .copy(sample.color)
        .lerp(greenFilterLightColor, greenFilterAmount);
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
    uniform sampler2D uSocialBackdropCanvas;
    uniform sampler2D uSocialPixelCanvas;
    uniform sampler2D uSocialAsciiCanvas;
    uniform sampler2D uTitleCanvas;
    uniform sampler2D uIntroTitleCanvas;
    uniform sampler2D uIntroCueSprite;
    uniform float uTime;
    uniform float uStaticAmount;
    uniform float uMobileLayout;
    uniform float uPhase;
    uniform float uMediaAspect;
    uniform float uScreenAspect;
    uniform float uTitleAspect;
    uniform float uAsciiAmount;
    uniform float uSocialAmount;
    uniform float uSocialRevealProgress;
    uniform float uSocialHoverActive;
    uniform float uHoverAmount;
    uniform float uGreenFilterReveal;
    uniform float uInteractiveAmount;
    uniform float uDimAmount;
    uniform float uPowerAmount;
    uniform float uIntroTitleOnScreenAmount;
    uniform float uTitleOnScreenAmount;
    uniform float uTitleFadeProgress;
    uniform float uIntroHoverAmount;
    uniform float uIntroBootProgress;
    uniform float uIntroWaveProgress;
    uniform vec4 uTitleUvRect;
    uniform vec2 uIntroPointerUv;
    uniform vec2 uIntroGridOffset;
    uniform vec2 uIntroGridScale;
    uniform vec2 uIntroCuePosition;
    uniform vec2 uIntroWaveOrigin;
    uniform vec2 uSocialPointerUv;
    uniform vec2 uScreenUvMin;
    uniform vec2 uScreenUvMax;
    uniform float uIntroCueClick;
    uniform float uIntroCueVisible;
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
        float staticFlickerFrame = floor((uTime + uPhase) * 6.0);
        float staticFlickerNoise = random(
          vec2(staticFlickerFrame, uPhase * 31.7)
        );
        float staticFlicker =
          (0.93 + staticFlickerNoise * 0.1) *
          (0.978 + sin(uTime * 4.8 + uPhase * 4.1) * 0.022);
        float staticLuminance =
          (0.035 + staticNoise * 0.19) * staticFlicker;
        color = vec3(
          staticLuminance * 0.78,
          staticLuminance * 0.84,
          staticLuminance * 0.9
        );
      } else {
        vec2 sampleUv = mediaUv;
        float mediaAsciiColumns = 112.0;
        vec2 asciiGrid = vec2(
          mediaAsciiColumns,
          max(8.0, floor(mediaAsciiColumns / (uMediaAspect * (10.0 / 6.0))))
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
          float asciiFilterAmount =
            uGreenFilterReveal *
            (1.0 - smoothstep(0.04, 0.96, uHoverAmount));
          vec3 asciiSourceColor = mix(
            originalAsciiGreen,
            vec3(1.0),
            asciiFilterAmount
          );
          color = asciiSourceColor * (character * 1.02 + glow * 0.16);
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
      float socialCharacterColumns = mix(64.0, 34.0, uMobileLayout);
      vec2 socialCharacterCell = floor(
        socialStableUv * vec2(socialCharacterColumns)
      );
      vec2 socialCharacterUv =
        (socialCharacterCell + 0.5) / socialCharacterColumns;
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
      float socialHoverProgress = clamp(uSocialHoverActive, 0.0, 1.0);
      float socialHoverEase = socialHoverProgress * socialHoverProgress *
        (3.0 - 2.0 * socialHoverProgress);
      float socialLayerScale = mix(0.75, 0.88, socialHoverEase);
      vec2 socialLayerUv = clamp(
        (mediaUv - 0.5) / socialLayerScale + 0.5,
        vec2(0.001),
        vec2(0.999)
      );
      float socialColorSeparation = 0.0016 + distanceFromCenter * 0.0024;
      vec2 socialRedUv = clamp(
        socialLayerUv + vec2(socialColorSeparation, 0.0),
        vec2(0.001),
        vec2(0.999)
      );
      vec2 socialBlueUv = clamp(
        socialLayerUv - vec2(socialColorSeparation, 0.0),
        vec2(0.001),
        vec2(0.999)
      );
      vec3 socialAsciiColor = min(
        vec3(
          texture2D(uSocialAsciiCanvas, socialRedUv).r,
          texture2D(uSocialAsciiCanvas, socialLayerUv).g,
          texture2D(uSocialAsciiCanvas, socialBlueUv).b
        ) * 1.28,
        vec3(1.35)
      );
      vec3 socialPixelColor = vec3(
        texture2D(uSocialPixelCanvas, socialRedUv).r,
        texture2D(uSocialPixelCanvas, socialLayerUv).g,
        texture2D(uSocialPixelCanvas, socialBlueUv).b
      );
      vec3 socialSolidColor = vec3(
        texture2D(uMedia, socialRedUv).r,
        texture2D(uMedia, socialLayerUv).g,
        texture2D(uMedia, socialBlueUv).b
      );
      float socialRevealProgress = clamp(uSocialRevealProgress, 0.0, 1.0);
      float socialPixelRise = smoothstep(
        0.02,
        0.5,
        socialRevealProgress
      );
      float socialIntroAsciiDissolve = smoothstep(
        0.28,
        0.9,
        socialRevealProgress
      );
      float socialFinalReveal = smoothstep(
        0.82,
        1.0,
        socialRevealProgress
      );
      float socialBottomUpPosition = 1.0 - socialCellScreenUv.y;
      float socialPixelThreshold = socialBottomUpPosition +
        (socialCharacterNoise - 0.5) * 0.18 +
        sin(socialCellScreenUv.x * 14.0 + uPhase) * 0.045;
      float socialPixelRevealMask = step(
        socialPixelThreshold,
        socialPixelRise
      );
      float socialIntroDissolveMask = smoothstep(
        socialCharacterNoise - 0.1,
        socialCharacterNoise + 0.1,
        socialIntroAsciiDissolve
      );
      vec3 socialIntroColor = mix(
        socialPixelColor * socialPixelRevealMask,
        socialAsciiColor * socialPixelRevealMask,
        socialIntroDissolveMask
      );
      float socialAsciiToPixelProgress = smoothstep(
        0.12,
        0.62,
        socialHoverEase
      );
      float socialAsciiToPixelMask = smoothstep(
        socialCharacterNoise - 0.08,
        socialCharacterNoise + 0.08,
        socialAsciiToPixelProgress
      ) * smoothstep(0.0, 0.08, socialAsciiToPixelProgress);
      vec3 socialHoverColor = mix(
        socialAsciiColor,
        socialPixelColor,
        socialAsciiToPixelMask
      );
      float socialSolidifyProgress = smoothstep(
        0.46,
        0.86,
        socialHoverEase
      );
      socialHoverColor = mix(
        socialHoverColor,
        socialSolidColor,
        socialSolidifyProgress
      );
      vec3 socialAnimatedColor = mix(
        socialIntroColor,
        socialHoverColor,
        socialFinalReveal
      );
      vec2 socialBackdropCell = floor(socialStableUv * vec2(38.0));
      float socialBackdropNoise = random(
        socialBackdropCell + vec2(uPhase * 5.31, uPhase * 8.17)
      );
      float socialBackdropRevealProgress = smoothstep(
        0.03,
        0.62,
        socialRevealProgress
      );
      float socialBackdropRevealMask = smoothstep(
        socialBackdropNoise - 0.09,
        socialBackdropNoise + 0.09,
        socialBackdropRevealProgress
      ) * smoothstep(0.0, 0.06, socialBackdropRevealProgress);
      vec3 socialBackdropColor = texture2D(
        uSocialBackdropCanvas,
        mediaUv
      ).rgb *
        0.52 *
        socialBackdropRevealMask *
        (0.95 + sin(uTime * 0.31 + uPhase) * 0.05);
      socialAnimatedColor = max(
        socialAnimatedColor,
        socialBackdropColor
      );
      color = mix(
        color,
        socialAnimatedColor,
        uSocialAmount *
          (1.0 - uMobileLayout) *
          (1.0 - uStaticAmount)
      );
      color = max(
        color,
        socialBackdropColor *
          uSocialAmount *
          uMobileLayout *
          (1.0 - uStaticAmount) *
          0.82
      );

      // Reduce project media to luminance first, then remap that single value
      // through a green phosphor ramp. Source hues never mix into the tint.
      float greenFilterLuminance = dot(
        max(color, vec3(0.0)),
        vec3(0.2126, 0.7152, 0.0722)
      );
      float greenFilterContrast = clamp(
        (greenFilterLuminance - 0.5) * 1.08 + 0.52,
        0.0,
        1.0
      );
      vec3 greenFilterShadow = vec3(0.01, 0.018, 0.012);
      vec3 greenFilterMid = vec3(0.12, 0.34, 0.16);
      vec3 greenFilterHighlight = vec3(0.56, 0.76, 0.58);
      vec3 greenFilteredColor = mix(
        greenFilterShadow,
        greenFilterMid,
        smoothstep(0.0, 0.62, greenFilterContrast)
      );
      greenFilteredColor = mix(
        greenFilteredColor,
        greenFilterHighlight,
        smoothstep(0.46, 1.0, greenFilterContrast)
      );
      float colorReveal = smoothstep(0.04, 0.96, uHoverAmount);
      float greenFilterAmount =
        (1.0 - uStaticAmount) *
        (1.0 - uSocialAmount) *
        uGreenFilterReveal *
        (1.0 - colorReveal);
      color = mix(color, greenFilteredColor, greenFilterAmount);

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

      float staticBandFrame = floor((uTime + uPhase) * 4.0);
      float staticBandRow = floor(curvedUv.y * 58.0);
      float staticBandNoise = random(
        vec2(staticBandRow, staticBandFrame + uPhase * 19.0)
      ) - 0.5;
      float staticBandWave =
        sin(curvedUv.y * 56.0 - uTime * 1.6 + uPhase * 3.1) * 0.011 +
        sin(curvedUv.y * 21.0 + uTime * 0.6 + uPhase * 1.7) * 0.007;
      float staticHorizontalInterference =
        (staticBandNoise * 0.024 + staticBandWave) * uStaticAmount;
      color += vec3(staticHorizontalInterference);

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

      float introBackdropTitleAmount = max(
        uIntroTitleOnScreenAmount,
        uTitleOnScreenAmount *
          (1.0 - smoothstep(0.18, 0.92, uTitleFadeProgress))
      );
      float introBackdropReveal = smoothstep(
        0.08,
        0.46,
        uIntroBootProgress
      );
      vec3 introBackdropColor = texture2D(
        uSocialBackdropCanvas,
        clamp(jitteredUv, vec2(0.001), vec2(0.999))
      ).rgb;
      introBackdropColor *=
        0.34 *
        introBackdropReveal *
        introBackdropTitleAmount *
        (0.94 + sin(uTime * 0.27 + uPhase) * 0.06);
      color = max(color, introBackdropColor);

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
      float titleCharacterColumns = mix(50.0, 32.0, uMobileLayout);
      vec2 titleCharacterCell = floor(
        stableTitleLocalUv * vec2(titleCharacterColumns)
      );
      vec2 titleCharacterUv =
        (titleCharacterCell + 0.5) / titleCharacterColumns;
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
      float introHoverDistance = length(
        (titleCellScreenUv - uIntroPointerUv) * vec2(uScreenAspect, 1.0)
      );
      float introHoverCharacterNoise = random(
        titleCharacterCell + vec2(uPhase * 4.17, 12.8)
      );
      float introHoverFalloff = exp(
        -pow(introHoverDistance / 0.24, 2.0)
      );
      float introHoverCharacterStrength = mix(
        0.7,
        1.0,
        introHoverCharacterNoise
      );
      float introHoverAsciiOff =
        introHoverFalloff *
        introHoverCharacterStrength *
        smoothstep(0.0, 1.0, uIntroHoverAmount);
      vec2 introGlobalUv =
        uIntroGridOffset + titleCellScreenUv * uIntroGridScale;
      vec2 introWaveDelta =
        (introGlobalUv - uIntroWaveOrigin) * vec2(2.5, 1.0);
      float introWaveRadius = uIntroWaveProgress * 2.75;
      float introWaveCharacterNoise =
        (random(titleCharacterCell + vec2(uPhase * 7.53, 29.1)) - 0.5) *
        0.12;
      float introWaveDistance =
        length(introWaveDelta) + introWaveCharacterNoise;
      float introClickPixelWave =
        exp(-pow((introWaveDistance - introWaveRadius) / 0.105, 2.0)) *
        smoothstep(0.0, 0.035, uIntroWaveProgress);
      float introBootProgress = clamp(uIntroBootProgress, 0.0, 1.0);
      float introBootAsciiProgress = clamp(
        introBootProgress / 0.78,
        0.0,
        1.0
      );
      vec2 introBootGlobalCell = titleCharacterCell;
      float introBootAsciiNoise = random(
        introBootGlobalCell +
        vec2(uPhase * 2.91 + 38.2, uPhase * 5.47 + 11.6)
      );
      float introBootAsciiThreshold =
        0.12 + introBootAsciiNoise * 0.76;
      float introBootAsciiMask = smoothstep(
        introBootAsciiThreshold - 0.11,
        introBootAsciiThreshold + 0.11,
        introBootAsciiProgress
      );
      float introAsciiLayerOpacity = smoothstep(
        0.0,
        0.82,
        introBootAsciiMask
      );
      float introTextureNoise = random(
        titleCharacterCell + vec2(uPhase * 3.71 + 8.2, uPhase * 6.19 + 14.7)
      );
      float introTextureFlow =
        0.5 +
        0.5 * sin(
          introGlobalUv.x * 19.0 -
          introGlobalUv.y * 13.0 +
          uTime * 0.38 +
          introTextureNoise * 6.2831853
        );
      float introStarDistribution = random(
        titleCharacterCell + vec2(uPhase * 9.13 + 31.4, uPhase * 4.81 + 6.7)
      );
      float introStarWave =
        0.5 +
        0.5 * sin(
          uTime * mix(1.1, 2.8, introTextureNoise) +
          introStarDistribution * 18.0 +
          introGlobalUv.y * 5.0
        );
      float introStarPulse =
        pow(introStarWave, 7.0) *
        smoothstep(0.24, 0.9, introStarDistribution);
      float introAsciiTextureOpacity = clamp(
        0.52 +
        introTextureNoise * 0.16 +
        introTextureFlow * 0.15 +
        introStarPulse * 0.38,
        0.52,
        1.0
      );
      float introClickPixelAmount =
        uIntroTitleOnScreenAmount * introClickPixelWave;
      float introFinalAsciiAmount = max(
        uTitleOnScreenAmount,
        uIntroTitleOnScreenAmount * clamp(
          introAsciiLayerOpacity,
          0.0,
          1.0
        )
      ) *
        introAsciiTextureOpacity *
        (1.0 - introHoverAsciiOff) *
        (1.0 - introClickPixelAmount * 0.9);

      float introAsciiLuminance = dot(
        max(titleCrtColor, vec3(0.0)),
        vec3(0.2126, 0.7152, 0.0722)
      );
      float introAsciiContrast = clamp(
        (introAsciiLuminance - 0.5) * 1.08 + 0.52,
        0.0,
        1.0
      );
      vec3 introTitleGreenShadow = vec3(0.004, 0.014, 0.006);
      vec3 introTitleGreenMid = vec3(0.075, 0.48, 0.14);
      vec3 introTitleGreenHighlight = vec3(0.58, 1.0, 0.64);
      vec3 introFinalAsciiGreen = mix(
        introTitleGreenShadow,
        introTitleGreenMid,
        smoothstep(0.0, 0.62, introAsciiContrast)
      );
      introFinalAsciiGreen = mix(
        introFinalAsciiGreen,
        introTitleGreenHighlight,
        smoothstep(0.46, 1.0, introAsciiContrast)
      );
      float introPatternA =
        0.5 +
        0.5 * sin(
          introGlobalUv.x * 34.0 +
          sin(introGlobalUv.y * 17.0 - uTime * 0.18) * 2.2
        );
      float introPatternB =
        0.5 +
        0.5 * sin(
          introGlobalUv.y * 27.0 -
          introGlobalUv.x * 8.0 +
          uTime * 0.12
        );
      float introSubtlePattern = smoothstep(
        0.74,
        0.92,
        introPatternA * 0.62 + introPatternB * 0.38
      );
      introFinalAsciiGreen *=
        0.84 + introSubtlePattern * 0.16 + introStarPulse * 0.42;
      float titleDissolveNoise = random(
        titleCharacterCell +
        vec2(uPhase * 5.71 + 13.2, uPhase * 1.83 + 7.4)
      );
      float titleCharacterDelay = 0.09 + titleDissolveNoise * 0.78;
      float titleCharacterVisibility = 1.0 - smoothstep(
        titleCharacterDelay - 0.08,
        titleCharacterDelay + 0.08,
        uTitleFadeProgress
      );
      color = mix(
        color,
        introFinalAsciiGreen,
        titleCrtAlpha * introFinalAsciiAmount * titleCharacterVisibility
      );
      color = mix(
        color,
        mix(introTitleGreenMid, introTitleGreenHighlight, 0.72),
        introTitleCrtAlpha * introClickPixelAmount
      );
      vec2 cueGlobalUv = uIntroGridOffset + screenUv * uIntroGridScale;
      vec2 cuePoint = vec2(
        (cueGlobalUv.x - uIntroCuePosition.x) /
          uIntroGridScale.x * uScreenAspect,
        -(cueGlobalUv.y - uIntroCuePosition.y) /
          uIntroGridScale.y
      );
      float cueClickActive = step(0.0, uIntroCueClick);
      float cueClickProgress = clamp(uIntroCueClick, 0.0, 1.0);
      float cuePress = cueClickActive *
        sin(cueClickProgress * 3.14159265) * 0.12;
      cuePoint /= max(0.82, 1.0 - cuePress);

      const float cueHeight = 0.15;
      const float cueAspect = 11.0 / 19.0;
      vec2 cueSize = vec2(cueHeight * cueAspect, cueHeight);
      vec2 cueSpriteUv = vec2(
        cuePoint.x / cueSize.x,
        1.0 - cuePoint.y / cueSize.y
      );
      float cueSpriteBounds =
        step(0.0, cueSpriteUv.x) *
        step(cueSpriteUv.x, 1.0) *
        step(0.0, cueSpriteUv.y) *
        step(cueSpriteUv.y, 1.0);
      vec4 cueSprite = texture2D(
        uIntroCueSprite,
        clamp(cueSpriteUv, vec2(0.0), vec2(1.0))
      );
      float cueSpriteAlpha = cueSprite.a * cueSpriteBounds;
      float cueRingRadius = mix(0.025, 0.145, cueClickProgress);
      float cueRing = (
        1.0 - smoothstep(
          0.006,
          0.014,
          abs(length(cuePoint) - cueRingRadius)
        )
      ) * cueClickActive * (1.0 - cueClickProgress);
      float cueVisibility = uIntroCueVisible * uIntroTitleOnScreenAmount;
      color = mix(
        color,
        cueSprite.rgb,
        cueSpriteAlpha * cueVisibility
      );
      color = mix(color, vec3(1.0), cueRing * cueVisibility);

      // The media, social logos and intro title now share this exact CRT pass.
      float crtSignalVisibility = max(
        step(0.001, powerAmount),
        max(uIntroTitleOnScreenAmount, uTitleOnScreenAmount)
      );
      color *= scanline * verticalMask;
      color += rollingLine * rollingLineStrength * crtSignalVisibility;
      color += (noise - 0.5) * noiseStrength * crtSignalVisibility;
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
      uSocialBackdropCanvas: { value: socialBackdropTexture },
      uSocialPixelCanvas: {
        value: socialPixelScreenTextures.get(mediaKey) ?? blankScreenTexture,
      },
      uSocialAsciiCanvas: {
        value: socialAsciiScreenTextures.get(mediaKey) ?? blankScreenTexture,
      },
      uTitleCanvas: { value: blankScreenTexture },
      uIntroTitleCanvas: { value: blankScreenTexture },
      uIntroCueSprite: { value: introCueSpriteTexture },
      uTime: { value: 0 },
      uStaticAmount: { value: mediaKey === "static" ? 1 : 0 },
      uMobileLayout: { value: Number(mobileLayoutActive) },
      uPhase: { value: phase },
      uMediaAspect: {
        value: screenMediaAspectCache.get(mediaKey) ?? 16 / 9,
      },
      uScreenAspect: { value: CRT_SCREEN_ASPECT },
      uTitleAspect: { value: 1 },
      uAsciiAmount: { value: mediaKey === "bicycleVideo" ? 1 : 0 },
      uSocialAmount: {
        value: SOCIAL_LINKS[mediaKey] ? 1 : 0,
      },
      uSocialRevealProgress: {
        value: SOCIAL_LINKS[mediaKey] && !mobileLayoutActive ? 0 : 1,
      },
      uSocialHoverActive: { value: 0 },
      uHoverAmount: { value: 0 },
      uGreenFilterReveal: { value: 0 },
      uInteractiveAmount: { value: mediaKey === "static" ? 0 : 1 },
      uDimAmount: { value: 0 },
      uPowerAmount: { value: 0 },
      uIntroTitleOnScreenAmount: { value: 0 },
      uTitleOnScreenAmount: { value: 0 },
      uTitleFadeProgress: { value: 0 },
      uIntroHoverAmount: { value: 0 },
      uIntroBootProgress: { value: 0 },
      uIntroWaveProgress: { value: 0 },
      uTitleUvRect: { value: new THREE.Vector4(0, 0, 1, 1) },
      uIntroPointerUv: { value: new THREE.Vector2(0.5, 0.5) },
      uIntroGridOffset: { value: new THREE.Vector2() },
      uIntroGridScale: { value: new THREE.Vector2(0.2, 0.5) },
      uIntroCuePosition: { value: new THREE.Vector2(0.1, 0.75) },
      uIntroWaveOrigin: { value: new THREE.Vector2(0.5, 0.5) },
      uSocialPointerUv: { value: new THREE.Vector2(0.5, 0.5) },
      uScreenUvMin: { value: new THREE.Vector2(0.001689, 0.121829) },
      uScreenUvMax: { value: new THREE.Vector2(0.998311, 0.878171) },
      uIntroCueClick: { value: -1 },
      uIntroCueVisible: { value: 0 },
    },
    vertexShader: CRT_VERTEX_SHADER,
    fragmentShader: CRT_FRAGMENT_SHADER,
    toneMapped: false,
  });

  material.userData.mediaKey = mediaKey;
  material.userData.baseStaticAmount = mediaKey === "static" ? 1 : 0;
  material.userData.baseInteractiveAmount = mediaKey === "static" ? 0 : 1;
  material.userData.interactionTarget = 0;
  material.userData.socialHoverTarget = 0;
  material.userData.introHoverTarget = 0;
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
  screenMaterial.userData.rowIndex = rowIndex;
  screenMaterial.userData.unitIndex = unitIndex;
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

function configureSharedTitleScreens() {
  if (allScreenEntries.length === 0) return;

  const screenBounds = new THREE.Box3();

  introLetterScreenEntries.length = 0;
  introLetterScreenEntries.push(
    ...allScreenEntries.filter((entry) => entry.rowIndex === 0 || entry.rowIndex === 1),
  );
  if (introLetterScreenEntries.length === 0) return;
  introLetterTitleBounds = new THREE.Box3().makeEmpty();
  introLetterScreenEntries.forEach((entry) => {
    screenBounds.setFromObject(entry.mesh);
    introLetterTitleBounds.union(screenBounds);
  });

  const introBoundsWidth = introLetterTitleBounds.max.x - introLetterTitleBounds.min.x;
  const introBoundsHeight = introLetterTitleBounds.max.y - introLetterTitleBounds.min.y;
  screenBounds.setFromObject(introLetterScreenEntries[0].mesh);
  const introScreenWidth = screenBounds.max.x - screenBounds.min.x;
  const introScreenHeight = screenBounds.max.y - screenBounds.min.y;
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

  if (introClickHitArea) {
    scene.remove(introClickHitArea);
    introClickHitArea.geometry.dispose();
    introClickHitArea.material.dispose();
  }
  introClickHitArea = new THREE.Mesh(
    new THREE.PlaneGeometry(introBoundsWidth, introBoundsHeight),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      colorWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  introClickHitArea.name = "Intro TV block click area";
  introClickHitArea.position.copy(introHoverHitArea.position);
  introClickHitArea.position.z += 0.01;
  scene.add(introClickHitArea);
  introClickHitArea.updateMatrixWorld(true);

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
    screenBounds.setFromObject(entry.mesh);
    const gridOffset = new THREE.Vector2(
      (screenBounds.min.x - introLetterTitleBounds.min.x) / introBoundsWidth,
      (screenBounds.min.y - introLetterTitleBounds.min.y) / introBoundsHeight,
    );
    const gridScale = new THREE.Vector2(
      (screenBounds.max.x - screenBounds.min.x) / introBoundsWidth,
      (screenBounds.max.y - screenBounds.min.y) / introBoundsHeight,
    );
    entry.introWorldBounds = screenBounds.clone();
    entry.introGridOffset = gridOffset;
    entry.introGridScale = gridScale;
    entry.material.uniforms.uIntroGridOffset.value.copy(gridOffset);
    entry.material.uniforms.uIntroGridScale.value.copy(gridScale);
    entry.material.userData.introLetterIndex =
      entry.rowIndex === 1 ? entry.unitIndex : entry.unitIndex + 5;
  });
}

function beginIntroSequence(
  elapsedTime = performance.now() * 0.001,
  pointerHit = getIntroClickPointerHit(),
) {
  if (
    !isSiteBootReady() ||
    introStage !== "waiting" ||
    introLetterScreenEntries.length === 0 ||
    !pointerHit
  ) return;

  // This runs directly inside the user's click, so mobile browsers grant
  // playback permission before the CRT power-up animation begins.
  startScreenVideos({ userInitiated: true });
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

function updateIntroCueState(elapsedTime, pointerHit = null) {
  if (!isSiteBootReady()) {
    introCueIdleStartedAt = null;
    crtScreenMaterials.forEach((material) => {
      material.uniforms.uIntroCueClick.value = -1;
      material.uniforms.uIntroCueVisible.value = 0;
    });
    return;
  }

  if (introStage !== "waiting") {
    introCueIdleStartedAt = null;
  } else if (introCueIdleStartedAt === null) {
    introCueIdleStartedAt = elapsedTime;
  }

  const cueElapsed = introCueIdleStartedAt === null
    ? 0
    : elapsedTime - introCueIdleStartedAt - INTRO_CUE_IDLE_DELAY;
  const cueVisibility =
    introStage === "waiting" && !pointerHit && cueElapsed >= 0
      ? smoothProgress(cueElapsed / INTRO_CUE_REVEAL_DURATION)
      : 0;
  const cueRoute = [
    { unitIndex: 0, rowIndex: 1 },
    { unitIndex: 3, rowIndex: 1 },
    { unitIndex: 4, rowIndex: 0 },
    { unitIndex: 1, rowIndex: 0 },
  ];
  const segmentDuration = 1.25;
  const cueAnimationTime = Math.max(0, cueElapsed);
  const routeProgress = reducedMotionQuery.matches
    ? 0
    : (cueAnimationTime % (segmentDuration * cueRoute.length)) / segmentDuration;
  const segmentIndex = Math.floor(routeProgress) % cueRoute.length;
  const segmentProgress = routeProgress - Math.floor(routeProgress);
  const currentTarget = cueRoute[segmentIndex];
  const nextTarget = cueRoute[(segmentIndex + 1) % cueRoute.length];
  const rawTravelProgress = THREE.MathUtils.clamp(segmentProgress / 0.68, 0, 1);
  const travelProgress = reducedMotionQuery.matches
    ? 0
    : rawTravelProgress * rawTravelProgress * (3 - 2 * rawTravelProgress);
  const getCuePosition = ({ unitIndex, rowIndex }) => {
    const entry = introLetterScreenEntries.find((screenEntry) => (
      screenEntry.unitIndex === unitIndex && screenEntry.rowIndex === rowIndex
    ));
    if (!entry?.introGridOffset || !entry?.introGridScale) {
      return new THREE.Vector2(0.5, 0.5);
    }
    return entry.introGridOffset.clone().addScaledVector(
      entry.introGridScale,
      0.5,
    );
  };
  const currentPosition = getCuePosition(currentTarget);
  const nextPosition = getCuePosition(nextTarget);
  const currentX = currentPosition.x;
  const currentY = currentPosition.y;
  const nextX = nextPosition.x;
  const nextY = nextPosition.y;
  const cueX = THREE.MathUtils.lerp(currentX, nextX, travelProgress);
  const cueY = THREE.MathUtils.lerp(currentY, nextY, travelProgress);
  const clickIsActive =
    !reducedMotionQuery.matches &&
    segmentProgress >= 0.72 &&
    segmentProgress < 0.92;
  const clickProgress = clickIsActive
    ? (segmentProgress - 0.72) / 0.2
    : -1;

  crtScreenMaterials.forEach((material) => {
    material.uniforms.uIntroCuePosition.value.set(cueX, cueY);
    material.uniforms.uIntroCueClick.value = clickProgress;
    material.uniforms.uIntroCueVisible.value = cueVisibility;
  });
}

function syncIntroClickHint(pointerHit) {
  const shouldShowClickHint =
    isSiteBootReady() && introStage === "waiting" && Boolean(pointerHit);
  if (shouldShowClickHint) viewCursor.textContent = getUiCopy().click;
  roomStage.classList.toggle("is-screen-hovered", shouldShowClickHint);
  viewCursor.classList.toggle("is-visible", shouldShowClickHint);
}

function createIntroPointerHit(point, matchedEntry = null) {
  if (!point || !introLetterTitleBounds) return null;

  const boundsWidth = introLetterTitleBounds.max.x - introLetterTitleBounds.min.x;
  const boundsHeight = introLetterTitleBounds.max.y - introLetterTitleBounds.min.y;
  if (boundsWidth <= 0 || boundsHeight <= 0) return null;

  const globalUv = new THREE.Vector2(
    (point.x - introLetterTitleBounds.min.x) / boundsWidth,
    (point.y - introLetterTitleBounds.min.y) / boundsHeight,
  );
  const entry = matchedEntry ?? introLetterScreenEntries.reduce(
    (closest, screenEntry) => {
      const bounds = screenEntry.introWorldBounds;
      if (!bounds) return closest;
      const centerX = (bounds.min.x + bounds.max.x) * 0.5;
      const centerY = (bounds.min.y + bounds.max.y) * 0.5;
      const distance = Math.hypot(point.x - centerX, point.y - centerY);
      return !closest || distance < closest.distance
        ? { entry: screenEntry, distance }
        : closest;
    },
    null,
  )?.entry ?? null;
  const entryOffset = entry?.introGridOffset ?? new THREE.Vector2();
  const entryScale = entry?.introGridScale ?? new THREE.Vector2(1, 1);
  const localUv = new THREE.Vector2(
    (globalUv.x - entryOffset.x) / Math.max(entryScale.x, 0.0001),
    (globalUv.y - entryOffset.y) / Math.max(entryScale.y, 0.0001),
  );
  return { entry, localUv, globalUv };
}

function getIntroHoverPointerHit() {
  if (
    introLetterScreenEntries.length === 0 ||
    !introLetterTitleBounds ||
    !introHoverHitArea
  ) return null;

  raycaster.setFromCamera(pointerNdc, camera);
  const intersection = raycaster.intersectObject(introHoverHitArea, false)[0];
  if (!intersection?.point) return null;

  return createIntroPointerHit(intersection.point);
}

function getIntroClickPointerHit() {
  if (
    introLetterScreenEntries.length === 0 ||
    !introLetterTitleBounds ||
    !introClickHitArea
  ) {
    return null;
  }

  raycaster.setFromCamera(pointerNdc, camera);
  const intersection = raycaster.intersectObject(introClickHitArea, false)[0];
  if (!intersection?.point) return null;

  return createIntroPointerHit(intersection.point);
}

function isPointerOverIntroTitle() {
  return Boolean(getIntroClickPointerHit());
}

function smoothProgress(value) {
  const clamped = THREE.MathUtils.clamp(value, 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

function isSiteBootReady() {
  return siteBootStage === "ready";
}

function updateLoadingWindow(progress, elapsedTime) {
  const percentage = Math.round(THREE.MathUtils.clamp(progress, 0, 1) * 100);
  loadingProgressBar.style.width = `${percentage}%`;
  loadingPercent.textContent = `${String(percentage).padStart(2, "0")}%`;
  loadingProgressTrack.setAttribute("aria-valuenow", String(percentage));

  if (percentage < 28) loadingStatus.textContent = "initializing display";
  else if (percentage < 54) loadingStatus.textContent = "loading concrete room";
  else if (percentage < 82) loadingStatus.textContent = "connecting crt array";
  else if (percentage < 100) loadingStatus.textContent = "warming signal";
  else loadingStatus.textContent = "display ready";

  const activityDots = ".".repeat(Math.floor(elapsedTime * 2.4) % 4);
  loadingActivity.textContent = percentage < 100
    ? `please wait${activityDots}`
    : "starting";
}

function updateSiteBootSequence(elapsedTime, deltaTime) {
  const stageElapsed = Math.max(0, elapsedTime - siteBootStageStartedAt);

  if (siteBootStage === "error") {
    siteBootLightAmount = 0;
    siteBootTitleProgress = 0;
    return;
  }

  if (siteBootStage === "loading") {
    const waitingTarget = Math.min(0.88, 0.08 + stageElapsed * 0.24);
    const targetProgress = siteAssetsReady ? 1 : waitingTarget;
    const progressSpeed = siteAssetsReady ? 5.2 : 1.8;
    const progressEase = 1 - Math.exp(-deltaTime * progressSpeed);
    siteBootLoadingProgress += (
      targetProgress - siteBootLoadingProgress
    ) * progressEase;
    updateLoadingWindow(siteBootLoadingProgress, elapsedTime);
    siteBootLightAmount = 0;
    siteBootTitleProgress = 0;

    if (
      siteAssetsReady &&
      stageElapsed >= LOADING_OVERLAY_MIN_DURATION &&
      siteBootLoadingProgress >= 0.985
    ) {
      siteBootLoadingProgress = 1;
      updateLoadingWindow(1, elapsedTime);
      siteBootStage = "lights";
      siteBootStageStartedAt = elapsedTime;
      siteBootSequenceStartedAt = elapsedTime;
      ceilingLightPower = 0;
      loadingScreen.classList.add("is-hidden");
      loadingScreen.setAttribute("aria-hidden", "true");
    }
    return;
  }

  const bootSequenceIsRunning =
    siteBootStage === "lights" ||
    siteBootStage === "screens" ||
    siteBootStage === "title";

  if (bootSequenceIsRunning) {
    const sequenceElapsed = Math.max(
      0,
      elapsedTime - siteBootSequenceStartedAt,
    );
    const progress = THREE.MathUtils.clamp(
      sequenceElapsed / BOOT_LIGHT_DURATION,
      0,
      1,
    );
    const rise = smoothProgress(progress / 0.72);
    const dropoutA = Math.exp(-Math.pow((progress - 0.18) / 0.055, 2)) * 0.78;
    const dropoutB = Math.exp(-Math.pow((progress - 0.39) / 0.07, 2)) * 0.5;
    const dropoutC = Math.exp(-Math.pow((progress - 0.58) / 0.05, 2)) * 0.36;
    const hardOutage =
      smoothProgress((progress - 0.29) / 0.018) *
      (1 - smoothProgress((progress - 0.345) / 0.025));
    const flutter =
      Math.sin(sequenceElapsed * 44 + 0.7) * 0.055 +
      Math.sin(sequenceElapsed * 77 + 2.4) * 0.025;
    const dropout = Math.max(dropoutA, dropoutB, dropoutC, hardOutage);
    siteBootLightAmount = THREE.MathUtils.clamp(
      rise * (1 - dropout) + flutter * rise * (1 - progress),
      0,
      1,
    );
    if (
      siteBootScreensStartedAt === 0 &&
      progress >= BOOT_SCREEN_LIGHT_OVERLAP_AT
    ) {
      siteBootScreensStartedAt = elapsedTime;
    }

    const screenSequenceElapsed = siteBootScreensStartedAt > 0
      ? Math.max(0, elapsedTime - siteBootScreensStartedAt)
      : 0;
    if (
      siteBootTitleStartedAt === 0 &&
      siteBootScreensStartedAt > 0 &&
      screenSequenceElapsed >= BOOT_TITLE_SCREEN_OVERLAP_DELAY
    ) {
      siteBootTitleStartedAt = elapsedTime;
    }

    if (siteBootTitleStartedAt > 0) {
      siteBootStage = "title";
      siteBootTitleProgress = smoothProgress(
        (elapsedTime - siteBootTitleStartedAt) / BOOT_TITLE_DURATION,
      );
    } else if (siteBootScreensStartedAt > 0) {
      siteBootStage = "screens";
      siteBootTitleProgress = 0;
    } else {
      siteBootStage = "lights";
      siteBootTitleProgress = 0;
    }

    const screenSequenceDuration =
      BOOT_SCREEN_POWER_DURATION + BOOT_SCREEN_STAGGER * 4;
    const screensComplete =
      screenSequenceElapsed >= screenSequenceDuration;
    if (
      progress >= 1 &&
      screensComplete &&
      siteBootTitleProgress >= 1
    ) {
      siteBootStage = "ready";
      siteBootStageStartedAt = elapsedTime;
      siteBootLightAmount = 1;
      siteBootTitleProgress = 1;
    }
    return;
  }

  siteBootLightAmount = 1;
  siteBootTitleProgress = 1;
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

  const roomLightTarget = introStage === "waiting" ? 0.4 : 0.7;
  const roomLightEase = 1 - Math.exp(-deltaTime * 2.4);
  roomLightLevel += (roomLightTarget - roomLightLevel) * roomLightEase;

  const outageMultiplier = 1 - hardOutageAmount;
  const bootLightMultiplier = THREE.MathUtils.clamp(siteBootLightAmount, 0, 1);
  scene.background
    .copy(bootBackgroundColor)
    .lerp(roomBackgroundColor, smoothProgress(bootLightMultiplier));
  ambientLight.intensity =
    AMBIENT_LIGHT_BASE_INTENSITY * bootLightMultiplier * roomLightLevel;
  tvGlowLight.intensity =
    TV_GLOW_BASE_INTENSITY * bootLightMultiplier * roomLightLevel;
  const visiblePanelPower =
    (0.14 + ceilingLightPower * 0.86) *
    outageMultiplier *
    bootLightMultiplier *
    roomLightLevel;
  ceilingPanelMaterial.color
    .copy(ceilingPanelBaseColor)
    .multiplyScalar(visiblePanelPower);
  keyLight.intensity =
    KEY_LIGHT_BASE_INTENSITY *
    (0.16 + ceilingLightPower * 0.84) *
    outageMultiplier *
    bootLightMultiplier *
    roomLightLevel;

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
      outageMultiplier *
      bootLightMultiplier *
      roomLightLevel;
  });
}

function updateSiteHeaderVisibility() {
  if (!siteHeader) return;

  const shouldShowHeader =
    introStage === "done" && focusTarget === 0 && !focusedScreen;
  const visibilityChanged = shouldShowHeader !== siteHeaderVisible;

  if (visibilityChanged) {
    siteHeaderVisible = shouldShowHeader;
    siteHeader.classList.toggle("is-visible", shouldShowHeader);
    siteHeader.setAttribute("aria-hidden", String(!shouldShowHeader));
    siteHeader.inert = !shouldShowHeader;

    if (shouldShowHeader) {
      if (!mobileLayoutActive) {
        headerWordmarkAnimationStartedAt = performance.now();
        headerWordmarkAnimationComplete = false;
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          drawHeaderAsciiWordmark(performance.now(), true);
        });
      });
    } else if (!mobileLayoutActive) {
      headerWordmarkAnimationStartedAt = null;
      headerWordmarkAnimationComplete = false;
    }

    if (!shouldShowHeader && aboutWindowAutoOpenTimer !== null) {
      window.clearTimeout(aboutWindowAutoOpenTimer);
      aboutWindowAutoOpenTimer = null;
    }

    syncAboutWindowVisibility();
  }

  const headerAnimationComplete =
    mobileLayoutActive || headerWordmarkAnimationComplete;
  const socialAnimationsComplete =
    mobileLayoutActive ||
    crtScreenMaterials
      .filter((material) => SOCIAL_LINKS[material.userData.mediaKey])
      .every(
        (material) =>
          material.uniforms.uSocialRevealProgress.value >= 0.999,
      );

  if (
    shouldShowHeader &&
    headerAnimationComplete &&
    socialAnimationsComplete &&
    !aboutWindowHasAutoOpened &&
    aboutWindowAutoOpenTimer === null
  ) {
    aboutWindowHasAutoOpened = true;
    aboutWindowAutoOpenTimer = window.setTimeout(() => {
      aboutWindowAutoOpenTimer = null;
      if (!siteHeaderVisible) return;
      aboutWindowRequestedOpen = true;
      syncAboutWindowVisibility();
    }, 140);
  }
}

function updateIntroSequence(elapsedTime) {
  if (introLetterScreenEntries.length === 0) return;

  const bootReady = isSiteBootReady();
  const introIsInteractive = bootReady && introStage === "waiting";
  const hoverPointerHit = introIsInteractive
    ? getIntroHoverPointerHit()
    : null;
  const clickPointerHit = introIsInteractive
    ? getIntroClickPointerHit()
    : null;
  if (introStage !== "done") syncIntroClickHint(clickPointerHit);
  updateIntroCueState(elapsedTime, clickPointerHit);
  introLetterScreenEntries.forEach((entry) => {
    entry.material.userData.introHoverTarget = 0;
  });
  if (hoverPointerHit) {
    introLetterScreenEntries.forEach((entry) => {
      const gridOffset = entry.introGridOffset ?? new THREE.Vector2();
      const gridScale = entry.introGridScale ?? new THREE.Vector2(1, 1);
      entry.material.userData.introHoverTarget = 1;
      entry.material.uniforms.uIntroPointerUv.value.set(
        (hoverPointerHit.globalUv.x - gridOffset.x) /
          Math.max(gridScale.x, 0.0001),
        (hoverPointerHit.globalUv.y - gridOffset.y) /
          Math.max(gridScale.y, 0.0001),
      );
    });
  }

  const bootShowsTitle =
    siteBootStage === "title" || siteBootStage === "ready";
  let regularTitleOnScreens =
    introStage === "waiting" && bootShowsTitle ? 1 : 0;
  let titleOnScreens = 0;
  let asciiFadeElapsed = null;
  let introWaveProgress = 0;
  let topRowShutdownProgress = 0;

  if (introStage === "handoff") {
    const rawProgress = THREE.MathUtils.clamp(
      (elapsedTime - introStageStartedAt) / INTRO_HANDOFF_DURATION,
      0,
      1,
    );
    const progress = smoothProgress(rawProgress);
    regularTitleOnScreens = 1;
    introWaveProgress = progress;
    topRowShutdownProgress = rawProgress;

    if (elapsedTime - introStageStartedAt >= INTRO_HANDOFF_DURATION) {
      introStage = "fade";
      introStageStartedAt = elapsedTime;
    }
  } else if (introStage === "fade") {
    asciiFadeElapsed = elapsedTime - introStageStartedAt;
    titleOnScreens = 1;
    introWaveProgress = 1;
    topRowShutdownProgress = 1;

    if (asciiFadeElapsed >= INTRO_FADE_DURATION) {
      introStage = "powering";
      introStageStartedAt = elapsedTime;
      crtScreenMaterials.forEach((material) => {
        material.uniforms.uPowerAmount.value = 0;
      });
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
      startScreenVideos();
    }
  }

  const greenFilterReveal =
    introStage === "powering" || introStage === "done" ? 1 : 0;
  const introShowsTopRowAsStatic =
    introStage === "waiting" ||
    introStage === "handoff" ||
    introStage === "fade";
  const socialRevealElapsed =
    introStage === "powering" || introStage === "done"
      ? elapsedTime - introStageStartedAt
      : null;
  const bootScreenElapsed = Math.max(
    0,
    siteBootScreensStartedAt > 0
      ? elapsedTime - siteBootScreensStartedAt
      : 0,
  );
  const siteBootIsRunning = !bootReady && introStage === "waiting";

  crtScreenMaterials.forEach((material) => {
    const isIntroTopScreen = material.userData.rowIndex === 2;
    material.uniforms.uStaticAmount.value = introShowsTopRowAsStatic
      ? Number(isIntroTopScreen)
      : material.userData.baseStaticAmount;
    material.uniforms.uInteractiveAmount.value =
      introShowsTopRowAsStatic && isIntroTopScreen
        ? 0
        : material.userData.baseInteractiveAmount;
    const isIntroLetterScreen = introLetterScreenEntries.some(
      (entry) => entry.material === material,
    );
    material.uniforms.uIntroTitleOnScreenAmount.value = isIntroLetterScreen
      ? regularTitleOnScreens
      : 0;
    let characterFadeProgress = 0;
    if (isIntroLetterScreen && asciiFadeElapsed !== null) {
      characterFadeProgress = smoothProgress(
        asciiFadeElapsed / 0.78,
      );
    }
    material.uniforms.uTitleOnScreenAmount.value = isIntroLetterScreen
      ? titleOnScreens
      : 0;
    material.uniforms.uTitleFadeProgress.value = characterFadeProgress;
    material.uniforms.uIntroBootProgress.value = isIntroLetterScreen
      ? siteBootTitleProgress
      : 1;
    material.uniforms.uIntroWaveProgress.value = isIntroLetterScreen
      ? introWaveProgress
      : 0;
    material.uniforms.uGreenFilterReveal.value = greenFilterReveal;
    const isSocialScreen = Boolean(SOCIAL_LINKS[material.userData.mediaKey]);
    material.uniforms.uSocialRevealProgress.value =
      !isSocialScreen || mobileLayoutActive
        ? 1
        : socialRevealElapsed === null
          ? 0
          : smoothProgress(
              (
                socialRevealElapsed -
                material.userData.bootDelay -
                SOCIAL_ICON_REVEAL_DELAY
              ) / SOCIAL_ICON_REVEAL_DURATION,
            );
    if (siteBootIsRunning) {
      if (
        (
          siteBootStage === "lights" ||
          siteBootStage === "screens" ||
          siteBootStage === "title"
        ) &&
        siteBootScreensStartedAt > 0 &&
        isIntroTopScreen
      ) {
        const screenBootDelay =
          material.userData.unitIndex * BOOT_SCREEN_STAGGER;
        material.uniforms.uPowerAmount.value = smoothProgress(
          (bootScreenElapsed - screenBootDelay) /
            BOOT_SCREEN_POWER_DURATION,
        );
      } else if (siteBootStage === "title") {
        material.uniforms.uPowerAmount.value = 0;
      } else {
        material.uniforms.uPowerAmount.value = 0;
      }
    } else if (introStage !== "powering" && introStage !== "done") {
      if (isIntroTopScreen) {
        const shutdownStart = 0.18 + material.userData.unitIndex * 0.05;
        const shutdownAmount = smoothProgress(
          (topRowShutdownProgress - shutdownStart) / 0.38,
        );
        material.uniforms.uPowerAmount.value = 1 - shutdownAmount;
      } else {
        material.uniforms.uPowerAmount.value = 0;
      }
    } else if (introStage === "done") {
      material.uniforms.uPowerAmount.value = 1;
    }
  });
}

function updateViewCursorLabel() {
  if (!hoveredScreen) return;

  const hoveredSocial = SOCIAL_LINKS[hoveredScreen.mediaKey];
  const hoveredExternal = EXTERNAL_SCREEN_LINKS[hoveredScreen.mediaKey];
  viewCursor.textContent =
    hoveredSocial?.label ?? hoveredExternal?.label ?? getUiCopy().view;
}

function setHoveredScreen(nextScreen) {
  if (hoveredScreen === nextScreen) {
    updateViewCursorLabel();
    return;
  }

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
  updateViewCursorLabel();
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

function getMobileFocusDistance(entry) {
  focusedScreenBounds.setFromObject(entry.mesh);
  focusedScreenBounds.getSize(mobileFocusBoundsSize);

  const referenceEntry = allScreenEntries.find(
    ({ mediaKey }) => mediaKey === MOBILE_FOCUS_REFERENCE_MEDIA_KEY,
  );
  if (!referenceEntry) return MOBILE_FOCUS_BASE_DISTANCE;

  mobileFocusReferenceBounds.setFromObject(referenceEntry.mesh);
  const referenceHeight = mobileFocusReferenceBounds.getSize(
    projectedScreenCorner,
  ).y;
  if (referenceHeight <= 0 || mobileFocusBoundsSize.y <= 0) {
    return MOBILE_FOCUS_BASE_DISTANCE;
  }

  return MOBILE_FOCUS_BASE_DISTANCE * (
    mobileFocusBoundsSize.y / referenceHeight
  );
}

function configureMobileFocusTargets(entry) {
  focusedScreenBounds
    .setFromObject(entry.mesh)
    .getCenter(interactionWorldPosition);

  focusCameraPosition.set(
    interactionWorldPosition.x,
    interactionWorldPosition.y + 0.18,
    interactionWorldPosition.z + getMobileFocusDistance(entry),
  );
  focusLookTarget.set(
    interactionWorldPosition.x,
    interactionWorldPosition.y - 0.82,
    interactionWorldPosition.z,
  );
}

function getProjectedFocusBoundsBottom(viewport, lookTargetYOffset = 0) {
  mobileFocusProjectionCamera.copy(camera);
  mobileFocusProjectionCamera.position.copy(focusCameraPosition);
  mobileFocusProjectionCamera.lookAt(
    focusLookTarget.x,
    focusLookTarget.y + lookTargetYOffset,
    focusLookTarget.z,
  );
  mobileFocusProjectionCamera.updateMatrixWorld(true);

  focusedScreenBounds.setFromObject(focusedScreen.mesh);
  let projectedMaxY = -Infinity;

  [focusedScreenBounds.min.x, focusedScreenBounds.max.x].forEach((x) => {
    [focusedScreenBounds.min.y, focusedScreenBounds.max.y].forEach((y) => {
      [focusedScreenBounds.min.z, focusedScreenBounds.max.z].forEach((z) => {
        projectedScreenCorner
          .set(x, y, z)
          .project(mobileFocusProjectionCamera);
        const screenY = (-projectedScreenCorner.y * 0.5 + 0.5) * viewport.height;
        projectedMaxY = Math.max(projectedMaxY, screenY);
      });
    });
  });

  return projectedMaxY;
}

function alignMobileFocusWithProjectPanel() {
  if (
    !mobileLayoutActive ||
    !focusedScreen ||
    !projectPanel.classList.contains("is-visible")
  ) {
    return;
  }

  const viewport = getStageViewport();
  const panelTop = projectPanel.offsetTop;
  if (!Number.isFinite(panelTop) || projectPanel.offsetHeight <= 0) return;

  const desiredGap = THREE.MathUtils.clamp(
    viewport.height * 0.12,
    84,
    108,
  );
  const extraLift = MOBILE_FOCUS_EXTRA_LIFT[focusedScreen.mediaKey] ?? 0;
  const desiredBottom = panelTop - desiredGap - extraLift;
  let lowerLookOffset = -2.4;
  let upperLookOffset = 2.4;
  let resolvedLookOffset = 0;

  for (let step = 0; step < 20; step += 1) {
    resolvedLookOffset = (lowerLookOffset + upperLookOffset) * 0.5;
    const candidateBottom = getProjectedFocusBoundsBottom(
      viewport,
      resolvedLookOffset,
    );
    if (candidateBottom < desiredBottom) {
      lowerLookOffset = resolvedLookOffset;
    } else {
      upperLookOffset = resolvedLookOffset;
    }
  }

  focusLookTarget.y += resolvedLookOffset;
}

function updateProjectPanelSideOffset(deltaTime, snap = false) {
  if (!focusedScreen || focusTarget === 0) return;
  if (mobileLayoutActive) {
    projectPanel.style.removeProperty("--project-side-offset");
    return;
  }

  const viewport = getStageViewport();

  camera.updateMatrixWorld(true);
  focusedScreenBounds.setFromObject(focusedScreen.mesh);
  let projectedMinX = Infinity;
  let projectedMaxX = -Infinity;

  [focusedScreenBounds.min.x, focusedScreenBounds.max.x].forEach((x) => {
    [focusedScreenBounds.min.y, focusedScreenBounds.max.y].forEach((y) => {
      [focusedScreenBounds.min.z, focusedScreenBounds.max.z].forEach((z) => {
        projectedScreenCorner.set(x, y, z).project(camera);
        const screenX = (projectedScreenCorner.x * 0.5 + 0.5) * viewport.width;
        projectedMinX = Math.min(projectedMinX, screenX);
        projectedMaxX = Math.max(projectedMaxX, screenX);
      });
    });
  });

  if (!Number.isFinite(projectedMinX) || !Number.isFinite(projectedMaxX)) return;

  const panelOnLeft = projectPanel.classList.contains("is-left");
  const mirroredScreenGap = panelOnLeft
    ? viewport.width - projectedMaxX
    : projectedMinX;
  const uiEdge = Number.parseFloat(
    window.getComputedStyle(roomStage).getPropertyValue("--ui-edge"),
  ) || 24;
  const targetOffset = THREE.MathUtils.clamp(
    mirroredScreenGap,
    uiEdge,
    viewport.width * 0.46,
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
  const copy = getUiCopy();
  projectMeta.textContent = formatForOnderFont(project.meta);
  projectTitle.textContent = formatForOnderFont(project.title);
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
    projectPreviewImage.alt = firstImage.alt ?? copy.previewAlt(project.title);
    projectPreviewLabel.textContent = gallery.length > 1
      ? copy.viewGallery
      : copy.view;
    projectPreview.setAttribute("aria-label", copy.viewProject(project.title));
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
    projectPreviewLabel.textContent = copy.watch;
    projectPreview.setAttribute("aria-label", copy.watchProject(project.title));
  }

  if (project.url) {
    projectLink.href = project.url;
    projectLink.textContent = project.linkLabel ?? copy.visitProject;
    projectLink.hidden = false;
  } else {
    projectLink.hidden = true;
    projectLink.removeAttribute("href");
  }

  fitProjectTitle();
  if (mobileLayoutActive && focusedScreen) {
    configureMobileFocusTargets(focusedScreen);
    alignMobileFocusWithProjectPanel();
  }
}

function fitProjectTitle() {
  if (!projectPanel.classList.contains("is-visible")) return;

  const actualTitle = projectTitle.textContent;
  projectTitle.style.fontSize = "";
  projectTitle.textContent = "delivery guy simulator";

  const maximumFontSize = Number.parseFloat(
    window.getComputedStyle(projectTitle).fontSize,
  );
  const availableWidth = projectTitle.clientWidth;
  if (!Number.isFinite(maximumFontSize) || availableWidth <= 0) {
    projectTitle.textContent = actualTitle;
    return;
  }

  let smallestSize = 8;
  let largestSize = maximumFontSize;
  for (let step = 0; step < 18; step += 1) {
    const candidateSize = (smallestSize + largestSize) * 0.5;
    projectTitle.style.fontSize = `${candidateSize}px`;
    if (projectTitle.scrollWidth <= availableWidth) {
      smallestSize = candidateSize;
    } else {
      largestSize = candidateSize;
    }
  }

  projectTitle.style.fontSize = `${Math.floor(smallestSize * 100) / 100}px`;
  projectTitle.textContent = actualTitle;
}

function focusProjectScreen(entry) {
  const project = getLocalizedProject(entry.mediaKey);
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
  if (mobileLayoutActive) {
    configureMobileFocusTargets(entry);
  } else {
    focusCameraPosition.set(
      interactionWorldPosition.x,
      interactionWorldPosition.y,
      interactionWorldPosition.z + 2.95,
    );
    focusLookTarget.set(
      interactionWorldPosition.x + (
        tvOnLeft
          ? DESKTOP_FOCUS_OUTWARD_LOOK_OFFSET
          : -DESKTOP_FOCUS_OUTWARD_LOOK_OFFSET
      ),
      interactionWorldPosition.y,
      interactionWorldPosition.z,
    );
  }

  crtScreenMaterials.forEach((material) => {
    material.userData.dimTarget = material === entry.material ? 0 : 1;
  });
  showProjectPanel(project, mobileLayoutActive ? false : !tvOnLeft, entry.mediaKey);
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

  focusProjectScreen(entry);
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
        alt: getUiCopy().imageAlt(project?.title ?? getUiCopy().media),
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
  cleanImage.alt = item.alt ?? getUiCopy().imageAlt(cleanViewTitle.textContent);
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
  const project = getLocalizedProject(mediaKey);
  const gallery = getProjectGallery(project, media);
  if (gallery.length === 0 && media?.type !== "video") return;

  setHoveredScreen(null);
  projectPreviewVideo.pause();
  setCleanViewOrigin();
  cleanViewTitle.textContent = project?.title ?? getUiCopy().media;

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

function handleProjectPreviewClick() {
  if (!focusedScreen) return;

  const project = getLocalizedProject(focusedScreen.mediaKey);
  if (project?.previewUrl) {
    window.open(project.previewUrl, "_blank", "noopener,noreferrer");
    return;
  }

  openCleanView();
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

canvas.addEventListener("click", (event) => {
  syncPointerFromEvent(event);
  if (introStage === "waiting") {
    if (isPointerOverIntroTitle()) beginIntroSequence();
    return;
  }

  if (introStage !== "done") return;

  if (focusTarget > 0) {
    closeProject();
    return;
  }

  updateHoveredScreen();
  if (!focusedScreen && hoveredScreen) {
    selectScreen(hoveredScreen);
  }
});
projectClose.addEventListener("click", closeProject);
projectPreview.addEventListener("click", handleProjectPreviewClick);
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

function startScreenVideos({ userInitiated = false } = {}) {
  if (userInitiated) screenVideosUnlocked = true;
  if (!screenVideosUnlocked) return;

  activeScreenVideos.forEach((video) => {
    video.play().catch(() => {
      if (screenVideoRetryArmed) return;
      screenVideoRetryArmed = true;
      window.addEventListener(
        "pointerdown",
        () => {
          screenVideoRetryArmed = false;
          startScreenVideos({ userInitiated: true });
        },
        { once: true },
      );
    });
  });
}

const tvLoader = new GLTFLoader();
const tvUnitsByKey = new Map();
let tvWallGroup = null;
let tvTemplateSize = null;

function getTvUnitKey(rowIndex, unitIndex) {
  return `${rowIndex}:${unitIndex}`;
}

function getActiveTvLayoutRows() {
  if (mobileLayoutActive) return TV_MOBILE_WALL_ROWS;

  return TV_DESKTOP_WALL_ROWS.map(({ offsetX, scales }, rowIndex) => ({
    offsetX,
    entries: scales.map((scale, unitIndex) => ({
      rowIndex,
      unitIndex,
      scale,
    })),
  }));
}

function applyTvWallLayout({ refreshLights = false } = {}) {
  if (!tvWallGroup || !tvTemplateSize) return;

  const horizontalGap = mobileLayoutActive ? -0.012 : TV_HORIZONTAL_GAP;
  const verticalGap = mobileLayoutActive ? -0.045 : TV_VERTICAL_GAP;
  let rowBottom = 0;

  getActiveTvLayoutRows().forEach(({
    offsetX,
    entries,
    columns = null,
  }, layoutRowIndex) => {
    const rowUnits = entries.map((layoutEntry) => {
      const tvUnit = tvUnitsByKey.get(
        getTvUnitKey(layoutEntry.rowIndex, layoutEntry.unitIndex),
      );
      return { ...layoutEntry, tvUnit };
    }).filter(({ tvUnit }) => Boolean(tvUnit));
    const usesFixedColumns = Number.isInteger(columns) && columns > 0;
    const columnUnitWidth = usesFixedColumns
      ? tvTemplateSize.x * Math.max(...rowUnits.map(({ scale }) => scale))
      : 0;
    const rowWidth = usesFixedColumns
      ? columnUnitWidth * columns + Math.max(0, columns - 1) * horizontalGap
      : rowUnits.reduce(
          (width, { scale }) => width + tvTemplateSize.x * scale,
          Math.max(0, rowUnits.length - 1) * horizontalGap,
        );
    const rowHeight = rowUnits.reduce(
      (height, { scale }) => Math.max(height, tvTemplateSize.y * scale),
      0,
    );
    let cursorX = offsetX - rowWidth * 0.5;

    rowUnits.forEach(({
      tvUnit,
      scale,
      rowIndex,
      unitIndex,
      columnIndex = null,
    }, layoutColumnIndex) => {
      const unitWidth = tvTemplateSize.x * scale;
      const resolvedColumnIndex = Number.isInteger(columnIndex)
        ? columnIndex
        : layoutColumnIndex;
      const unitCenterX = usesFixedColumns
        ? offsetX - rowWidth * 0.5 +
          resolvedColumnIndex * (columnUnitWidth + horizontalGap) +
          columnUnitWidth * 0.5
        : cursorX + unitWidth * 0.5;
      tvUnit.scale.setScalar(scale);
      tvUnit.position.set(
        unitCenterX,
        rowBottom,
        TV_WALL_Z,
      );
      tvUnit.userData.layoutRowIndex = layoutRowIndex;
      tvUnit.userData.layoutColumnIndex = resolvedColumnIndex;
      tvUnit.userData.contentRowIndex = rowIndex;
      tvUnit.userData.contentUnitIndex = unitIndex;
      if (!usesFixedColumns) cursorX += unitWidth + horizontalGap;
    });

    rowBottom += rowHeight + verticalGap;
  });

  tvWallGroup.updateMatrixWorld(true);
  configureSharedTitleScreens();

  const wallBounds = new THREE.Box3().setFromObject(tvWallGroup);
  const wallCenter = wallBounds.getCenter(new THREE.Vector3());
  tvGlowLight.position.set(wallCenter.x, wallCenter.y, TV_WALL_Z + 1.45);

  if (refreshLights) configureScreenGlowLights();
  else syncScreenGlowLightPositions();
}

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

    tvTemplateSize = templateSize;
    tvWallGroup = new THREE.Group();
    tvWallGroup.name = mobileLayoutActive
      ? "Portrait CRT television wall"
      : "Desktop CRT television wall";

    TV_SCREEN_LAYOUT.forEach((row, rowIndex) => {
      row.forEach((mediaKey, unitIndex) => {
        const tvUnit = tvTemplate.clone(true);

        applyScreenMaterial(
          tvUnit,
          mediaKey,
          rowIndex * 5.73 + unitIndex * 1.91,
          rowIndex,
          unitIndex,
        );
        tvUnitsByKey.set(getTvUnitKey(rowIndex, unitIndex), tvUnit);
        tvWallGroup.add(tvUnit);
      });
    });

    scene.add(tvWallGroup);
    applyTvWallLayout();
    configureScreenGlowLights();
    siteModelReady = true;
    siteAssetsReady = siteModelReady && siteFontReady && siteConcreteReady;
    render();
  },
  undefined,
  (error) => {
    console.error("CRT TV model could not be loaded.", error);
    siteBootStage = "error";
    loadingScreen.classList.add("is-error");
    loadingStatus.textContent = "crt wall failed to initialize";
    loadingActivity.textContent = "reload required";
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

  const motionScale = reducedMotionQuery.matches
    ? 0.18
    : mobileLayoutActive
      ? 0.42
      : 1;
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
  const defaultCameraHeight = mobileLayoutActive
    ? MOBILE_DEFAULT_CAMERA_HEIGHT
    : EYE_HEIGHT;
  const introCameraHeight = mobileLayoutActive
    ? MOBILE_INTRO_CAMERA_HEIGHT
    : INTRO_CAMERA_HEIGHT;
  const defaultCameraZ = mobileLayoutActive
    ? MOBILE_DEFAULT_CAMERA_Z
    : DEFAULT_CAMERA_Z;
  const introCameraZ = mobileLayoutActive
    ? MOBILE_INTRO_CAMERA_Z
    : INTRO_CAMERA_Z;
  const introPointerDamping = THREE.MathUtils.lerp(
    1,
    mobileLayoutActive ? 0.3 : 0.56,
    introCameraAmount,
  );
  const activeCameraHeight = THREE.MathUtils.lerp(
    defaultCameraHeight,
    introCameraHeight,
    introCameraAmount,
  );
  const activeCameraZ = THREE.MathUtils.lerp(
    defaultCameraZ,
    introCameraZ,
    introCameraAmount,
  );

  homeCameraPosition.set(
    handheldX * introPointerDamping,
    activeCameraHeight +
      handheldY * introPointerDamping,
    handheldZ + activeCameraZ,
  );
  homeLookTarget.set(
    (
      smoothedPointer.x * (mobileLayoutActive ? 0.045 : 0.14) +
      handheldLookX
    ) * introPointerDamping,
    activeCameraHeight +
      (
        smoothedPointer.y * (mobileLayoutActive ? 0.025 : 0.075) +
        handheldLookY
      ) * introPointerDamping,
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
  updateHoveredScreen();

  const materialEase = 1 - Math.exp(-deltaTime * 10);
  const socialHoverEase = 1 - Math.exp(-deltaTime * 2.25);
  const introHoverEase = 1 - Math.exp(-deltaTime * 3.6);

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
    if (
      material.userData.socialHoverTarget === 0 &&
      material.uniforms.uSocialHoverActive.value < 0.035
    ) {
      material.uniforms.uSocialHoverActive.value = 0;
    } else if (
      material.userData.socialHoverTarget === 1 &&
      material.uniforms.uSocialHoverActive.value > 0.965
    ) {
      material.uniforms.uSocialHoverActive.value = 1;
    }
    material.uniforms.uIntroHoverAmount.value += (
      material.userData.introHoverTarget -
      material.uniforms.uIntroHoverAmount.value
    ) * introHoverEase;
    material.uniforms.uDimAmount.value += (
      material.userData.dimTarget - material.uniforms.uDimAmount.value
    ) * materialEase;
    material.uniforms.uTitleOnScreenAmount.value = 0;
  });

  updateSiteBootSequence(elapsedTime, deltaTime);
  updateIntroSequence(elapsedTime);
  updateCeilingFlicker(elapsedTime, deltaTime);
  updateSiteHeaderVisibility();
  if (
    siteHeaderVisible &&
    !mobileLayoutActive &&
    !headerWordmarkAnimationComplete
  ) {
    drawHeaderAsciiWordmark(elapsedTime * 1000);
  }
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
  const nextMobileLayout = FORCE_MOBILE_PREVIEW || MOBILE_LAYOUT_QUERY.matches;
  const layoutChanged = nextMobileLayout !== mobileLayoutActive;

  if (layoutChanged) {
    if (focusedScreen) closeProject();
    mobileLayoutActive = nextMobileLayout;
    document.documentElement.classList.toggle(
      "is-mobile-layout",
      mobileLayoutActive,
    );
    aboutWindow.style.removeProperty("left");
    aboutWindow.style.removeProperty("top");
    projectPanel.style.removeProperty("--project-side-offset");
    camera.fov = mobileLayoutActive ? 52 : 60;
    const shadowSize = mobileLayoutActive ? 1024 : 2048;
    keyLight.shadow.mapSize.set(shadowSize, shadowSize);
    keyLight.shadow.map?.dispose();
    keyLight.shadow.map = null;
    ceilingFixtures.forEach(({ housing, panel }) => {
      housing.visible = !mobileLayoutActive;
      panel.visible = !mobileLayoutActive;
    });
    crtScreenMaterials.forEach((material) => {
      material.uniforms.uMobileLayout.value = Number(mobileLayoutActive);
      material.uniforms.uSocialAmount.value =
        SOCIAL_LINKS[material.userData.mediaKey] ? 1 : 0;
    });
    introLetterTextureCache.forEach(drawIntroLetterTextureSet);
    Object.keys(SOCIAL_LINKS).forEach(drawSocialScreenTexture);
    headerWordmarkAnimationStartedAt =
      !mobileLayoutActive && siteHeaderVisible ? performance.now() : null;
    headerWordmarkAnimationComplete = false;
    drawHeaderAsciiWordmark(performance.now(), true);
    applyTvWallLayout({ refreshLights: true });
  }

  const { width, height } = getStageViewport();

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(getRendererPixelRatio());
  renderer.setSize(width, height, false);
  projectPanelSideOffset = null;
  clampAboutWindowPosition();
  fitProjectTitle();
  if (mobileLayoutActive && focusedScreen) {
    configureMobileFocusTargets(focusedScreen);
    alignMobileFocusWithProjectPanel();
  }
  render();
}

window.addEventListener("resize", handleResize);

let mediaResumeFrameId = null;
let mediaResumeTimeoutId = null;

function resumeVisibleVideos() {
  if (document.hidden) return;

  if (introStage === "done") startScreenVideos();

  const cleanViewVisible = cleanView.classList.contains("is-visible");
  if (cleanViewVisible && cleanViewMode === "video") {
    cleanVideo.play().catch(() => {});
    return;
  }

  if (
    projectPanel.classList.contains("is-visible") &&
    !projectPreviewVideo.hidden
  ) {
    projectPreviewVideo.play().catch(() => {});
  }
}

function queueVideoResume() {
  if (document.hidden) return;

  if (mediaResumeFrameId !== null) {
    cancelAnimationFrame(mediaResumeFrameId);
  }
  if (mediaResumeTimeoutId !== null) {
    clearTimeout(mediaResumeTimeoutId);
  }

  resumeVisibleVideos();
  mediaResumeFrameId = requestAnimationFrame(() => {
    mediaResumeFrameId = null;
    resumeVisibleVideos();
  });
  mediaResumeTimeoutId = window.setTimeout(() => {
    mediaResumeTimeoutId = null;
    resumeVisibleVideos();
  }, 180);
}

function pauseVisibleVideos() {
  if (mediaResumeFrameId !== null) {
    cancelAnimationFrame(mediaResumeFrameId);
    mediaResumeFrameId = null;
  }
  if (mediaResumeTimeoutId !== null) {
    clearTimeout(mediaResumeTimeoutId);
    mediaResumeTimeoutId = null;
  }

  activeScreenVideos.forEach((video) => video.pause());
  projectPreviewVideo.pause();
  if (cleanViewMode === "video") cleanVideo.pause();
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseVisibleVideos();
    return;
  }

  queueVideoResume();
});

window.addEventListener("focus", queueVideoResume);
window.addEventListener("pageshow", queueVideoResume);

renderer.setAnimationLoop(render);
