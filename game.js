/*
To add:
- comments
- end scren
- rules
- timer (?)
*/

// Get width/height of the browser window
windowWidth = window.innerWidth;
windowHeight = window.innerHeight;
console.log("Window is %d by %d", windowWidth, windowHeight);

// Get the canvas, set the width and height from the window
canvas = document.getElementById("mainCanvas");
// I found that - 20 worked well for me, YMMV
canvas.width = windowWidth - 25;
canvas.height = windowHeight - 25;
canvas.style.border = "1px solid black";

// Set up the context for the animation
context = canvas.getContext("2d");

// Fire up the animation engine
window.requestAnimationFrame(drawAll);

// Lines
// var lines = [[0, 0, 0, 0], [canvas.width, canvas.height, canvas.width, canvas.height]];
// var lineChanges = [[1, 2, 3, 4], [-1, -2, -3, -4]];

// var lines = [[0, 0, 0, 0], [0, 0, 0, 0], [300, 300, 300, 300]];
// var lineChanges = [[0.8, 1.6, 2.4, 3.2], [3.2, 2.4, 1.6, 0.8], [-1, -1.2, 1.4, 1.6]];
var lines = [];
var lineChanges = [];

function addLine() {
  var newLineChange = [];
  var newLine = [];
  for (var j = 0; j < 4; j++) {
    newLineChange.push((Math.random() - 0.5) * 6);
    if (j % 2 == 0) {
      var xAttempt = Math.random() * canvas.width;
      while (Math.abs(xAttempt - canvas.width / 2) <= 50) {
        xAttempt = Math.random() * canvas.width;
      }
      newLine.push(xAttempt);
    } else {
      var yAttempt = Math.random() * canvas.height;
      while (Math.abs(yAttempt - canvas.height / 2) < 50) {
        yAttempt = Math.random() * canvas.height;
      }
      newLine.push(yAttempt);
    }
  }
  lineChanges.push(newLineChange);
  lines.push(newLine);
}

// Circle (x, y, radius)
var circlePos = [Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 25];

function applyVelocity (position, velocity) {
  /*
    Parameters: Position and Velocity of an object
      Assumption: Velocity list has same length as position list.
    Returns: None, but modifies global variables
    Purpose: Apply velocity to position, moving the object.
  */
  var i = 0;
  for (i = 0; i < position.length; i++) {
    position[i] += velocity[i];
  }
}

function mouseMoved (event) {
  // console.log("test");
  circlePos[0] = event.x;
  circlePos[1] = event.y;
}


var foodX;
var foodY;

function drawFood(foodX, foodY) {
  // console.log("test");

  context.beginPath();
  context.strokeStyle = "green";
  context.fillStyle = "green";
  context.stroke();
  context.arc(foodX, foodY, 5, 0, 2*Math.PI);
  context.fill();

  context.fillStyle = "black";
}

function eatFood() {
  if (Math.pow(circlePos[0] - foodX, 2) + Math.pow(circlePos[1] - foodY, 2) < Math.pow(circlePos[2], 2)) {
    // console.log("food eaten");
    return true;
  }
  return false;
}

function wallCollision() {
  // If the line hits the end of the canvas, bounce
  // Add/subtract a little speed
  for (var i = 0; i < lines.length; i++) {
    if ((lines[i][0] > canvas.width) || (lines[i][0] < 0)) {
      lineChanges[i][0] *= -1;
      lineChanges[i][0] += Math.random() - 0.5;
      // console.log(lineChanges);
    }
    if ((lines[i][1] > canvas.height) || (lines[i][1] < 0)) {
      lineChanges[i][1] *= -1;
      lineChanges[i][1] += Math.random() - 0.5;
      // console.log(lineChanges);
    }
    if ((lines[i][2] > canvas.width) || (lines[i][2] < 0)) {
      lineChanges[i][2] *= -1;
      lineChanges[i][2] += Math.random() - 0.5;
      // console.log(lineChanges);
    }
    if ((lines[i][3] > canvas.height) || (lines[i][3] < 0)) {
      lineChanges[i][3] *= -1;
      lineChanges[i][3] += Math.random() - 0.5;
      // console.log(lineChanges);
    }
  }
}

