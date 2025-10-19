let startImg;
let prologueImg;
let img1;   // carousel scene
let img2;   // ring toss scene
let img3;   // ring for mouse
let img4; // bloody carousel scene
let img5; // map for game 
let img6;   // funhouse scene 
let img7;   // sewer scene 
let hintsIcon; // hints icon
let infoIcon; // info icon
let aboutBlurb; // aether about blurb
let funhouseKey;
let keyX = 315; 
let keyY = 440;
let keyW = 200;
let keyH = 200;
let playImg; // play button
let continueImg; // continue button
let proceedImg; // proceed to mission button
let mapIcon; // map icon for navigation
let transitioningToMap = false;
let scene = "start"; // keeps track of which screen to show
let playButton;
let currentAudio = null;
let exitSewerButton;
let homepageFont;
let buttonFont;
let stuffedbunnyWon;
let bunnyCollected = false;
let gasMask;
let memories;
let showBunnyOverlay = false;
let bunnyOverlayStartTime = 0;
let showMemorySequence = false;
let memorySequenceStartTime = 0;
let memorySequenceDuration = 90000; // 4 seconds
let ringtossMemory;
let ringtossMemoryEnded = false;
let ringtossMemoryWasStoppedEarly = false;
let showRingTossInstruction = false; 
let memoryExitButton; // exit button for memory scene
let memoryMusicStarted = false; // track if memory music has started
let messages1 = [
  "Agent ***,",
  "As a loyal subject to the Federal Bureau of Investigation,",
  "a member of the PNRC (Post-Nuclear Regulatory Commission),",
  "and a citizen of the New Republic, you are tasked with",
  "investigating the amusement park formerly known as Dreamland City",
  "code name OPERATION 399. This task is, as you well know, part of a",
  "larger mission by the bureau to investigate decommissioned nuclear",
  "power stations and their surrounding areas within aprox. <1 km",
  "so as to ensure the validity of their inoperability and the neutrality",
  "of their threat. It is the Commission's belief, being of sound body and",
  "mind, that such investigations will lead to the betterment of",
  "our post-nuclear society, and a better understanding of how our world,", 
  "as it stands, came to be. Good luck, soldier, and godspeed.",
  " -- Lieutenant Grenger"
];

let messages2 = [
  "hello there, weary traveler",
  "I know not why you are here.",
  "whether soldier, gypsy, or pirate", 
  "I do not care, for such titles, anyway...",
  "they are trivial, in the end.", 
  "but I know you must be looking, for something, or someone...",
  "this place, is not as it seems.", 
  "Take care in your journey..", 
  "this place is full of rich stories to uncover",
  "but you must first prove you are worthy of hearing them."
];

let typingActive11 = false;
let currentMsg = 0;
let displayText = "";
let charIndex = 0;
let lastUpdate = 0;
let typingSpeed = 100;
let exitButton;
let proceedButton;
let inventory; // inventory icon ilet sewerMusicStarted = false;emage
let homepageSound;
let carnivalSound;
let actionclickSound;
let funhouseMemory; // use funhouseMemory for playback
let sewerSound;
let sewerMusicStarted = false;
let canvas;
let showBloodyScene = false; // Track whether to show bloody image
let currentMusic = null;

// Radioactive rain particles system
let particles = [];
let maxParticles = 80;

// Map click areas - you'll need to adjust these coordinates based on your map.png
let mapClickAreas = [
  {
    name: "carousel",
    minX: 266,
    maxX: 420,
    minY: 213,
    maxY: 327, // adjust these coordinates for "ride the carousel" text
    scene: "scene1.1"
  },
  { 
    name: "ringtoss", 
    minX: 274, 
    maxX: 413, 
    minY: 74, 
    maxY: 188, // adjust these coordinates for "play ringtoss" text
    scene: "scene2.0"
  },
  {
    name: "funhouse",
    minX: 52,
    maxX: 202,
    minY: 52,
    maxY: 190,
    scene: "funhouse"
  }, 
  { 
   name: "sewers",
   minX: 2, 
   maxX: 445, 
   minY: 408, 
   maxY: 495,
   scene: "sewers"
  }
];

// Firefly system
let fireflies = [];
let maxFireflies = 6;

let hooks = [
  {x: 176, y: 186, r: 30}, 
  {x: 280, y: 186, r: 30},
  {x: 123, y: 277, r: 30},
  {x: 227, y: 275, r: 30},
  {x: 330, y: 277, r: 30},
  {x: 174, y: 365, r: 30},
  {x: 281, y: 366, r: 30},
  {x: 126, y: 456, r: 30},
  {x: 230, y: 456, r: 30},
  {x: 338, y: 458, r: 30},
];

// track ring state
let ringAttached = false;
let attachedHook = null;
let ringWon = false; // tracks if player has won the ring toss game
let transitioningToRingToss = false; // prevents immediate attachment

// --- Inventory & Bunny drag state (NEW) ---
let invX, invY, invSize; // inventory box at top (not overlapping icons)
let bunnyAvailable = false; // becomes true after messages shown
let bunnyInInventory = false;
let inventoryItems = []; // list of strings / items placed in inventory
let inventoryWindow = false; // shows full-screen inventory window
let inventoryExitButton; // exit button for inventory window
let bunnyX, bunnyY; // bunny position variables

// --- NEW: hints UI ---
let hintsButton;       // HTML button positioned over the drawn hintsIcon
let hintsWindow = false; // whether the hints overlay is visible

