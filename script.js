import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const asciiOutput = document.getElementById("asciiOutput");
const sourceVideo = document.getElementById("sourceVideo");
const displayCanvas = document.getElementById("displayCanvas");
const frameCanvas = document.getElementById("frameCanvas");
const loadingScreen = document.getElementById("loadingScreen");
const wishlistModal = document.getElementById("wishlistModal");
const wishlistBackdrop = document.getElementById("wishlistBackdrop");
const wishlistClose = document.getElementById("wishlistClose");
const wishlistFab = document.getElementById("wishlistFab");
const speakerModelStage = document.getElementById("speakerModelStage");
const musicPlayerPanel = document.getElementById("musicPlayerPanel");
const musicPlayerClose = document.getElementById("musicPlayerClose");
const musicPlayerCover = document.getElementById("musicPlayerCover");
const musicPlayerTitle = document.getElementById("musicPlayerTitle");
const musicPlayerArtist = document.getElementById("musicPlayerArtist");
const musicProgressBar = document.getElementById("musicProgressBar");
const musicProgressFill = document.getElementById("musicProgressFill");
const musicCurrentTime = document.getElementById("musicCurrentTime");
const musicDuration = document.getElementById("musicDuration");
const musicVolumeBar = document.getElementById("musicVolumeBar");
const musicTrackToggle = document.getElementById("musicTrackToggle");
const musicTrackList = document.getElementById("musicTrackList");
const musicPrev = document.getElementById("musicPrev");
const musicPlayToggle = document.getElementById("musicPlayToggle");
const musicNext = document.getElementById("musicNext");
const musicPlayerHeader = document.querySelector(".music-player-header");
const siteShell = document.querySelector(".site-shell");
const galleryShell = document.querySelector(".gallery-shell");
const galleryGrid = document.getElementById("galleryGrid");
const scrollCue = document.querySelector(".scroll-cue");
const postOverlay = document.getElementById("postOverlay");
const postBackdrop = document.getElementById("postBackdrop");
const postClose = document.getElementById("postClose");
const postPanel = document.querySelector(".post-panel");
const postBanner = document.getElementById("postBanner");
const postBannerVideo = document.getElementById("postBannerVideo");
const postCarousel = document.getElementById("postCarousel");
const postCarouselViewport = document.getElementById("postCarouselViewport");
const postCarouselPrev = document.getElementById("postCarouselPrev");
const postCarouselNext = document.getElementById("postCarouselNext");
const postCarouselDots = document.getElementById("postCarouselDots");
const postGameWrap = document.getElementById("postGameWrap");
const postGameFrame = document.getElementById("postGameFrame");
const postMeta = document.getElementById("postMeta");
const postTitle = document.getElementById("postTitle");
const postContent = document.getElementById("postContent");
const postActions = document.getElementById("postActions");

const GAME_FRAME_WIDTH = 1920;
const GAME_FRAME_HEIGHT = 1118;
const WISHLIST_DISMISSED_AT_KEY = "onderbalta:wishlistDismissedAt";
const WISHLIST_REPEAT_INTERVAL_MS = 24 * 60 * 60 * 1000;
const speakerModelUrl = "https://res.cloudinary.com/ddvaepjce/image/upload/v1776865669/dusty_passive_stage_speaker_quke5k.glb";
const musicTracks = [
  {
    title: "ナトリウムライト",
    artist: "Oblique",
    cover: "https://res.cloudinary.com/ddvaepjce/image/upload/v1776867989/Oblique_bmsnfi.jpg",
    src: "https://res.cloudinary.com/ddvaepjce/video/upload/v1776867974/Oblique_powd5e.mp3",
  },
  {
    title: "Fever Chill",
    artist: "ilent Hill 4",
    cover: "https://res.cloudinary.com/ddvaepjce/image/upload/v1776867988/FeverChill_yf43iv.jpg",
    src: "https://res.cloudinary.com/ddvaepjce/video/upload/v1776867965/FeverChill_fcqnom.mp3",
  },
  {
    title: "MCOMM",
    artist: "Sxnctuary",
    cover: "https://res.cloudinary.com/ddvaepjce/image/upload/v1776867989/MCOMM_uv36gu.jpg",
    src: "https://res.cloudinary.com/ddvaepjce/video/upload/v1776867976/MCOMM_w0dsin.mp3",
  },
];
let activeGameFrameWidth = GAME_FRAME_WIDTH;
let activeGameFrameHeight = GAME_FRAME_HEIGHT;
let activeGameWrapWidth = GAME_FRAME_WIDTH;
let activeGameWrapHeight = GAME_FRAME_HEIGHT;

const ctx = frameCanvas.getContext("2d", { willReadFrequently: true });
const displayCtx = displayCanvas.getContext("2d");
const charset = " .`',:^;i!l~_-";
const topCropRatio = 0;
const leftCropRatio = 0;
const rightCropRatio = 0;
const bottomCropRatio = 0;
const renderScale = 1.45;
const cursorRadius = 15;
const cursorFlowStrength = 3.2;
const cursorFadeSpeed = 0.16;
const cursorNoiseScale = 0.22;
const introAsciiPatterns = {
  minimal: " .,:;",
  geometric: " .:-=+*#%@",
  technical: " .`':;i!+=x#",
  organic: " .`'^~*:ox",
};
const activeIntroAsciiPattern = introAsciiPatterns.technical;
const galleryAsciiPreviewCleanups = [];
const postCarouselCleanups = [];
let postCarouselIndex = 0;
const introAsciiVideoSrc = "https://res.cloudinary.com/ddvaepjce/video/upload/v1776767453/From_KlickPin_CF_Pin_de_angelina_em_Videos_pt_2___Dia_da_dan%C3%A7a_Cen%C3%A1rio_para_v%C3%ADdeos_Guia_de_fotografia_agywq4.mp4";
const managedVideos = new Set();

function safePlayVideo(video) {
  if (!video || video.hidden || !video.isConnected) return;

  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  const playPromise = video.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      window.setTimeout(() => {
        if (!video.hidden && video.isConnected) {
          video.play().catch(() => {});
        }
      }, 260);
    });
  }
}

function watchVideo(video) {
  if (!video || managedVideos.has(video)) return;
  managedVideos.add(video);

  video.addEventListener("pause", () => {
    if (!video.dataset.allowPause) {
      safePlayVideo(video);
    }
  });

  video.addEventListener("ended", () => {
    if (!video.dataset.allowPause) {
      video.currentTime = 0;
      safePlayVideo(video);
    }
  });

  video.addEventListener("stalled", () => safePlayVideo(video));
  video.addEventListener("suspend", () => safePlayVideo(video));
  video.addEventListener("waiting", () => safePlayVideo(video));
}

function ensureAllVideosPlaying() {
  document.querySelectorAll("video").forEach((video) => {
    if (video.hidden || !video.isConnected) return;
    watchVideo(video);
    if (video.paused || video.ended || video.readyState < 2) {
      safePlayVideo(video);
    }
  });

  if (!isRendering && sourceVideo && sourceVideo.readyState >= 2) {
    startRendering();
  }
}

