const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealItems.forEach((item) => observer.observe(item));

const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const quickviewModal = document.querySelector("[data-quickview-modal]");
const quickviewTriggers = document.querySelectorAll("[data-quickview-open]");
const quickviewCloseButtons = document.querySelectorAll("[data-quickview-close]");
const quickviewMainImage = document.getElementById("quickview-main-image");
const quickviewThumbsContainer = document.getElementById("quickview-thumbs");
const quickviewBadge = document.getElementById("quickview-badge");
const quickviewTitle = document.getElementById("quickview-title");
const quickviewDescription = document.getElementById("quickview-description");
const quickviewPrice = document.getElementById("quickview-price");
const quickviewNote = document.getElementById("quickview-note");
const quickviewDetails = document.getElementById("quickview-details");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.tabTarget;

    tabButtons.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-selected", "false");
    });

    tabPanels.forEach((panel) => {
      const isMatch = panel.id === targetId;
      panel.classList.toggle("is-active", isMatch);
      panel.hidden = !isMatch;
    });

    button.classList.add("is-active");
    button.setAttribute("aria-selected", "true");

    document.querySelectorAll(`#${targetId} .reveal`).forEach((item) => {
      item.classList.add("is-visible");
    });
  });
});

const setActiveThumb = (thumb) => {
  quickviewThumbsContainer?.querySelectorAll(".quickview-thumb").forEach((item) => {
    item.classList.remove("is-active");
  });

  thumb.classList.add("is-active");
};

const buildQuickviewThumb = (src, alt, isActive) => {
  const thumb = document.createElement("button");
  thumb.type = "button";
  thumb.className = `quickview-thumb${isActive ? " is-active" : ""}`;
  thumb.dataset.quickviewImage = src;
  thumb.dataset.quickviewAlt = alt;

  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  thumb.appendChild(image);

  thumb.addEventListener("click", () => {
    if (!quickviewMainImage) {
      return;
    }

    setActiveThumb(thumb);
    quickviewMainImage.src = src;
    quickviewMainImage.alt = alt;
  });

  return thumb;
};

const populateQuickview = (trigger) => {
  if (
    !quickviewMainImage ||
    !quickviewThumbsContainer ||
    !quickviewBadge ||
    !quickviewTitle ||
    !quickviewDescription ||
    !quickviewPrice ||
    !quickviewNote ||
    !quickviewDetails
  ) {
    return;
  }

  const images = (trigger.dataset.productImages || "").split("|").filter(Boolean);
  const alts = (trigger.dataset.productAlts || "").split("|").filter(Boolean);
  const details = (trigger.dataset.productDetails || "").split("|").filter(Boolean);

  quickviewBadge.textContent = trigger.dataset.productBadge || "Closer View";
  quickviewTitle.textContent = trigger.dataset.productTitle || "Jersey Preview";
  quickviewDescription.textContent = trigger.dataset.productDescription || "";
  quickviewPrice.textContent = trigger.dataset.productPrice || "INR 500";
  quickviewNote.textContent = trigger.dataset.productNote || "";

  quickviewDetails.innerHTML = "";
  details.forEach((detail) => {
    const item = document.createElement("li");
    item.textContent = detail;
    quickviewDetails.appendChild(item);
  });

  quickviewThumbsContainer.innerHTML = "";

  images.forEach((src, index) => {
    const alt = alts[index] || trigger.dataset.productTitle || "Jersey image";
    const thumb = buildQuickviewThumb(src, alt, index === 0);
    quickviewThumbsContainer.appendChild(thumb);
  });

  const firstImage = images[0];
  const firstAlt = alts[0] || trigger.dataset.productTitle || "Jersey image";

  if (firstImage) {
    quickviewMainImage.src = firstImage;
    quickviewMainImage.alt = firstAlt;
  }
};

const openQuickview = (trigger) => {
  if (!quickviewModal) {
    return;
  }

  populateQuickview(trigger);
  quickviewModal.hidden = false;
  document.body.classList.add("modal-open");
};

const closeQuickview = () => {
  if (!quickviewModal) {
    return;
  }

  quickviewModal.hidden = true;
  document.body.classList.remove("modal-open");
};

quickviewTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openQuickview(trigger);
  });
});

quickviewCloseButtons.forEach((button) => {
  button.addEventListener("click", closeQuickview);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && quickviewModal && !quickviewModal.hidden) {
    closeQuickview();
  }
});

const signupForm = document.querySelector(".signup-form");

signupForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const button = signupForm.querySelector("button");
  const input = signupForm.querySelector("input");

  if (!button || !input) {
    return;
  }

  button.textContent = "You're On The List";
  button.disabled = true;
  input.value = "";
});
