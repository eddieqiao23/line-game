function drawAll() {
  for (var i = 0; i < lines.length; i++) {
    lines[i].applyVelocity();
    lines[i].bounceCheck();
  }

  // Draw the new frame
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < lines.length; i++) {
    lines[i].draw();
    if (intCL(player, lines[i])) {
      drawFinal();
      return;
    }
  }

  if (intCC(player, food)) {
    score++;
    food = new Circle(Math.random() * canvas.width, Math.random() * canvas.height, 5, "#008000", context);
    addLine();
  }

  player.draw();
  food.draw();
  drawScore(50, 50);

  document.addEventListener("mousemove", mouseMoved);

  // Loop the animation to the next frame.
  window.requestAnimationFrame(drawAll);
}

function drawFinal() {
  console.log("laksdflkasdf");
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawScore(canvas.width / 2, canvas.height / 2);
}

// Set up the canvas and context objects
context = setUpContext();

var score = 0;
// Create instance of Line object
lines = [];
player = new Circle(canvas.width / 2, canvas.height / 2, 20, "#ff0000", context);
food = new Circle(Math.random() * canvas.width, Math.random() * canvas.height, 5, "#008000", context);


// Fire up the animation engine
window.requestAnimationFrame(drawAll);
drawFinal();
