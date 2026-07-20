const carousels = {
  biofi: {
    imageId: "biofi-carousel-image",
    dotsId: "biofi-dots",
    images: [
      {
        src: "assets/images/carousels/biofi/redcomb.png",
        alt: "BioFi product image 1",
      },
      {
        src: "assets/images/carousels/biofi/white-pellets.jpg",
        alt: "BioFi product image 2",
      },
      {
        src: "assets/images/carousels/biofi/ramp-part.jpg",
        alt: "BioFi product image 3",
      },
      {
        src: "assets/images/carousels/biofi/grommet.jpg",
        alt: "BioFi product image 4",
      },
    ],
    index: 0,
  },
  btr: {
    imageId: "btr-carousel-image",
    dotsId: "btr-dots",
    images: [
      {
        src: "assets/images/carousels/btr/plain-jutin.png",
        alt: "BTR Board product image 1",
      },
      {
        src: "assets/images/carousels/btr/blue-carved-jutin.jpg",
        alt: "BTR Board product image 2",
      },
      {
        src: "assets/images/carousels/btr/mushroom.jpg",
        alt: "BTR Board product image 3",
      },
      {
        src: "assets/images/carousels/btr/green-jutin.jpg",
        alt: "BTR Board product image 4",
      },
    ],
    index: 0,
  },
};

function renderDots(name) {
  const carousel = carousels[name];
  const dotsRoot = document.getElementById(carousel.dotsId);
  const dotSpacing = 13;

  if (!dotsRoot.dataset.ready) {
    dotsRoot.innerHTML = "";

    carousel.images.forEach(() => {
      const dot = document.createElement("span");
      dot.className = "carousel-dot";
      dotsRoot.appendChild(dot);
    });

    const indicator = document.createElement("span");
    indicator.className = "carousel-dot-indicator";
    dotsRoot.appendChild(indicator);
    dotsRoot.dataset.ready = "true";
  }

  const indicator = dotsRoot.querySelector(".carousel-dot-indicator");
  indicator.style.transform = `translateX(${carousel.index * dotSpacing}px)`;
}

function updateCarousel(name) {
  const carousel = carousels[name];
  const image = document.getElementById(carousel.imageId);
  const current = carousel.images[carousel.index];
  const prevButton = document.querySelector(
    `.carousel-prev[data-carousel-target="${name}"]`
  );
  const nextButton = document.querySelector(
    `.carousel-next[data-carousel-target="${name}"]`
  );

  image.src = current.src;
  image.alt = current.alt;
  renderDots(name);

  if (prevButton) {
    prevButton.classList.toggle("is-hidden", carousel.index === 0);
  }

  if (nextButton) {
    nextButton.classList.toggle(
      "is-hidden",
      carousel.index === carousel.images.length - 1
    );
  }
}

function nextSlide(name) {
  const carousel = carousels[name];
  if (carousel.index >= carousel.images.length - 1) {
    return;
  }

  carousel.index += 1;
  updateCarousel(name);
}

function prevSlide(name) {
  const carousel = carousels[name];
  if (carousel.index <= 0) {
    return;
  }

  carousel.index -= 1;
  updateCarousel(name);
}

Object.keys(carousels).forEach((name) => updateCarousel(name));

document.querySelectorAll(".carousel-arrow").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.carouselTarget;
    const direction = button.dataset.carouselDirection;

    if (direction === "prev") {
      prevSlide(target);
      return;
    }

    nextSlide(target);
  });
});

// Marketplace links shown in the Buy Now modal.
// To add another marketplace, add an entry here - the modal renders it automatically.
const marketplaces = [
  {
    name: "B2BMAP",
    url: "https://b2bmap.com/applied-bioplastics",
  },
  {
    name: "Knowde",
    url: "https://www.knowde.com/stores/applied-bioplastics",
  },
];

const buyModal = document.getElementById("buy-modal");

if (buyModal) {
  const linksRoot = document.getElementById("buy-modal-links");
  const dialog = buyModal.querySelector(".buy-modal-dialog");
  const closeElements = buyModal.querySelectorAll("[data-modal-close]");
  const buyTriggers = document.querySelectorAll("[data-buy-trigger]");
  let lastFocusedElement = null;

  const svgNS = "http://www.w3.org/2000/svg";

  function createIcon(className, pathData) {
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", className);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("viewBox", "0 0 24 24");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "1.8");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");

    svg.appendChild(path);
    return svg;
  }

  marketplaces.forEach((marketplace) => {
    const link = document.createElement("a");
    link.className = "buy-modal-link";
    link.href = marketplace.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const icon = document.createElement("span");
    icon.className = "buy-modal-link-icon";
    icon.appendChild(
      createIcon(
        "",
        "M6 8h12l-1 12.5a1 1 0 0 1-1 .9H8a1 1 0 0 1-1-.9L6 8ZM9 8V6.5a3 3 0 0 1 6 0V8"
      )
    );

    const text = document.createElement("span");
    text.className = "buy-modal-link-text";

    const name = document.createElement("span");
    name.className = "buy-modal-link-name";
    name.textContent = marketplace.name;

    const domain = document.createElement("span");
    domain.className = "buy-modal-link-domain";
    domain.textContent = new URL(marketplace.url).hostname.replace(/^www\./, "");

    text.append(name, domain);

    const arrow = createIcon("buy-modal-link-arrow", "M5 12h14M13 6l6 6-6 6");
    arrow.setAttribute("stroke-width", "2");

    link.append(icon, text, arrow);
    linksRoot.appendChild(link);
  });

  function getFocusable() {
    return dialog.querySelectorAll('a[href], button:not([disabled])');
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = getFocusable();
    if (!focusable.length) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openModal() {
    lastFocusedElement = document.activeElement;
    buyModal.classList.add("is-open");
    buyModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", onKeydown);

    const closeButton = buyModal.querySelector(".buy-modal-close");
    if (closeButton) {
      closeButton.focus();
    }
  }

  function closeModal() {
    buyModal.classList.remove("is-open");
    buyModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", onKeydown);

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  buyTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openModal();
    });
  });

  closeElements.forEach((element) => {
    element.addEventListener("click", closeModal);
  });
}

// Defer downloading the hero video until it's about to scroll into view,
// and skip it entirely for users who prefer reduced motion.
const lazyVideos = document.querySelectorAll("[data-lazy-video]");

function loadLazyVideo(video) {
  if (video.dataset.loaded) {
    return;
  }

  video.dataset.loaded = "true";
  video.querySelectorAll("source[data-src]").forEach((source) => {
    source.src = source.dataset.src;
  });
  video.load();
  video.play().catch(() => {});
}

if (lazyVideos.length) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    // Leave the poster frame in place; don't download or autoplay the video.
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadLazyVideo(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    lazyVideos.forEach((video) => observer.observe(video));
  } else {
    lazyVideos.forEach(loadLazyVideo);
  }
}

// Fade/slide the video hero copy in once it scrolls into view.
const revealEls = document.querySelectorAll(".video-hero-copy");

if (revealEls.length && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    mainNav.classList.toggle("is-open", !isOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      mainNav.classList.remove("is-open");
    });
  });
}
