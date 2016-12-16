var time, limit, rate;
var score, isPlaying;
var laserShootSound, asteroidExplosionSound, toastySound, pushermanMusic;

var scl, grid, starfield;
var windowSize;

var ship;
var asteroids, maxAsteroids;

function preload() {
  laserShootSound = loadSound("sounds/laserShoot.wav");
  asteroidExplosionSound = loadSound("sounds/asteroidExplosion.wav");
  toastySound = loadSound("sounds/toasty.mp3");
  pushermanMusic = loadSound("sounds/toasty.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  windowSize = width+height;
  starfield = createBackgroundField(floor((windowSize)*0.05));
  restrartSketch();
  //pushermanMusic.loop();
  pushermanMusic.play();
  masterVolume(0.3);
  textFont("Courier New");
}

function restrartSketch() {
  time = 0;
  limit = 1200;
  rate = 1;
  score = 0;
  isPlaying = true;

  // scl = 20;
  // grid = createImage(width, height);
  // grid.loadPixels();
  // for (var x = 0; x < grid.width; x++) {
  //   for (var y = 0; y < grid.height; y++) {
  //     if (x%scl == 0 || y%scl == 0) {
  //       grid.set(x,y,color('rgba(255, 255, 255, 0.1)'));
  //     }
  //   }
  // }
  // grid.updatePixels();

  asteroids = [];
  ship = new Ship(laserShootSound);
  maxAsteroids = floor(windowWidth*0.0066);
  for (var i = 0; i < maxAsteroids; i++) {
    asteroids.push(new Asteroid(asteroidExplosionSound, createVector(ship.pos.x + random(width/3,width/2), ship.pos.y + random(width/3,2*width/3)) ));
  }
  console.log(maxAsteroids);
  loop();
}



function draw() {

  background(0);
  image(starfield, 0, 0);
  fill(255);
  textSize(26);
  text("SCORE: " + score, 20, 26);

  if( (time > limit && asteroids.length < maxAsteroids*2) || asteroids.length < maxAsteroids) {
    time = 0;
    asteroids.push(new Asteroid(asteroidExplosionSound, createVector(ship.pos.x + random(width/3,width/2), ship.pos.y + random(width/3,2*width/3)) ));
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

function drawStar(img, x, y, size, color) {
  for(var i = -size; i < 2*size; i++) {
    for (var j = 0; j < size; j++) {
      img.set(x+j, y+i, color);
    }
  }
  for(var i = -size; i < 2*size; i++) {
    for (var j = 0; j < size; j++) {
      img.set(x+i, y+j, color);
    }
  }
}

function drawPlanet(img, x, y, r, angle, rad, c) {
  var xoff = x, yoff = y;
  var rsq = r*r;

  var rShad = r*rad, rShadsq = rShad*rShad;
  var xShad = x+0.3*r*cos(angle), yShad = y-0.3*r*sin(angle);

  var disc = 0;
  var shadow = 0;
  for (var i = y-r; i < y+r; i++) {
    disc = floor(sqrt(rsq-pow(y-i, 2)));
    shadow = floor(sqrt(rShadsq-pow(yShad-i, 2)));
    for (var j = x-disc; j < x+disc; j++) {
      var pnoise = noise(xoff, yoff);
      if (j == x+disc-1 || j == x-disc) {
        img.set(j,i, darken(c,1.4*pnoise));
      }
      else if (!shadow || j <= xShad-shadow || j >= xShad+shadow) {
        img.set(j,i, darken(c,0.2*pnoise));
      }
      else {
        img.set(j,i,darken(c, 2*pnoise));
      }
      xoff += 0.005;
    }
    yoff += 0.0005;
  }
}

function darken(c, amount) {
  return color('rgba(' + floor(red(c)*amount) + ','
              + floor(green(c)*amount) + ','
              + floor(blue(c)*amount) + ',' + alpha(c) + ')');
}

function createBackgroundField(numOfStars) {
  var field = createImage(width, height);

  field.loadPixels();
  for (var x = 0; x < numOfStars; x++) {
      drawStar(field, floor(random(field.width)), floor(random(field.height)), floor(random(1,3)), color('rgba(255,255,255,0.5)'));
  }
  var planetR = floor(random(100,300));
  var planetX = floor(random(planetR*1.5, field.width - planetR*1.5));
  var planetY = floor(random(planetR*1.5, field.height - planetR*1.5));
  var planetC = color('rgba(' + floor(floor(random(255))) + ','
              + floor(floor(random(255))) + ','
              + floor(floor(random(255))) + ',' + 0.1 + ')');
  var planetShadAngle = random(HALF_PI,TWO_PI);
  var planetShadRad = random(1, 1.2);
  drawPlanet(field, planetX, planetY, planetR, planetShadAngle, planetShadRad, planetC);
  field.updatePixels();
  return field;
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
