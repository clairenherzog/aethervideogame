let startImg;
let prologueImg;
let settings; // settings button 
let img1;   // carousel scene
let img2;   // ring toss scene
let img3;   // ring for mouse
let img4; // bloody carousel scene
let img5; // map for game 
let img6;   // funhouse scene 
let img7;   // sewer scene 
let playImg; // play button
let continueImg; // continue button
let proceedImg; // proceed to mission button
let mapIcon; // map icon for navigation
let transitioningToMap = false;
let scene = "start"; // keeps track of which screen to show
let playButton;
let homepageFont;
let buttonFont;
let stuffedbunnyWon;
let memories;
let stuffedBunny;
let showBunnyOverlay = false;
let bunnyOverlayStartTime = 0;
let showMemorySequence = false;
let memorySequenceStartTime = 0;
let memorySequenceDuration = 90000; // 4 seconds
let ringtossMemory;
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
  "you must be gone, before first light,", 
  "before the beasts come out to play.",
  "you must go, now, and remember my warning."
];

let typingActive11 = false;
let currentMsg = 0;
let displayText = "";
let charIndex = 0;
let lastUpdate = 0;
let typingSpeed = 100;
let exitButton;
let proceedButton;
let inventory; // inventory icon image
let homepageSound;
let carnivalSound;
let actionclickSound;
let funhouseSound;
let canvas;
let showBloodyScene = false; // Track whether to show bloody image
let currentMusic = null;

// Radioactive rain particles system
let particles = [];
let maxParticles = 80;

