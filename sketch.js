var time, limit, rate;
var score, isPlaying;
var laserShootSound, asteroidExplosionSound, toastySound;

var ship;
var asteroids;

function preload() {
  laserShootSound = loadSound("sounds/laserShoot.wav");
  asteroidExplosionSound = loadSound("sounds/asteroidExplosion.wav");
  toastySound = loadSound("sounds/toasty.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  restrartSketch();
  masterVolume(0.3);
  textFont("Courier New");
}

function restrartSketch() {
  time = 0;
  limit = 1200;
  rate = 1;
  score = 0;
  isPlaying = true;

  asteroids = [];
  ship = new Ship(laserShootSound);
  for (var i = 0; i < 7; i++) {
    asteroids.push(new Asteroid(asteroidExplosionSound, createVector(ship.pos.x + random(width/3,width/2), ship.pos.y + random(width/3,width/2)) ));
  }
  loop();
}

function draw() {
  background(0);

  fill(255);
  textSize(26);
  text("SCORE: " + score, 20, 26);

  if( (time > limit && asteroids.length < 24) || asteroids.length < 5) {
    time = 0;
    asteroids.push(new Asteroid(asteroidExplosionSound, createVector(ship.pos.x + random(width/3,width/2), ship.pos.y + random(width/3,width/2)) ));
  }
  if (limit < 100) {
    rate = 0;
  }

  ship.drawLasers();

  ship.render();
  ship.turn();
  ship.update();
  ship.edges();

  for (var i = asteroids.length-1; i >= 0; i--) {
    asteroids[i].render();
    asteroids[i].update();
    asteroids[i].edges();

    if (asteroids[i].hits(ship)) {
      fill(255);
      textSize(64);
      text("GAME OVER", width/2-200, height/2);
      textSize(25);
      text("press ENTER to restart", width/2-190, height/2+36);
      toastySound.setVolume(1);
      toastySound.play();
      noLoop();
      isPlaying = false;
    }

    if (ship.lasersHitting(asteroids[i])) {
      score+=20;
      asteroids = asteroids.concat(asteroids[i].breakup());
      asteroids.splice(i, 1);
    }
    //NO CODE HERE!!!
  }

  time++;
  limit -= rate;
}

function keyReleased() {
  if (isPlaying) {
    switch (keyCode) {
      case RIGHT_ARROW:
      case LEFT_ARROW:
        ship.setRotation(0);
        break;
      case UP_ARROW:
        ship.boosting(false);
        break;
    }
  }
}

function keyPressed() {
  if (isPlaying) {
    switch (keyCode) {
      case RIGHT_ARROW:
        ship.setRotation(0.1);
        break;
      case LEFT_ARROW:
        ship.setRotation(-0.1);
        break;
      case UP_ARROW:
        ship.boosting(true);
        break;
      case 32:
        ship.shoot();
        break;
    }
  }
  else {
    switch (keyCode) {
      case 13:
        restrartSketch();
        break;
    }
  }
}
