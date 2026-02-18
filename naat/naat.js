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