// --- NEW: advance hint for scene1.1 ---
let showAdvanceHint11 = false; // controls "[press space bar or click mouse to continue]" inside the scene1.1 bubble

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function preload() {
  homepageFont = loadFont("assets/homepagefont.ttf"); 
  startImg = loadImage("assets/aether.png"); 
  prologueImg = loadImage("assets/prologue.png"); 
  img1 = loadImage("assets/scene1.1.png");
  img2 = loadImage("assets/scene2.0.png");
  img3 = loadImage("assets/ringtoss.png");
  img4 = loadImage("assets/scene1.1bloody.png");
  img5 = loadImage("assets/map.png");
  img6 = loadImage("assets/funhouse.png");
  img7 = loadImage("assets/sewers.png");
  hintsIcon = loadImage("assets/hints.png");
  infoIcon = loadImage("assets/info.png");
  aboutBlurb = loadImage("assets/aetherblurb.png");
  memories = loadImage("assets/memorygirl.png");
  gasMask = loadImage("assets/gasmask.png");
  stuffedbunnyWon = loadImage("assets/stuffedbunnywon.png");
   
  playImg = loadImage("assets/playbutton.png");
  continueImg = loadImage("assets/continuebutton.png");
  proceedImg = loadImage("assets/proceedbutton.png");
  funhouseKey = loadImage("assets/funhousekey.png");
  inventory = loadImage("assets/inventory.svg"); 
  // You can use the same image for map icon or create a smaller version
  mapIcon = loadImage("assets/map.png"); // or create a separate map icon image
  
  // Load sounds with error handling
  homepageSound = loadSound("assets/homepagemusic.wav", 
    () => console.log("Homepage sound loaded successfully"),
    () => console.log("Error loading homepage sound")
  );
  carnivalSound = loadSound("assets/fair.mp3",
    () => console.log("Carnival sound loaded successfully"),
    () => console.log("Error loading carnival sound")
  );
  ringtossMemory = loadSound("assets/ringtossmemory.mp3",
    () => console.log("Ring toss sound loaded successfully"),
    () => console.log("Error loading ring toss sound")
  );
  actionclickSound = loadSound("assets/actionclick.wav",
    () => console.log("Action click sound loaded successfully"),
    () => console.log("Error loading action click sound")
  );
  sewerSound = loadSound("assets/memory2.mp3",
    () => console.log("Sewer sound loaded successfully"),
    () => console.log("Error loading sewer sound")
  );
  funhouseMemory = loadSound("assets/memory3.mp3",
    () => console.log("Funhouse memory sound loaded successfully"),
    () => console.log("Error loading funhouse memory")
  );                         
}

// Function to stop all music
function stopAllMusic() {
  if (homepageSound && homepageSound.isPlaying()) homepageSound.stop();
  if (carnivalSound && carnivalSound.isPlaying()) carnivalSound.stop();
  if (ringtossMemory && ringtossMemory.isPlaying()) ringtossMemory.stop();
  if (sewerSound && sewerSound.isPlaying()) sewerSound.stop();
  if (funhouseMemory && funhouseMemory.isPlaying()) funhouseMemory.stop();
  currentMusic = null;
}

// Function to play specific music for a scene
function playSceneMusic(sceneName) {
  // Don't restart the same music
  if (currentMusic === sceneName) return;
  
  stopAllMusic();
  
  switch(sceneName) {
    case "start":
    case "prologue":
      if (homepageSound && homepageSound.isLoaded()) {
        homepageSound.loop();
        currentMusic = sceneName;
      }
      break;
    case "scene1.1":
      if (carnivalSound && carnivalSound.isLoaded()) {
        carnivalSound.loop();
        currentMusic = sceneName;
      }
      break;
    case "scene2.0":
      if (ringtossMemory && ringtossMemory.isLoaded()) {
        ringtossMemory.loop();
        currentMusic = sceneName;
      }
      break;
    case "memory":
      if (ringtossMemory && ringtossMemory.isLoaded()) {
        ringtossMemory.play();
        currentMusic = sceneName;
      }
      break;
    case "funhouse":
      // Only start funhouse audio if the player already has collected the key
      if (inventoryItems.includes("funhouse key")) {
        if (funhouseMemory && funhouseMemory.isLoaded()) {
          funhouseMemory.loop();
          currentMusic = sceneName;
        }
      } else {
        // do not auto-play funhouse audio if the key is not collected
        currentMusic = null;
      }
      break;
    case "map":
      break;
    case "sewers":
        // Only allow music control if gas mask has been collected
        if (inventoryItems.includes("gas mask") && sewerSound && sewerSound.isLoaded()) {
          sewerSound.loop();
          currentMusic = sceneName;
        }
        break;
  }
}

function setup() {
  let w, h;
  if (isMobile()) {
    w = windowWidth;
    h = windowHeight;
  } else {
    w = 450;
    h = 500;
  }
  canvas = createCanvas(w, h);
  canvas.parent('sketch');  
  imageMode(CORNER);
  
  fill("white");
  textFont(homepageFont);
  textSize(36);  
  text('aether', 10, 50);
   
  playButton = createButton("play");
  playButton.style("color", "white");
  playButton.style("background-color", "transparent");
  playButton.style("border", "2px solid white");
  playButton.style("border-radius", "5px");
  playButton.size(60, 30);
  centerButtonOnCanvas(playButton, 40);
  playButton.mousePressed(() => {
    playActionClick(); // Play click sound
    scene = "prologue";   
    playButton.hide(); 
    currentMsg = 0;
    displayText = "";
    charIndex = 0;
    lastUpdate = millis();
  });

  exitButton = createButton("exit the carousel");
  exitButton.style("color", "white");
  exitButton.style("background-color", "transparent");
  exitButton.style("border", "2px solid white");
  exitButton.style("border-radius", "5px");
  exitButton.size(190, 30);
  centerButtonOnCanvas(exitButton, 125);
  exitButton.hide(); 
  exitButton.mousePressed(() => {
    playActionClick(); // Play click sound
    // reset ring state when entering ring-toss scene
    ringAttached = false;
    attachedHook = null;
    transitioningToRingToss = true; // set flag to prevent immediate attachment
    scene = "map";  // Changed to go back to map instead of scene2.0
    exitButton.hide();
    // Reset bloody scene flag when leaving
    showBloodyScene = false;
    // clear the transition flag after a short delay
    setTimeout(() => {
      transitioningToRingToss = false;
    }, 100);
  });

  proceedButton = createButton("proceed to mission");
  proceedButton.style("color", "white");
  proceedButton.style("background-color", "transparent");
  proceedButton.style("border", "2px solid white");
  proceedButton.style("border-radius", "5px");
  proceedButton.size(140, 50);
  centerButtonOnCanvas(proceedButton, 90);
  proceedButton.hide(); 
  proceedButton.mousePressed(() => {
    playActionClick(); // Play click sound
    scene = "map";  // Changed to go to map instead of scene1.1
    proceedButton.hide();
    currentMsg = 0;
    displayText = "";
    charIndex = 0;
    lastUpdate = millis();
    typingActive11 = false;
    // Reset bloody scene flag when entering map
    showBloodyScene = false;

    transitioningToMap = true;
    setTimeout(() => {
      transitioningToMap = false;
    }, 300); // 300ms should be enough
  });

  memoryExitButton = createButton("exit memory");
  memoryExitButton.style("color", "white");
  memoryExitButton.style("background-color", "transparent");
  memoryExitButton.style("border", "2px solid white");
  memoryExitButton.style("border-radius", "5px");
  memoryExitButton.size(140, 30);
  centerButtonOnCanvas(memoryExitButton, 40);
  memoryExitButton.hide(); 
  memoryExitButton.mousePressed(() => {
    playActionClick(); // Play click sound
    transitioningToMap = true;
    scene = "map";
    memoryExitButton.hide();
    showMemorySequence = false;
    memoryMusicStarted = false;
    // Stop memory music and play map music (which stops all music)
    if (ringtossMemory && ringtossMemory.isPlaying()) {
      ringtossMemory.stop();
    }
    playSceneMusic("map");
    setTimeout(() => { 
      transitioningToMap = false;
    }, 300);
  });
  exitSewerButton = createButton("exit sewer");
  exitSewerButton.style("color", "white");
  exitSewerButton.style("background-color", "transparent");
  exitSewerButton.style("border", "2px solid white");
  exitSewerButton.style("border-radius", "5px");
  exitSewerButton.size(120, 38);
  exitSewerButton.hide();
  exitSewerButton.mousePressed(() => {
    playActionClick();
    exitSewerButton.hide();
    sewerMusicStarted = false; // Reset flag
    if (sewerSound && sewerSound.isPlaying()) sewerSound.stop();
    scene = "map";
    playSceneMusic("map");
  });

  // NEW: inventory exit button (for inventory window)
  inventoryExitButton = createButton("exit");
  inventoryExitButton.style("color", "white");
  inventoryExitButton.style("background-color", "transparent");
  inventoryExitButton.style("border", "2px solid white");
  inventoryExitButton.style("border-radius", "5px");
  inventoryExitButton.size(100, 30);
  inventoryExitButton.hide();
  inventoryExitButton.mousePressed(() => {
    playActionClick();
    inventoryWindow = false;
    inventoryExitButton.hide();
  });

  // NEW: Hints button - an invisible HTML button that sits over the drawn hintsIcon
  hintsButton = createButton(''); // no label; icon will be drawn by p5 in draw()
  hintsButton.style('background', 'transparent');
  hintsButton.style('border', 'none');
  // size approximately same as other top icons (30x30)
  hintsButton.size(34, 34);
  // Position will be set via positionHintsButton()
  hintsButton.mousePressed(() => {
    playActionClick();
    // toggle hints overlay
    hintsWindow = !hintsWindow;
  });

  // Setup HTML controls - this is the key fix!
  setupHTMLControls();

  // Setup inventory box coordinates (top, left of other icons so it won't overlap)
  invSize = 30;
  invX = width - 80 - invSize - 10; 
  invY = 10;

  // Initial bunny position (off until available)
  bunnyX = width / 2;
  bunnyY = height * 0.65;

  // Position the hints button once initially
  positionHintsButton();
}

