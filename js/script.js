const endDate = "2025-08-02T11:11:00";

function getCountdownElements(element) {
  const card = element.querySelector(".card");
  const cardTop = card.querySelector(".top-half");
  const cardBottom = card.querySelector(".bottom-half");
  const cardOverlay = card.querySelector(".card-overlay");
  const cardTopOverlay = cardOverlay.querySelector(".top-half-overlay");
  const cardBottomOverlay = cardOverlay.querySelector(".bottom-half-overlay");

  return {
    cardTop,
    cardBottom,
    cardOverlay,
    cardTopOverlay,
    cardBottomOverlay,
  };
}

function updateCardValues(element, overlay, timeValue) {
  element.textContent = timeValue;
  overlay.textContent = timeValue;
}

function updateTimeCard(element, timeValue) {
    const countdownElement = document.querySelector(`.${element}`)
    const cardElements = getCountdownElements(countdownElement);

  //add animation "flip" class
  if (parseInt(cardElements.cardTop.textContent, 10) === timeValue) {
    return;
  }
  cardElements.cardOverlay.classList.add("flip");

  updateCardValues(
    cardElements.cardTop,
    cardElements.cardBottomOverlay,
    timeValue
  );

  function endAnimation() {
    cardElements.cardOverlay.classList.remove("flip");
    updateCardValues(cardElements.cardBottom, cardElements.cardTopOverlay, timeValue);
    this.removeEventListener("animationend", endAnimation);
  }

  cardElements.cardOverlay.addEventListener("animationend", endAnimation);
}

function getRemainingTime(endTime) {
  const currentTime = Date.now();
  const timeDistance = Math.floor(endTime - currentTime);

  if (timeDistance <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalSeconds = Math.floor(timeDistance / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

function updateAllCards() {
    const endTimeStamp = new Date(endDate).getTime();
    const remainingTimeBits = getRemainingTime(endTimeStamp);

    updateTimeCard('seconds', remainingTimeBits.seconds);
    updateTimeCard('minutes', remainingTimeBits.minutes);
    updateTimeCard('hours', remainingTimeBits.hours);
    updateTimeCard('days', remainingTimeBits.days);
}

const countdownTimer = setInterval(() => {
    updateAllCards();
}, 1000);