function ensureHeroRendering() {
  if (!sourceVideo) return;

  watchVideo(sourceVideo);

  if (sourceVideo.readyState >= 2) {
    if (sourceVideo.paused || sourceVideo.ended) {
      safePlayVideo(sourceVideo);
    }

    if (!isRendering) {
      startRendering();
    }

    if (!hasLoadedFrame) {
      hasLoadedFrame = true;
      firstFrameReady = true;
      revealUiIfReady();
    }
  } else {
    sourceVideo.load();
    safePlayVideo(sourceVideo);
  }
}
const galleryPosts = [
    {
      type: "intro",
      body: [
        "Hey! I'm onder. I love building things, and this is a place where I share and archive what I create."
      ]
    },
  {
    title: "scene 01",
    category: "environment",
    year: "2026",
    mediaType: "video",
    image: "https://res.cloudinary.com/ddvaepjce/video/upload/v1776697083/Movie_020_yqakht.mp4",
    alt: "Atmospheric cinematic still",
    body: [
      "work in progress.",
      "made with unity.",
      "procedural god rays, bird flocks, and horse systems. experimenting with shaders, lighting, and post-processing. still working on the color grading, composition, and camera angle."
    ]
  },
  {
    title: "null",
    category: "game",
    year: "prototype",
    mediaType: "game",
    image: "https://img.itch.zone/aW1nLzI2Nzk5MzQ3LnBuZw==/347x500/r6hpSd.png",
    gameUrl: "https://roaring-treacle-78453f.netlify.app/",
    gameWidth: 1920,
    gameHeight: 1118,
    externalUrl: "https://gousk.itch.io/null",
    alt: "NULL game preview",
    body: [
      "Fast-paced, level-based movement shooter with only 3 levels for now. This is currently a prototype, but I plan to turn it into a proper demo later. I might eventually release it on Steam as well, though I'm not completely sure yet.",
    ]
  },
  {
    title: "scene 03",
    category: "environment",
    year: "2026",
    mediaType: "video",
    image: "https://res.cloudinary.com/ddvaepjce/video/upload/v1776695734/456_qsbg78.mp4?v=1776695734",
    alt: "Scene 03 video preview",
    body: [
      "made with unity.",
      "test intro sequence for bicycle club games and videos."
    ]
  },
  {
    title: "bicycle club",
    category: "website",
    year: "2026",
    mediaType: "video",
    image: "https://res.cloudinary.com/ddvaepjce/video/upload/v1776690543/introclip_witlri.mp4",
    previewType: "ascii-video",
    alt: "Bicycle Club website ASCII hero preview",
    externalUrl: "https://bicycleclub.net",
    actionLabel: "visit",
    mediaGallery: [
      { type: "ascii-video", src: "https://res.cloudinary.com/ddvaepjce/video/upload/v1776690543/introclip_witlri.mp4", alt: "Bicycle Club ASCII hero" },
      { type: "image", src: "https://res.cloudinary.com/ddvaepjce/image/upload/v1776690433/Screenshot_26_dsglbw.png", alt: "Bicycle Club screenshot" }
    ],
    body: [
      "made with react, vite, and supabase. the site uses ascii art throughout the interface and keeps a dense terminal-inspired visual language.",
      "it includes pages like home, posts, projects, gallery, merch, and contact, plus authenticated areas such as logs and profile. the console is functional, login happens through it, and some hidden panels and extras open from there, including things like the aim trainer.",
      "it also works like a small cms/admin-driven platform. depending on the logged-in user's permissions, content like gallery items, posts, and projects can be managed directly from inside the site instead of being hardcoded by hand.",
      "there is also realtime chat, a draggable music player, and a few smaller interactive systems layered into the same interface. it is still in active development and not fully finished yet."
    ]
  },
  {
    title: "scene 02",
    category: "environment",
    year: "2026",
    mediaType: "video",
    image: "https://res.cloudinary.com/ddvaepjce/video/upload/v1776680203/123_ikdovw.mp4",
    alt: "Scene 02 video preview",
    body: [
      "made with unity.",
      "procedural blob tracking."
    ]
  },
    {
      title: "isometric shooter",
      category: "game",
      year: "2024",
      mediaType: "game",
      image: "https://img.itch.zone/aW1nLzE1MTIyNTI2LnBuZw==/508x254%23mb/e19PyI.png",
      gameUrl: "https://html-classic.itch.zone/html/9772857/BUILD/index.html",
      gameWidth: 1920,
      gameHeight: 1118,
      externalUrl: "https://gousk.itch.io/isometric-shooter",
      alt: "Isometric Shooter game preview",
      body: [
        "This project is something I'm working on for learning and to try out different ideas. It's not finished yet and I'm still working on it when I have time. The car mechanic comes from a free asset; everything else is my own creation other than the models and animations.",
        "You can navigate with WASD, pick up weapons by walking over them, shoot with the mouse, drop weapons with G, swap with the scroll wheel or number keys, and spawn a vehicle with F. Enemies drop ammo of various rarities, endless spawns are active, and for now you cannot die."
      ]
    },
    {
      title: "splitself",
      category: "game",
      year: "2025",
      mediaType: "game",
      image: "https://img.itch.zone/aW1nLzIxMjE5MTIwLnBuZw==/508x254%23mb/5sih03.png",
      gameUrl: "https://html-classic.itch.zone/html/13709006/Splitself WebBuild/index.html",
      gameWidth: 1920,
      gameHeight: 1118,
      externalUrl: "https://gousk.itch.io/splitself",
      alt: "Splitself game preview",
      body: [
        "Google Yapay Zeka ve Teknoloji Akademisi'nin duzenledigi Game Jam'de, Grup 49 olarak uc gun icinde gelistirdigimiz bu projeyle ikincilik elde ettik.",
        "Splitself, yanlis giden bir buyu sonucu benligi ve esyalari farkli diyarlara ve zaman dilimlerine dagilan bir buyucunun, bu diyarlarda gezerek benligini ve esyalarini toplayip anilarini yeniden hatirlamaya calistigi uc bolumlu bir Game Jam oyunudur.",
        "Kontroller: WASD hareket, Space ziplama, Left Shift kamera acisini degistirme, R zamani geri sarma, sol fare tusu buyu atma."
      ]
    },
    {
      title: "fridge rush",
      category: "game",
      year: "2022",
      mediaType: "game",
      image: "https://img.itch.zone/aW1hZ2UvMTQ2MDc3My84NTI2MzgzLnBuZw==/794x1000/bULZxs.png",
      gameUrl: "https://html-classic.itch.zone/html/5502426/Fridge Rush 1.1/index.html",
      gameWidth: 486,
      gameHeight: 902,
      wrapWidth: 1920,
      wrapHeight: 1118,
      externalUrl: "https://gousk.itch.io/fridge-rush",
      alt: "Fridge Rush game preview",
      body: [
        "An ATMRush clone with a different theme. Learning practice."
      ]
    },
    {
      title: "ps graphics shooter",
      category: "game",
      year: "2024",
      mediaType: "game",
      image: "https://img.itch.zone/aW1nLzE1MTIyNjIxLnBuZw==/508x254%23mb/AnWhs5.png",
      gameUrl: "https://html-classic.itch.zone/html/9772838/COWBOY BUILD/index.html",
      gameWidth: 1920,
      gameHeight: 1118,
      externalUrl: "https://gousk.itch.io/ps-graphics-shooter",
      alt: "PS Graphics Shooter game preview",
      body: [
        "I always wanted to try an old PlayStation graphics look, so I mixed that aesthetic with an old-school shooter feel.",
        "Controls: Move with WASD, switch weapons with 1 and 2, and shoot with Mouse 1."
      ]
    },
      {
        title: "mpcars",
        category: "game",
        year: "2022",
      mediaType: "game",
      image: "https://img.itch.zone/aW1nLzg4NjI0NjAucG5n/508x254%23mb/FaxERN.png",
      gameUrl: "https://html-classic.itch.zone/html/5804609/CROSSDENEME/index.html",
      gameWidth: 1024,
      gameHeight: 806,
      wrapWidth: 1920,
      wrapHeight: 1118,
      externalUrl: "https://gousk.itch.io/mpcars",
      alt: "MPCARS game preview",
      body: [
        "Multiplayer car sumo game developed with Unity and PUN2."
      ]
    }
  ];

let animationHandle = null;
let isRendering = false;
let hasLoadedFrame = false;
let pointerActive = false;
let pointerX = 0;
let pointerY = 0;
let smoothPointerX = 0;
let smoothPointerY = 0;
let frameTick = 0;
let displayFrameBuffer = null;
let backgroundReady = false;
let firstFrameReady = false;
let uiReady = false;
let introAsciiEl = null;
let introCardEl = null;
let introVideoBgEl = null;
let introVideoEl = null;
let introCanvasEl = null;
let introCanvasCtx = null;
let introVideoBgCtx = null;
let introVideoBgAnimationHandle = null;
let introAsciiFrame = 0;
let introAsciiLastTime = 0;
let introPointerActive = false;
let introPointerX = 0;
let introPointerY = 0;
let introPointerSmoothX = 0;
let introPointerSmoothY = 0;
let introAsciiMetrics = null;
const introPointerRadius = 11.5;
let activeMusicTrackIndex = 0;
let musicIsPlaying = false;
let musicProgress = 0;
let musicVolume = 0.42;
let isSeekingMusic = false;
let isChangingVolume = false;
const musicAudio = new Audio();
musicAudio.preload = "metadata";
musicAudio.crossOrigin = "anonymous";

function openMusicPlayerModal() {
  if (!musicPlayerPanel) return;
  musicPlayerPanel.hidden = false;
}

function closeMusicPlayerModal() {
  if (!musicPlayerPanel) return;
  musicPlayerPanel.hidden = true;
}

function openWishlistModal() {
  if (!wishlistModal) return;
  wishlistModal.hidden = false;
  if (wishlistFab) wishlistFab.hidden = true;
  wishlistModal.querySelectorAll("video").forEach((video) => {
    watchVideo(video);
    safePlayVideo(video);
  });
}

function closeWishlistModal(rememberDismissal = true) {
  if (!wishlistModal) return;
  wishlistModal.hidden = true;
  if (rememberDismissal) {
    try {
      window.localStorage.setItem(WISHLIST_DISMISSED_AT_KEY, String(Date.now()));
    } catch {}
  }
  if (wishlistFab) wishlistFab.hidden = false;
}

function shouldAutoOpenWishlistModal() {
  try {
    const dismissedAt = Number(window.localStorage.getItem(WISHLIST_DISMISSED_AT_KEY) || 0);
    return !dismissedAt || Date.now() - dismissedAt > WISHLIST_REPEAT_INTERVAL_MS;
  } catch {
    return true;
  }
}

function initWishlistModal() {
  if (!wishlistModal) return;

  if (shouldAutoOpenWishlistModal()) {
    openWishlistModal();
    return;
  }

  if (wishlistFab) wishlistFab.hidden = false;
}

function formatTrackTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function getActiveTrackDuration() {
  return Number.isFinite(musicAudio.duration) && musicAudio.duration > 0
    ? musicAudio.duration
    : 0;
}

