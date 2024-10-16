// lenis smooth scroll
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// scrolltrigger animation
gsap.registerPlugin(ScrollTrigger);

const stickySection = document.querySelector(".sticky");
const pinnedHeight = window.innerHeight * 8;
const handContainer = document.querySelector(".hand-container");
const hand = document.querySelector(".hand-container .hand");
const handImage = hand.querySelector("img");
const intro = document.querySelector(".intro");
const h1Element = document.querySelector(".intro h1");
let h1Span = h1Element.querySelector("span");
const introCopy = intro.querySelectorAll("p");

const introHeaders = [
  "<span>time to</span> be creative",
  "<span>time to</span> be (extra)ordinary",
  "<span>time to</span> design the future",
  "<span>time to</span> meet thounny",
  "<span>time to</span> see <strong>thounny</strong>",
];

let currentCycle = -1;
let imageRevealed = false;

function updateHeaderText() {
  h1Element.innerHTML =
    introHeaders[Math.min(currentCycle, introHeaders.length - 1)];
  h1Span = h1Element.querySelector("span");
  console.log(`Changed to: ${h1Element.textContent}`);
}

ScrollTrigger.create({
  trigger: stickySection,
  start: "top top",
  end: `+=${pinnedHeight}`,
  pin: true,
  pinSpacing: true,
  onUpdate: (self) => {
    const progress = self.progress;

    const rotationProgress = Math.min((progress * 8) / 5, 1);
    const totalRotation = rotationProgress * 1800 - 90;
    const rotationInCycle = ((totalRotation + 90) % 360) - 90;
    gsap.set(handContainer, { rotationZ: rotationInCycle });

    const newCycle = Math.floor((totalRotation + 90) / 360);
    if (
      newCycle !== currentCycle &&
      newCycle >= 0 &&
      newCycle < introHeaders.length
    ) {
      currentCycle = newCycle;
      updateHeaderText();

      if (newCycle === 3 && !imageRevealed) {
        gsap.to(handImage, { opacity: 1, duration: 0.3 });
        gsap.to(introCopy, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
        });
        imageRevealed = true;
      } else if (newCycle !== 3 && imageRevealed) {
        gsap.to(handImage, { opacity: 0, duration: 0.3 });
        gsap.to(introCopy, {
          x: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
        });

        imageRevealed = false;
      }
    }

    if (progress <= 6 / 8) {
      const animationProgress = Math.max(0, (progress - 5 / 8) / (1 / 8));
      const newHeight = gsap.utils.interpolate(52.75, 100, animationProgress);
      const newOpacity = gsap.utils.interpolate(1, 0, animationProgress);
      gsap.set(hand, { height: `${newHeight}%` });
      gsap.set(intro, { opacity: 1 });
      gsap.set(h1Element, { opacity: newOpacity });
      gsap.set(h1Span, { opacity: newOpacity });
    } else {
      gsap.set(intro, { opacity: 0 });
    }

    if (progress <= 7 / 8) {
      const scaleProgress = Math.max(0, (progress - 6 / 8) / (1 / 8));
      const newScale = gsap.utils.interpolate(1, 20, scaleProgress);
      gsap.set(hand, { scale: newScale });
    }

    if (progress <= 7.5 / 8) {
      const opacityProgress = Math.max(0, (progress - 7 / 8) / (0.5 / 8));
      const newOpacity = gsap.utils.interpolate(1, 0, opacityProgress);
      gsap.set(hand, { opacity: newOpacity });
    }

    if (progress > 7.5 / 8) {
      const revealProgress = (progress - 7.5 / 8) / (0.5 / 8);
      const newOpacity = gsap.utils.interpolate(0, 1, revealProgress);
      gsap.set(".website-content", { opacity: newOpacity });
    } else {
      gsap.set(".website-content", { opacity: 0 });
    }
  },
});

updateHeaderText();
