function Asteroid(asteroidExplosionSound, pos, r, vel) {
  this.pos = pos ? pos.copy() : createVector(random(width), random(height));
  this.r = r || random(50, 80);
  this.vel = vel ? vel.copy() : createVector(random(-5, 5), random(-5, 5));
  this.total = floor(random(5, 15));
  this.offset = [];
  for (var i = 0; i < this.total; i++) {
    this.offset[i] = random(-this.r*0.4, this.r*0.4);
  }
  this.asteroidExplosionSound = asteroidExplosionSound;

  this.render = function() {
    push();
    noFill();
    stroke(173,140,255);
    translate(this.pos.x, this.pos.y);
    beginShape();
    strokeWeight(2);
    for (var i =0; i < 10; i++) {
      var angle = map(i, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i];
      var x = r * cos(angle);
      var y = r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
   }

   this.update = function() {
      this.pos.add(this.vel);
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

   this.hits = function(object) {
     var d = dist(this.pos.x, this.pos.y, object.pos.x, object.pos.y);
     if (d < this.r) {
       return true;
     }
     return false;
   }

   this.breakup = function() {
     var newA = [];
     this.asteroidExplosionSound.setVolume(0.3);
     this.asteroidExplosionSound.play();
     if (this.r > 25) {
       newA[0] = new Asteroid(this.asteroidExplosionSound, this.pos, floor(this.r/2));
       newA[1] = new Asteroid(this.asteroidExplosionSound, this.pos, floor(this.r/2));
     }
     return newA;
   }
}