function lineCircleInt() {
  for (var i = 0; i < lines.length; i++) {
    // Check for intersection between lines[i] and circle
    var u = [lines[i][2] - lines[i][0], -lines[i][3] + lines[i][1]];
    var v = [-lines[i][0] + circlePos[0], lines[i][1] - circlePos[1]];
    // console.log(u);
    // console.log(v);
    var proj = (u[0] * v[0] + u[1] * v[1]) / (u[0] * u[0] + u[1] * u[1]);
    // console.log(proj);
    var projPoint = [u[0] * proj + lines[i][0], -u[1] * proj + lines[i][1]];
    // console.log(projPoint);

    // context.beginPath();
    // context.fillRect(projPoint[0] - 5, projPoint[1] - 5, 10, 10);
    // context.stroke();

    if (Math.pow(circlePos[0] - lines[i][0], 2) + Math.pow(circlePos[1] -
       lines[i][1], 2) < Math.pow(circlePos[2], 2)) {
         return true;
    }
    else if (Math.pow(circlePos[0] - lines[i][2], 2) + Math.pow(circlePos[1] -
       lines[i][3], 2) < Math.pow(circlePos[2], 2)) {
         return true;
    }
    else if (proj < 0 || proj > 1) {
      continue;
    }
    else {
      // console.log(proj);
      var pt = [u[0] + v[0], u[1] + v[1]];
      if (Math.pow(projPoint[0] - circlePos[0], 2) + Math.pow(projPoint[1] -
         circlePos[1], 2) < Math.pow(circlePos[2], 2)) {
        return true;
      }
      else if (Math.pow(circlePos[0] - lines[i][0], 2) + Math.pow(circlePos[1] -
         lines[i][1], 2) < Math.pow(circlePos[2], 2)) {
           return true;
      }
    }
  }

  return false;
}

foodX = canvas.width * Math.random();
foodY = canvas.height * Math.random();
var score = 0;

function drawAll() {
  /*
    Purpose: This is the main drawing loop.
    Inputs: None, but it is affected by what the other functions are doing
    Returns: None, but it calls itself to cycle to the next frame
  */

  // Ready to draw
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = 3;
  context.lineCap = 'round';

  // Applies velocity to the lines
  for (var i = 0; i < lines.length; i++) {
    applyVelocity(lines[i], lineChanges[i]);
  }

  if (eatFood()) {
    // console.log("food eaten");
    foodX = canvas.width * Math.random();
    foodY = canvas.height * Math.random();
    score++;
    var newLineChange = [];
    var newLine = [];
    for (var j = 0; j < 4; j++) {
      newLineChange.push((Math.random() - 0.5) * 6);
      if (j % 2 == 0) {
        var xAttempt = Math.random() * canvas.width;
        while (Math.abs(xAttempt - canvas.width / 2) <= 50) {
          xAttempt = Math.random() * canvas.width;
        }
        newLine.push(xAttempt);
      } else {
        var yAttempt = Math.random() * canvas.height;
        while (Math.abs(yAttempt - canvas.height / 2) < 50) {
          yAttempt = Math.random() * canvas.height;
        }
        newLine.push(yAttempt);
      }
    }
    lineChanges.push(newLineChange);
    lines.push(newLine);
  } else {
    drawFood(foodX, foodY);
    // console.log(foodX, foodY);
  }
  wallCollision();


  if (lineCircleInt()) {
    return; // i should actualy do something later...
  }

  for (var i = 0; i < lines.length; i++) {
    context.stroke();

    context.beginPath();
    context.strokeStyle = "black";
    context.moveTo(lines[i][0], lines[i][1]);
    context.lineTo(lines[i][2], lines[i][3]);
    context.stroke();
  }

  context.beginPath();
  context.strokeStyle = "red";
  context.arc(circlePos[0], circlePos[1], circlePos[2], 0, 2*Math.PI);
  context.stroke();
  context.strokeStyle = "black";
  context.font = "30px Arial";
  context.fillText("Score: " + score, 50, 50);

  // Set up event listener for when user presses a key down.
  // It then calls the function myKeyDown, passing it an event object.
  document.addEventListener("mousemove", mouseMoved);

  // Loop the animation to the next frame.
  window.requestAnimationFrame(drawAll);
}
