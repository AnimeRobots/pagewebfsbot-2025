Telegram.WebApp.ready();
Telegram.WebApp.expand();
let initData = Telegram.WebApp.initData || "";
let initDataUnsafe = Telegram.WebApp.initDataUnsafe || {};
function showAlert(message) {
  Telegram.WebApp.showAlert(message);
}
function showPROFILE(message) {
  Telegram.WebApp.showPopup(
    {
      title: "ATTENTION!",
      message: message,
      buttons: [
        { id: "faq", type: "destructive", text: "Message" },
        { id: "close", type: "default", text: "Close" },
      ],
    },
    function (buttonId) {
      if (buttonId === "faq") {
        Telegram.WebApp.openTelegramLink(
          "https://t.me/Maid_Robot?start=FileSharingBotWebApp"
        );
      }
      // If buttonId is "close", nothing happens
    }
  );
}

function OpenLink(url) {
  Telegram.WebApp.openTelegramLink("https://t.me/" + url);
}
async function copyText(text, btn = null, duration = 1200) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    if (!btn) return;
    btn.innerText = "Copied";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.classList.remove("copied");
      btn.innerText = "Copy";
    }, duration);
  } catch (err) {
    console.error("copy failed", err);
  }
}

function downloadEnvTemplate() {
  const fullUrl = window.location.origin + "assets/BOT.env.txt";
  Telegram.WebApp.downloadFile({
    url: fullUrl,
    file_name: "BOT.env.txt",
  });
}

// place badge properly for env rows
function addEnvBadge() {
  document.querySelectorAll(".env-row").forEach((row) => {
    const strong = row.querySelector("strong");
    const badge = row.querySelector(".badge");
    strong.appendChild(badge);
  });
}
window.addEventListener("DOMContentLoaded", addEnvBadge);

// small utilities
document.getElementById("year").textContent = new Date().getFullYear();

// Accordion behaviour
document.querySelectorAll(".acc-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    const open = content.style.display === "block";
    document
      .querySelectorAll(".acc-content")
      .forEach((c) => (c.style.display = "none"));
    if (!open) content.style.display = "block";
  });
});

// background canvas: moving particles + gradient
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
let W,
  H,
  particles = [];
function resize() {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
}
window.addEventListener("resize", resize);
resize();

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

class P {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = rand(0, W);
    this.y = rand(0, H);
    this.vx = rand(-0.25, 0.25);
    this.vy = rand(-0.2, 0.2);
    this.r = rand(0.6, 2.4);
    this.alpha = rand(0.1, 0.8);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -50 || this.x > W + 50 || this.y < -50 || this.y > H + 50)
      this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = "rgba(124,92,255," + this.alpha + ")";
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles(n = 120) {
  particles = [];
  for (let i = 0; i < n; i++) particles.push(new P());
}
initParticles(Math.floor((W * H) / 90000));

let t = 0;
function loop() {
  ctx.clearRect(0, 0, W, H);
  // gradient overlay
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "rgba(7,9,16,0.45)");
  g.addColorStop(1, "rgba(3,6,12,0.6)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // draw soft orbs
  ctx.globalCompositeOperation = "lighter";
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  ctx.globalCompositeOperation = "source-over";

  // subtle animated grid lines
  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  const spacing = 120 + Math.sin(t * 0.0008) * 12;
  for (let x = 0; x < W; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();

  t += 16;
  requestAnimationFrame(loop);
}
loop();

// small subtle entrance animations
document.querySelectorAll(".card").forEach((c, i) => {
  c.style.opacity = 0;
  c.style.transform = "translateY(18px)";
  setTimeout(() => {
    c.style.transition = "all 520ms cubic-bezier(.2,.9,.3,1)";
    c.style.opacity = 1;
    c.style.transform = "translateY(0)";
  }, i * 120);
});
