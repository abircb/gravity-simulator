const G = 6.6;  // Can be anything but this avoids working with small numbers

// TODO: Collisions

/**
 * Updates every object according to all of the forces
 * acting upon them
 */
function updateObjects(objects) {
  forces = calculateForces(objects);
  for(let i = 0; i < objects.length; i++) {
    let force = multipleVectorOperation(forces[i], add); // Add all force vectors together
    let acc = force / objects[i].mass;
    let timediff = Date.now() - objects[i].lastTimeUpdated;
    let timeArray = initialiseArray(objects[i].velocity.length, timeDiff);
    let newVel = vectorOperation(timeArray, acc, mult);
    objects[i].velocity = vectorOperation(objects[i].velocity, newVel, add);
    let distTravelled = vectorOperation(timeArray, objects[i].velocity, mult);
    objects[i].coord = vectorOperation(distTravelled, objects[i].coord, add);
    objects[i].lastTimeUpdated = Date.now();
  }
  checkForCollisions(objects);
  checkForOutSideCanvas(objects);
}

/**
 * Checks if 2 objects have collided. If they have,
 * it merges them.
 */
function checkForCollisions(objects) {
  for(let i = 0; i < objects.length; i++) {
    for(let j = 0; j < objects.length; j++) {
      if(i >= j) { continue; }
      if(detectCollision(objects[i], objects[j])) {
        objects[i].mass += objects[j].mass;
        objects[i].radius = calculateRadius(objects[i].mass);
        relativeVelocityJ = (objects[j].mass * 1.0) / objects[i].mass;
        relativeVelocityI = 1.0 - relativeVelocityJ;
        objects[i].velocity = vectorOperation(initialiseArray(objects[i].velocity.length, relativeVelocityI), objects[i].velocity, mult);
        let velocityJ =  vectorOperation(initialiseArray(objects[j].velocity.length, relativeVelocityJ), objects[j].velocity, mult);
        objects[i].velocity = vectorOperation(objects[i].velocity, velocityJ, add);
        objects.splice(j, 1);
        j--;
      }
    }
  }
}

/**
 * Detects if there is a collision between 2 objects.
 * This can be done by checking if the center of any 2 circles (x and y)
 * are more than r_x + r_y distance from each other
 */
function detectCollision(obj1, objd2) {
  let subVec = vectorOperation(obj1.coord, obj2.coord, sub);
  let distance = Math.sqrt(_.reduce(subVec, (sum, x) => sum + x * x));
  return distance < (obj1.radius + obj2.radius);
}

/**
 * If a node goes out of the canvas, turn it around
 */
function checkForOutSideCanvas(objects) {

}

/**
 * Calculates all the forces
 * @param  {Array} objects  [Array of all objects]
 * @return {Array}          [2D array with the force between x and y as array[x][y]]
 */
function calculateForces(objects) {
  let result = initialise2DArray(objects.length);
  for(let i = 0; i < objects.length; i++) {
    for(let j = 0; j < objects.length; j++) {
      if(i == j) { result[i][j] = 0; }
      else if(result[i][j] !== undefined) { continue; }
      else {
        result[i][j] = calculateForce(object[i], objects[j]);
        result[j][i] = vectorOperation(initialiseArray(result[i][j].length, 0), result[i][j], sub);
      }
    }
  }
  return result;
}

/**
 * Calculates the gravity force between 2 objects
 * @return {Array}      [Array with force]
 */
function calculateForce(obj1, obj2) {
  let subVec = vectorOperation(obj1.coord, obj2.coord, sub);
  let distance = Math.sqrt(_.reduce(subVec, (sum, x) => sum + x * x));
  let norVec = getNormalisedVector(subVec, distance);
  let force = (G * obj1.mass * obj2.mass)/(distance * distance);
  return _.map(norVec, x => x * force);
}

/**
 * Get the normalised vector (unit length 1)
 */
function getNormalisedVector(subVec, dist) {
  return _.map(subVec, x => (x * 1.0) / dist);
}

/**
 * Takes an array of vectors and adds them together
 */
function multipleVectorOperation(vectors, op) {
  _.reduce(vectors, (sum, x) => vectorOperation(sum, x, op));
}

/**
 * Takes 2 vectors (arrays) and returns another
 * vector which is the result of op(v1, v2)
 */
function vectorOperation(v1, v2, op) {
  let minLength = Math.min(v1.length, v2.length);
  let newV = [];
  for(let i = 0; i < minLength; i++) {
    newV.push(op(v1[i] * 1.0, v2[i]));
  }
  return newV;
}

/**
 * Initialises an array of length n with value as every entry
 */
function initialiseArray(length, value) {
  return _.map(new Array(length), x => value);
}

function initialise2DArray(length) {
  let result = [];
  for(let i = 0; i < length; i++) {
    result.push(new Array(length));
  }
  return result;
}

function sub(x, y) {
  return x - y;
}

function add(x, y) {
  return x + y;
}

function mult(x, y) {
  return x * y;
}
