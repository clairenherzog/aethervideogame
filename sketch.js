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
let stuffedBunny; // transparent bunny used for dragging (user said this variable exists)
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
let sewerSound;
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
    minY: 54, 
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
  // Transparent bunny sprite used for dragging (user said stuffedBunny already exists; re-load to be safe)
  stuffedBunny = loadImage("assets/stuffedbunny.png");
  playImg = loadImage("assets/playbutton.png");
  continueImg = loadImage("assets/continuebutton.png");
  proceedImg = loadImage("assets/proceedbutton.png");
  settings = loadImage("assets/settings.png");
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
  funhouseSound = loadSound("assets/funhouse.mp3", 
    () => console.log("Funhouse sound loaded successfully"),
    () => console.log("Error loading funhouse sound")
  );
  sewerSound = loadSound("assets/memory2.mp3",
    () => console.log("Sewer sound loaded successfully"),
    () => console.log("Sewer sound loaded successfully"),
  );
}

// Function to stop all music
function stopAllMusic() {
  if (homepageSound && homepageSound.isPlaying()) homepageSound.stop();
  if (carnivalSound && carnivalSound.isPlaying()) carnivalSound.stop();
  if (funhouseSound && funhouseSound.isPlaying()) funhouseSound.stop();
  if (ringtossMemory && ringtossMemory.isPlaying()) ringtossMemory.stop();
  if (sewerSound && sewerSound.isPlaying() sewerSound.stop();
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
      stopAllMusic();
    case "sewers":
      if (sewerSound && sewerSound.isLoaded()) {
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
  // *** CHANGE 1: Added transparent background styles ***
  playButton.style("background-color", "transparent");
  playButton.style("border", "2px solid white");
  playButton.style("border-radius", "5px");
  // *** END CHANGE 1 ***
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
  // *** CHANGE 2: Added transparent background styles ***
  exitButton.style("color", "white");
  exitButton.style("background-color", "transparent");
  exitButton.style("border", "2px solid white");
  exitButton.style("border-radius", "5px");
  // *** END CHANGE 2 ***
  exitButton.size(140, 30);
  centerButtonOnCanvas(exitButton, 40);
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
  // *** CHANGE 3: Added transparent background styles ***
  proceedButton.style("color", "white");
  proceedButton.style("background-color", "transparent");
  proceedButton.style("border", "2px solid white");
  proceedButton.style("border-radius", "5px");
  // *** END CHANGE 3 ***
  proceedButton.size(180, 40);
  centerButtonOnCanvas(proceedButton, 60);
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

  memoryExitButton = createButton("return to map");
  memoryExitButton.style("color", "white");
  memoryExitButton.style("background-color", "transparent");
  memoryExitButton.style("border", "2px solid white");
  memoryExitButton.style("border-radius", "5px");
  memoryExitButton.size(140, 30);
  centerButtonOnCanvas(memoryExitButton, 60);
  memoryExitButton.hide(); 
  memoryExitButton.mousePressed(() => {
  playActionClick(); // Play click sound
  transitioningToMap = true;
  scene= "map";
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

  // Setup HTML controls - this is the key fix!
  setupHTMLControls();

  // Setup inventory box coordinates (top, left of other icons so it won't overlap)
  // Icons are drawn at width-40 (settings) and width-80 (map). Place inventory left of map.
  invSize = 44;
  invX = width - 130; // safe margin to the left of map icon
  invY = 10;

  // Initial bunny position (off until available)
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

function setupHTMLControls() {
  const vol = document.getElementById('vol');
  const volVal = document.getElementById('volVal');
  if (vol && volVal) {
    const initialVol = parseFloat(vol.value);
    if (homepageSound) homepageSound.setVolume(initialVol);
    if (carnivalSound) carnivalSound.setVolume(initialVol);
    if (ringtossMemory) ringtossMemory.setVolume(initialVol);
    if (funhouseSound) funhouseSound.setVolume(initialVol);
    if (actionclickSound) actionclickSound.setVolume(initialVol * 0.7);
    volVal.textContent = initialVol.toFixed(2);
    vol.addEventListener('input', () => {
      const v = parseFloat(vol.value);
      if (homepageSound) homepageSound.setVolume(v);
      if (carnivalSound) carnivalSound.setVolume(v);
      if (ringtossMemory) ringtossMemory.setVolume(v);
      if (funhouseSound) funhouseSound.setVolume(v);
      if (actionclickSound) actionclickSound.setVolume(v * 0.7);
      volVal.textContent = v.toFixed(2);
    });
  }

  const toggle = document.getElementById('toggle-sound');
  if (toggle) {
    toggle.addEventListener('click', () => {
      playActionClick();
      console.log("Sound button clicked, current scene:", scene);
      if (scene === "scene1.1") {
        if (carnivalSound && carnivalSound.isLoaded()) {
          if (!carnivalSound.isPlaying()) {
            if (homepageSound && homepageSound.isPlaying()) homepageSound.stop();
            if (ringtossMemory && ringtossMemory.isPlaying()) ringtossMemory.stop();
            if (funhouseSound && funhouseSound.isPlaying()) funhouseSound.stop();
            carnivalSound.loop();
          } else carnivalSound.stop();
        } else {
          setTimeout(() => {
            if (carnivalSound && carnivalSound.isLoaded()) carnivalSound.loop();
          }, 100);
        }
      } else if (scene === "scene2.0") {
        if (ringtossMemory && ringtossMemory.isLoaded()) {
          if (!ringtossMemory.isPlaying()) {
            if (homepageSound && homepageSound.isPlaying()) homepageSound.stop();
            if (carnivalSound && carnivalSound.isPlaying()) carnivalSound.stop();
            if (funhouseSound && funhouseSound.isPlaying()) funhouseSound.stop();
            if (sewerSound && sewerSound.isPlaying()) sewerSound.stop();
            ringtossMemory.loop();
          } else ringtossMemory.stop();
        } else {
          setTimeout(() => {
            if (ringtossMemory && ringtossMemory.isLoaded()) ringtossMemory.loop();
          }, 100);
        }
      } else if (scene === "funhouse") {
        if (funhouseSound && funhouseSound.isLoaded()) {
          if (!funhouseSound.isPlaying()) {
            if (homepageSound && homepageSound.isPlaying()) homepageSound.stop();
            if (carnivalSound && carnivalSound.isPlaying()) carnivalSound.stop();
            if (sewerSound && sewerSound.isPlaying()) sewerSound.stop();
            if (ringtossMemory && ringtossMemory.isPlaying()) ringtossMemory.stop();
            funhouseSound.loop();
          } else funhouseSound.stop();
        } else {
          setTimeout(() => {
            if (funhouseSound && funhouseSound.isLoaded()) funhouseSound.loop();
          }, 100);
        }
      } else if (scene === "start" || scene === "prologue") {
        if (homepageSound && homepageSound.isLoaded()) {
          if (!homepageSound.isPlaying()) {
            if (carnivalSound && carnivalSound.isPlaying()) carnivalSound.stop();
            if (ringtossMemory && ringtossMemory.isPlaying()) ringtossMemory.stop();
            if (sewerSound && sewerSound.isPlaying()) sewerSound.stop();
            if (funhouseSound && funhouseSound.isPlaying()) funhouseSound.stop();
            homepageSound.loop();
          } else homepageSound.stop();
        } else {
          setTimeout(() => {
            if (homepageSound && homepageSound.isLoaded()) homepageSound.loop();
          }, 100);
        }
      } else {
        if (homepageSound && homepageSound.isPlaying()) homepageSound.stop();
      }
    });
  }
}

function draw() {
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
  } else if (scene == "sewers") {
    image(img7, 0, 0, width, height);
  } else if (scene === "memory") {
    drawMemorySequence();
   
    if (!memoryMusicStarted) {
        playSceneMusic("memory");
        memoryMusicStarted = true;
    }
    // Check if memory music has finished playing
    if (ringtossMemory && !ringtossMemory.isPlaying() && memoryMusicStarted) {
        // Show exit button when music finishes
        memoryExitButton.show();
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



  } else if (scene === "scene2.0") {
    // ring toss scene
    image(img2, 0, 0, width, height);

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
      if (millis() - bunnyOverlayStartTime > 3000) {
        showBunnyOverlay = true;
      }
      
      // Draw the bunny overlay if it's time
      if (showBunnyOverlay && stuffedbunnyWon) {
        image(stuffedbunnyWon, 0, 0, width, height);
      }

      // --- NEW: handle the sequential messages and make bunny clickable after ---
      if (showBunnyOverlay) {
        // elapsed since the overlay became visible
        let elapsed = millis() - (bunnyOverlayStartTime + 3000);
        let msg1 = "you won the pink stuffed bunny!";
        let msg2 = "click on it to put it in your inventory up top!";

        // show first message immediately after overlay; second after 1500ms
        push();
        textAlign(CENTER, CENTER);
        textSize(18);
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
        
        if (elapsed >= 0) {
          text(msg1, width / 2, height * 0.15);
        }
        if (elapsed > 1500) {
          // draw second message below the first
          textSize(16);
          text(msg2, width / 2, height * 0.21);
        }
        pop();

        // After the second message has displayed for a short time, enable the draggable bunny
        if (elapsed > 2000 && !bunnyInInventory) {
          bunnyAvailable = true;
        }
      }
    }
  }

  // Draw UI icons (settings, map, inventory) - but not on start screen
  if (scene !== "start") {
    if (settings) {
      image(settings, width - 40, 10, 30, 30);
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
    // invX, invY and invSize set in setup and windowResized
    rect(invX, invY, invSize, invSize, 6);
    if (inventory) {
      // draw inventory image centered in that rect
      imageMode(CENTER);
      image(inventory, invX, invY, invSize, invSize);
      imageMode(CORNER);
    }
    pop();
  }

 // If the bunny is available and not yet in inventory, draw it bigger
if (bunnyAvailable && !bunnyInInventory) {
  push();
  imageMode(CENTER);
  if (stuffedBunny) {
    image(stuffedBunny, bunnyX, bunnyY -75, 470, 470); // ⬅ bigger size here
  } else if (stuffedbunnyWon) {
    image(stuffedbunnyWon, bunnyX - 80, bunnyY - 80, 160, 160);
  }
  imageMode(CORNER);
  pop();
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

    // inventory panel
    let panelW = width * 0.8;
    let panelH = height * 0.75;
    let panelX = width * 0.1;
    let panelY = height * 0.12;
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
    let cols = 4;
    let padding = 18;
    let slotSize = min(80, (panelW - padding * 2) / cols - 12);
    let startX = panelX + padding;
    let startY = panelY + 50;

    // draw placeholder empty slots then items
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < cols; c++) {
        let sx = startX + c * (slotSize + 12);
        let sy = startY + r * (slotSize + 12);
        stroke(120);
        noFill();
        rect(sx, sy, slotSize, slotSize, 6);
      }
    }

    // If bunny is in inventory, draw it in first slot
    if (bunnyInInventory && stuffedBunny) {
      imageMode(CORNER);
      let sx = startX;
      let sy = startY;
      // draw bunny image scaled to slot
      image(stuffedBunny, sx + 6, sy + 6, slotSize - 12, slotSize - 12);
    }
    pop();

    // show inventory exit button and position it relative to panel
    inventoryExitButton.show();
    // compute position for the inventoryExitButton so it sits top-right of the panel
    let canvasX = canvas.elt.getBoundingClientRect().left + window.scrollX;
    let canvasY = canvas.elt.getBoundingClientRect().top + window.scrollY;
    let btnX = canvasX + panelX + panelW - inventoryExitButton.width - 16;
    let btnY = canvasY + panelY + 12;
    inventoryExitButton.position(btnX, btnY);
  } else {
    // hide inventory exit button if window not open
    inventoryExitButton.hide();
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
  // Prevent interactions during short transitions
  if (transitioningToRingToss) return;

  // --- PRIORITIZE inventory window interactions ---
  if (inventoryWindow) {
    return;
  }

  // --- If bunny overlay is showing AND bunny available, check for clicking the bunny to add to inventory ---
  if (scene === "scene2.0" && showBunnyOverlay && bunnyAvailable && !bunnyInInventory) {
    // bunny is drawn at bunnyX, bunnyY (usually width/2, height/2)
    let d = dist(mouseX, mouseY, bunnyX, bunnyY);
    if (d < 80) { // Clicked bunny
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
      return; // Stop further processing!
    }
  }

  // --- Inventory icon click (open inventory window) ---
  if (scene !== "start") {
    if (mouseX >= invX && mouseX <= invX + invSize && mouseY >= invY && mouseY <= invY + invSize) {
      playActionClick();
      inventoryWindow = true;
      return;
    }
  }

  // settings click
  if (mouseX > width - 40 && mouseX < width - 10 && mouseY > 10 && mouseY < 40) {
    playActionClick();
    scene = "settings"; 
    return;
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
    } else {
      ringAttached = false;
      attachedHook = null;
    }
    return;
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
  invX = width - 120;
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
