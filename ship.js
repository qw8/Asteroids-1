function Ship(laserShootSound, engineSound) {
  this.pos = createVector(width/2, height/2);
  this.r = 10;
  this.heading = 0;
  this.rotation = 0;
  this.vel = createVector(0, 0);
  this.isBoosting = false;
  this.lasers = [];
  this.laserShootSound = laserShootSound;
  this.engineSound = engineSound;

  this.boosting = function(b) {
    this.isBoosting = b;
  }

  this.update = function() {
    if (this.isBoosting) {
      this.engineSound.setVolume(3);
      if (!this.engineSound.isPlaying()) this.engineSound.loop();
      this.boost();
    }
    else {
      this.engineSound.stop();
    }
    this.pos.add(this.vel);
    this.vel.mult(0.99);
  }

  this.boost = function() {
    var force = p5.Vector.fromAngle(this.heading);
    force.mult(0.15);
    this.vel.add(force);
  }

  this.edges = function() {
     if (this.pos.x > width + this.r) {
       this.pos.x = -this.r;
     }
     else if (this.pos.x < -this.r) {
       this.pos.x = width + this.r;
     }
     if (this.pos.y > height + this.r) {
       this.pos.y = -this.r;
     }
     else if (this.pos.y < -this.r) {
       this.pos.y = height + this.r;
     }
  }

  this.render = function() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI/2);
    var r = map(this.vel.mag(), 0, 13, 0, 221);
    var g = map(this.vel.mag(), 0, 13, 0, 47);
    var b = map(this.vel.mag(), 0, 13, 0, 80);
    stroke(255);
    if (this.isBoosting) {
      fill(126, 205, 246);
      triangle(-this.r*0.5, this.r, this.r*0.5, this.r, 0, 2.5*this.r);
    }
    fill(floor(r), floor(g),floor(b));
    triangle(-this.r, this.r, this.r, this.r, 0, -this.r*1.5);
    pop();
  }

  this.setRotation = function(val) {
    this.rotation = val;
  }

  this.turn = function(val) {
    this.heading += val || this.rotation;
  }




  this.shoot = function() {
    this.laserShootSound.setVolume(0.3);
    this.laserShootSound.play();
    this.lasers.push(new Laser(this.pos, this.heading, this.vel.mag()+9));
  }

  this.drawLasers = function() {
    for (var i = this.lasers.length-1; i >= 0; i--) {
      this.lasers[i].render();
      this.lasers[i].update();
      if (this.lasers[i].offscreen()) {
        this.lasers.splice(i, 1);
      }
    }
  }

  this.lasersHitting = function(obj) {
    for (var j = this.lasers.length-1; j >= 0 ; j--) {
      if (obj && obj.hits(ship.lasers[j])) {
        ship.lasers.splice(j, 1);
        return true;
      }
    }
    return false;
  }

}
