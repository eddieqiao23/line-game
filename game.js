function drawAll() {
  // Draw the new frame
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Deals with the lines moving and bouncing around
  for (var i = 0; i < lines.length; i++) {
    lines[i].applyVelocity();
    lines[i].bounceCheck();
  }

  // If the player hits a line, the game ends
  for (var i = 0; i < lines.length; i++) {
    lines[i].draw();
    if (intCL(player, lines[i])) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      // Draws score in the center
      drawText(canvas.width / 2, canvas.height / 2, "Score: " + score);
      return;
    }
  }

  // If the player eats food
  if (intCC(player, food)) {
    score++;
    food = new Circle(Math.random() * canvas.width, Math.random() * canvas.height, 5, "#008000", context);
    addLine();
  }

  // Draws the player, the food, and the score
  player.draw();
  food.draw();
  drawText(canvas.width / 40, canvas.height / 20, "Score: " + score);

  if (hasHelp && score == 0) {
    context.textAlign = "center";
    messages = ["Control circle with mouse.", "Eat green food to gain points.", "New lines will spawn. Don't hit them.", "Press 'h' again to close."];
    for (var i = 0; i < 4; i++) {
      drawText(canvas.width / 2, canvas.height / 2 + i * 50, messages[i]);
    }
    context.textAlign = "left";
  }
  if (score == 0) {
    drawText(canvas.width / 40, canvas.height / 8, "Press \"h\" for help");
  }

  // Whenever the mouse moves, we update the location of the player
  document.addEventListener("mousemove", mouseMoved);
  document.addEventListener("keydown", keyPressed);

  // Loop the animation to the next frame.
  window.requestAnimationFrame(drawAll);
}

// Set up the canvas and context objects
context = setUpContext();

// Initializes score
var score = 0;
var hasHelp = false;
lines = [];
player = new Circle(canvas.width / 2, canvas.height / 2, 20, "#ff0000", context);
food = new Circle(Math.random() * canvas.width, Math.random() * canvas.height, 5, "#008000", context);


// Fire up the animation engine
window.requestAnimationFrame(drawAll);