function positionHintsButton() {
  if (!hintsButton || !hintsButton.elt || !canvas || !canvas.elt) return;
  const canvasX = canvas.elt.getBoundingClientRect().left + window.scrollX;
  const canvasY = canvas.elt.getBoundingClientRect().top + window.scrollY;
  // Place at left edge with same Y as other top icons (10)
  hintsButton.position(canvasX + 10, canvasY + 10);
}

function createParticle() {
  return {
    x: random(width),
    y: -10,
    speed: random(1, 3),
    size: random(0.5, 3),
    opacity: random(80, 180),
    drift: random(-0.4, 0.4), 
    seed: random(1000)
  };
}

function drawIrregularAsh(x, y, size, seed) {
  beginShape();
  let steps = int(random(6, 9)); // fewer points = chunkier, more lumpy
  for (let i = 0; i < steps; i++) {
    let angle = map(i, 0, steps, 0, TWO_PI);
    // Increase 0.7–1.5 for more wobble, and up the noise range a bit
    let r = size * (0.7 + noise(seed + cos(angle) * 1.2, seed + sin(angle) * 1.2) * 1.2);
    vertex(x + cos(angle) * r, y + sin(angle) * r);
  }
  endShape(CLOSE);
}

function updateParticles() {
  if (particles.length < maxParticles && random() < 0.3) {
    particles.push(createParticle());
  }
  for (let i = particles.length - 1; i >= 0; i--) {
  let p = particles[i];
  p.y += p.speed;
  p.x += p.drift;
  fill(200, 200, 200, p.opacity); // slightly gray for ash
  noStroke();
  drawIrregularAsh(p.x, p.y, p.size, p.seed); // <-- use new function
  if (p.y > height + 20) particles.splice(i, 1);
  }
}

function playActionClick() {
  if (actionclickSound && actionclickSound.isLoaded()) {
    actionclickSound.play();
  }
}

