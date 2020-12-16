class Point {
  constructor(x1, y1) {
    this.pt = [x1, y1];
  }

  get x() { return this.pt[0]; }
  set x(newX) {this.pt[0] = newX;}

  get y() {return this.pt[1]};
  set y(newY) {this.pt[1] = newY;}
}

class Line {
  // Notice that the constructor takes some of its values as inputs,
  //   and sets others by itself.
  constructor(x1, y1, x2, y2) {
    this.pt1 = [x1, y1];
    this.pt2 = [x2, y2];
    this.vel1 = [Math.random() * 4 - 2, Math.random() * 4 - 2];
    this.vel2 = [Math.random() * 4 - 2, Math.random() * 4 - 2];
    this.color = "#0000ff";
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
    // Check if any point is over any edge.  If it is over the edge, then
    //   set it to be at the edge, reverse direction, and slightly modify
    //   the velocity by a little.
    if (this.pt1[0] > canvas.width) {
      this.pt1[0] = canvas.width;
      this.vel1[0] += Math.random() - 0.5;
      if (this.vel1[0] > 0) {this.vel1[0] *= -1;}
    }
    if (this.pt1[0] < 0) {
      this.pt1[0] = 0;
      this.vel1[0] += Math.random() - 0.5;
      if (this.vel1[0] < 0) {this.vel1[0] *= -1;}
    }
    if (this.pt2[0] > canvas.width) {
      this.pt2[0] = canvas.width;
      this.vel2[0] += Math.random() - 0.5;
      if (this.vel2[0] > 0) {this.vel2[0] *= -1;}
    }
    if (this.pt2[0] < 0) {
      this.pt2[0] = 0;
      this.vel2[0] += Math.random() - 0.5;
      if (this.vel2[0] < 0) {this.vel2[0] *= -1;}
    }
    if (this.pt1[1] > canvas.height) {
      this.pt1[1] = canvas.height;
      this.vel1[1] += Math.random() - 0.5;
      if (this.vel1[1] > 0) {this.vel1[1] *= -1;}
    }
    if (this.pt1[1] < 0) {
      this.pt1[1] = 0;
      this.vel1[1] += Math.random() - 0.5;
      if (this.vel1[1] < 0) {this.vel1[1] *= -1;}
    }
    if (this.pt2[1] > canvas.height) {
      this.pt2[1] = canvas.height;
      this.vel2[1] += Math.random() - 0.5;
      if (this.vel2[1] > 0) {this.vel2[1] *= -1;}
    }
    if (this.pt2[1] < 0) {
      this.pt2[1] = 0;
      this.vel2[1] += Math.random() - 0.5;
      if (this.vel2[1] < 0) {this.vel2[1] *= -1;}
    }
  }

  draw() {
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
  constructor (x, y, r, color) {
    this.x = x;
    this.y = y;
    this.pt = new Point(x, y);
    this.r = r;
    this.color = color;
  }

  // get x() {return this.x;}
  // set x(newX) {this.x = newX;}
  //
  // get y() {return this.y;}
  // set y(newY) {this.y = newY;}
  //
  // get r() {return this.r;}
  // set r(newR) {this.r = newR;}
  //
  // get color () {return this.color;}
  // set color (newCol) {this.color = newCol;}

  draw() {
    context.strokeStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, 2*Math.PI);
    context.stroke();
  }
}

function distPP (p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function distPL (p, l) {
  var u = [l.x2 - l.x1, -l.y2 + l.y1];
  var v = [-l.x1 + p.x, l.y1 - p.y];

  var proj = (u[0] * v[0] + u[1] * v[1]) / (u[0] * u[0] + u[1] * u[1]);
  let projPoint = new Point(u[0] * proj + l.x1, -u[1] * proj + l.y1);

  return distPP(projPoint, p);
}

function intCL (c, l) {
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
  return distPP(c1.pt, c2.pt) < c1.r + c2.r;
}

function mouseMoved (event) {
  // console.log("test");
  player.x = event.x;
  player.y = event.y;
  player.pt = new Point(player.x, player.y);
}

function addLine() {
  var newX1 = canvas.width * Math.random();
  var newX2 = canvas.width * Math.random();
  var newY1 = canvas.height * Math.random();
  var newY2 = canvas.height * Math.random();

  newLine = new Line(newX1, newY1, newX2, newY2);

  while (distPL(player.pt, newLine) < 400) {
    var newX1 = canvas.width * Math.random();
    var newX2 = canvas.width * Math.random();
    var newY1 = canvas.height * Math.random();
    var newY2 = canvas.height * Math.random();

    newLine = new Line(newX1, newY1, newX2, newY2);
  }
  lines.push(newLine);
}

function addFood() {
  var x = Math.random() * canvas.width;
  var y = Math.random() * canvas.height;
  while ((canvas.width / 5 < x && canvas.width * 4 / 5 < x) || (canvas.height / 5 < y && y < canvas.height * 4 / 5 )) {
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
  }
  food = new Circle(x, y, 5, "#008000", context);
}

function drawScore(x, y) {
  context.beginPath();
  context.stroke();
  context.strokeStyle = "black";
  context.font = "30px Arial";
  context.fillText("Score: " + score, x, y);
}

function setUpContext() {
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