function updateMusicPlayerUi() {
  const track = musicTracks[activeMusicTrackIndex];
  if (!track) return;

  const duration = getActiveTrackDuration();
  const currentTime = Number.isFinite(musicAudio.currentTime) ? musicAudio.currentTime : 0;
  musicProgress = duration ? currentTime / duration : 0;

  if (musicPlayerCover) {
    musicPlayerCover.src = track.cover;
  }
  if (musicPlayerTitle) musicPlayerTitle.textContent = track.title;
  if (musicPlayerArtist) musicPlayerArtist.textContent = track.artist;
  if (musicCurrentTime) musicCurrentTime.textContent = formatTrackTime(currentTime);
  if (musicDuration) musicDuration.textContent = duration ? formatTrackTime(duration) : "--:--";
  if (musicProgressFill) musicProgressFill.style.width = `${musicProgress * 100}%`;
  if (musicProgressBar) musicProgressBar.setAttribute("aria-valuenow", String(Math.round(musicProgress * 100)));
  if (musicVolumeBar) musicVolumeBar.setAttribute("aria-valuenow", String(Math.round(musicVolume * 100)));

  document.querySelectorAll(".music-track-item").forEach((item) => {
    item.classList.toggle("is-active", Number(item.dataset.trackIndex) === activeMusicTrackIndex);
  });
}

function updateVolumeUi() {
  const volumeFill = musicVolumeBar?.querySelector("span");
  if (volumeFill) volumeFill.style.width = `${musicVolume * 100}%`;
  if (musicVolumeBar) musicVolumeBar.setAttribute("aria-valuenow", String(Math.round(musicVolume * 100)));
}

function loadActiveTrack() {
  const track = musicTracks[activeMusicTrackIndex];
  if (!track) return;
  musicAudio.src = track.src;
  musicAudio.load();
  updateMusicPlayerUi();
}

function updateSelectedTrack(nextIndex, shouldPlay = musicIsPlaying) {
  activeMusicTrackIndex = (nextIndex + musicTracks.length) % musicTracks.length;
  musicProgress = 0;
  loadActiveTrack();
  if (shouldPlay) {
    musicAudio.play().catch(() => setMusicPlayerState(false));
  }
}

function setMusicPlayerState(isPlaying) {
  musicIsPlaying = isPlaying;
  if (!musicPlayToggle) return;
  musicPlayToggle.textContent = isPlaying ? "||" : ">";

  if (isPlaying) {
    musicAudio.play().catch(() => setMusicPlayerState(false));
  } else {
    musicAudio.pause();
  }
}

function getPointerRatio(event, element) {
  const rect = element.getBoundingClientRect();
  if (!rect.width) return 0;
  return Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
}

function seekMusicToRatio(ratio) {
  const duration = getActiveTrackDuration();
  if (!duration) return;
  musicAudio.currentTime = duration * ratio;
  updateMusicPlayerUi();
}

function setVolumeToRatio(ratio) {
  musicVolume = Math.max(0, Math.min(1, ratio));
  musicAudio.volume = musicVolume;
  updateVolumeUi();
}

function initSpeakerModel() {
  if (!speakerModelStage) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0.38, 5.6);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  speakerModelStage.appendChild(renderer.domElement);

  const keyLight = new THREE.DirectionalLight(0xffead2, 2.2);
  keyLight.position.set(3.2, 4.2, 4.4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x8f2722, 1.25);
  fillLight.position.set(-3.5, 1.4, 2.6);
  scene.add(fillLight);

  const ambientLight = new THREE.AmbientLight(0xdccdb6, 1.15);
  scene.add(ambientLight);

  const modelPivot = new THREE.Group();
  scene.add(modelPivot);
  const throwState = {
    dragging: false,
    lastX: 0,
    lastY: 0,
    velocityX: 0,
    velocityY: 0,
    positionX: 0,
    positionY: 0,
    lastMoveTime: 0,
    lastFrameTime: 0,
    pointerDownX: 0,
    pointerDownY: 0,
    movedDistance: 0,
  };

  function beginSpeakerDrag(event) {
    speakerModelStage.setPointerCapture(event.pointerId);
    speakerModelStage.classList.add("is-dragging");
    throwState.dragging = true;
    throwState.lastX = event.clientX;
    throwState.lastY = event.clientY;
    throwState.pointerDownX = event.clientX;
    throwState.pointerDownY = event.clientY;
    throwState.movedDistance = 0;
    throwState.velocityX = 0;
    throwState.velocityY = 0;
    throwState.lastMoveTime = performance.now();
  }

  function resizeSpeakerRenderer() {
    const rect = speakerModelStage.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function frameLoadedModel(model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;

    model.position.sub(center);
    model.scale.setScalar(1.58 / maxAxis);
    model.rotation.set(
      THREE.MathUtils.degToRad(-12),
      THREE.MathUtils.degToRad(-34),
      THREE.MathUtils.degToRad(10)
    );
  }

  new GLTFLoader().load(
    speakerModelUrl,
    (gltf) => {
      frameLoadedModel(gltf.scene);
      modelPivot.add(gltf.scene);
      speakerModelStage.classList.add("is-loaded");
    },
    undefined,
    () => {
      speakerModelStage.remove();
    }
  );

  speakerModelStage.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".music-player-panel")) return;
    beginSpeakerDrag(event);
  });

  if (musicPlayerHeader) {
    musicPlayerHeader.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) return;
      event.stopPropagation();
      beginSpeakerDrag(event);
    });
  }

  function applySpeakerPosition() {
    speakerModelStage.style.setProperty("--speaker-x", `${throwState.positionX}px`);
    speakerModelStage.style.setProperty("--speaker-y", `${throwState.positionY}px`);
  }

  function clampSpeakerPosition() {
    const rects = [speakerModelStage.getBoundingClientRect()];
    if (musicPlayerPanel && !musicPlayerPanel.hidden) {
      rects.push(musicPlayerPanel.getBoundingClientRect());
    }

    const baseBounds = rects.reduce((bounds, rect) => {
      const left = rect.left - throwState.positionX;
      const right = rect.right - throwState.positionX;
      const top = rect.top - throwState.positionY;
      const bottom = rect.bottom - throwState.positionY;

      return {
        left: Math.min(bounds.left, left),
        right: Math.max(bounds.right, right),
        top: Math.min(bounds.top, top),
        bottom: Math.max(bounds.bottom, bottom),
      };
    }, {
      left: Number.POSITIVE_INFINITY,
      right: Number.NEGATIVE_INFINITY,
      top: Number.POSITIVE_INFINITY,
      bottom: Number.NEGATIVE_INFINITY,
    });

    const minX = -baseBounds.left;
    const maxX = window.innerWidth - baseBounds.right;
    const minY = -baseBounds.top;
    const maxY = window.innerHeight - baseBounds.bottom;

    if (throwState.positionX < minX) {
      throwState.positionX = minX;
      throwState.velocityX = Math.abs(throwState.velocityX) * 0.86;
    } else if (throwState.positionX > maxX) {
      throwState.positionX = maxX;
      throwState.velocityX = -Math.abs(throwState.velocityX) * 0.86;
    }

    if (throwState.positionY < minY) {
      throwState.positionY = minY;
      throwState.velocityY = Math.abs(throwState.velocityY) * 0.86;
    } else if (throwState.positionY > maxY) {
      throwState.positionY = maxY;
      throwState.velocityY = -Math.abs(throwState.velocityY) * 0.86;
    }
  }

  speakerModelStage.addEventListener("pointermove", (event) => {
    if (!throwState.dragging) return;

    const now = performance.now();
    const dt = Math.max(16, now - throwState.lastMoveTime);
    const dx = event.clientX - throwState.lastX;
    const dy = event.clientY - throwState.lastY;

    throwState.movedDistance = Math.max(
      throwState.movedDistance,
      Math.hypot(event.clientX - throwState.pointerDownX, event.clientY - throwState.pointerDownY)
    );
    throwState.positionX += dx;
    throwState.positionY += dy;
    throwState.velocityX = dx / dt;
    throwState.velocityY = dy / dt;
    throwState.lastX = event.clientX;
    throwState.lastY = event.clientY;
    throwState.lastMoveTime = now;

    clampSpeakerPosition();
    applySpeakerPosition();
  });

  function releaseSpeakerModel(event) {
    if (!throwState.dragging) return;

    if (speakerModelStage.hasPointerCapture(event.pointerId)) {
      speakerModelStage.releasePointerCapture(event.pointerId);
    }

    speakerModelStage.classList.remove("is-dragging");
    throwState.dragging = false;
    if (throwState.movedDistance < 6) {
      openMusicPlayerModal();
    }
    throwState.velocityX = THREE.MathUtils.clamp(throwState.velocityX, -2.4, 2.4);
    throwState.velocityY = THREE.MathUtils.clamp(throwState.velocityY, -2.4, 2.4);
  }

  speakerModelStage.addEventListener("pointerup", releaseSpeakerModel);
  speakerModelStage.addEventListener("pointercancel", releaseSpeakerModel);

  function animateSpeakerModel(time) {
    const seconds = time * 0.001;
    const previousFrameTime = throwState.lastFrameTime || time;
    const deltaTime = Math.min(34, time - previousFrameTime);
    throwState.lastFrameTime = time;

    if (!throwState.dragging) {
      throwState.positionX += throwState.velocityX * deltaTime;
      throwState.positionY += throwState.velocityY * deltaTime;
      throwState.velocityX *= 0.985;
      throwState.velocityY *= 0.985;

      if (Math.abs(throwState.velocityX) < 0.004) throwState.velocityX = 0;
      if (Math.abs(throwState.velocityY) < 0.004) throwState.velocityY = 0;

      clampSpeakerPosition();
      applySpeakerPosition();
    }

    modelPivot.rotation.y = Math.sin(seconds * 0.28) * THREE.MathUtils.degToRad(82);
    modelPivot.rotation.x = Math.sin(seconds * 0.22) * 0.025;
    modelPivot.rotation.z = Math.sin(seconds * 0.2) * 0.018;
    renderer.render(scene, camera);
    window.requestAnimationFrame(animateSpeakerModel);
  }

  resizeSpeakerRenderer();
  window.addEventListener("resize", resizeSpeakerRenderer);
  window.requestAnimationFrame(animateSpeakerModel);
}