function setupHTMLControls() {
  const vol = document.getElementById('vol');
  const volVal = document.getElementById('volVal');
  if (vol && volVal) {
    const initialVol = parseFloat(vol.value);
    if (homepageSound) homepageSound.setVolume(initialVol);
    if (carnivalSound) carnivalSound.setVolume(initialVol);
    if (ringtossMemory) ringtossMemory.setVolume(initialVol);
    if (funhouseMemory) funhouseMemory.setVolume(initialVol);
    if (sewerSound) sewerSound.setVolume(initialVol);
    if (actionclickSound) actionclickSound.setVolume(initialVol * 0.7);
    volVal.textContent = initialVol.toFixed(2);
    vol.addEventListener('input', () => {
      const v = parseFloat(vol.value);
      if (homepageSound) homepageSound.setVolume(v);
      if (carnivalSound) carnivalSound.setVolume(v);
      if (ringtossMemory) ringtossMemory.setVolume(v);
      if (funhouseMemory) funhouseMemory.setVolume(v);
      if (sewerSound) sewerSound.setVolume(v);
      if (actionclickSound) actionclickSound.setVolume(v * 0.7);
      volVal.textContent = v.toFixed(2);
    });
  }

  const toggle = document.getElementById('toggle-sound');
  if (toggle) {
    toggle.addEventListener('click', () => {
      playActionClick();

      // Prefer toggling the sound corresponding to currentMusic (the most recently started scene audio)
      // If none found, fall back to selecting by current scene.
      let sceneSound = null;

      if (currentMusic) {
        switch (currentMusic) {
          case "start":
          case "prologue":
            sceneSound = homepageSound;
            break;
          case "scene1.1":
            sceneSound = carnivalSound;
            break;
          case "scene2.0":
          case "memory":
            sceneSound = ringtossMemory;
            break;
          case "funhouse":
            // use the funhouseMemory audio for funhouse
            sceneSound = funhouseMemory;
            break;
          case "sewers":
            if (inventoryItems.includes("gas mask")) sceneSound = sewerSound;
            break;
        }
      }

      // Fallback to scene-based sound selection if currentMusic mapping not available
      if (!sceneSound) {
        if (scene === "start" || scene === "prologue") {
          sceneSound = homepageSound;
        } else if (scene === "scene1.1") {
          sceneSound = carnivalSound;
        } else if (scene === "scene2.0" || scene === "memory") {
          sceneSound = ringtossMemory;
        } else if (scene === "funhouse") {
          // use funhouseMemory when toggling from funhouse
          sceneSound = funhouseMemory;
        } else if (scene === "sewers") {
          if (inventoryItems.includes("gas mask")) {
            sceneSound = sewerSound;
          }
        }
      }

      // If we have a sound for this selection, toggle it
      if (sceneSound && sceneSound.isLoaded && sceneSound.isLoaded()) {
        if (sceneSound.isPlaying && sceneSound.isPlaying()) {
          sceneSound.stop();
          // Special-case memory track behavior
          if (currentMusic === "memory" || scene === "memory") {
            ringtossMemoryEnded = false; // User stopped audio, do NOT show exit button
            ringtossMemoryWasStoppedEarly = true;
          }
          // If we just stopped the funhouse audio, clear currentMusic if it matched
          if (currentMusic === "funhouse") currentMusic = null;
        } else {
          // Stop all other sounds first
          stopAllMusic();
          if (currentMusic === "memory" || scene === "memory") {
            ringtossMemoryEnded = false; // Reset before playing
            ringtossMemoryWasStoppedEarly = false;
            sceneSound.play();
            sceneSound.onended(() => {
              if (!ringtossMemoryWasStoppedEarly) {
                ringtossMemoryEnded = true; // Only show exit button if natural end!
              }
            });
            currentMusic = "memory";
          } else {
            sceneSound.loop();
            // set currentMusic to the mapped name if we can infer it
            if (scene === "scene1.1") currentMusic = "scene1.1";
            else if (scene === "scene2.0") currentMusic = "scene2.0";
            else if (scene === "start" || scene === "prologue") currentMusic = "prologue";
            else if (scene === "funhouse") currentMusic = "funhouse";
            else if (scene === "sewers") currentMusic = "sewers";
          }
        }
      } else if (sceneSound && sceneSound.isLoaded && !sceneSound.isLoaded()) {
        // If sound isn't loaded yet, try again after delay
        setTimeout(() => {
          if (sceneSound.isLoaded && sceneSound.isLoaded()) {
            stopAllMusic();
            if (currentMusic === "memory" || scene === "memory") {
              sceneSound.play();
              currentMusic = "memory";
            } else {
              sceneSound.loop();
              // set currentMusic to something sensible
              if (scene === "scene1.1") currentMusic = "scene1.1";
            }
          }
        }, 100);
      } else {
        // Fall back: if no sceneSound could be determined, attempt to stop any playing
        // (useful if currentMusic is null but audio is playing)
        stopAllMusic();
      }
    });
  }
}