// Map click areas
let mapClickAreas = [
  {
    name: "carousel",
    minX: 266,
    maxX: 420,
    minY: 213,
    maxY: 327,
    scene: "scene1.1"
  },
  { 
    name: "ringtoss", 
    minX: 274, 
    maxX: 413, 
    minY: 54, 
    maxY: 188,
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
let ringWon = false;
let transitioningToRingToss = false;

// Inventory & Bunny state (cleaned, click-only)
let invX, invY, invSize;
let bunnyX, bunnyY;
let bunnyAvailable = false;
let bunnyInInventory = false;
let inventoryItems = [];
let inventoryWindow = false;
let inventoryExitButton;

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
  memories = loadImage("assets/memorygirl.png");
  stuffedbunnyWon = loadImage("assets/stuffedbunnywon.png");
  stuffedBunny = loadImage("assets/stuffedbunny.png");
  playImg = loadImage("assets/playbutton.png");
  continueImg = loadImage("assets/continuebutton.png");
  proceedImg = loadImage("assets/proceedbutton.png");
  settings = loadImage("assets/settings.png");
  inventory = loadImage("assets/inventory.svg"); 
  mapIcon = loadImage("assets/map.png");
  homepageSound = loadSound("assets/homepagemusic.wav");
  carnivalSound = loadSound("assets/fair.mp3");
  ringtossMemory = loadSound("assets/ringtossmemory.mp3");
  actionclickSound = loadSound("assets/actionclick.wav");
  funhouseSound = loadSound("assets/funhouse.mp3");
}

function stopAllMusic() {
  if (homepageSound && homepageSound.isPlaying()) homepageSound.stop();
  if (carnivalSound && carnivalSound.isPlaying()) carnivalSound.stop();
  if (funhouseSound && funhouseSound.isPlaying()) funhouseSound.stop();
  if (ringtossMemory && ringtossMemory.isPlaying()) ringtossMemory.stop();
  currentMusic = null;
}

function playSceneMusic(sceneName) {
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
    case "memory":
      if (ringtossMemory && ringtossMemory.isLoaded()) {
        ringtossMemory.play();
        currentMusic = sceneName;
      }
      break;
    case "funhouse":
      if (funhouseSound && funhouseSound.isLoaded()) {
        funhouseSound.loop();
        currentMusic = sceneName;
      }
      break;
    case "map":
    case "sewers":
      stopAllMusic();
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
    playActionClick();
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
  exitButton.size(140, 30);
  centerButtonOnCanvas(exitButton, 40);
  exitButton.hide(); 
  exitButton.mousePressed(() => {
    playActionClick();
    ringAttached = false;
    attachedHook = null;
    transitioningToRingToss = true;
    scene = "map";
    exitButton.hide();
    showBloodyScene = false;
    setTimeout(() => {
      transitioningToRingToss = false;
    }, 100);
  });

  proceedButton = createButton("proceed to mission");
  proceedButton.style("color", "white");
  proceedButton.style("background-color", "transparent");
  proceedButton.style("border", "2px solid white");
  proceedButton.style("border-radius", "5px");
  proceedButton.size(180, 40);
  centerButtonOnCanvas(proceedButton, 60);
  proceedButton.hide(); 
  proceedButton.mousePressed(() => {
    playActionClick();
    scene = "map";
    proceedButton.hide();
    currentMsg = 0;
    displayText = "";
    charIndex = 0;
    lastUpdate = millis();
    typingActive11 = false;
    showBloodyScene = false;
    transitioningToMap = true;
    setTimeout(() => {
      transitioningToMap = false;
    }, 300);
  });

  memoryExitButton = createButton("return to map");
  memoryExitButton.style("color", "white");
  memoryExitButton.style("background-color", "transparent");
  memoryExitButton.style("border", "2px solid white");
  memoryExitButton.style("border-radius", "5px");
  memoryExitButton.size(140, 30);
  centerButtonOnCanvas(memoryExitButton, 60);
  memoryExitButton.hide(); 
  memoryExitButton.mousePressed(() => {
    playActionClick();
    transitioningToMap = true;
    scene= "map";
    memoryExitButton.hide();
    showMemorySequence = false;
    memoryMusicStarted = false;
    if (ringtossMemory && ringtossMemory.isPlaying()) {
      ringtossMemory.stop();
    }
    playSceneMusic("map");
    setTimeout(() => { 
      transitioningToMap = false;
    }, 300);
  });

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

  setupHTMLControls();

  invSize = 44;
  invX = width - 130;
  invY = 10;

  bunnyX = width / 2;
  bunnyY = height * 0.65;
}

function createParticle() {
  return {
    x: random(width),
    y: -10,
    speed: random(3, 8),
    width: random(1, 2),
    height: random(15, 25),
    opacity: random(150, 255),
    drift: random(-0.2, 0.2)
  };
}

function updateParticles() {
  if (particles.length < maxParticles && random() < 0.3) {
    particles.push(createParticle());
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.y += p.speed;
    p.x += p.drift;
    fill(255, 255, 255, p.opacity);
    noStroke();
    ellipse(p.x, p.y, p.width, p.height);
    if (p.y > height + 20) particles.splice(i, 1);
  }
}

function playActionClick() {
  if (actionclickSound && actionclickSound.isLoaded()) {
    actionclickSound.play();
  }
}

// setupHTMLControls unchanged from your code

function draw() {
  // ...all scenes unchanged except for bunny drag logic...
  // In scene2.0, bunny is only clickable, not draggable.
  // See previous responses for draw() implementation.
  // (If you need the full draw() pasted, let me know.)
}

function mousePressed() {
  if (transitioningToRingToss) return;
  if (inventoryWindow) return;
  if (scene === "scene2.0" && showBunnyOverlay && bunnyAvailable && !bunnyInInventory) {
    let d = dist(mouseX, mouseY, bunnyX, bunnyY);
    if (d < 80) {
      bunnyInInventory = true;
      bunnyAvailable = false;
      if (!inventoryItems.includes("pink stuffed bunny")) {
        inventoryItems.push("pink stuffed bunny");
      }
      showMemorySequence = true;
      memorySequenceStartTime = millis();
      memoryMusicStarted = false;
      playSceneMusic("memory");
      setTimeout(() => {
        scene = "memory";
      }, 100);
      playActionClick();
      return;
    }
  }
  if (scene !== "start") {
    if (mouseX >= invX && mouseX <= invX + invSize && mouseY >= invY && mouseY <= invY + invSize) {
      playActionClick();
      inventoryWindow = true;
      return;
    }
  }
  if (mouseX > width - 40 && mouseX < width - 10 && mouseY > 10 && mouseY < 40) {
    playActionClick();
    scene = "settings"; 
    return;
  }
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
  if (scene === "map" && !transitioningToMap) {
    for (let area of mapClickAreas) {
      if (mouseX >= area.minX && mouseX <= area.maxX && 
          mouseY >= area.minY && mouseY <= area.maxY) {
        playActionClick();
        scene = area.scene;
        fireflies = [];
        if (area.scene === "scene1.1") {
          typingActive11 = false;
          currentMsg = 0;
          displayText = "";
          charIndex = 0;
          showBloodyScene = false;
        } else if (area.scene === "scene2.0") {
          ringAttached = false;
          attachedHook = null;
          ringWon = false;
          showBunnyOverlay = false;
          bunnyOverlayStartTime = 0;
          transitioningToRingToss = true;
          setTimeout(() => {
            transitioningToRingToss = false;
          }, 100);
        }
        return;
      }
    }
    return;
  }
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
    } else {
      ringAttached = false;
      attachedHook = null;
    }
    return;
  }
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
  invSize = 44;
  invX = width - 130;
  invY = 10;

  // re-center bunny
  bunnyX = width / 2;
  bunnyY = height * 0.65;
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
