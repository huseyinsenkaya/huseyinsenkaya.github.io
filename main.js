/*------TYPEWRITER------*/
const textArray = ["web developer", "game developer"];
const typingDelay = 200;
const erasingDelay = 100;
const newTextDelay = 2000;
const dynText = document.querySelector(".d-text");
const cursorSpan = document.querySelector(".cursor");
let charIndex = 0;
let textArrayIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    dynText.innerHTML += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  }
  else {
    cursorSpan.classList.remove("typing");
    setTimeout(erase, newTextDelay)
  }
}

function erase() {
  if (charIndex > 0) {
    if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    dynText.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  }
  else {
    cursorSpan.classList.remove("typing");
    textArrayIndex++;
    if (textArrayIndex >= textArray.length) textArrayIndex = 0;
    setTimeout(type, typingDelay);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(type, 4000);
})

/*------HAMBURGER-NAVBAR------*/
const hamburger_menu = document.querySelector(".hamburger-menu");
const container = document.querySelector(".containerr");

hamburger_menu.addEventListener('click', () => {
  container.classList.toggle("active");
  if (container.classList.contains('active')) {
    document.querySelector(".menu-container").style.height = "100%";
  }
  else {
    document.querySelector(".menu-container").style.height = "0%";
  }
})


/*------navbar-scrool------*/

let prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  let currentScrollpos = window.pageYOffset;
  if (prevScrollpos > currentScrollpos) {
    document.querySelector(".navbarr").style.top="0"
  }
  else {
    document.querySelector(".navbarr").style.top="-75px"
  }
  prevScrollpos = currentScrollpos;
}








/*------BACKGROUND------*/
// Synthwave world
let c = document.createElement('canvas').getContext('2d')
let postctx = document.querySelector(".big-container").appendChild(document.createElement('canvas')).getContext('2d')

// This is for TV-effect
let redFilter = document.createElement('canvas').getContext('2d')
let greenFilter = document.createElement('canvas').getContext('2d')
let blueFilter = document.createElement('canvas').getContext('2d')

let canvas = c.canvas
let frame = 0
let noise = 0

// Properties
let grid = 24
let perspective = 100
let depth = 5000
let cameraY = 100

// Common
let xInterval = depth / grid
let zInterval = depth / grid

let drawLine = (x1, y1, x2, y2) => {
  c.beginPath()
  c.moveTo(x1, y1)
  c.lineTo(x2, y2)
  c.stroke()
}

let drawSun = (x, y, r) => {
  c.fillStyle = c.createLinearGradient(x, y - r, x, y + r)
  c.fillStyle.addColorStop(0.1, "#fdce74")
  c.fillStyle.addColorStop(0.8, "#d60066")

  c.beginPath()
  c.arc(x, y, r, 0, Math.PI * 2)
  c.fill()
}

// Render loop
let loop = () => {
  frame++

  // Resizing canvas
  if (postctx.canvas.width !== postctx.canvas.offsetWidth || postctx.canvas.height !== postctx.canvas.offsetHeight) {
    postctx.canvas.width =
      canvas.width =
      redFilter.canvas.width =
      greenFilter.canvas.width =
      blueFilter.canvas.width =
      postctx.canvas.offsetWidth / 2

    postctx.canvas.height =
      canvas.height =
      redFilter.canvas.height =
      greenFilter.canvas.height =
      blueFilter.canvas.height =
      postctx.canvas.offsetHeight / 2

  }

  c.fillStyle = "#0f050d"
  c.fillRect(0, 0, canvas.width, canvas.height)
  c.save()
  c.translate(canvas.width / 1.2, canvas.height / 1.5)

  drawSun(0, -64, 128)

  c.strokeStyle = "#00e9fb"
  // Vertical Lines
  for (let i = 0; i < grid * 10; i++) {
    let x1 = (-grid * 5 + i) * xInterval
    let y1 = cameraY
    let z1 = 1

    let x2 = x1
    let y2 = y1
    let z2 = depth

    let px1 = x1 / z1 * perspective;
    let py1 = y1 / z1 * perspective;

    let px2 = x2 / z2 * perspective;
    let py2 = y2 / z2 * perspective;

    drawLine(px1, py1, px2, py2)
  }

  // Horizontal Lines
  for (let i = 0; i <= depth / zInterval; i++) {
    let x1 = -grid * 5 * xInterval
    let y1 = cameraY
    let z1 = i * zInterval - frame * 10 % zInterval

    let x2 = grid * 5 * xInterval
    let y2 = y1
    let z2 = z1

    let px1 = x1 / z1 * perspective;
    let py1 = y1 / z1 * perspective;

    let px2 = x2 / z2 * perspective;
    let py2 = y2 / z2 * perspective;

    if (z1 < 0) continue

    drawLine(px1, py1, px2, py2)
  }
  c.restore()

  // Post-processing
  // Getting only red colors from canvas
  redFilter.drawImage(canvas, 2, 0)
  redFilter.globalCompositeOperation = 'multiply'
  redFilter.fillStyle = "#f00"
  redFilter.fillRect(0, 0, canvas.width, canvas.height)
  redFilter.globalCompositeOperation = 'source-over'

  // Getting only green colors from canvas
  greenFilter.drawImage(canvas, 2, 0)
  greenFilter.globalCompositeOperation = 'multiply'
  greenFilter.fillStyle = "#0f0"
  greenFilter.fillRect(0, 0, canvas.width, canvas.height)
  greenFilter.globalCompositeOperation = 'source-over'

  // Getting only blue colors from canvas
  blueFilter.drawImage(canvas, 2, 0)
  blueFilter.globalCompositeOperation = 'multiply'
  blueFilter.fillStyle = "#00f"
  blueFilter.fillRect(0, 0, canvas.width, canvas.height)
  blueFilter.globalCompositeOperation = 'source-over'

  // Combine all filter in one with bloom effect and color shifting

  // Generates each 5 frame a new color shift
  if (frame % 5 === 0) {
    noise = Math.random()
  }

  postctx.clearRect(0, 0, canvas.width, canvas.height)
  postctx.globalCompositeOperation = 'screen'
  postctx.filter = 'blur(0.5px)'
  postctx.drawImage(redFilter.canvas, 1, 0)
  postctx.drawImage(greenFilter.canvas, -1 * noise, 0)
  postctx.drawImage(blueFilter.canvas, -5 * noise, 0)


  postctx.filter = 'blur(8px)'
  postctx.drawImage(postctx.canvas, 0, 0)
  postctx.globalCompositeOperation = 'source-over'

  requestAnimationFrame(loop)
}

loop()


/*---------CARD ANIMATION---------*/
const cards = document.querySelectorAll(".card");
const workContainer = document.querySelector("#work .containerr");
const titles = document.querySelectorAll(".title");


cards.forEach((card, index) => {
  card.addEventListener('mousemove', (e) => {

    let xAxis = (((window.innerWidth / 2)) - e.pageX) / 25;

    let yAxis = (((window.innerHeight / 2) + 600) - e.pageY) / 25;
    card.style.transform = `perspective(700px)  rotateX(${yAxis}deg) rotateY(${xAxis}deg) scale3d(1.05, 1.05, 1.05)`;
  });

  //mouse in
  card.addEventListener('mouseenter', e => {
    card.style.transition = "none"
    //Popout
    //titles[index].style.transform = "translateZ(30px)"
  })
  //mouse out
  card.addEventListener('mouseleave', e => {
    card.style.transition = "all 0.3s ease"
    card.style.transform = `rotateY(0deg) rotateX(0deg) `;
    //Popin
    //titles[index].style.transform = "translateZ(0px)"
  })

});