function draw() {
  // Always ensure hints button is positioned over the drawn icon (in case canvas moved)
  positionHintsButton();

  if (scene === "start") {
    image(startImg, 0, 0, width, height);
    updateParticles();
    fill("white");
    textFont(homepageFont);
    textSize(36);
    textAlign(CENTER, CENTER);
    text("aether", width / 2, height / 3);
  } else if (scene == "prologue") {
    image(prologueImg, 0, 0, width, height);
    updateParticles();
    if (millis() - lastUpdate > typingSpeed && charIndex < messages1[currentMsg].length) {
      displayText += messages1[currentMsg].charAt(charIndex);
      charIndex++;
      lastUpdate = millis();
    }
    fill("white");
    textFont("Source Code Pro");
    textSize(min(10, width * 0.04));
    textAlign(CENTER, TOP);
    let yStart = height * 0.1;
    let lineHeight = min(28, width * 0.05);
    for (let i = 0; i < currentMsg; i++) {
      text(messages1[i], width / 2, yStart + i * lineHeight);
    }
    text(displayText, width/2, yStart + currentMsg * lineHeight);

    // --- Instruction shown under first line in prologue (already present) ---
    if (currentMsg === 0) {
  push();
  textFont("Source Code Pro");
  textSize(min(12, width * 0.03));
  fill(200); // subtle gray
  textAlign(CENTER, TOP);
  text("[press space or click mouse to continue]", width / 2, yStart + lineHeight + 6);
  pop();
}

    if (currentMsg === messages1.length - 1 && charIndex === messages1[currentMsg].length) {
      proceedButton.show();
    }
  } else if (scene === "map") {
    image(img5, 0, 0, width, height);
    let mouseInClickableArea = false;
    for (let area of mapClickAreas) {
      if (mouseX >= area.minX && mouseX <= area.maxX && 
          mouseY >= area.minY && mouseY <= area.maxY) {
        mouseInClickableArea = true;
        if (fireflies.length < maxFireflies && random() < 0.3) {
          fireflies.push({
            x: random(area.minX, area.maxX),
            y: random(area.minY, area.maxY),
            life: 60,
            size: random(3, 6),
            glowSize: random(8, 15),
            bobSpeed: random(0.02, 0.05),
            bobOffset: random(0, TWO_PI)
          });
        }
        break;
      }
    }
    for (let i = fireflies.length - 1; i >= 0; i--) {
      let fly = fireflies[i];
      fly.life--;
      fly.y += sin(millis() * fly.bobSpeed + fly.bobOffset) * 0.5;
      fly.x += random(-0.5, 0.5);
      push();
      drawingContext.shadowColor = 'rgba(255, 255, 0, 0.8)';
      drawingContext.shadowBlur = fly.glowSize;
      fill(255, 255, 100, 200);
      noStroke();
      ellipse(fly.x, fly.y, fly.size);
      pop();
      fill(255, 255, 150);
      noStroke();
      ellipse(fly.x, fly.y, fly.size * 0.6);
      if (fly.life <= 0) fireflies.splice(i, 1);
    }
  } else if (scene === "funhouse") {
    image(img6, 0, 0, width, height);
    if (!inventoryItems.includes("funhouse key")) {
      imageMode(CENTER);
      push();
        translate(keyX, keyY);
        rotate(radians(30));
        image(funhouseKey, 0, 0, keyW, keyH);
      pop();
      imageMode(CORNER);

      // Instruction text to the left of the key (match ringtoss styling)
      push();
      textFont("Source Code Pro");
      textSize(min(18, width * 0.045));
      textAlign(RIGHT, CENTER);
      textStyle(BOLD);
      fill(250, 245, 230); // slightly translucent white used elsewhere
      // subtle shadow to match ringtoss instruction appearance
      drawingContext.shadowBlur = 8;
      drawingContext.shadowColor = 'rgba(0,0,0,0.6)';
      // Draw the text a bit to the left of the key image
      text("[click key to enter memory]", keyX - keyW / 2 - 12, keyY);
      // clear shadow and style
      drawingContext.shadowBlur = 0;
      textStyle(NORMAL);
      pop();
    }  // ← This closes the if statement
  }    // ← This closes the funhouse scene
  else if (scene === "sewers") {
    image(img7, 0, 0, width, height);
    if (!inventoryItems.includes("gas mask")) {
      imageMode(CENTER);
      push();
        translate(keyX, keyY);
        rotate(radians(30));
        image(gasMask, 0, 0, keyW, keyH);
      pop();
      imageMode(CORNER);

      // Instruction text to the left of the gas mask (match ringtoss styling)
      push();
      textFont("Source Code Pro");
      textSize(min(18, width * 0.045));
      textAlign(RIGHT, CENTER);
      textStyle(BOLD);
      fill(250, 245, 230);
      drawingContext.shadowBlur = 8;
      drawingContext.shadowColor = 'rgba(0,0,0,0.6)';
      text("[click mask to enter memory]", keyX - keyW / 2 - 12, keyY);
      drawingContext.shadowBlur = 0;
      textStyle(NORMAL);
      pop();
    }
  
    // Only show exit button when music has finished playing
    if (sewerMusicStarted && sewerSound && !sewerSound.isPlaying()) {
      let canvasX = canvas.elt.getBoundingClientRect().left + window.scrollX;
      let canvasY = canvas.elt.getBoundingClientRect().top + window.scrollY;
      exitSewerButton.position(
        canvasX + width / 2 - exitSewerButton.width / 2,
        canvasY + height - 160
      );
      exitSewerButton.show();
    } else {
      exitSewerButton.hide();
    }
  }

    else if (scene === "memory") {
    drawMemorySequence();

    if (ringtossMemoryEnded && !ringtossMemoryWasStoppedEarly) {
      memoryExitButton.show();
    } else {
      memoryExitButton.hide();
    }
  
  } else if (scene === "scene1.1") {
    if (currentMsg > 6 || (currentMsg === 6 && charIndex === messages2[6].length)) {
      showBloodyScene = true;
    }
    if (showBloodyScene) {
      image(img4, 0, 0, width, height);
    } else {
      image(img1, 0, 0, width, height);
    }
    const bubbleW = width * 0.3;
    const bubbleH = height * 0.22;
    const bubbleX = width * 0.55;
    const bubbleY = width * 0.25;
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(bubbleX, bubbleY, bubbleW, bubbleH, 20);
    beginShape();
    vertex(bubbleX, bubbleY + bubbleH * 0.6);
    vertex(bubbleX - 20, bubbleY + bubbleH * 0.7);
    vertex(bubbleX, bubbleY + bubbleH * 0.7);
    endShape(CLOSE);
    if (
      typingActive11 &&
      millis() - lastUpdate > typingSpeed &&
      charIndex < messages2[currentMsg].length
    ) {
      displayText += messages2[currentMsg].charAt(charIndex);
      charIndex++;
      lastUpdate = millis();
    }
    const pad = 10;
    fill(0);
    noStroke();
    textFont("Source Code Pro");
    textSize(min(16, width * 0.03));
    textAlign(LEFT, TOP);
    text(displayText, bubbleX + pad, bubbleY + pad, bubbleW - 2 * pad, bubbleH - 2 * pad);
if (showAdvanceHint11) {
  // Compute padded box near the bottom of the speech bubble
  const hintPad = 8; // smaller padding so we have more room
  const hintBoxW = bubbleW - hintPad * 2;
  const hintBoxH = bubbleH * 0.28; // allow up to ~28% of bubble height
  const hintBoxX = bubbleX + hintPad;
  const hintBoxY = bubbleY + bubbleH - hintPad - hintBoxH - 20;

  const hintText = "[press space or click mouse to continue]";

  // Start with a reasonable font size and shrink until it fits
  textFont("Source Code Pro");
  let fontSize = Math.min(14, Math.floor(hintBoxW * 0.08)); // start size (cap at 14)
  if (fontSize < 10) fontSize = 10; // never too small
  textAlign(CENTER, TOP);

  // Helper to compute approximate wrapped text height for given fontSize
  function wrappedHeightForSize(size, txt, boxW) {
    textSize(size);
    const ascent = textAscent();
    const descent = textDescent();
    const lineHeight = ascent + descent;
    const rawWidth = textWidth(txt);
    const lines = Math.max(1, Math.ceil(rawWidth / boxW));
    return lines * lineHeight;
  }

  // Reduce font size until the wrapped height fits in hintBoxH (or reach min size)
  while (fontSize > 8) {
    const h = wrappedHeightForSize(fontSize, hintText, hintBoxW);
    if (h <= hintBoxH) break;
    fontSize--;
  }

  // Draw the text centered in the hint box by using the box's left as x
  push();
  noStroke();
  fill(120); // subtle gray
  textSize(fontSize);
  // use left edge (hintBoxX) — text will center inside the box thanks to textAlign(CENTER)
  textAlign(CENTER, TOP);
  text(hintText, hintBoxX, hintBoxY, hintBoxW, hintBoxH);
  pop();
}

  } else if (scene === "scene2.0") {
    // ring toss scene
    image(img2, 0, 0, width, height);

   if (showRingTossInstruction) {
  push();
  textFont("Source Code Pro");
  textSize(min(18, width * 0.045)); // responsive size; tweak as desired
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  fill(250, 245, 230); // slightly translucent white
  noStroke();
  // Optional subtle shadow:
  drawingContext.shadowBlur = 8;
  drawingContext.shadowColor = 'rgba(0,0,0,0.6)';

  text("[click on one of the hooks to play]", width / 2, height / 2 + 11);

  // clear shadow so it doesn't affect other drawings
  drawingContext.shadowBlur = 0;
  pop();
}

    if (!ringWon) {
      push();
      imageMode(CENTER);
      if (ringAttached && attachedHook) {
        image(img3, attachedHook.x, attachedHook.y, 100, 100);
        if (!ringWon) {
          setTimeout(() => {
            ringWon = true;
            bunnyOverlayStartTime = millis();
          }, 500);
        }
      } else {
        image(img3, mouseX, mouseY, 100, 100);
      }
      pop();
    }
    
    // Display win message and handle bunny overlay timing
    if (ringWon) {
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(24);
      text("You won!", width / 2, height / 2);
      
      // Check if enough time has passed to show the bunny (3 seconds after win)
      if (millis() - bunnyOverlayStartTime > 3000 && !bunnyCollected) {
        showBunnyOverlay = true;
      }
      
      // Draw the bunny overlay if it's time
      if (showBunnyOverlay && stuffedbunnyWon && !bunnyCollected) {
        image(stuffedbunnyWon, 0, 0, width, height);
        bunnyAvailable = true;
        
        // show message
        push();
        textAlign(CENTER, CENTER);
        textSize(15);
        fill(255);
        stroke(0);
        strokeWeight(2);
        // message box backdrop for readability
        rectMode(CENTER);
        fill(0, 140);
        noStroke();
        rect(width / 2, height * 0.15, width * 0.9, 60, 8);
        fill(255);
        noStroke();
        textFont("Source Code Pro");
        text("You won the pink stuffed bunny!\nClick on it to place it in\nyour inventory up top!", width / 2, height * 0.18);
        pop();
    
      }
    }

    if (bunnyCollected) {
      fill(0);
      rect(0, 0, width, height);
    }
   }

  // Draw UI icons (settings, map, inventory, hints) - but not on start screen
  if (scene !== "start") {
    // Draw hints icon at top-left (always visible)
    if (hintsIcon) {
      image(hintsIcon, 10, 10, 30, 30);
    }
    if (scene !== "map" && mapIcon) {
      image(mapIcon, width - 80, 10, 30, 30);
    }
    // Draw the inventory box (top, left of map icon so it doesn't overlap)
    // Visual: small rounded rect with inventory image
    push();
    rectMode(CORNER);
    stroke(255);
    fill(0, 120);
    strokeWeight(1);
    rect(invX, invY, invSize, invSize, 6);
    if (inventory) {
      let iconPadding = 0.8;
      let iconSize = invSize * iconPadding;
      let yOffset = 2;
      // draw inventory image centered in that rect
      imageMode(CENTER);
      image(inventory, invX + invSize / 2, invY + invSize / 2, iconSize, iconSize);
      imageMode(CORNER);
    }
    pop();

    let mapBoxX = width - 80;
    let mapBoxY = 10;
    let mapBoxSize = 30;
    let mapIconPadding = 0.8;
    let mapIconSize = mapBoxSize * mapIconPadding;

    push();
    rectMode(CORNER);
    stroke(255);
    strokeWeight(1);
    noFill();
    rect(mapBoxX, mapBoxY, mapBoxSize, mapBoxSize, 6);
    pop();

    if (mapIcon) {
      imageMode(CENTER);
      image(
        mapIcon,
        mapBoxX + mapBoxSize / 2,
        mapBoxY + mapBoxSize / 2,
        mapIconSize,
        mapIconSize
      );
      imageMode(CORNER);
    }
  }

  // If bunny is in inventory, show a small indicator on the inventory box (a dot or thumbnail)
  if (bunnyInInventory) {
    push();
    fill(255, 200, 200);
    noStroke();
    ellipse(invX + invSize - 10, invY + invSize - 10, 14);
    pop();
  }

  // Inventory window (fullscreen modal-like) if opened
  if (inventoryWindow) {
    // dark backdrop
    push();
    fill(0, 200);
    rect(0, 0, width, height);
    pop();

    let panelW = width * 0.8;
    let panelH = height * 0.75;
    let panelX = width * 0.1;
    let panelY = height * 0.12;
    let cols = 1;
    let rows = 3;
    let padding = 18;
    let slotSize = min(80, (panelW - padding * 2) / rows - 12);
    let startX = panelX + padding;
    let startY = panelY + 50;

    // inventory panel (start push)
    push();
    rectMode(CORNER);
    fill(20, 20, 30);
    stroke(255);
    strokeWeight(2);
    rect(panelX, panelY, panelW, panelH, 12);
    // title
    noStroke();
    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    text("Inventory", panelX + 18, panelY + 12);

    // Draw items inside inventory panel (grid)
    // draw placeholder empty slots then items
    for (let r = 0; r < rows; r++) {
     let sx = startX;
     let sy = startY + r * (slotSize + 12);
     stroke(120);
      noFill();
      rect(sx, sy, slotSize, slotSize, 6);
    }

    // If bunny is in inventory, draw it in first slot
    if (bunnyInInventory && stuffedbunnyWon) {
      imageMode(CORNER);
      let sx = startX;
      let sy = startY;
      // draw bunny image scaled to slot
      image(stuffedbunnyWon, sx + 6, sy + 6, slotSize - 12, slotSize - 12);
    }
    pop();

    // Now draw the funhouse key (OUTSIDE push/pop)
    if (inventoryItems.includes("funhouse key") && funhouseKey) {
      let keySlot = bunnyInInventory ? 1 : 0;
      let sx = startX;
      let sy = startY + keySlot * (slotSize + 12);
      image(funhouseKey, sx + 6, sy + 6, slotSize - 12, slotSize - 12);
    }

    // Draw gas mask in inventory if collected
    if (inventoryItems.includes("gas mask") && gasMask) {
      let maskSlot = 0;
      if (bunnyInInventory) maskSlot++;
      if (inventoryItems.includes("funhouse key")) maskSlot++;
      let sx = startX;
      let sy = startY + maskSlot * (slotSize + 12);
      image(gasMask, sx + 6, sy + 6, slotSize - 12, slotSize - 12);
    }

    // show inventory exit button and position it relative to panel
    inventoryExitButton.show();
    // compute position for the inventoryExitButton so it sits top-right of the panel
    let canvasX = canvas.elt.getBoundingClientRect().left + window.scrollX;
    let canvasY = canvas.elt.getBoundingClientRect().top + window.scrollY;
    let btnX = canvasX + panelX + panelW / 2 - inventoryExitButton.width / 2;
    let btnY = canvasY + panelY + 12;
    inventoryExitButton.position(btnX, btnY);
  } else {
    // hide inventory exit button if window not open
    inventoryExitButton.hide();
  }

  // Hints overlay (drawn on top of everything when toggled)
  if (hintsWindow) {
    push();
    fill(0, 220);
    rect(0, 0, width, height);
    fill(255);
    noStroke();
    textFont("Source Code Pro");
    textAlign(CENTER, TOP);
    textSize(16);
    // Example hint text – customize as desired
    text("Hints:\n• Click objects highlighted in each scene to interact.\n• Use the map icon (top-right) to navigate.\n• Collect items to use later.", width/2, 60, width * 0.8);
    pop();
  }
}