function updateGalleryVisibility() {
  const revealPoint = Math.min(window.innerHeight * 0.14, 140);
  if (window.scrollY > revealPoint) {
    galleryShell.classList.add("is-visible");
    if (scrollCue) {
      scrollCue.classList.add("is-hidden");
    }
    return;
  }

  galleryShell.classList.remove("is-visible");
  if (scrollCue) {
    scrollCue.classList.remove("is-hidden");
  }
}

function renderGalleryAdStrip() {
  return `
    <a
      class="gallery-ad-strip"
      href="https://store.steampowered.com/app/3377340/Delivery_Guy_Simulator/"
      target="_blank"
      rel="noreferrer"
      aria-label="Wishlist Delivery Guy Simulator on Steam"
    >
      <video
        class="gallery-ad-video"
        src="https://res.cloudinary.com/ddvaepjce/video/upload/v1776850880/DGS-TRAILER_wd62u0.mp4"
        muted
        autoplay
        loop
        playsinline
        crossorigin="anonymous"
        aria-hidden="true"
      ></video>
      <div class="gallery-ad-ascii-layer" aria-hidden="true">
        <canvas class="gallery-ad-ascii-canvas hidden-video"></canvas>
        <pre class="gallery-ad-ascii-preview"></pre>
      </div>
      <img
        class="gallery-ad-icon"
        src="https://res.cloudinary.com/ddvaepjce/image/upload/v1776849204/21ca6d0cf2f25c4dbb35d8dc0b679c3f_wxzz1g.png"
        alt=""
      >
      <span class="gallery-ad-text">wishlist now</span>
      <img
        class="gallery-ad-side-icon"
        src="https://res.cloudinary.com/ddvaepjce/image/upload/v1776853122/Gemini_Generated_Image_zhaahqzhaahqzhaa_wjqem2.png"
        alt=""
      >
    </a>
  `;
}

function renderGallery() {
  galleryAsciiPreviewCleanups.splice(0).forEach((cleanup) => {
    try { cleanup(); } catch {}
  });

  galleryGrid.innerHTML = galleryPosts.map((post, index) => `
      ${post.mediaType === "game" ? "" : ""}
      ${post.type === "intro" ? `
        <article class="gallery-card gallery-card-layout-${(index % 8) + 1} gallery-card-intro">
          <video class="gallery-intro-video hidden-video" src="${introAsciiVideoSrc}" muted autoplay loop playsinline crossorigin="anonymous"></video>
          <canvas class="gallery-intro-video-bg" aria-hidden="true"></canvas>
          <canvas class="gallery-intro-canvas hidden-video"></canvas>
          <pre class="gallery-intro-ascii" aria-hidden="true"></pre>
          <div class="gallery-intro-inner">
            <div class="gallery-intro-body">
            ${post.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}
          </div>
        </div>
        </article>
        ` : post.mediaType === "game" && post.title !== "null" ? `` : `
        <button class="gallery-card gallery-card-layout-${(index % 8) + 1}${post.mediaType === "game" ? " gallery-card-game" : ""}${post.title === "fridge rush" ? " gallery-card-game-portrait" : ""}${post.title === "null" ? " gallery-card-game-null" : ""}${post.title === "scene 03" ? " gallery-card-scene-3" : ""}${post.title === "scene 02" ? " gallery-card-scene-2" : ""}${post.previewType === "ascii-video" ? " gallery-card-website" : ""}${post.title === "bicycle club" ? " gallery-card-bicycleclub" : ""}" type="button" data-post-index="${index}"${post.previewType === "ascii-video" ? ` data-preview-type="${post.previewType}"` : ""}>
          <div class="gallery-thumb-wrap">
            ${post.previewType === "ascii-video" ? `
              <div class="gallery-ascii-thumb" aria-hidden="true">
                <video class="gallery-ascii-source hidden-video" src="${post.image}" muted autoplay loop playsinline crossorigin="anonymous"></video>
                <canvas class="gallery-ascii-canvas hidden-video"></canvas>
                <pre class="gallery-ascii-preview"></pre>
              </div>
            ` : post.mediaType === "video" ? `
              <video class="gallery-thumb-video${post.image.includes("Movie_020_yqakht.mp4") ? " gallery-thumb-video-right" : ""}${post.mediaType === "game" ? " gallery-thumb-game" : ""}" src="${post.image}" muted autoplay loop playsinline crossorigin="anonymous" aria-label="${post.alt}"></video>
            ` : `
              <img class="gallery-thumb${post.mediaType === "game" ? " gallery-thumb-game" : ""}" src="${post.image}" alt="${post.alt}">
            `}
            <div class="gallery-copy">
            <p class="gallery-card-title">${post.title}</p>
            <p class="gallery-card-meta">${post.category} / ${post.year}</p>
          </div>
        </div>
        </button>
      `}
    `).filter(Boolean).join("");
  galleryGrid.insertAdjacentHTML("beforeend", renderGalleryAdStrip());

  introAsciiEl = galleryGrid.querySelector(".gallery-intro-ascii");
  introCardEl = galleryGrid.querySelector(".gallery-card-intro");
  introVideoBgEl = galleryGrid.querySelector(".gallery-intro-video-bg");
  introVideoEl = galleryGrid.querySelector(".gallery-intro-video");
  introCanvasEl = galleryGrid.querySelector(".gallery-intro-canvas");
  introCanvasCtx = introCanvasEl ? introCanvasEl.getContext("2d", { willReadFrequently: true }) : null;
  introVideoBgCtx = introVideoBgEl ? introVideoBgEl.getContext("2d") : null;
  introAsciiMetrics = null;
  setupGalleryAsciiPreviews();

  if (introVideoEl) {
    watchVideo(introVideoEl);
    safePlayVideo(introVideoEl);
  }


  if (introCardEl) {
    introCardEl.addEventListener("mousemove", (event) => {
      const rect = (introAsciiEl || introCardEl).getBoundingClientRect();
      introPointerX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      introPointerY = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));

      if (!introPointerActive) {
        introPointerSmoothX = introPointerX;
        introPointerSmoothY = introPointerY;
      }

      introPointerActive = true;
    });

    introCardEl.addEventListener("mouseleave", () => {
      introPointerActive = false;
    });
  }
}

function setupGalleryAsciiPreviews() {
  const cards = galleryGrid.querySelectorAll('[data-preview-type="ascii-video"]');
  cards.forEach((card) => {
    const wrap = card.querySelector(".gallery-ascii-thumb");
    const video = card.querySelector(".gallery-ascii-source");
    const canvas = card.querySelector(".gallery-ascii-canvas");
    const pre = card.querySelector(".gallery-ascii-preview");
    if (!wrap || !video || !canvas || !pre) return;

    const ctx2d = canvas.getContext("2d", { willReadFrequently: true });
    const ramp = " .:-=+*#%@";
    const cell = { cw: 6, ch: 10 };
    let frameTimer = null;
    const fitBoost = card.classList.contains("gallery-card-bicycleclub") ? 1.05 : 0.998;

    const measureCell = () => {
      const probe = document.createElement("span");
      probe.textContent = "MMMMMMMMMM\nMMMMMMMMMM";
      probe.style.position = "absolute";
      probe.style.visibility = "hidden";
      probe.style.whiteSpace = "pre";
      probe.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
      probe.style.fontSize = "10px";
      probe.style.lineHeight = "10px";
      wrap.appendChild(probe);
      const rect = probe.getBoundingClientRect();
      wrap.removeChild(probe);
      cell.cw = Math.max(4, rect.width / 10);
      cell.ch = Math.max(6, rect.height / 2);
    };

    const fitPre = () => {
      const preWidth = pre.scrollWidth || 1;
      const preHeight = pre.scrollHeight || 1;
      const wrapRect = wrap.getBoundingClientRect();
      if (!wrapRect.width || !wrapRect.height) return;
      const scale = Math.min(wrapRect.width / preWidth, wrapRect.height / preHeight) * fitBoost;
      pre.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };

    const draw = () => {
      if (!video.videoWidth || !video.videoHeight) return;
      const wrapRect = wrap.getBoundingClientRect();
      if (!wrapRect.width || !wrapRect.height) return;

      const aspect = video.videoWidth / video.videoHeight;
      const colsByWidth = Math.max(36, Math.floor(wrapRect.width / cell.cw));
      const rowsByWidth = Math.max(8, Math.round(colsByWidth / (aspect * (cell.ch / cell.cw))));
      const rowsLimit = Math.max(8, Math.floor(wrapRect.height / cell.ch));

      let cols = colsByWidth;
      let rows = rowsByWidth;

      if (rows > rowsLimit) {
        rows = rowsLimit;
        cols = Math.max(24, Math.round(rows * aspect * (cell.ch / cell.cw)));
      }

      canvas.width = cols;
      canvas.height = rows;
      ctx2d.clearRect(0, 0, cols, rows);
      ctx2d.imageSmoothingEnabled = true;
      ctx2d.drawImage(video, 0, 0, cols, rows);

      const { data } = ctx2d.getImageData(0, 0, cols, rows);
      let out = "";
      for (let y = 0; y < rows; y += 1) {
        let row = "";
        for (let x = 0; x < cols; x += 1) {
          const i = (y * cols + x) * 4;
          const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
          const idx = Math.min(ramp.length - 1, Math.max(0, Math.round(lum * (ramp.length - 1))));
          row += ramp[idx];
        }
        out += y === rows - 1 ? row : `${row}\n`;
      }
      pre.textContent = out;
      fitPre();
    };

    const onLoaded = () => {
      measureCell();
      watchVideo(video);
      safePlayVideo(video);
      draw();
      if (frameTimer) clearInterval(frameTimer);
      frameTimer = setInterval(draw, 1000 / 20);
    };

    const onResize = () => {
      measureCell();
      draw();
    };

    video.addEventListener("loadedmetadata", onLoaded);
    window.addEventListener("resize", onResize);

    if (video.readyState >= 1) {
      onLoaded();
    }

    galleryAsciiPreviewCleanups.push(() => {
      video.removeEventListener("loadedmetadata", onLoaded);
      window.removeEventListener("resize", onResize);
      if (frameTimer) clearInterval(frameTimer);
      video.dataset.allowPause = "true";
      video.pause();
    });
  });
}

