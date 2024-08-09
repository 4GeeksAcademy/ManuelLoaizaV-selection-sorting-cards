const SUITS = ["Clubs", "Diamonds", "Hearts", "Spades"];

const suitProperties = {
  Diamonds: {
    color: "danger",
    symbol: "♦"
  },
  Hearts: {
    color: "danger",
    symbol: "♥"
  },
  Spades: {
    color: "black",
    symbol: "♠"
  },
  Clubs: {
    color: "black",
    symbol: "♣"
  }
};

const RANKS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King",
  "Ace"
];

const MIN_NUMBER_OF_CARDS = 1;
const MAX_NUMBER_OF_CARDS = 52;

const getRandomInteger = function getRandomIntegerBetweenLAndRInclusive(l, r) {
  return l + Math.floor(Math.random() * (r - l + 1));
};

const generateCardIndexes = function generateSuitAndRankIndexesRandomly() {
  const randomSuitIndex = getRandomInteger(0, SUITS.length - 1);
  const randomRankIndex = getRandomInteger(0, RANKS.length - 1);
  return { suitIndex: randomSuitIndex, rankIndex: randomRankIndex };
};

const generateDeckIndexes = function generateDeckIndexesRandomly(
  numberOfCards
) {
  const deckIndexes = [];
  for (let i = 0; i < numberOfCards; i++) {
    deckIndexes.push(generateCardIndexes());
  }
  return deckIndexes;
};

const hasValidCardsNumber = function hasValidRawCardsNumberValue(
  cardsNumberInput
) {
  const rawCardsNumber = cardsNumberInput.value;
  if (rawCardsNumber === "") {
    return false;
  }
  const cardsNumber = Number(rawCardsNumber);
  return (
    Number.isInteger(cardsNumber) &&
    MIN_NUMBER_OF_CARDS <= cardsNumber &&
    cardsNumber <= MAX_NUMBER_OF_CARDS
  );
};

const disableSortButton = function disableSortButtonIfEnabled() {
  const sortButton = document.getElementById("sort-button");
  if (!sortButton.hasAttribute("disabled")) {
    sortButton.setAttribute("disabled", "");
  }
};

const enableSortButton = function enableSortButtonIfDisabled() {
  const sortButton = document.getElementById("sort-button");
  if (sortButton.hasAttribute("disabled")) {
    sortButton.removeAttribute("disabled");
  }
};

const generateCardHTML = function generateCardHTML(cardIndexes) {
  const suit = SUITS[cardIndexes.suitIndex];
  const rank = RANKS[cardIndexes.rankIndex];
  const color = suitProperties[suit].color;
  const symbol = suitProperties[suit].symbol;
  return `
  <div class="col">
    <div class="card rounded-4 bg-white" style="width:125px;height:175px;">
      <div class="card-header border-bottom-0 bg-transparent">
        <div class="d-flex align-items-center justify-content-start h-100">
          <p class="text-${color} mb-0">${symbol}</p>
        </div>
      </div>
      <div class="card-body bg-transparent">
        <div class="d-flex align-items-center justify-content-center h-100">
          <p class="text-${color} mb-0">${rank.length > 2 ? rank[0] : rank}</p>
        </div>
      </div>
      <div class="card-footer border-top-0 bg-transparent">
        <div class="d-flex align-items-center justify-content-end h-100">
          <p class="text-${color} mb-0">${symbol}</p>
        </div>
      </div>
    </div>
  </div>
  `;
};

const generateDeckHTML = function generateDeckHTML(deckIndexes) {
  const columns = deckIndexes.map(cardIndexes => generateCardHTML(cardIndexes));
  return `<div class="row row-cols-12 mb-3 mt-3">${columns.join("")}</div>`;
};

// I have created this array to share the generated deck from the draw-button callback in the sort-button callback.
let renderedDeckIndexes = [];

document.getElementById("draw-button").addEventListener("click", event => {
  const cardsNumberInput = document.getElementById("cards-number");
  if (!hasValidCardsNumber(cardsNumberInput)) {
    disableSortButton();
    return;
  }
  enableSortButton();
  const cardsNumber = parseInt(cardsNumberInput.value);
  const deckIndexes = generateDeckIndexes(cardsNumber);
  document.getElementById("deck").innerHTML = generateDeckHTML(deckIndexes);
  document.getElementById("sorting-log").innerHTML = "";
  renderedDeckIndexes = [...deckIndexes];
});

// One of the most common conventions from lowest to highest is the English alphabetical order starting from
// clubs, followed by diamonds, hearts, and spades. See https://en.wikipedia.org/wiki/High_card_by_suit
document.getElementById("sort-button").addEventListener("click", event => {
  let sortingLogHTML = `<h2 class="text-center mt-4 mb-4">Bubble Sort Log</h2>`;
  let swapsNumber = 0;
  for (let r = renderedDeckIndexes.length - 1; r >= 0; r--) {
    let atLeastOneSwap = false;
    for (let l = 0; l < r; l++) {
      if (
        renderedDeckIndexes[l].suitIndex >
          renderedDeckIndexes[l + 1].suitIndex ||
        (renderedDeckIndexes[l].suitIndex ===
          renderedDeckIndexes[l + 1].suitIndex &&
          renderedDeckIndexes[l].rankIndex >
            renderedDeckIndexes[l + 1].rankIndex)
      ) {
        const aux = renderedDeckIndexes[l];
        renderedDeckIndexes[l] = renderedDeckIndexes[l + 1];
        renderedDeckIndexes[l + 1] = aux;
        swapsNumber++;
        atLeastOneSwap = true;
        sortingLogHTML += `<h4 class="text-center">${swapsNumber}. Swap cards in positions ${l +
          1} and ${l + 2}.</h2>${generateDeckHTML(renderedDeckIndexes)}`;
      }
    }
    if (!atLeastOneSwap) {
      break;
    }
  }

  if (swapsNumber === 0) {
    sortingLogHTML =
      '<h2 class="text-center mt-4 mb-4">Deck already sorted.</h2>';
  }
  document.getElementById("sorting-log").innerHTML = sortingLogHTML;
  disableSortButton();
});

document.getElementsByTagName("form")[0].addEventListener("submit", event => {
  event.preventDefault();
});
