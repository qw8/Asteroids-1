var time, limit, rate;
var score, isPlaying;
var laserShootSound, engineSound, asteroidExplosionSound, toastySound, backgroundMusic;

var scl, grid, starfield;
var windowSize;

var ship;
var asteroids, maxAsteroids;
var godmod = false, mouseControl = false;

function preload() {
  laserShootSound = loadSound("sounds/laserShoot.wav");
  asteroidExplosionSound = loadSound("sounds/asteroidExplosion.wav");
  toastySound = loadSound("sounds/toasty.mp3");
  engineSound = loadSound("sounds/engine.wav");
}

function setup() {

  createCanvas(windowWidth, windowHeight);
  backgroundMusic = loadSound("sounds/Rolemu_-_Neoishiki.mp3", function() {
    backgroundMusic.setVolume(0.3);
    backgroundMusic.loop();
  });
  windowSize = width+height;
  starfield = createBackgroundField(floor((windowSize)*0.05));
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

  cursor(CROSS);
  asteroids = [];
  ship = new Ship(laserShootSound, engineSound);
  maxAsteroids = floor(windowWidth*0.007);
  for (var i = 0; i < maxAsteroids; i++) {
    asteroids.push(new Asteroid(asteroidExplosionSound, createVector(ship.pos.x + random(width/3,width/2), ship.pos.y + random(width/3,2*width/3)) ));
  }
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
    asteroids.push(new Asteroid(asteroidExplosionSound, createVector(ship.pos.x + random(width/3,width/2), ship.pos.y + random(height/3,2*height/3)) ));
  }
  if (limit < 100) {
    rate = 0;
  }

  ship.drawLasers();

  ship.render();
  ship.turn();
  if (mouseControl) {
    mouseBoost();
    mouseTurn();
  }
  ship.update();
  ship.edges();

  for (var i = asteroids.length-1; i >= 0; i--) {
    asteroids[i].render();
    asteroids[i].update();
    asteroids[i].edges();

    if (asteroids[i].hits(ship) && !godmod) {
      fill(255);
      textSize(64);
      text("GAME OVER", width/2-200, height/2);
      textSize(25);
      text("press ENTER to restart", width/2-190, height/2+36);
      toastySound.setVolume(2);
      toastySound.isPlaying() == false ? toastySound.play() : false;
      ship.boosting(false);
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

function drawPlanet(img, x, y, r, angle, rad, eara, cloa, c, c2, c3) {
  var xoff = x, yoff = y,
      rsq = r*r,
      rShad = r*rad, rShadsq = rShad*rShad,
      xShad = x+0.3*r*cos(angle), yShad = y-0.3*r*sin(angle),
      disc = 0,
      shadow = 0,
      currentC = c,
      earaMax = pow(eara, 0.1),
      cloaMax = pow(cloa, 0.01);
  for (var i = y-r; i < y+r; i++) {
    disc = floor(sqrt(rsq-pow(y-i, 2)));
    shadow = floor(sqrt(rShadsq-pow(yShad-i, 2)));
    xoff = x;
    for (var j = x-disc; j < x+disc; j++) {
      var pnoise = noise(xoff, yoff);
      var noisep = noise(yoff, xoff);
      if (pnoise > eara) {
        currentC = darken(c, map(pow(pnoise, 0.1), earaMax, 1, 0.9, 1.2));
      }
      else {
        currentC = lerpColor(c, c2, map(pow(pnoise, 0.1), 0, earaMax, 0, 0.9));
      }
      if (noisep > cloa) {
        currentC = lerpColor(currentC, c3, map(pow(noisep, 0.01), cloaMax, 1, 0.01,1));
      }

      if (j == x+disc-1 || j == x-disc) {
        img.set(j,i, darken(currentC,0.5));
      }
      else if (!shadow || j <= xShad-shadow || j >= xShad+shadow) {
        var shadowness = j > x ? x+disc-1-j : j-x+disc;
        img.set(j,i, darken(currentC,0.2));
      }
      else {
        img.set(j,i, currentC);
      }
      xoff += 0.01;
    }
    yoff += 0.01;
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
  console.log(windowSize);
  var planetR = floor(random(windowSize*0.03,windowSize*0.06));
  var planetX = floor(random(planetR*1.5, field.width - planetR*1.5));
  var planetY = floor(random(planetR*1.5, field.height - planetR*1.5));

  var planetGroundC = color(floor(random(0,150)),
                    + floor(random(100, 255)),
                    + floor(random(0, 155)));

  var planetWaterC = color(floor(random(0, 150)),
                    + floor(random(0, 150)),
                    + floor(random(100, 255)));

  var planetCloudC = color(floor(random(230,255)),
                    + floor(random(230,255)),
                    + floor(random(230,255)));

  var planetShadAngle = random(PI-0.3,PI+0.3);
  var planetShadRad = random(1, 1.2);
  var earthAmo = random(0.25,0.75);
  var cloudAmo = random(0.2,0.7);
  drawPlanet(field, planetX, planetY, planetR, planetShadAngle, planetShadRad, earthAmo, cloudAmo, planetGroundC, planetWaterC, planetCloudC);
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

function mousePressed() {
  if (isPlaying && mouseControl) {
    if (mouseButton = LEFT) {
      ship.shoot();
    }
  }
}

function mouseTurn() {
  if (isPlaying) {
    var prefHeading = p5.Vector.sub(createVector(mouseX, mouseY), ship.pos).heading();
    if (ship.heading - prefHeading > PI) {
      prefHeading += TWO_PI;
    } else if (ship.heading - prefHeading < -PI) {
      prefHeading -= TWO_PI;
    }
    ship.heading += (prefHeading - ship.heading) * 0.2;
    ship.heading %= TWO_PI;
  }
}

function mouseBoost() {
  if (isPlaying) {
    if(dist(mouseX,mouseY,ship.pos.x,ship.pos.y) > 5*ship.r) {
      ship.boosting(true);
    }
    else {
      ship.boosting(false);
    }
  }
}
