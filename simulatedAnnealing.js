let canvas = document.getElementById('canvas');
let context = canvas.getContext("2d");

const CITIES_COUNT = 10;
const CR = 0.5;
let temperature = 0.1;
let currentRoute = [];
let bestRoute = [];
let bestCost = 0;

function randomNumber(n) {
   return Math.floor(Math.random() * (n));
}

function randomLocation(a, b) {
   return Math.floor(Math.random() * (b - a) + a);
}

function copyArr(array, to) {
   let i = array.length;
   while (i != 0) {
      i--;
      to[i] = [array[i][0], array[i][1]];
   }
}

// TODO menghitung delta
function getDiffCity(route) {
   let cost = 0;
   for (let i = 0; i < CITIES_COUNT - 1; i++) {
      cost += getDistance(route[i], route[i + 1]);
   }
   cost += getDistance(route[0], route[CITIES_COUNT - 1]);
   return cost;
}

function getDistance(p1, p2) {
   del_x = p1[0] - p2[0];
   del_y = p1[1] - p2[1];
   return Math.sqrt((del_x * del_x) + (del_y * del_y));
}

function getNeighbor(route, i, j) {
   let neighbor = [];
   copyArr(route, neighbor);
   while (i != j) {
      let t = neighbor[j];
      neighbor[j] = neighbor[i];
      neighbor[i] = t;

      i = (i + 1) % CITIES_COUNT;
      if (i == j)
         break;
      j = (j - 1 + CITIES_COUNT) % CITIES_COUNT;
   }
   return neighbor;
}

function getProbability(currentCost, neighborCost) {
   if (neighborCost < currentCost)
      return 1;
   return Math.exp((currentCost - neighborCost) / temperature);
}

function run() {
   let currentCost = getDiffCity(currentRoute);
   let k = randomNumber(CITIES_COUNT);
   let l = (k + 1 + randomNumber(CITIES_COUNT - 2)) % CITIES_COUNT;
   if (k > l) {
      let tmp = k;
      k = l;
      l = tmp;
   }
   let neighbor = getNeighbor(currentRoute, k, l);
   let neighborCost = getDiffCity(neighbor);
   if (Math.random() < getProbability(currentCost, neighborCost)) {
      copyArr(neighbor, currentRoute);
      currentCost = getDiffCity(currentRoute);
   }
   if (currentCost < bestCost) {
      copyArr(currentRoute, bestRoute);
      bestCost = currentCost;
      draw();
   }
   temperature *= CR;
}

function draw() {
   context.clearRect(0, 0, canvas.width, canvas.height);
   // Cities
   for (let i = 0; i < CITIES_COUNT; i++) {
      context.beginPath();
      context.arc(bestRoute[i][0], bestRoute[i][1], 4, 0, 2 * Math.PI);
      // context.fillStyle = "red";
      context.strokeStyle = "red";
      context.closePath();
      context.fill();
      if (i === 0) {
         context.lineWidth = 20;
      } else {
         context.lineWidth = 10;
      }
      context.closePath();
      context.stroke();
   }
   context.strokeStyle = "white";
   context.lineWidth = 2;
   context.moveTo(bestRoute[0][0], bestRoute[0][1]);
   for (let i = 0; i < CITIES_COUNT - 1; i++) {
      context.lineTo(bestRoute[i + 1][0], bestRoute[i + 1][1]);
      context.stroke();
   }
   context.closePath();
   context.lineTo(bestRoute[0][0], bestRoute[0][1]);
   context.stroke();
   context.closePath();
}

// TODO input koordinat lokasi, saat ini masih generate secara random sejumlah cities
for (let i = 0; i < CITIES_COUNT; i++) {
   currentRoute[i] = [randomLocation(10, canvas.width - 10), randomLocation(10, canvas.height - 10)];
}

// deep copy array currentRoute ke bestRoute
copyArr(currentRoute, bestRoute);
bestCost = getDiffCity(bestRoute);
// setInterval(solve, 10);
for (let i = 0; i < 100; i++) {
   run()
}