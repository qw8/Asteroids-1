function Laser(spos, angle, speed) {
  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(speed);


  this.update = function() {
    this.pos.add(this.vel);
  }

  this.render = function() {
    push();
    stroke(148, 208, 255);
    strokeWeight(3);
    point(this.pos.x, this.pos.y);
    pop();
  }

  this.offscreen = function() {
     if (this.pos.x > width || this.pos.x < 0||
        this.pos.y > height + this.r || this.pos.y < 0) {
          return true;
     }
    return false;
  }
}
