const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const closeBtn = document.querySelector(".nav-links .close-btn");

// Hamburger click
hamburger.addEventListener("click", () => {
  navLinks.classList.add("active");
});

// Close button click
closeBtn.addEventListener("click", () => {
  navLinks.classList.remove("active");
});

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-page');
  const currentUrl = window.location.href.toLowerCase();

  navLinks.forEach(link => {
    const linkHref = link.href.toLowerCase();

    // Home link special case (href="#")
    if(link.getAttribute('href') === '#' && currentUrl.endsWith('index.html')) {
      link.style.color = 'gold';
      link.style.fontWeight = 'bold';
    } 
    // Baaki links ke liye URL check
    else if(currentUrl.includes(linkHref)) {
      link.style.color = 'gold';
      link.style.fontWeight = 'bold';
    }
  });
});







// Convert 24h time to 12h format
function convertTo12Hour(time24) {
  let [hours, minutes] = time24.split(":");
  hours = parseInt(hours);

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 -> 12

  return `${hours}:${minutes} ${ampm}`;
}

async function getRamadanTimes() {
  try {
    const response = await fetch(
      "https://api.aladhan.com/v1/hijriCalendarByCity?city=Karachi&country=Pakistan&method=1&school=1&month=9&year=1447",
    );

    const result = await response.json();
    const data = result.data;

    const ramadanContainer = document.getElementById("ramadan-data");
    ramadanContainer.innerHTML = "";

    const today = new Date();
    const todayFormatted = today.toISOString().split("T")[0]; // YYYY-MM-DD

    data.forEach((day, index) => {
      const row = document.createElement("div");
      row.classList.add("table-row");

      const apiDate = day.date.gregorian.date; // DD-MM-YYYY
      const [dd, mm, yyyy] = apiDate.split("-");
      const formattedApiDate = `${yyyy}-${mm}-${dd}`;

      // Active Roza Highlight
      if (formattedApiDate === todayFormatted) {
        row.classList.add("active-roza");
      }

      // Time extraction
      const fajr24 = day.timings.Fajr.split(" ")[0];
      const maghrib24 = day.timings.Maghrib.split(" ")[0];

      const fajr12 = convertTo12Hour(fajr24);
      const maghrib12 = convertTo12Hour(maghrib24);

      row.innerHTML = `
        <div>${index + 1}</div>
        <div>${apiDate}</div>
        <div>${day.date.gregorian.weekday.en}</div>
        <div>${fajr12}</div>
        <div>${maghrib12}</div>
      `;

      ramadanContainer.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching Ramadan data:", error);
  }
}

getRamadanTimes();

let count = 0;
const nameEl = document.getElementById("tasbeeh-name");
const countEl = document.getElementById("tasbeeh-count");
const inputEl = document.getElementById("tasbeeh-input");

const incBtn = document.getElementById("tasbeeh-increase");
const decBtn = document.getElementById("tasbeeh-decrease");
const resetBtn = document.getElementById("tasbeeh-reset");

// Update display
function updateDisplay() {
  const text = inputEl.value.trim() || "---";
  nameEl.textContent = text;
  countEl.textContent = count;
}

// Increment
incBtn.addEventListener("click", () => {
  if (inputEl.value.trim() === "") return;
  count++;
  updateDisplay();
});

// Decrement
decBtn.addEventListener("click", () => {
  if (count > 0) count--;
  updateDisplay();
});

// Reset
resetBtn.addEventListener("click", () => {
  count = 0;
  updateDisplay();
});

// Update text dynamically if user changes input
inputEl.addEventListener("input", () => {
  count = 0; // reset count when new text entered
  updateDisplay();
});

// Initial display
updateDisplay();

// --------------------------
// UTILITY: Convert time string "HH:MM" to Date object today
function getTimeToday(timeStr) {
  const now = new Date();
  const [h, m] = timeStr.split(":").map(Number);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
}

// --------------------------
// Draw Analog Clock
function drawAnalogClock(canvasId, timeObj = null) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const radius = canvas.height / 2;
  ctx.translate(radius, radius);
  const r = radius * 0.9;

  function drawFace() {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 2 * Math.PI);
    ctx.fillStyle = "#000000AA";
    ctx.fill();

    ctx.strokeStyle = "gold";
    ctx.lineWidth = r * 0.05;
    ctx.stroke();

    // Numbers
    ctx.font = r * 0.15 + "px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let num = 1; num <= 12; num++) {
      const ang = (num * Math.PI) / 6;
      ctx.rotate(ang);
      ctx.translate(0, -r * 0.85);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, r * 0.85);
      ctx.rotate(-ang);
    }
  }

  function drawHand(pos, length, width, color) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  }

  function updateClock() {
    ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
    drawFace();

    let h, m, s;
    const now = timeObj ? timeObj : new Date();
    h = now.getHours();
    m = now.getMinutes();
    s = now.getSeconds();

    h = h % 12;
    const hourPos =
      (h * Math.PI) / 6 + (m * Math.PI) / (6 * 60) + (s * Math.PI) / (360 * 60);
    const minPos = (m * Math.PI) / 30 + (s * Math.PI) / 1800;
    const secPos = (s * Math.PI) / 30;

    drawHand(hourPos, r * 0.5, 6, "gold");
    drawHand(minPos, r * 0.8, 4, "white");
    drawHand(secPos, r * 0.9, 2, "red");
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// --------------------------
// FETCH NAMAZ TIMES API
async function initNamazClocks() {
  try {
    const res = await fetch(
      "https://api.aladhan.com/v1/timingsByCity?city=Karachi&country=Pakistan&method=2",
    );
    const data = await res.json();
    const timings = data.data.timings;

    const prayerTimes = {
      fajr: timings.Fajr.split(" ")[0],
      dhuhr: timings.Dhuhr.split(" ")[0],
      asr: timings.Asr.split(" ")[0],
      maghrib: timings.Maghrib.split(" ")[0],
      isha: timings.Isha.split(" ")[0],
    };

    // Update text
    for (let prayer in prayerTimes) {
      const time12h = convertTo12Hour(prayerTimes[prayer]);
      document.getElementById(`${prayer}-time`).textContent = time12h;
    }

    // Draw clocks
    drawAnalogClock("fajr-clock", getTimeToday(prayerTimes.fajr));
    drawAnalogClock("dhuhr-clock", getTimeToday(prayerTimes.dhuhr));
    drawAnalogClock("asr-clock", getTimeToday(prayerTimes.asr));
    drawAnalogClock("maghrib-clock", getTimeToday(prayerTimes.maghrib));
    drawAnalogClock("isha-clock", getTimeToday(prayerTimes.isha));
    drawAnalogClock("current-clock"); // live current time
  } catch (e) {
    console.error("Error fetching prayer times:", e);
  }
}

// 24-hour to 12-hour
function convertTo12Hour(time24) {
  let [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
}

// Initialize
initNamazClocks();

// --------------------------
// Current Clock Digital Time Update
function startCurrentTimeDisplay() {
  const currentTimeEl = document.getElementById("current-time");

  function updateTime() {
    const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12; // handle 0 hour

    currentTimeEl.textContent = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")} ${ampm}`;
  }

  updateTime(); // initial call
  setInterval(updateTime, 1000); // update every second
}

// Call the function to start digital clock
startCurrentTimeDisplay();