function advanceMessage() {
  let lines;
  if (scene === "prologue") {
    lines = messages1;
  } else if (scene === "scene1.1") {
    lines = messages2;
  } else {
    return;
  }

  if (charIndex < lines[currentMsg].length) {
    displayText = lines[currentMsg];
    charIndex = lines[currentMsg].length;
  } else {
    currentMsg++;
    if (currentMsg < lines.length) {
      displayText = "";
      charIndex = 0;
      lastUpdate = millis();
    } else {
      currentMsg = lines.length - 1;
      if (scene === "prologue") {
        proceedButton.show();
      } else if (scene === "scene1.1") {
        exitButton.show();
      }
    }
  }
}

function handleAdvance() {
  // Hide the scene1.1 hint as soon as the user advances (space or click)
  if (scene === "scene1.1") {
    showAdvanceHint11 = false;
  }

  if (scene === "scene1.1") {
    if (!typingActive11) {
      typingActive11 = true;
      lastUpdate = millis();
      return;
    }
    if (charIndex < messages2[currentMsg].length) {
      displayText = messages2[currentMsg];
      charIndex = messages2[currentMsg].length;
    } else {
      currentMsg++;
      if (currentMsg < messages2.length) {
        displayText = "";
        charIndex = 0;
        lastUpdate = millis();
      } else {
        currentMsg = messages2.length - 1;
        exitButton.show();
      }
    }
    return;
  }
  advanceMessage();
}