function initAsciiVideoSurface(wrap, video, canvas, pre, options = {}) {
  const ctx2d = canvas.getContext("2d", { willReadFrequently: true });
  const ramp = options.ramp || " .:-=+*#%@";
  const fontSize = options.fontSize || 10;
  const lineHeight = options.lineHeight || fontSize;
  const fps = options.fps || 20;
  const cover = options.cover ?? false;
  const fit = options.fit ?? true;
  const cell = { cw: 6, ch: 10 };
  let frameTimer = null;

  const measureCell = () => {
    const probe = document.createElement("span");
    probe.textContent = "MMMMMMMMMM\nMMMMMMMMMM";
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.whiteSpace = "pre";
    probe.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
    probe.style.fontSize = `${fontSize}px`;
    probe.style.lineHeight = `${lineHeight}px`;
    wrap.appendChild(probe);
    const rect = probe.getBoundingClientRect();
    wrap.removeChild(probe);
    cell.cw = Math.max(4, rect.width / 10);
    cell.ch = Math.max(6, rect.height / 2);
  };

  const fitPre = () => {
    const preWidth = pre.scrollWidth || 1;
    const preHeight = pre.scrollHeight || 1;
    const wrapRect = wrap.getBoundingClientRect();
    if (!wrapRect.width || !wrapRect.height) return;
    if (!fit) {
      pre.style.transform = "";
      return;
    }
    const scaleFn = cover ? Math.max : Math.min;
    const scale = scaleFn(wrapRect.width / preWidth, wrapRect.height / preHeight) * (cover ? 1.01 : 0.998);
    pre.style.transform = `translate(-50%, -50%) scale(${scale})`;
  };

  const draw = () => {
    if (!video.videoWidth || !video.videoHeight) return;
    const wrapRect = wrap.getBoundingClientRect();
    if (!wrapRect.width || !wrapRect.height) return;

    const videoAspect = video.videoWidth / video.videoHeight;
    const targetAspect = wrapRect.width / wrapRect.height;
    const colsByWidth = Math.max(36, Math.floor(wrapRect.width / cell.cw));
    const rowsByWidth = Math.max(8, Math.round(colsByWidth / (videoAspect * (cell.ch / cell.cw))));
    const rowsLimit = Math.max(8, Math.floor(wrapRect.height / cell.ch));

    let cols = colsByWidth;
    let rows = rowsByWidth;
    let sx = 0;
    let sy = 0;
    let sw = video.videoWidth;
    let sh = video.videoHeight;

    if (cover) {
      rows = rowsLimit;
      cols = Math.max(36, Math.floor(wrapRect.width / cell.cw));

      if (videoAspect > targetAspect) {
        sw = Math.round(video.videoHeight * targetAspect);
        sx = Math.round((video.videoWidth - sw) / 2);
      } else {
        sh = Math.round(video.videoWidth / targetAspect);
        sy = Math.round((video.videoHeight - sh) / 2);
      }
    }

    if (!cover && rows > rowsLimit) {
      rows = rowsLimit;
      cols = Math.max(24, Math.round(rows * videoAspect * (cell.ch / cell.cw)));
    }

    canvas.width = cols;
    canvas.height = rows;
    ctx2d.clearRect(0, 0, cols, rows);
    ctx2d.imageSmoothingEnabled = true;
    ctx2d.drawImage(video, sx, sy, sw, sh, 0, 0, cols, rows);

    const { data } = ctx2d.getImageData(0, 0, cols, rows);
    let out = "";
    for (let y = 0; y < rows; y += 1) {
      let row = "";
      for (let x = 0; x < cols; x += 1) {
        const i = (y * cols + x) * 4;
        const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
        const idx = Math.min(ramp.length - 1, Math.max(0, Math.round(lum * (ramp.length - 1))));
        row += ramp[idx];
      }
      out += y === rows - 1 ? row : `${row}\n`;
    }
    pre.textContent = out;
    fitPre();
  };

  const onLoaded = () => {
    measureCell();
    watchVideo(video);
    safePlayVideo(video);
    draw();
    if (frameTimer) clearInterval(frameTimer);
    frameTimer = setInterval(draw, 1000 / fps);
  };

  const onResize = () => {
    measureCell();
    draw();
  };

  video.addEventListener("loadedmetadata", onLoaded);
  window.addEventListener("resize", onResize);

  if (video.readyState >= 1) {
    onLoaded();
  }

  return () => {
    video.removeEventListener("loadedmetadata", onLoaded);
    window.removeEventListener("resize", onResize);
    if (frameTimer) clearInterval(frameTimer);
    video.dataset.allowPause = "true";
    video.pause();
  };
}

function setupGalleryAdAscii() {
  const wrap = document.querySelector(".gallery-ad-ascii-layer");
  const video = document.querySelector(".gallery-ad-video");
  const canvas = document.querySelector(".gallery-ad-ascii-canvas");
  const pre = document.querySelector(".gallery-ad-ascii-preview");
  if (!wrap || !video || !canvas || !pre) return;

  initAsciiVideoSurface(wrap, video, canvas, pre, {
    fontSize: 16,
    lineHeight: 14.72,
    fps: 18,
    cover: true,
    fit: false,
    ramp: activeIntroAsciiPattern,
  });
}

function clearPostCarousel() {
  postCarouselCleanups.splice(0).forEach((cleanup) => {
    try { cleanup(); } catch {}
  });
  postCarouselViewport.innerHTML = "";
  postCarouselDots.innerHTML = "";
  postCarousel.hidden = true;
  postCarouselIndex = 0;
}

function updatePostCarousel(index) {
  const slides = postCarouselViewport.querySelectorAll(".post-carousel-slide");
  const dots = postCarouselDots.querySelectorAll(".post-carousel-dot");
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });
  postCarouselIndex = index;
}

function setupPostCarousel(post) {
  clearPostCarousel();
  const mediaItems = Array.isArray(post.mediaGallery) ? post.mediaGallery : [];
  if (!mediaItems.length) return false;

  postCarousel.hidden = false;

  mediaItems.forEach((item, index) => {
    const slide = document.createElement("div");
    slide.className = "post-carousel-slide";
    slide.setAttribute("aria-hidden", index === 0 ? "false" : "true");

    if (item.type === "ascii-video") {
      const wrap = document.createElement("div");
      wrap.className = "post-carousel-ascii";

      const video = document.createElement("video");
      video.className = "hidden-video";
      video.src = item.src;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute("crossorigin", "anonymous");

      const canvas = document.createElement("canvas");
      canvas.className = "hidden-video";

      const pre = document.createElement("pre");

      wrap.append(video, canvas, pre);
      slide.appendChild(wrap);
      postCarouselCleanups.push(
        initAsciiVideoSurface(wrap, video, canvas, pre, { fontSize: 12, lineHeight: 12, fps: 20, cover: false })
      );
    } else if (item.type === "video") {
      const video = document.createElement("video");
      video.className = "post-carousel-media";
      video.src = item.src;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = true;
      slide.appendChild(video);
      watchVideo(video);
      safePlayVideo(video);
      postCarouselCleanups.push(() => {
        video.dataset.allowPause = "true";
        video.pause();
      });
    } else {
      const image = document.createElement("img");
      image.className = "post-carousel-media";
      image.src = item.src;
      image.alt = item.alt || "";
      slide.appendChild(image);
    }

    postCarouselViewport.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "post-carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Media ${index + 1}`);
    dot.addEventListener("click", () => updatePostCarousel(index));
    postCarouselDots.appendChild(dot);
  });

  postCarouselPrev.hidden = mediaItems.length < 2;
  postCarouselNext.hidden = mediaItems.length < 2;

  updatePostCarousel(0);
  return true;
}

