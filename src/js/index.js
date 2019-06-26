/**
 * Every object has the structure:
 * object {
 *   mass: float,
 *   radius: float,
 *   velocity: [x, y],
 *   force: [x, y],
 *   coord: [x, y],
 *   lastTimeUpdated: Int (Date.now())
 *   float  ::= 64-bit Floating Point number
 *   [x, y] ::= 2-tuple
 * }
 *
 * The reason for using lists is for adding the possibility to expanding it to more dimensions
 */

const OPACITY = 0.7;
const MAX = 0.01;
const TOLERANCE = 10;
var MAX_DIST;
var MAX_COORD;
var OBJECTS;
var G;
var SLOW_DOWN;
var canvas;
var context;

var requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var requestId;

startSimulation();

/**
 * Init the animation
 * @param  {Array} size                   [Array with max x and y values]
 * @param  {Int} amountOfObjects          [Amount of initial nodes ()]
 * @param  {Double} g                     [Describes how strong the gravity is]
 * @param  {Double} slowDown              [If the animation is too fact, slow it down by this factor]
 */
function startSimulation(id = "canvas", size = [window.innerWidth - 20, window.innerHeight * 0.8], amountOfObjects = 100,
  g = 0.4, slowDown = 12.0) {
  canvas = document.getElementById(id);
  context = canvas.getContext("2d");

  MAX_COORD = size;
  OBJECTS = amountOfObjects;
  G = g;
  SLOW_DOWN = slowDown;
  MAX_DIST = getDistance([MAX_COORD[0] / 6, MAX_COORD[1] / 6]);

  setCanvasSize(canvas);
  let objects = generateObjects(amountOfObjects);

  draw(objects);
}

function stopSimulation() {
  cancelAnimationFrame(requestId);
}

function setCanvasSize(canvas) {
  canvas.setAttribute("width", MAX_COORD[0]);
  canvas.setAttribute("height", MAX_COORD[1]);
}

function draw(objects) {
  if (objects.length < 20) {
    cancelAnimationFrame(requestId);
    let objects = generateObjects(OBJECTS);
    draw(objects);
    return;
  }
  context.clearRect(0, 0, MAX_COORD[0], MAX_COORD[1]);
  let forces = updateObjects(objects);
  checkForOutOfBounds(objects);
  drawCircles(objects);
  drawLines(objects, forces);
  requestId = requestAnimationFrame(() => draw(objects));
}

function drawCircles(objects) {
  objects.forEach((object) => {
    context.beginPath();
    context.arc(object.coord[0], object.coord[1], object.radius, 0, 2 * Math.PI, false);
    if (object.mass > 20.0) {
      context.fillStyle = "rgb(255, 255, 255)";
    } else {
      context.fillStyle = "rgba(255, 255, 255," + OPACITY + ")";
    }
    context.fill();
    context.lineWidth = 0;
  });
}

function drawLines(objects, forces) {
  getMagnitudeForce(objects, forces);
  for (let i = 0; i < objects.length; i++) {
    for (let j = 0; j < objects.length; j++) {
      if (i >= j || distanceTooGreat(objects[i], objects[j])) {
        continue;
      }
      if (forces[i][j] >= MAX) context.strokeStyle = "rgba(255, 255, 255," + OPACITY + ")";
      else {
        let opacity = (forces[i][j] / MAX) * OPACITY;
        context.strokeStyle = "rgba(255, 255, 255," + opacity + ")";
      }
      context.beginPath();
      context.lineWidth = 1;
      context.moveTo(objects[i].coord[0], objects[i].coord[1]);
      context.lineTo(objects[j].coord[0], objects[j].coord[1]);
      context.stroke();
    }
  }
}

function checkForOutOfBounds(objects) {
  for (let i = 0; i < objects.length; i++) {
    if (objects[i].coord[0] < -TOLERANCE || objects[i].coord[0] > MAX_COORD[0] + TOLERANCE ||
      objects[i].coord[1] < -TOLERANCE || objects[i].coord[1] > MAX_COORD[1] + TOLERANCE) {
      objects.splice(i, 1);
      i--;
    }
  }
}

function distanceTooGreat(obj1, obj2) {
  let subVec = vectorOperation(obj1.coord, obj2.coord, sub);
  let distance = getDistance(subVec);
  return distance > MAX_DIST;
}

function getMagnitudeForce(objects, forces) {
  for (let i = 0; i < objects.length; i++) {
    for (let j = 0; j < objects.length; j++) {
      if (i > j) {
        continue;
      }
      forces[i][j] = getDistance(forces[i][j]);
      forces[j][i] = forces[i][j];
    }
  }
}

function generateObjects(amount) {
  let objects = [];
  for (let i = 0; i < amount; i++) {
    let mass = getRandomInt(1, 10) * 1.0;
    objects.push({
      mass: mass,
      radius: calculateRadius(mass),
      velocity: [getRandomInt(0, 1) * 1.0, getRandomInt(0, 1) * 1.0],
      force: [0, 0],
      coord: [getRandomInt(0, MAX_COORD[0]), getRandomInt(0, MAX_COORD[1])],
      lastTimeUpdated: Date.now()
    });
  }
  return objects;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
