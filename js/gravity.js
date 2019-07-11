/**
 * Updates every object according to all of the forces
 * acting upon them
 */
function updateObjects(objects) {
  forces = calculateForces(objects);
  for (let i = 0; i < objects.length; i++) {
    let force = multipleVectorOperation(forces[i], add); // Add all force vectors together
    let acc = scalarOperation1(objects[i].mass, force, div);
    let timeDiff = (Date.now() - objects[i].lastTimeUpdated) / SLOW_DOWN;
    let timeArray = initialiseArray(objects[i].velocity.length, timeDiff);
    let newVel = vectorOperation(timeArray, acc, mult);
    objects[i].velocity = vectorOperation(objects[i].velocity, newVel, add);
    let distTravelled = vectorOperation(timeArray, objects[i].velocity, mult);
    objects[i].coord = vectorOperation(distTravelled, objects[i].coord, add);
    objects[i].lastTimeUpdated = Date.now();
  }
  checkForCollisions(objects);
  checkForOutSideCanvas(objects);

  return forces;
}

/**
 * Checks if 2 objects have collided. If they have,
 * it merges them.
 */
function checkForCollisions(objects) {
  for (let i = 0; i < objects.length; i++) {
    for (let j = 0; j < objects.length; j++) {
      if (i >= j) {
        continue;
      }
      if (detectCollision(objects[i], objects[j])) {
        objects[i].mass += objects[j].mass;
        objects[i].radius = calculateRadius(objects[i].mass);
        relativeVelocityJ = (objects[j].mass * 1.0) / objects[i].mass;
        relativeVelocityI = 1.0 - relativeVelocityJ;
        objects[i].velocity = scalarOperation(relativeVelocityI, objects[i].velocity, mult);
        let velocityJ = scalarOperation(relativeVelocityJ, objects[j].velocity, mult);
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
function detectCollision(obj1, obj2) {
  let subVec = vectorOperation(obj1.coord, obj2.coord, sub);
  let distance = getDistance(subVec);
  return distance < (obj1.radius + obj2.radius);
}

/**
 * If a node goes out of the canvas, turn it around.
 * This is the only place where we assume the data to be 2D.
 */
function checkForOutSideCanvas(objects) {
  for (let i = 0; i < objects.length; i++) {
    if (objects[i].coord[0] > MAX_COORD[0] || objects[i].coord[0] < 0) {
      objects[i].velocity = [-objects[i].velocity[0], objects[i].velocity[1]];
    } else if (objects[i].coord[1] > MAX_COORD[1] || objects[i].coord[1] < 0) {
      objects[i].velocity = [objects[i].velocity[0], -objects[i].velocity[1]];
    }
  }
}

/**
 * Calculates all the forces
 * @param  {Array} objects  [Array of all objects]
 * @return {Array}          [2D array with the force between x and y as array[x][y]]
 */
function calculateForces(objects) {
  let result = initialise2DArray(objects.length);
  for (let i = 0; i < objects.length; i++) {
    for (let j = 0; j < objects.length; j++) {
      if (i == j) {
        result[i][j] = initialiseArray(objects[i].force.length, 0);
      } else if (result[i][j] !== undefined) {
        continue;
      } else {
        result[j][i] = calculateForce(objects[i], objects[j]);
        result[i][j] = _.map(result[j][i], x => -x);
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
  let distance = getDistance(subVec);
  let norVec = distance === 0 ? initialiseArray(subVec.length, 0) : getNormalisedVector(subVec, distance);
  let force = distance === 0 ? 0 : (G * obj1.mass * obj2.mass) / (distance * distance);
  return _.map(norVec, x => x * force);
}

function getDistance(v) {
  let result = 0;
  for (let i = 0; i < v.length; i++) {
    result += v[i] * v[i];
  }
  return Math.sqrt(result);
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
  return _.reduce(vectors, (sum, x) => vectorOperation(sum, x, op));
}

/**
 * Takes 2 vectors (arrays) and returns another
 * vector which is the result of op(v1, v2)
 */
function vectorOperation(v1, v2, op) {
  let minLength = Math.min(v1.length, v2.length);
  let newV = [];
  for (let i = 0; i < minLength; i++) {
    newV.push(op(v1[i] * 1.0, v2[i]));
  }
  return newV;
}

function scalarOperation(scalar, v, op) {
  return _.map(v, x => op(scalar, x));
}

function scalarOperation1(scalar, v, op) {
  return _.map(v, x => op(x, scalar));
}

/**
 * Initialises an array of length n with value as every entry
 */
function initialiseArray(length, value) {
  return _.map(new Array(length), x => value);
}

function initialise2DArray(length) {
  let result = [];
  for (let i = 0; i < length; i++) {
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

function div(x, y) {
  return y === 0 ? 0 : x / y;
}