function getIntroAsciiMetrics(targetEl) {
  if (!targetEl) return null;

  const width = targetEl.clientWidth;
  const height = targetEl.clientHeight;

  if (
    introAsciiMetrics &&
    introAsciiMetrics.width === width &&
    introAsciiMetrics.height === height
  ) {
    return introAsciiMetrics;
  }

  const style = window.getComputedStyle(targetEl);
  const fontSize = Number.parseFloat(style.fontSize) || 16;
  const lineHeight = Number.parseFloat(style.lineHeight) || fontSize * 0.92;
  const columns = Math.max(22, Math.ceil(width / (fontSize * 0.56)));
  const rows = Math.max(12, Math.ceil(height / (lineHeight * 0.96)));

  introAsciiMetrics = {
    width,
    height,
    fontSize,
    lineHeight,
    columns,
    rows,
  };

  return introAsciiMetrics;
}

function getIntroSourceRect(video, targetAspect) {
  const sourceAspect = video.videoWidth / video.videoHeight;
  let sx = 0;
  let sy = 0;
  let sw = video.videoWidth;
  let sh = video.videoHeight;

  if (sourceAspect > targetAspect) {
    sw = Math.round(video.videoHeight * targetAspect);
    sx = Math.round((video.videoWidth - sw) / 2);
  } else {
    sh = Math.round(video.videoWidth / targetAspect);
    sy = Math.round((video.videoHeight - sh) / 2);
  }

  return { sx, sy, sw, sh };
}

function renderIntroAsciiFrame() {
  if (!introAsciiEl) return;

  const pattern = activeIntroAsciiPattern;
  const metrics = getIntroAsciiMetrics(introAsciiEl);
  if (!metrics) return;

  const { columns, rows, width, height } = metrics;
  const hasVideo = introVideoEl &&
    introCanvasEl &&
    introCanvasCtx &&
    introVideoBgEl &&
    introVideoBgCtx &&
    introVideoEl.videoWidth &&
    introVideoEl.videoHeight &&
    introVideoEl.readyState >= 2;

  let videoData = null;

  if (hasVideo) {
    const targetAspect = columns / rows;
    const { sx, sy, sw, sh } = getIntroSourceRect(introVideoEl, targetAspect);

    if (introCanvasEl.width !== columns || introCanvasEl.height !== rows) {
      introCanvasEl.width = columns;
      introCanvasEl.height = rows;
    }

    if (introVideoBgEl.width !== columns || introVideoBgEl.height !== rows) {
      introVideoBgEl.width = columns;
      introVideoBgEl.height = rows;
    }

    introCanvasCtx.drawImage(introVideoEl, sx, sy, sw, sh, 0, 0, columns, rows);
    videoData = introCanvasCtx.getImageData(0, 0, columns, rows).data;

    introVideoBgCtx.imageSmoothingEnabled = true;
    introVideoBgCtx.clearRect(0, 0, columns, rows);
    introVideoBgCtx.drawImage(introVideoEl, sx, sy, sw, sh, 0, 0, columns, rows);
  }

  const pointerGridX = introPointerSmoothX * Math.max(0, columns - 1);
  const pointerGridY = introPointerSmoothY * Math.max(0, rows - 1);

  function getPatternChar(sampleX, sampleY) {
    const waveA = Math.sin((sampleX * 0.65) + (introAsciiFrame * 0.08));
    const waveB = Math.cos((sampleY * 0.72) - (introAsciiFrame * 0.06));
    const waveC = Math.sin((sampleX + sampleY) * 0.3 + introAsciiFrame * 0.04);
    const mix = (waveA + waveB + waveC + 3) / 6;
    const index = Math.max(0, Math.min(pattern.length - 1, Math.floor(mix * pattern.length)));
    return pattern[index];
  }

  function getVideoChar(sampleX, sampleY) {
    if (!videoData) return null;
    const clampedX = Math.max(0, Math.min(columns - 1, sampleX));
    const clampedY = Math.max(0, Math.min(rows - 1, sampleY));
    const offset = (clampedY * columns + clampedX) * 4;
    const r = videoData[offset];
    const g = videoData[offset + 1];
    const b = videoData[offset + 2];
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const index = Math.max(0, Math.min(pattern.length - 1, Math.floor(Math.pow(luminance, 0.9) * pattern.length)));
    return pattern[index];
  }

  let output = "";

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      let nextChar = getVideoChar(x, y) ?? getPatternChar(x, y);

      if (introPointerActive) {
        const dx = x - pointerGridX;
        const dy = y - pointerGridY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < cursorRadius) {
          const force = 1 - distance / cursorRadius;
          const easedForce = force * force * (3 - 2 * force);
          const angle = Math.atan2(dy, dx);
          const swirl = angle + Math.sin(introAsciiFrame * 0.045 + x * 0.09 + y * 0.05) * 1.2;
          const noiseX = Math.sin((x + introAsciiFrame * 0.8) * cursorNoiseScale + y * 0.07);
          const noiseY = Math.cos((y - introAsciiFrame * 0.6) * cursorNoiseScale + x * 0.06);
          const flowX = Math.cos(swirl) * easedForce * cursorFlowStrength + noiseX * easedForce * 1.4;
          const flowY = Math.sin(swirl) * easedForce * cursorFlowStrength + noiseY * easedForce * 1.2;
          const shiftedX = Math.max(0, Math.min(columns - 1, Math.round(x + flowX)));
          const shiftedY = Math.max(0, Math.min(rows - 1, Math.round(y + flowY)));
          const scatteredChar = getVideoChar(shiftedX, shiftedY) ?? getPatternChar(shiftedX, shiftedY);
          const scatteredIndex = Math.max(0, pattern.indexOf(scatteredChar));

          if (easedForce > 0.82) {
            nextChar = scatteredIndex <= 1 ? " " : pattern[Math.max(0, scatteredIndex - 1)];
          } else if (easedForce > 0.48) {
            nextChar = scatteredIndex <= 0 ? " " : scatteredChar;
          } else {
            nextChar = scatteredChar;
          }
        }
      }

      output += nextChar;
    }
    output += "\n";
  }

  introAsciiEl.textContent = output;
  introVideoBgEl.style.width = `${width}px`;
  introVideoBgEl.style.height = `${height}px`;
}

function animateIntroAscii(timestamp) {
  const frameInterval = introPointerActive ? 34 : 50;

  if (timestamp - introAsciiLastTime > frameInterval) {
    introAsciiFrame += 1;
    introAsciiLastTime = timestamp;
    if (introPointerActive) {
      introPointerSmoothX += (introPointerX - introPointerSmoothX) * 0.18;
      introPointerSmoothY += (introPointerY - introPointerSmoothY) * 0.18;
    } else {
      introPointerSmoothX += (0.5 - introPointerSmoothX) * 0.06;
      introPointerSmoothY += (0.5 - introPointerSmoothY) * 0.06;
    }

    renderIntroAsciiFrame();
  }

  window.requestAnimationFrame(animateIntroAscii);
}

function animateMusicProgress() {
  if (musicIsPlaying && !isSeekingMusic) {
    updateMusicPlayerUi();
  }

  window.requestAnimationFrame(animateMusicProgress);
}

function revealUiIfReady() {
  if (uiReady || !backgroundReady || !firstFrameReady) return;
  uiReady = true;
  siteShell.classList.add("is-ready");
  loadingScreen.classList.add("is-hidden");
}

