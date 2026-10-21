let ADMARK = [];
let AD = [];

let sliderX = 100;
let sliderY = 200;
let sliderSize = 300;
let sliderMax = 100;
let sliderVal = 0;
let isDragging = false;

let content = [];
let contentFiles = [
  "yippee-happy.gif",
  "c20aba1faa466939231d3cce391bd0fd.jpg",
  "Screenshot 2024-08-05 at 10.06.47 PM.png",
  "221959-messages-emoticons-bad-thumbs-down.gif",
  "flower-cat.gif",
  "free-breaking-free.png",
  "f5ef5000641ee61a1866e04430db71fd.gif",
];

let volumeSym;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  //generate initial # of adMarkers
  for (let i = 0; i < 5; i++) {
    let adMarkerpos = random(0, sliderMax);
    let adMarker = int(adMarkerpos);
    ADMARK.push(
      new Ad(adMarker * (sliderSize / sliderMax) + sliderX, 197, adMarker)
    );
  }

  content = await Promise.all(contentFiles.map((file) => loadImage(file)));
  volumnSym = await loadImage('images-removebg-preview.png');
}

function draw() {
  background(200);

  image(volumnSym, 40, 180, 40, 40);
  //draws custom slider
  if (isDragging) {
    let constrainedX = constrain(mouseX, sliderX, sliderX + sliderSize);
    sliderVal = int(map(constrainedX, sliderX, sliderX + sliderSize, 0, sliderMax));
  }
  stroke(100);
  strokeWeight(4);
  line(sliderX, sliderY, sliderX + sliderSize, sliderY);
  let knobX = map(sliderVal, 0, sliderMax, sliderX, sliderX + sliderSize);
  fill(255);
  noStroke();
  ellipse(knobX, sliderY, 16, 16);

  //draws markers  on slider
  let vol = sliderVal;
  for (let m of ADMARK) {
    m.collide(vol);
    m.run();
  }
  //draws ad
  for (let a of AD) {
    if (a.img) {
      stroke(0);
      strokeWeight(1);
      fill(50, 100, a.color);
      rect(a.x, a.y, a.size, a.size + 7.5);
      fill(a.color);
      rect(a.x + 2.5, a.y + 10, a.size - 5, a.size - 5);
      image(a.img, a.x + 2.5, a.y + 10, a.size - 5, a.size - 5);
      fill(a.color, 0, 0);
      strokeWeight(.5);
      rect(a.x + a.size - 8, a.y + 2, 6);
      line(a.x + a.size - 6, a.y + 4, a.x + a.size - 4, a.y + 6);
      line(a.x + a.size - 4, a.y + 4, a.x + a.size - 6, a.y + 6);
    }
  }
}

function mousePressed() {
  let adClicked = false;
  for (let i = AD.length - 1; i >= 0; i--) {
    let a = AD[i];
    if (
      mouseX >= a.x + a.size - 7 &&
      mouseX <= a.x + a.size - 2 &&
      mouseY >= a.y + 2 &&
      mouseY <= a.y + 7
    ) {
      AD.splice(i, 1);
      adClicked = true;
      break;
    }
  }

  if (!adClicked) {
    let knobX = map(sliderVal, 0, sliderMax, sliderX, sliderX + sliderSize);
    let d = dist(mouseX, mouseY, knobX, sliderY);
    if (d < 20) {
      isDragging = true;
    }
  }
}

function mouseReleased() {
  isDragging = false;
}
class Ad {
  constructor(x, y, adMark) {
    this.x = x;
    this.y = y;
    this.adMark = adMark;
  }

  run() {
    noStroke();
    fill(255, 225, 50);
    rect(this.x, this.y, 5);
  }

  collide(currentVol) {
    if (this.adMark === currentVol) {
      //add new ad
      let adSize = random(50, windowWidth / 3);
      let chosenContent = random(content);

      let newad = {
        x: random(0, width - adSize),
        y: random(0, height - adSize),
        size: adSize,
        img: chosenContent,
        color: 255,
      };
      AD.push(newad);

      //adds more markers
      this.adMark = int(random(0, sliderMax));
      this.x = this.adMark * (sliderSize / sliderMax) + sliderX;
    }
  }
}
