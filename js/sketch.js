let pixelFont;
let fireworks = [];
let floatingTexts = [];
let fireworkTimer = 0;
let textTimer = 0;

function preload() {
  pixelFont = loadFont('../fonts/PressStart2P-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  textFont(pixelFont);
  textSize(24);
  textAlign(CENTER, CENTER);
  noStroke();
}

function draw() {
  drawCRTBackground();

  // Generar fuegos artificiales cada 30 frames (~0.5 seg)
  fireworkTimer++;
  if (fireworkTimer % 30 === 0) {
    fireworks.push(new Firework());
  }

  // Generar textos "+1" cada 45 frames (~0.75 seg)
  textTimer++;
  if (textTimer % 45 === 0) {
    let x = random(width);
    let y = random(height / 2, height - 100);
    floatingTexts.push(new FloatingText("+1", x, y));
  }

  // Mostrar fuegos artificiales
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].isDone()) {
      fireworks.splice(i, 1);
    }
  }

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    floatingTexts[i].update();
    floatingTexts[i].show();
    if (floatingTexts[i].opacity <= 0) {
      floatingTexts.splice(i, 1);
    }
  }
}

function drawCRTBackground() {
  background(220, 80, 20); // Azul marino base

  // Líneas horizontales tipo escaneo
  for (let y = 0; y < height; y += 4) {
    stroke(220, 80, 25, 0.1); // Líneas muy sutiles
    line(0, y, width, y);
  }

  noStroke();
}

class Firework {
  constructor() {
    this.x = random(width);
    this.y = height;
    this.exploded = false;
    this.particles = [];
    this.velocity = random(-12, -8);
  }

  update() {
    if (!this.exploded) {
      this.y += this.velocity;
      this.velocity += 0.2;
      if (this.velocity >= 0) {
        this.exploded = true;
        for (let i = 0; i < 50; i++) {
          this.particles.push(new Particle(this.x, this.y));
        }
      }
    } else {
      for (let p of this.particles) {
        p.update();
      }
    }
  }

  show() {
    if (!this.exploded) {
      fill(0, 0, 100);
      ellipse(this.x, this.y, 4);
    } else {
      for (let p of this.particles) {
        p.show();
      }
    }
  }

  isDone() {
    return this.exploded && this.particles.every(p => p.life <= 0);
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = random(TWO_PI);
    this.speed = random(2, 6);
    this.life = 255;
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    this.life -= 4;
  }

  show() {
    fill(random(360), 80, 100, this.life / 255);
    ellipse(this.x, this.y, 3);
  }
}


class FloatingText {
  constructor(txt, x, y) {
    this.txt = txt;
    this.x = x;
    this.y = y;
    this.opacity = 255;
  }

  update() {
    this.y -= 1;
    this.opacity -= 3;
  }

  show() {
    let txt = this.txt;
    let steps = txt.length;
    let charWidth = textWidth(txt) / steps;

    for (let i = 0; i < steps; i++) {
      let inter = map(i, 0, steps - 1, 0, 1);
      let baseHue = (frameCount * 2 + i * 20) % 360;
      let hue = lerp(baseHue, (baseHue + 60) % 360, inter);
      let col = color(hue, 100, 100, this.opacity / 255);

      fill(col);
      text(txt[i], this.x - textWidth(txt) / 2 + i * charWidth, this.y);
    }
  }
}