function openPost(index) {
  const post = galleryPosts[index];
  if (!post) return;

  postPanel.classList.remove("is-game");
  postGameWrap.hidden = true;
  postGameFrame.removeAttribute("src");
  clearPostCarousel();

  if (setupPostCarousel(post)) {
    postBanner.hidden = true;
    postBannerVideo.dataset.allowPause = "true";
    postBannerVideo.pause();
    postBannerVideo.hidden = true;
    postBannerVideo.removeAttribute("src");
  } else if (post.mediaType === "video") {
    postBanner.hidden = true;
    postBannerVideo.hidden = false;
    postBannerVideo.src = post.image;
    postBannerVideo.setAttribute("aria-label", post.alt);
    delete postBannerVideo.dataset.allowPause;
    watchVideo(postBannerVideo);
    safePlayVideo(postBannerVideo);
  } else if (post.mediaType === "game" && !post.embedDisabled) {
    postPanel.classList.add("is-game");
    postBanner.hidden = true;
    postBannerVideo.dataset.allowPause = "true";
    postBannerVideo.pause();
    postBannerVideo.hidden = true;
    postBannerVideo.removeAttribute("src");
    postGameWrap.hidden = false;
    activeGameFrameWidth = post.gameWidth || GAME_FRAME_WIDTH;
    activeGameFrameHeight = post.gameHeight || GAME_FRAME_HEIGHT;
    activeGameWrapWidth = post.wrapWidth || activeGameFrameWidth;
    activeGameWrapHeight = post.wrapHeight || activeGameFrameHeight;
    postGameWrap.style.aspectRatio = `${activeGameWrapWidth} / ${activeGameWrapHeight}`;
    postGameFrame.style.width = `${activeGameFrameWidth}px`;
    postGameFrame.style.height = `${activeGameFrameHeight}px`;
    postGameFrame.src = post.gameUrl;
    updateGameFrameScale();
    requestAnimationFrame(updateGameFrameScale);
  } else if (post.mediaType === "game") {
    postBannerVideo.dataset.allowPause = "true";
    postBannerVideo.pause();
    postBannerVideo.hidden = true;
    postBannerVideo.removeAttribute("src");
    postBanner.hidden = false;
    postBanner.src = post.image;
    postBanner.alt = post.alt;
  } else {
    postBannerVideo.dataset.allowPause = "true";
    postBannerVideo.pause();
    postBannerVideo.hidden = true;
    postBannerVideo.removeAttribute("src");
    postBanner.hidden = false;
    postBanner.src = post.image;
    postBanner.alt = post.alt;
  }

  postMeta.textContent = `${post.category} / ${post.year}`;
  postTitle.textContent = post.title;
  postContent.innerHTML = post.body.map((paragraph) => `<p>${paragraph}</p>`).join("");
  postActions.innerHTML = post.externalUrl
    ? `<a class="post-action-link" href="${post.externalUrl}" target="_blank" rel="noreferrer">${post.actionLabel || "visit"}</a>`
    : "";
  postOverlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function updateGameFrameScale() {
  if (postGameWrap.hidden) return;

  const wrapRect = postGameWrap.getBoundingClientRect();
  if (!wrapRect.width || !wrapRect.height) return;

  const scale = Math.min(
    wrapRect.width / activeGameFrameWidth,
    wrapRect.height / activeGameFrameHeight
  );

  postGameWrap.style.setProperty("--game-scale", String(scale));
}

function closePost() {
  postPanel.classList.remove("is-game");
  postBannerVideo.dataset.allowPause = "true";
  postBannerVideo.pause();
  postBannerVideo.removeAttribute("src");
  clearPostCarousel();
  postGameFrame.removeAttribute("src");
  postGameWrap.hidden = true;
  postGameWrap.style.removeProperty("--game-scale");
  postGameWrap.style.removeProperty("aspect-ratio");
  postGameFrame.style.removeProperty("width");
  postGameFrame.style.removeProperty("height");
  activeGameFrameWidth = GAME_FRAME_WIDTH;
  activeGameFrameHeight = GAME_FRAME_HEIGHT;
  activeGameWrapWidth = GAME_FRAME_WIDTH;
  activeGameWrapHeight = GAME_FRAME_HEIGHT;
  postActions.innerHTML = "";
  postOverlay.hidden = true;
  document.body.style.overflow = "";
}

window.addEventListener("resize", updateGameFrameScale);

postCarouselPrev.addEventListener("click", () => {
  const total = postCarouselViewport.querySelectorAll(".post-carousel-slide").length;
  if (!total) return;
  updatePostCarousel((postCarouselIndex - 1 + total) % total);
});

postCarouselNext.addEventListener("click", () => {
  const total = postCarouselViewport.querySelectorAll(".post-carousel-slide").length;
  if (!total) return;
  updatePostCarousel((postCarouselIndex + 1) % total);
});

function getColumns() {
  if (window.innerWidth < 380) return Math.round(42 * renderScale);
  if (window.innerWidth < 540) return Math.round(54 * 1.18 * renderScale);
  if (window.innerWidth < 860) return Math.round(72 * 1.12 * renderScale);
  return Math.round(96 * renderScale);
}

function updateMeta() {
  return;
}

function resizeCanvas() {
  if (!sourceVideo.videoWidth || !sourceVideo.videoHeight) return;

  const columns = getColumns();
  const aspectRatio = sourceVideo.videoHeight / sourceVideo.videoWidth;
  const rows = Math.max(24, Math.round(columns * aspectRatio * 0.58));

  frameCanvas.width = columns;
  frameCanvas.height = rows;
  displayCanvas.width = columns;
  displayCanvas.height = rows;
  displayFrameBuffer = displayCtx.createImageData(columns, rows);
}

function getAsciiChar(r, g, b) {
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const boosted = Math.min(1, Math.pow(1 - luminance, 0.92) * 1.08);

  if (boosted < 0.22) {
    return " ";
  }

  const index = Math.min(charset.length - 1, Math.floor(boosted * (charset.length - 1)));
  return charset[Math.max(1, index)];
}

function getPixelStrength(r, g, b) {
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return Math.min(1, Math.pow(1 - luminance, 0.92) * 1.08);
}

function frameToAscii() {
  if (!sourceVideo.videoWidth || !sourceVideo.videoHeight) return;
  frameTick += 1;

  if (pointerActive) {
    smoothPointerX += (pointerX - smoothPointerX) * cursorFadeSpeed;
    smoothPointerY += (pointerY - smoothPointerY) * cursorFadeSpeed;
  }

  const cropLeft = Math.floor(sourceVideo.videoWidth * leftCropRatio);
  const cropTop = Math.floor(sourceVideo.videoHeight * topCropRatio);
  const cropRight = Math.floor(sourceVideo.videoWidth * rightCropRatio);
  const cropBottom = Math.floor(sourceVideo.videoHeight * bottomCropRatio);
  const cropWidth = sourceVideo.videoWidth - cropLeft - cropRight;
  const cropHeight = sourceVideo.videoHeight - cropTop - cropBottom;

  ctx.drawImage(
    sourceVideo,
    cropLeft,
    cropTop,
    cropWidth,
    cropHeight,
    0,
    0,
    frameCanvas.width,
    frameCanvas.height
  );
  const { data, width, height } = ctx.getImageData(0, 0, frameCanvas.width, frameCanvas.height);
  const displayData = displayFrameBuffer.data;
  let ascii = "";

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      const strength = getPixelStrength(r, g, b);

      displayData[offset] = r;
      displayData[offset + 1] = g;
      displayData[offset + 2] = b;
      displayData[offset + 3] = strength < 0.12
        ? 0
        : Math.min(255, Math.round((strength - 0.12) / 0.88 * 255));

      let nextChar = getAsciiChar(r, g, b);

      if (pointerActive) {
        const dx = x - smoothPointerX;
        const dy = y - smoothPointerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < cursorRadius) {
          const force = 1 - distance / cursorRadius;
          const easedForce = force * force * (3 - 2 * force);
          const angle = Math.atan2(dy, dx);
          const swirl = angle + Math.sin(frameTick * 0.045 + x * 0.09 + y * 0.05) * 1.2;
          const noiseX = Math.sin((x + frameTick * 0.8) * cursorNoiseScale + y * 0.07);
          const noiseY = Math.cos((y - frameTick * 0.6) * cursorNoiseScale + x * 0.06);
          const flowX = Math.cos(swirl) * easedForce * cursorFlowStrength + noiseX * easedForce * 1.4;
          const flowY = Math.sin(swirl) * easedForce * cursorFlowStrength + noiseY * easedForce * 1.2;
          const shiftedX = Math.max(0, Math.min(width - 1, Math.round(x + flowX)));
          const shiftedY = Math.max(0, Math.min(height - 1, Math.round(y + flowY)));
          const shiftedOffset = (shiftedY * width + shiftedX) * 4;
          const sr = data[shiftedOffset];
          const sg = data[shiftedOffset + 1];
          const sb = data[shiftedOffset + 2];
          const scatteredChar = getAsciiChar(sr, sg, sb);
          const scatteredLuminance = (0.2126 * sr + 0.7152 * sg + 0.0722 * sb) / 255;
          const scatteredBoosted = Math.min(1, Math.pow(1 - scatteredLuminance, 0.92) * 1.08);
          const scatteredIndex = Math.min(charset.length - 1, Math.floor(scatteredBoosted * (charset.length - 1)));

          if (easedForce > 0.82) {
            nextChar = scatteredBoosted < 0.3 ? " " : charset[Math.max(1, scatteredIndex - 1)];
          } else if (easedForce > 0.48) {
            nextChar = scatteredBoosted < 0.24 ? " " : scatteredChar;
          } else {
            nextChar = scatteredChar;
          }
        }
      }

      ascii += nextChar;
    }
    ascii += "\n";
  }

  displayCtx.putImageData(displayFrameBuffer, 0, 0);
  asciiOutput.textContent = ascii;
}

function renderLoop() {
  if (!isRendering) return;

  if (sourceVideo.readyState >= 2) {
    if (sourceVideo.paused || sourceVideo.ended) {
      safePlayVideo(sourceVideo);
    }

    resizeCanvas();
    frameToAscii();
  }

  animationHandle = window.requestAnimationFrame(renderLoop);
}

function startRendering() {
  if (isRendering) return;
  isRendering = true;
  renderLoop();
}

function stopRendering() {
  isRendering = false;
  if (animationHandle) {
    window.cancelAnimationFrame(animationHandle);
    animationHandle = null;
  }
}

