import { gsap } from "gsap";
import { Observer } from "gsap/observer";


// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobileMenuButton');
const navbarItems = document.getElementById('navbarItems');

if (mobileMenuButton && navbarItems) {
  mobileMenuButton.addEventListener('click', () => {
    navbarItems.classList.toggle('hidden');
    navbarItems.classList.toggle('md:flex');
    navbarItems.classList.toggle('flex');
    navbarItems.classList.toggle('flex-col');
    navbarItems.classList.toggle('absolute');
    navbarItems.classList.toggle('top-full');
    navbarItems.classList.toggle('left-0');
    navbarItems.classList.toggle('right-0');
    navbarItems.classList.toggle('bg-[rgba(26,26,26,0.95)]');
    navbarItems.classList.toggle('backdrop-blur-lg');
    navbarItems.classList.toggle('p-4');
    navbarItems.classList.toggle('space-y-4');
  });
}

// Navbar scroll hide/show functionality with smooth slide animation
let lastScrollTop = 0;
const header = document.getElementById('header');
const scrollThreshold = 10; // Minimum scroll distance to trigger hide/show

function handleScroll() {
  if (!header) return;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Only trigger if scrolled more than threshold
  if (Math.abs(scrollTop - lastScrollTop) < scrollThreshold) {
    return;
  }

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    header.classList.add('header-hidden');
  } else {
    header.classList.remove('header-hidden');
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
}

// Throttle scroll event for better performance
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
});

// Show navbar when at the top of the page
window.addEventListener('scroll', () => {
  if (window.pageYOffset === 0) {
    header.classList.remove('header-hidden');
  }
});

// Set current year in footer
const currentYearElement = document.getElementById('current-year');
if (currentYearElement) {
  currentYearElement.textContent = new Date().getFullYear();
}

/*------------------------------
      CUSTOM CURSOR
------------------------------*/
const cursor = document.getElementById("customCursor");
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

let isCursorAnimating = false;
function animateCursor() {
  if (!isCursorAnimating) return;
  // Instant following - no delay
  cursorX = mouseX;
  cursorY = mouseY;

  cursor.style.left = cursorX + "px";
  cursor.style.top = cursorY + "px";

  requestAnimationFrame(animateCursor);
}

// Only start animation when mouse moves
document.addEventListener(
  "mousemove",
  () => {
    if (!isCursorAnimating) {
      isCursorAnimating = true;
      animateCursor();
    }
  },
  { once: false }
);

// Cursor animation starts on first mouse move

// Make cursor larger on hover over interactive elements
const footerLink = document.querySelector(".footer a");
if (footerLink) {
  footerLink.addEventListener("mouseenter", () => {
    cursor.style.width = "50px";
    cursor.style.height = "50px";
    cursor.style.borderWidth = "3px";
  });
  footerLink.addEventListener("mouseleave", () => {
    cursor.style.width = "40px";
    cursor.style.height = "40px";
    cursor.style.borderWidth = "2px";
  });
}

// Make cursor larger on hover over color buttons
if (typeof colorButtons !== 'undefined') {
  colorButtons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      cursor.style.width = "50px";
      cursor.style.height = "50px";
      cursor.style.borderWidth = "3px";
    });
    btn.addEventListener("mouseleave", () => {
      cursor.style.width = "40px";
      cursor.style.height = "40px";
      cursor.style.borderWidth = "2px";
    });
  });
}

// Make cursor larger on hover over toggle adjuster button
if (typeof toggleAdjusterBtn !== 'undefined' && toggleAdjusterBtn) {
  toggleAdjusterBtn.addEventListener("mouseenter", () => {
    cursor.style.width = "50px";
    cursor.style.height = "50px";
    cursor.style.borderWidth = "3px";
  });
toggleAdjusterBtn.addEventListener("mouseleave", () => {
  cursor.style.width = "40px";
  cursor.style.height = "40px";
  cursor.style.borderWidth = "2px";
});

let sectionNodes = Array.from(document.querySelectorAll("section"));
let sectionAnimating = false;
let sectionIndex = 0;
let outerWrappers = Array.from(document.querySelectorAll("section .outer"));
let innerWrappers = Array.from(document.querySelectorAll("section .inner"));
function clampIndex(i, len) {
  if (len === 0) return 0;
  return (i % len + len) % len;
}
function nearestSectionIndex() {
  let y = window.pageYOffset || document.documentElement.scrollTop;
  let idx = 0;
  let min = Infinity;
  for (let i = 0; i < sectionNodes.length; i++) {
    let top = sectionNodes[i].offsetTop;
    let d = Math.abs(y - top);
    if (d < min) {
      min = d;
      idx = i;
    }
  }
  return idx;
}
function gotoSection(i, dir) {
  if (sectionAnimating || sectionNodes.length === 0) return;
  sectionAnimating = true;
  i = clampIndex(i, sectionNodes.length);
  let target = sectionNodes[i];
  let heading = target.querySelector(".section-heading");
  window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
  if (typeof gsap !== "undefined" && heading) {
    let dFactor = dir === -1 ? -1 : 1;
    let ow = outerWrappers[i];
    let iw = innerWrappers[i];
    if (ow && iw) {
      gsap.set(outerWrappers, { yPercent: 100 });
      gsap.set(innerWrappers, { yPercent: -100 });
      gsap.fromTo(
        [ow, iw],
        { yPercent: j => j ? -100 * dFactor : 100 * dFactor },
        { yPercent: 0, duration: 1, ease: "power1.inOut" }
      );
    }
    gsap.fromTo(
      heading,
      { autoAlpha: 0, yPercent: 25 * dFactor },
      { autoAlpha: 1, yPercent: 0, duration: 0.8, ease: "power2.out" }
    );
  }
  sectionIndex = i;
  setTimeout(() => {
    sectionAnimating = false;
  }, 900);
}
sectionIndex = nearestSectionIndex();
if (typeof gsap !== "undefined" && typeof Observer !== "undefined") {
  gsap.registerPlugin(Observer);
  Observer.create({
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onDown: () => !sectionAnimating && gotoSection(sectionIndex - 1, -1),
    onUp: () => !sectionAnimating && gotoSection(sectionIndex + 1, 1),
    tolerance: 10,
    preventDefault: true
  });
} else {
  let lastY = window.pageYOffset || document.documentElement.scrollTop;
  window.addEventListener("wheel", (e) => {
    if (sectionAnimating) return;
    let y = window.pageYOffset || document.documentElement.scrollTop;
    let dir = y > lastY ? 1 : -1;
    gotoSection(sectionIndex + dir, dir);
    lastY = y;
    e.preventDefault();
  }, { passive: false });
}
}
