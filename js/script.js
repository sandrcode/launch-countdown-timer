const endDate = "2025-10-21T13:00:00";
let countdownTimer = null;
const timeUnits = ["days", "hours", "minutes", "seconds"];
const cardElementsCache = new Map();

function getCountdownElements(element) {
  if (cardElementsCache.has(element)) {
    return cardElementsCache.get(element);
  }

  const card = element.querySelector(".card");
  const elements = {
    cardTop: card.querySelector(".top-half"),
    cardBottom: card.querySelector(".bottom-half"),
    cardOverlay: card.querySelector(".card-overlay"),
    cardTopOverlay: card.querySelector(".top-half-overlay"),
    cardBottomOverlay: card.querySelector(".bottom-half-overlay"),
  };

  // Cache the elements
  cardElementsCache.set(element, elements);
  return elements;
}

function updateCardValues(element, overlay, timeValue) {
  // Format with leading zero (2 digits)
  const formattedValue = timeValue.toString().padStart(2, "0");

  // Only update if value changed to avoid unnecessary DOM operations
  if (element.textContent !== formattedValue) {
    element.textContent = formattedValue;
    overlay.textContent = formattedValue;
  }
}

function updateTimeCard(elementClass, timeValue) {
  const countdownElement = document.querySelector(`.${elementClass}`);
  if (!countdownElement) return;

  const cardElements = getCountdownElements(countdownElement);
  const currentValue = parseInt(cardElements.cardTop.textContent, 10);

  // Skip if value hasn't changed
  if (currentValue === timeValue) return;

  // Add flip animation
  cardElements.cardOverlay.classList.add("flip");

  // Update visible values
  updateCardValues(
    cardElements.cardTop,
    cardElements.cardBottomOverlay,
    timeValue
  );

  // Clean up animation and update remaining values when animation ends
  const endAnimation = () => {
    cardElements.cardOverlay.classList.remove("flip");
    updateCardValues(
      cardElements.cardBottom,
      cardElements.cardTopOverlay,
      timeValue
    );
    cardElements.cardOverlay.removeEventListener("animationend", endAnimation);
  };

  cardElements.cardOverlay.addEventListener("animationend", endAnimation, {
    once: true,
  });
}

function getRemainingTime(endTime) {
  const currentTime = Date.now();
  const timeDistance = Math.floor(endTime - currentTime);

  if (timeDistance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(timeDistance / 1000);
  const days = Math.floor(totalSeconds / 86400); // 3600 * 24
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function updateAllCards() {
  const endTimeStamp = new Date(endDate).getTime();
  const remainingTime = getRemainingTime(endTimeStamp);

  // Check if countdown has reached zero
  const { days, hours, minutes, seconds } = remainingTime;

  if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    // Force final state (0, 0, 0, 0)
    timeUnits.forEach((unit) => {
      updateTimeCard(unit, 0);
    });

    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }

    return;
  }

  // Update all time unit cards
  timeUnits.forEach((unit) => {
    updateTimeCard(unit, remainingTime[unit]);
  });
}

// Initialize immediately to avoid initial delay
updateAllCards();

// Start the countdown timer
countdownTimer = setInterval(updateAllCards, 1000);

// Clean up on page unload
window.addEventListener("beforeunload", () => {
  clearInterval(countdownTimer);
});