sourceVideo.addEventListener("loadedmetadata", () => {
  resizeCanvas();
  updateMeta();
});

sourceVideo.addEventListener("loadeddata", () => {
  hasLoadedFrame = true;
  resizeCanvas();
  updateMeta();
  frameToAscii();
  startRendering();
  firstFrameReady = true;
  revealUiIfReady();
});

sourceVideo.addEventListener("canplay", () => {
  if (!hasLoadedFrame) {
    resizeCanvas();
    updateMeta();
    frameToAscii();
    hasLoadedFrame = true;
    startRendering();
    firstFrameReady = true;
    revealUiIfReady();
  }
});

sourceVideo.addEventListener("play", () => {
  startRendering();
});
sourceVideo.addEventListener("pause", () => {
  if (sourceVideo.dataset.allowPause) {
    stopRendering();
    return;
  }

  safePlayVideo(sourceVideo);
  startRendering();
});
sourceVideo.addEventListener("ended", () => {
  if (sourceVideo.loop) {
    sourceVideo.currentTime = 0;
    safePlayVideo(sourceVideo);
    startRendering();
    return;
  }
  stopRendering();
});

sourceVideo.addEventListener("error", () => {
  asciiOutput.textContent = "Video yuklenemedi.\n\nMuhtemel nedenler:\n- tarayici codec desteklemiyor\n- file:// acilisinda medya bloklaniyor\n- dosya bozuk ya da okunamiyor";
});

window.addEventListener("resize", () => {
  introAsciiMetrics = null;
  resizeCanvas();
  if (hasLoadedFrame) {
    frameToAscii();
  }
  updateGalleryVisibility();
});

asciiOutput.addEventListener("mousemove", (event) => {
  const rect = asciiOutput.getBoundingClientRect();
  const relativeX = (event.clientX - rect.left) / rect.width;
  const relativeY = (event.clientY - rect.top) / rect.height;

  pointerX = Math.max(0, Math.min(frameCanvas.width - 1, Math.round(relativeX * frameCanvas.width)));
  pointerY = Math.max(0, Math.min(frameCanvas.height - 1, Math.round(relativeY * frameCanvas.height)));

  if (!pointerActive) {
    smoothPointerX = pointerX;
    smoothPointerY = pointerY;
  }

  pointerActive = true;
});

asciiOutput.addEventListener("mouseleave", () => {
  pointerActive = false;
});

galleryGrid.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-post-index]");
  if (!trigger) return;
  openPost(Number(trigger.dataset.postIndex));
});

postClose.addEventListener("click", closePost);
postBackdrop.addEventListener("click", closePost);
if (wishlistClose) {
  wishlistClose.addEventListener("click", closeWishlistModal);
}
if (wishlistBackdrop) {
  wishlistBackdrop.addEventListener("click", closeWishlistModal);
}
if (wishlistFab) {
  wishlistFab.addEventListener("click", () => openWishlistModal());
}
if (musicPlayerClose) {
  musicPlayerClose.addEventListener("click", closeMusicPlayerModal);
}
if (musicPlayerPanel) {
  musicPlayerPanel.addEventListener("pointerdown", (event) => event.stopPropagation());
  musicPlayerPanel.addEventListener("click", (event) => event.stopPropagation());
}
if (musicPrev) {
  musicPrev.addEventListener("click", () => {
    updateSelectedTrack(activeMusicTrackIndex - 1);
  });
}
if (musicNext) {
  musicNext.addEventListener("click", () => {
    updateSelectedTrack(activeMusicTrackIndex + 1);
  });
}
if (musicPlayToggle) {
  musicPlayToggle.addEventListener("click", () => setMusicPlayerState(!musicIsPlaying));
}
if (musicTrackToggle && musicTrackList) {
  musicTrackToggle.addEventListener("click", () => {
    const nextIsOpen = musicTrackList.hidden;
    musicTrackList.hidden = !nextIsOpen;
    musicTrackToggle.setAttribute("aria-expanded", String(nextIsOpen));
    const toggleIcon = musicTrackToggle.querySelector("[aria-hidden='true']");
    if (toggleIcon) toggleIcon.textContent = nextIsOpen ? "-" : "+";
  });
}
if (musicTrackList) {
  musicTrackList.addEventListener("click", (event) => {
    const trackItem = event.target.closest(".music-track-item");
    if (!trackItem) return;
    updateSelectedTrack(Number(trackItem.dataset.trackIndex));
  });
}
if (musicProgressBar) {
  musicProgressBar.addEventListener("pointerdown", (event) => {
    isSeekingMusic = true;
    musicProgressBar.setPointerCapture(event.pointerId);
    seekMusicToRatio(getPointerRatio(event, musicProgressBar));
  });
  musicProgressBar.addEventListener("pointermove", (event) => {
    if (!isSeekingMusic) return;
    seekMusicToRatio(getPointerRatio(event, musicProgressBar));
  });
  musicProgressBar.addEventListener("pointerup", (event) => {
    isSeekingMusic = false;
    if (musicProgressBar.hasPointerCapture(event.pointerId)) {
      musicProgressBar.releasePointerCapture(event.pointerId);
    }
  });
  musicProgressBar.addEventListener("pointercancel", (event) => {
    isSeekingMusic = false;
    if (musicProgressBar.hasPointerCapture(event.pointerId)) {
      musicProgressBar.releasePointerCapture(event.pointerId);
    }
  });
  musicProgressBar.addEventListener("keydown", (event) => {
    const duration = getActiveTrackDuration();
    if (!duration) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      musicAudio.currentTime = Math.max(0, musicAudio.currentTime - 5);
      updateMusicPlayerUi();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      musicAudio.currentTime = Math.min(duration, musicAudio.currentTime + 5);
      updateMusicPlayerUi();
    }
  });
}
if (musicVolumeBar) {
  musicVolumeBar.addEventListener("pointerdown", (event) => {
    isChangingVolume = true;
    musicVolumeBar.setPointerCapture(event.pointerId);
    setVolumeToRatio(getPointerRatio(event, musicVolumeBar));
  });
  musicVolumeBar.addEventListener("pointermove", (event) => {
    if (!isChangingVolume) return;
    setVolumeToRatio(getPointerRatio(event, musicVolumeBar));
  });
  musicVolumeBar.addEventListener("pointerup", (event) => {
    isChangingVolume = false;
    if (musicVolumeBar.hasPointerCapture(event.pointerId)) {
      musicVolumeBar.releasePointerCapture(event.pointerId);
    }
  });
  musicVolumeBar.addEventListener("pointercancel", (event) => {
    isChangingVolume = false;
    if (musicVolumeBar.hasPointerCapture(event.pointerId)) {
      musicVolumeBar.releasePointerCapture(event.pointerId);
    }
  });
  musicVolumeBar.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setVolumeToRatio(musicVolume - 0.05);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setVolumeToRatio(musicVolume + 0.05);
    }
  });
}
musicAudio.addEventListener("loadedmetadata", updateMusicPlayerUi);
musicAudio.addEventListener("timeupdate", updateMusicPlayerUi);
musicAudio.addEventListener("ended", () => updateSelectedTrack(activeMusicTrackIndex + 1, true));
musicAudio.addEventListener("pause", () => {
  if (!musicAudio.ended) setMusicPlayerState(false);
});
musicAudio.addEventListener("play", () => {
  musicIsPlaying = true;
  if (musicPlayToggle) musicPlayToggle.textContent = "||";
});
setMusicPlayerState(false);
musicAudio.volume = musicVolume;
loadActiveTrack();
updateVolumeUi();
updateMusicPlayerUi();

if (scrollCue) {
  scrollCue.addEventListener("click", () => {
    const galleryTop = galleryGrid.getBoundingClientRect().top + window.scrollY;
    const revealPoint = Math.max(0, galleryTop - 96);
    window.scrollTo({ top: revealPoint, behavior: "smooth" });
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && wishlistModal && !wishlistModal.hidden) {
    closeWishlistModal();
    return;
  }

  if (event.key === "Escape" && musicPlayerPanel && !musicPlayerPanel.hidden) {
    closeMusicPlayerModal();
    return;
  }

  if (event.key === "Escape" && !postOverlay.hidden) {
    closePost();
  }
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    ensureHeroRendering();
    ensureAllVideosPlaying();
  }
});

renderGallery();
initSpeakerModel();
window.requestAnimationFrame(initWishlistModal);
setupGalleryAdAscii();
ensureAllVideosPlaying();
window.requestAnimationFrame(animateIntroAscii);
window.requestAnimationFrame(animateMusicProgress);
updateGalleryVisibility();
window.addEventListener("scroll", updateGalleryVisibility, { passive: true });
window.setInterval(ensureHeroRendering, 700);
window.setInterval(ensureAllVideosPlaying, 1400);
const bgImage = new Image();
bgImage.onload = () => {
  backgroundReady = true;
  revealUiIfReady();
};
bgImage.onerror = () => {
  backgroundReady = true;
  revealUiIfReady();
};
bgImage.src = "https://res.cloudinary.com/ddvaepjce/image/upload/v1776680183/Gemini_Generated_Image_y68dxay68dxay68d_o18s0q.png";
sourceVideo.load();
watchVideo(sourceVideo);
safePlayVideo(sourceVideo);
