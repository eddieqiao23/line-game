class Point {
  // Used for things like center of circle, projection points, etc.
  constructor(x, y) {
    this.pt = [x, y];
    this.x = x;
    this.y = y;
  }
}

class Line {
  // Represents the lines that are bouncing around
  // A lot of this class is the same as Dr. J's class (though there are differences)
  constructor(x1, y1, x2, y2) {
    this.pt1 = [x1, y1];
    this.pt2 = [x2, y2];
    this.vel1 = [(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4];
    this.vel2 = [(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4];
    this.color = "#000000";
    this.width = 3;
    this.cap = 'round';
  }

  // Getters and setters
  get x1() {return this.pt1[0];}
  set x1(newX) {this.pt1[0] = newX;}

  get y1() {return this.pt1[1];}
  set y1(newX) {this.pt1[1] = newX;}

  get x2() {return this.pt2[0];}
  set x2(newY) {this.pt2[0] = newY;}

  get y2() {return this.pt2[1];}
  set y2(newY) {this.pt2[1] = newY;}


  applyVelocity() {
    // Add velocity to position in each coordinate
    this.pt1[0] += this.vel1[0];
    this.pt1[1] += this.vel1[1];
    this.pt2[0] += this.vel2[0];
    this.pt2[1] += this.vel2[1];
  }

  bounceCheck() {
    // Simplified version of Dr. J's code
    // If it's outside of the frame, apply a bit of randomness then flip the direction
    if (this.pt1[0] > canvas.width || this.pt1[0] < 0) {
      this.vel1[0] += Math.random() - 0.5;
      this.vel1[0] *= -1;
    }
    if (this.pt2[0] > canvas.width || this.pt2[0] < 0) {
      this.vel2[0] += Math.random() - 0.5;
      this.vel2[0] *= -1;
    }
    if (this.pt1[1] > canvas.height || this.pt1[1] < 0) {
      this.vel1[1] += Math.random() - 0.5;
      this.vel1[1] *= -1;
    }
    if (this.pt2[1] > canvas.height || this.pt2[1] < 0) {
      this.vel2[1] += Math.random() - 0.5;
      this.vel2[1] *= -1;
    }
  }

  draw() {
    // Draws the line
    context.strokeStyle = this.color;
    context.lineWidth = this.width;
    context.lineCap = this.cap;
    context.beginPath();
    context.moveTo(this.pt1[0], this.pt1[1]);
    context.lineTo(this.pt2[0], this.pt2[1]);
    context.stroke();
  }
}

class Circle {
  // Player and the food
  // Note that it takes in a color as a parameter, as the food/player are different
  constructor (x, y, r, color) {
    this.x = x;
    this.y = y;
    this.pt = new Point(x, y);
    this.r = r;
    this.color = color;
  }

  draw() {
    context.strokeStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, 2*Math.PI);
    context.stroke();
  }
}

function distPP (p1, p2) {
  // Calculates the distance between a point and another point
  // Parameters: Two points
  // Returns: The distance
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function distPL (p, l) {
  // Calculates distance between a point and a line
  // Parameters: A point and a line (usually the center of the circle and a line)
  // Returns: The distance between the point and the line
  var u = [l.x2 - l.x1, -l.y2 + l.y1];
  var v = [-l.x1 + p.x, l.y1 - p.y];

  var proj = (u[0] * v[0] + u[1] * v[1]) / (u[0] * u[0] + u[1] * u[1]);
  // This point is the projection of the point onto the line
  let projPoint = new Point(u[0] * proj + l.x1, -u[1] * proj + l.y1);

  // Returns distance between the projection and the point that was projected
  return distPP(projPoint, p);
}

function intCL (c, l) {
  // Detects intersection between a circle and a line (used for player + lines)
  // Parameters: A circle (the player) and a line (the line we're checking)
  // Returns: true or false whether there is an intersection or not
  var u = [l.x2 - l.x1, -l.y2 + l.y1];
  var v = [-l.x1 + c.x, l.y1 - c.y];

  var proj = (u[0] * v[0] + u[1] * v[1]) / (u[0] * u[0] + u[1] * u[1]);
  let projPoint = new Point(u[0] * proj + l.x1, -u[1] * proj + l.y1);

  if (Math.pow(c.x - l.x1, 2) + Math.pow(c.y - l.y1, 2) < Math.pow(c.r, 2)) {
    return true;
  }
  else if (Math.pow(c.x - l.x2, 2) + Math.pow(c.y - l.y2, 2) < Math.pow(c.r, 2)) {
    return true;
  }
  else if (proj < 0 || proj > 1) {
    return false;
  }
  else {
    var pt = [u[0] + v[0], u[1] + v[1]];
    if (Math.pow(projPoint.x - c.x, 2) + Math.pow(projPoint.y - c.y, 2) < Math.pow(c.r, 2)) {
      return true;
    }
    else if (Math.pow(c.x - l.x1, 2) + Math.pow(c.y - l.y1, 2) < Math.pow(c.r, 2)) {
      return true;
    }
  }

  return false;
}

function intCC (c1, c2) {
  // Determines whether two circles are intersecting
  // Note that if one is inside of another this counts (since this is for eating)
  // Parameters: Two circles
  // Returns: true or false depending on whether they are intersecting
  return distPP(c1.pt, c2.pt) < c1.r + c2.r;
}

function mouseMoved (event) {
  // Whenever the mouse moves, the position of the player is updated
  // Parameters: An event, which is going to be mousemove
  // Returns: Nothing
  player.x = event.x;
  player.x = Math.max(player.x, player.r);
  player.x = Math.min(player.x, canvas.width - player.r);

  player.y = event.y;
  player.y = Math.max(player.y, player.r);
  player.y = Math.min(player.y, canvas.height - player.r);
  player.pt = new Point(player.x, player.y);
}

function keyPressed (event) {
  // Whenever the mouse moves, this function is called and it opens/closes help
  // Parameters: An event, which is going to be keydown
  // Returns: Nothing
  if (event.keyCode == 72) {
    // If the key is 'h', go from false to true or true to false
    hasHelp = !hasHelp;
  }
}

function addLine() {
  // Adds a new line to the list of lines
  // Parameters: None, but it uses global variables
  // Returns: None, but it changes global variables

  var newX1 = canvas.width * Math.random();
  var newX2 = canvas.width * Math.random();
  var newY1 = canvas.height * Math.random();
  var newY2 = canvas.height * Math.random();

  newLine = new Line(newX1, newY1, newX2, newY2);

  // Makes sure the line doesn't spawn right next to the player and kill them immediately
  while (distPL(player.pt, newLine) < canvas.width / 5) {
    var newX1 = canvas.width * Math.random();
    var newX2 = canvas.width * Math.random();
    var newY1 = canvas.height * Math.random();
    var newY2 = canvas.height * Math.random();

    newLine = new Line(newX1, newY1, newX2, newY2);
  }

  // Adds the line to the list
  lines.push(newLine);
}

function addFood() {
  // Changes the position of the food
  // Paramters: None
  // Returns: None, but it modifies global variables

  var x = Math.random() * canvas.width;
  var y = Math.random() * canvas.height;
  while ((canvas.width / 5 < x && x < canvas.width * 4 / 5) || (canvas.height / 5 < y && y < canvas.height * 4 / 5 )) {
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
  }
  food = new Circle(x, y, 5, "#008000", context);
}

function drawText(x, y, message) {
  // Draws some text (score or help) at a certain position x, y
  // Parameters: Integers x, y that reprsent the coordinates
  // Returns: Nothing but it modifies the display
  context.beginPath();
  context.alignText = "left";
  context.stroke();
  context.strokeStyle = "black";
  context.font = "30px Arial";
  context.fillText(message, x, y);
}

function setUpContext() {
  // Sets up the context to get ready for the animation
  // Parameters: None
  // Returns: None, but it sets up global variables like canvas.width and context
  // Get width/height of the browser window
  console.log("Window is %d by %d", window.innerWidth, window.innerHeight);

  canvas = document.getElementById("mainCanvas");

  canvas.width = window.innerWidth - 30;
  canvas.height = window.innerHeight - 30;
  canvas.style.border = "1px solid black";

  // Set up the context for the animation
  context = canvas.getContext("2d");
  return context;
}
