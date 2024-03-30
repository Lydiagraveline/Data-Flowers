// Define the initial state
let state = 'loading'; // can be loading, loaded, hinge

let hingeData = [];
let hingeMatches = [];
let matches = [];


let budImg;
let buddingImg;
let flower2img;
let flowerimg;
let witheringimg;
let witheredimg;

let hover = false;

let touchInProgress = false; // Keep track of touch events
let recentClick = false; // Track recent click events

// Function to fetch data from the server
async function fetchData(path, className) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    return createClassObj(result, className);
  } catch (error) {
    console.error(`Error fetching data from ${path}:`, error);
    return [];
  }
}

// Preload the data & media
async function preload() {
  try {
    // Fetch data and assign them to the variables
    hingeMatches = await fetchData('/hingeData');
    // Set the state once data is fetched
    state = "loaded";
    // Call setup function again 
    setup();
  } catch (error) {
    console.error('Error during preload:', error);
  }
}

// Function to create class objects from fetched data
function createClassObj(result, className) {
  if (result && className) {
    return result.map(item => new className(item));
  } else {
    //console.log("class not defined");
    return result;
  }
}

//set up
function setup() {
    createCanvas(windowWidth, windowHeight);
    // textAlign(CENTER, CENTER);
    let textSizeFactor = min(windowWidth, windowHeight) / 45; 
    textSize(textSizeFactor);
    // Load images 
    budImg = loadImage('media/hingeFlowers/bud.png');
    buddingImg = loadImage('media/hingeFlowers/budding.png');
    flower2img = loadImage('media/hingeFlowers/flower.png');
    flowerimg = loadImage('media/hingeFlowers/fullflower.png');
    witheringimg = loadImage('media/hingeFlowers/withering.png');
    witheredimg = loadImage('media/hingeFlowers/withered.png'); 
  }

// Draw function to display content based on the state
function draw(){
  background(245);
  // Display content based on the current state
  if (state == 'loading') {
    text('loading data...', width/2, height/2 + 200);
  } else if (state == 'loaded') {
    state = 'hinge'
  } else if (state == 'hinge'){
    handleHingeFlowers();
  }  
 }

 function touchStarted() {
  touchInProgress = true; // Set touchInProgress to true when touch starts
  // console.log("touch in progress");
}

function touchEnded() {
  touchInProgress = false; // Set touchInProgress to false when touch ends
  // console.log("touch ended");
}


// draw the flowers 
function touchMoved() {
  if (touchInProgress && state == 'hinge'){
     createHingeFlowers();
  }
  return false;
}

// Function to handle mouse drag event
function mouseDragged() {
  if (!recentClick && !touchInProgress && state == 'hinge') {
    createHingeFlowers();
    console.log("mouse Dragged")
  }
}

function mousePressed (){
  if (!touchInProgress && state == 'hinge'){
    createHingeFlowers();
    console.log("mouse Pressed")
    recentClick = true; // Set recentClick to true when a click event occurs
    setTimeout(() => {
      recentClick = false; // Reset recentClick after a short delay
    }, 100); // Adjust the delay as needed
  }
}

function createHingeFlowers() {
  for (let i = matches.length - 1; i >= 0; i--) {
    if (matches[i].contains(mouseX, mouseY)) {
      matches[i].handleClick();
      hover = true;
    }
  }
  if (hover === false) {
    let index = floor(random(hingeMatches.length));
    let newMatch = new Match(hingeMatches[index], budImg, buddingImg, flower2img, flowerimg, witheringimg, witheredimg);
    matches.push(newMatch);
  }
}

function handleHingeFlowers() {
  hover = false; // Reset hover before handling matches
  for (let i = matches.length - 1; i >= 0; i--) {
    if (matches[i].contains(mouseX, mouseY)) {
      matches[i].handleHover();
      hover = true;
    } else {
      matches[i].handleHoverOutside();
    }
    if (matches[i].withered()) {
      matches.splice(i, 1);
    } else if (matches[i].filter()) {
      matches.splice(i, 1);
      //mousePressed(); 
    } else {
      matches[i].display();
    }
  }
}


