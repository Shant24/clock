setInterval(() => {
  const date = new Date();
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const secondsArrow = document.getElementById("secondsArrow");
  const minutesArrow = document.getElementById("minutesArrow");
  const hoursArrow = document.getElementById("hoursArrow");

  if ((seconds * 6) % 360 === 0) {
    secondsArrow.style.transition = "none";
  } else {
    secondsArrow.style.transition = "all 0.05s ease-in";
  }

  secondsArrow.style.transform = `rotate(${seconds * 6}deg)`;
  minutesArrow.style.transform = `rotate(${minutes * 6}deg)`;
  hoursArrow.style.transform = `rotate(${hours * 30}deg)`;
}, 1000);

let particleMaxVelocity = 0.5;
let particleCount = 80;
let lineLength = 150;
let particleRadius = 3;
screenSize();

function screenSize() {
  if (window.innerWidth <= 700) {
    particleCount = 60;
    lineLength = 120;
  } else {
    particleCount = 80;
    lineLength = 150;
  }
}

(function() {
  let canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");
  w = canvas.width = screen.width;
  h = canvas.height = screen.height;
  particles = [];
  console.log(particles);
  properties = {
    bgColor: "rgba(17, 17, 19, 1)",
    particleColor: "rgba(255, 40, 40, 1)",
    particleLife: 8
  };

  document.querySelector("body").appendChild(canvas);

  window.onresize = function() {
    w = canvas.width = screen.width;
    h = canvas.height = screen.height;
    screenSize();
  };

  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.velocityX =
        Math.random() * (particleMaxVelocity * 2) - particleMaxVelocity;
      this.velocityY =
        Math.random() * (particleMaxVelocity * 2) - particleMaxVelocity;
      this.life = Math.random() * properties.particleLife * 60;
    }
    position() {
      (this.x + this.velocityX > w && this.velocityX > 0) ||
      (this.x + this.velocityX < 0 && this.velocityX < 0)
        ? (this.velocityX *= -1)
        : this.velocityX;
      (this.y + this.velocityY > h && this.velocityY > 0) ||
      (this.y + this.velocityY < 0 && this.velocityY < 0)
        ? (this.velocityY *= -1)
        : this.velocityY;
      this.x += this.velocityX;
      this.y += this.velocityY;
    }
    reDraw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, particleRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = properties.particleColor;
      ctx.fill();
    }
    reCalculateLife() {
      if (this.life < 1) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.velocityX =
          Math.random() * (particleMaxVelocity * 2) - particleMaxVelocity;
        this.velocityY =
          Math.random() * (particleMaxVelocity * 2) - particleMaxVelocity;
        this.life = Math.random() * properties.particleLife * 60;
      }
      this.life--;
    }
  }

  function reDrawBackground() {
    // ctx.fillStyle = "green";
    ctx.fillStyle = properties.bgColor;
    ctx.fillRect(0, 0, w, h);
  }

  function drawLines() {
    let x1, y1, x2, y2, length, opacity;

    for (let i in particles) {
      for (let j in particles) {
        x1 = particles[i].x;
        y1 = particles[i].y;
        x2 = particles[j].x;
        y2 = particles[j].y;
        length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        if (length < lineLength) {
          opacity = 1 - length / lineLength;
          ctx.lineWidth = "0.3";
          ctx.strokeStyle = "rgba(255, 40, 40, " + opacity + ")";
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  }

  function reDrawParticles() {
    for (let i in particles) {
      particles[i].reCalculateLife();
      particles[i].position();
      particles[i].reDraw();
    }
  }

  function loop() {
    reDrawBackground();
    reDrawParticles();
    drawLines();
    requestAnimationFrame(loop);
  }

  function init() {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    loop();
  }

  init();
})();