function keyPressed() {
  if (scene !== "prologue" && scene !== "scene1.1") {
    playActionClick();
  }
  if (key === ' ') handleAdvance();
}

function mousePressed() {

if (aboutWindow) {
    playActionClick();
    aboutWindow = false;
    return;
  }

  // Info icon click (top-right) - open about overlay
  // This replaces the previous settings click handler behavior
  if (mouseX > width - 40 && mouseX < width - 10 && mouseY > 10 && mouseY < 40) {
    playActionClick();
    aboutWindow = true;
    return;
  }
  
  // If the click falls on the hintsButton area (HTML button sits over the canvas), let it handle the click.
if (hintsButton && hintsButton.elt && canvas && canvas.elt) {
  let btnBounds = hintsButton.elt.getBoundingClientRect();
  let canvasRect = canvas.elt.getBoundingClientRect();
  let relativeMouseX = mouseX + canvasRect.left;
  let relativeMouseY = mouseY + canvasRect.top + window.scrollY;
  if (
    relativeMouseX >= btnBounds.left && relativeMouseX <= btnBounds.right &&
    relativeMouseY >= btnBounds.top && relativeMouseY <= btnBounds.bottom
  ) {
    // The HTML button's own mousePressed handles toggling the hintsWindow,
    // so we simply return to avoid duplicate canvas handling.
    return;
  }
}

// --- If bunny overlay is showing AND bunny available, check for clicking the bunny to add to inventory ---
 if (scene === "scene2.0" && showBunnyOverlay && bunnyAvailable && !bunnyInInventory) {
  let minX = 140;  // Left edge of clickable area
  let maxX = 307;  // Right edge of clickable area
  let minY = 128;  // Top edge of clickable area
  let maxY = 421;  // Bottom edge of clickable area
  
  if (mouseX >= minX && mouseX <= maxX && mouseY >= minY && mouseY <= maxY) {
    bunnyInInventory = true;
    bunnyAvailable = false;
    showBunnyOverlay = false;
    bunnyCollected = true;
   if (!inventoryItems.includes("pink stuffed bunny")) {
        inventoryItems.push("pink stuffed bunny");
      }
      showMemorySequence = true;
      memorySequenceStartTime = millis();
      memoryMusicStarted = false;
      ringtossMemoryEnded = false;
      ringtossMemoryWasStoppedEarly = false; 

      if (ringtossMemory && ringtossMemory.isLoaded()) {
        ringtossMemory.play();
        ringtossMemory.onended(() => {
          if (!ringtossMemoryWasStoppedEarly) {
            ringtossMemoryEnded = true;
          }
        });
        memoryMusicStarted = true;
      }
      setTimeout(() => {
        scene = "memory";
      }, 500);
      playActionClick();
      return;
    }
  }

if (transitioningToRingToss) return;

  // Sewer scene: prioritize exit button click
if (scene === "sewers") {
  // Only show exit button if music is finished
  let buttonIsShowing = (sewerMusicStarted && sewerSound && !sewerSound.isPlaying());

  if (buttonIsShowing) {
    // Get exit button bounds
    let btnBounds = exitSewerButton.elt.getBoundingClientRect();
    let canvasRect = canvas.elt.getBoundingClientRect();
    let relativeMouseX = mouseX + canvasRect.left;
    let relativeMouseY = mouseY + canvasRect.top + window.scrollY;

    // If mouse is inside button, let the button handle it and return immediately
    if (relativeMouseX >= btnBounds.left && relativeMouseX <= btnBounds.right &&
        relativeMouseY >= btnBounds.top && relativeMouseY <= btnBounds.bottom) {
      // Do NOT process gas mask pickup!
      return;
    }
    // If button is showing and click wasn't on the button, ignore all other logic.
    return;
  }
  
  // Only process gas mask pickup if button is NOT showing
  if (!inventoryItems.includes("gas mask")) {
    let d = dist(mouseX, mouseY, keyX, keyY);
    if (d < keyW / 2) {
      inventoryItems.push("gas mask");
      playActionClick();
      if (sewerSound && sewerSound.isLoaded()) {
        sewerSound.play(); // Play once
        sewerMusicStarted = true;
      }
      return;
    }
  }
  // If button is NOT showing, allow picking up the mask
  if (!inventoryItems.includes("gas mask")) {
    let d = dist(mouseX, mouseY, keyX, keyY);
    if (d < keyW / 2) {
      inventoryItems.push("gas mask");
      playActionClick();
      // Start playing the sewer music for the first time
      if (sewerSound && sewerSound.isLoaded()) {
        sewerSound.play(); // Play once, not loop
        sewerMusicStarted = true;
      }
      return;
    }
  }
}
  
  // Prevent interactions during short transitions
  if (transitioningToRingToss) return;

  // --- Inventory icon click (open inventory window) ---
  if (scene !== "start") {
    if (mouseX >= invX && mouseX <= invX + invSize && mouseY >= invY && mouseY <= invY + invSize) {
      playActionClick();
      inventoryWindow = true;
      return;
    }
  }
  if (scene === "funhouse" && !inventoryItems.includes("funhouse key")) {
    let d = dist(mouseX, mouseY, keyX, keyY);
    if (d < keyW / 2) { // assuming the key is roughly square/circular
    // collect the funhouse key, place into inventory, and start funhouse audio now that key is in inventory
    inventoryItems.push("funhouse key");
    playActionClick();
    // Start funhouse audio only after key is collected
    if (funhouseMemory && funhouseMemory.isLoaded()) {
      // Use the centralized helper to start scene audio so currentMusic is set consistently
      playSceneMusic("funhouse");
    }
    return; // prevent further click handling
  }
}
  // map icon click (only show when not on map and not on start screen)
  if (scene !== "map" && scene !== "start" && 
      mouseX > width - 80 && mouseX < width - 50 && mouseY > 10 && mouseY < 40) {
    playActionClick();
    scene = "map";
    ringAttached = false;
    attachedHook = null;
    ringWon = false;
    showBloodyScene = false;
    typingActive11 = false;
    currentMsg = 0;
    displayText = "";
    charIndex = 0;
    showBunnyOverlay = false;
    bunnyOverlayStartTime = 0;
    exitButton.hide();
    bunnyAvailable = false;
    return;
  }

  // Map scene click handling
  if (scene === "map" && !transitioningToMap) {
    for (let area of mapClickAreas) {
      if (mouseX >= area.minX && mouseX <= area.maxX && 
          mouseY >= area.minY && mouseY <= area.maxY) {
        playActionClick();
        scene = area.scene;
        // Only play audio immediately for other scenes, NOT ringtoss
        if (area.scene !== "scene2.0") {
          playSceneMusic(area.scene);
        }
        fireflies = [];
        if (area.scene === "scene1.1") {
          typingActive11 = false;
          currentMsg = 0;
          displayText = "";
          charIndex = 0;
          showBloodyScene = false;
          // show the advance hint when entering scene1.1
          showAdvanceHint11 = true;
        } else if (area.scene === "scene2.0") {
          ringAttached = false;
          attachedHook = null;
          ringWon = false;
          showBunnyOverlay = false;
          bunnyOverlayStartTime = 0;
          transitioningToRingToss = true;
          showRingTossInstruction = true;
          setTimeout(() => {
            transitioningToRingToss = false;
          }, 100);
        }
        return;
      }
    }
    return;
  }

  // Ring toss scene click handling (only for ring interactions if not yet won)
  if (scene === "scene2.0" && !ringWon) {
    playActionClick();
    let clickedHook = null;
    for (let h of hooks) {
      let d = dist(mouseX, mouseY, h.x, h.y);
      if (d < h.r) {
        clickedHook = h;
        break;
      }
    }
    if (clickedHook) {
      ringAttached = true;
      attachedHook = clickedHook;
      showRingTossInstruction = false;
    } else {
      ringAttached = false;
      attachedHook = null;
    }
    return;
  }

  if (scene === "sewers" && !inventoryItems.includes("gas mask")) {
    // Only process gas mask clicks if the exit button is NOT currently showing
    let buttonIsShowing = (sewerMusicStarted && sewerSound && !sewerSound.isPlaying());
    
    if (!buttonIsShowing) {
      let d = dist(mouseX, mouseY, keyX, keyY);
      if (d < keyW / 2) {
        inventoryItems.push("gas mask");
        playActionClick();
        // Start playing the sewer music for the first time
        if (sewerSound && sewerSound.isLoaded()) {
          sewerSound.play(); // Play once, not loop
          sewerMusicStarted = true;
        }
        return;
      }
    }
  }

  // Dialogue advancement clicks (prologue/scene1.1)
  handleAdvance();
}

