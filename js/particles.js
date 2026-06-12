/**
 * RoomSync AI - Background Particle Connection Network
 * Creates a premium canvas particle background that reacts to mouse movement.
 */

class ParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.numberOfParticles = 80;

    this.init();
    this.animate();

    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mouseout', () => this.handleMouseOut());
  }

  init() {
    this.resize();
    this.particles = [];
    
    // Scale density based on screen width
    if (window.innerWidth < 768) {
      this.numberOfParticles = 30;
    } else {
      this.numberOfParticles = 80;
    }

    for (let i = 0; i < this.numberOfParticles; i++) {
      const size = Math.random() * 2 + 1; // particle size 1px to 3px
      const x = Math.random() * (this.canvas.width - size * 2) + size;
      const y = Math.random() * (this.canvas.height - size * 2) + size;
      const directionX = (Math.random() * 0.4) - 0.2; // slow drift
      const directionY = (Math.random() * 0.4) - 0.2;
      const color = Math.random() > 0.5 ? '#6D5DFC' : '#00E5FF'; // Purple or Cyan
      
      this.particles.push(new Particle(x, y, directionX, directionY, size, color, this.ctx, this.canvas, this.mouse));
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  handleMouseMove(event) {
    this.mouse.x = event.x;
    this.mouse.y = event.y;
  }

  handleMouseOut() {
    this.mouse.x = null;
    this.mouse.y = null;
  }

  connect() {
    let opacityValue = 1;
    for (let a = 0; a < this.particles.length; a++) {
      for (let b = a; b < this.particles.length; b++) {
        let dx = this.particles[a].x - this.particles[b].x;
        let dy = this.particles[a].y - this.particles[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        // Draw connection lines if particles are within 120px of each other
        if (distance < 120) {
          opacityValue = 1 - (distance / 120);
          this.ctx.strokeStyle = `rgba(109, 93, 252, ${opacityValue * 0.15})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
          this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      this.particles[i].draw();
    }
    this.connect();
    requestAnimationFrame(() => this.animate());
  }
}

class Particle {
  constructor(x, y, directionX, directionY, size, color, ctx, canvas, mouse) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
    this.ctx = ctx;
    this.canvas = canvas;
    this.mouse = mouse;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    
    // Glowing particles
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = this.color;
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.shadowBlur = 0; // reset shadow
  }

  update() {
    // Collision detection with edges
    if (this.x > this.canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > this.canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // Interactive mouse push/pull effect
    if (this.mouse.x != null && this.mouse.y != null) {
      let dx = this.mouse.x - this.x;
      let dy = this.mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.mouse.radius) {
        // Drifts slightly away from mouse
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxForce = 1.5;
        const force = (this.mouse.radius - distance) / this.mouse.radius;
        const directionX = forceDirectionX * force * maxForce;
        const directionY = forceDirectionY * force * maxForce;

        this.x -= directionX;
        this.y -= directionY;
      }
    }

    // Move particle
    this.x += this.directionX;
    this.y += this.directionY;
  }
}

// Initialize particles on load
document.addEventListener('DOMContentLoaded', () => {
  new ParticleNetwork('bg-canvas');
});
