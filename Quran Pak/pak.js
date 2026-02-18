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




const paraContainer = document.getElementById("paraContainer");
const quranText = document.getElementById("quranText");
const paraTitle = document.getElementById("paraTitle");

// Single image for all Para cards
const paraImage = "../assets/Quran-pak.jpg"; // 1 image for all cards

// Create 30 Para Cards
for (let i = 1; i <= 30; i++) {
    paraContainer.innerHTML += `
        <div class="para-card">
            <img src="${paraImage}" alt="Para ${i}" class="para-img">
            <h3>Para ${i}</h3>
            <button class="read-btn" onclick="loadPara(${i})">
                Read
            </button>
        </div>
    `;
}

// Load Para Function
function loadPara(paraNumber) {
    quranText.innerHTML = "Loading...";
    paraTitle.innerText = `Para ${paraNumber}`;

    fetch(`https://api.alquran.cloud/v1/juz/${paraNumber}/quran-uthmani`)
    .then(res => res.json())
    .then(data => {
        quranText.innerHTML = "";
        data.data.ayahs.forEach(ayah => {
            const p = document.createElement("p");
            p.innerText = ayah.text;
            quranText.appendChild(p);
        });

        window.scrollTo({
            top: document.querySelector(".quran-content").offsetTop,
            behavior: "smooth"
        });
    })
    .catch(err => {
        quranText.innerHTML = "Error loading Para.";
        console.log(err);
    });
}