function goToMap() {
  scene = "map";
  playSceneMusic("map");
  mapClickable = false; // disable clicks temporarily
  setTimeout(() => {
    mapClickable = true; // re-enable clicks after 200ms
  }, 200);
}

function centerButtonOnCanvas(btn, yOffset = 0) {
  // Check if btn and canvas are defined, and have the 'elt' property
  if (!btn || !btn.elt || !canvas || !canvas.elt) return;

  const canvasX = canvas.elt.getBoundingClientRect().left + window.scrollX;
  const canvasY = canvas.elt.getBoundingClientRect().top + window.scrollY;
  btn.position(
    canvasX + width / 2 - btn.width / 2,
    canvasY + height - yOffset
  );
}

function windowResized() {
  let w, h;
  if (isMobile()) {
    w = windowWidth;
    h = windowHeight;
  } else {
    w = 450;
    h = 500;
  }
  resizeCanvas(w, h);

  centerButtonOnCanvas(playButton, 40);
  centerButtonOnCanvas(exitButton, 40);
  centerButtonOnCanvas(proceedButton, 40);

  // Recompute inventory coordinates for new width
  invSize = 30;
  invX = width - 80 - invSize - 10;
  invY = 10;

  // re-center bunny
  bunnyX = width / 2;
  bunnyY = height * 0.65;

  // reposition hints button after resizing
  positionHintsButton();
}

function drawMemorySequence() {
  background(0);
  
  // --- MUCH lighter glitch noise layer (only 200-500 particles instead of 20,050!) ---
  let glitchCount = random(200, 500); // Vary the amount for more organic feel
  for (let i = 0; i < glitchCount; i++) {
    let x = random(width);
    let y = random(height);
    
    // occasional horizontal glitch band
    if (random(1) < 0.1) {
      x = random(width);
      y = int(random(height / 15)) * 15 + random(-2, 2);
      // make horizontal bands wider
      let bandWidth = random(10, width * 0.3);
      let bandHeight = random(1, 3);
      fill(255, random(100, 255));
      noStroke();
      rect(x, y, bandWidth, bandHeight);
    } else {
      // regular glitch pixels
      let w = random(1, 3);
      let h = random(1, 2);
      fill(255, random(80, 255));
      noStroke();
      rect(x, y, w, h);
    }
  }
  
  // --- ellipse mask for "memories" image ---
  if (memories) {
    push();
    
    // Simple approach - draw a mask using p5.js native functions
    // Create a graphics buffer for masking
    let maskGraphics = createGraphics(width, height);
    maskGraphics.fill(255);
    maskGraphics.ellipse(width/2, height/2, 300, 400); // Adjust size as needed
    
    // Draw the image
    push();
    imageMode(CENTER);
    image(memories, width/2, height/2, 300, 400);
    pop();
    
    // Apply mask effect by drawing black around the ellipse
    fill(0);
    noStroke();
    // Top rectangle
    rect(0, 0, width, height/2 - 200);
    // Bottom rectangle  
    rect(0, height/2 + 200, width, height/2 - 200);
    // Left rectangle
    rect(0, height/2 - 200, width/2 - 150, 400);
    // Right rectangle
    rect(width/2 + 150, height/2 - 200, width/2 - 150, 400);
    
    // Draw ellipse border for cleaner edge
    noFill();
    stroke(100);
    strokeWeight(2);
    ellipse(width/2, height/2, 300, 400);
    
    pop();
  }
  
  // --- subtle flickering overlay ---
  if (random(1) < 0.3) { // Only flicker 30% of the time
    fill(255, random(5, 25));
    noStroke();
    rect(0, 0, width, height);
  }
}
