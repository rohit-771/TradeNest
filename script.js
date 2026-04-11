const container = document.getElementById("container");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");
const themeBtn = document.getElementById("themeBtn");

let cryptoData = [];
let favorites = new Set();

//  Fetch API
async function fetchData() {
  try {
    loading.style.display = "block";

    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
    );

    const data = await res.json();
    cryptoData = data;

    applyAll();
  } catch (error) {
    console.log(error);
  } finally {
    loading.style.display = "none";
  }
}

//  MAIN FUNCTION (Search + Filter + Sort)
function applyAll() {
  let data = [...cryptoData];

  //  Search (filter HOF)
  const value = searchInput.value.toLowerCase();
  data = data.filter((coin) =>
    coin.name.toLowerCase().includes(value)
  );

  //  Filter
  if (filterSelect.value === "top") {
    data = data.filter((coin) => coin.market_cap_rank <= 10);
  }

  // Sorting
  if (sortSelect.value === "priceHigh") {
    data = data.sort((a, b) => b.current_price - a.current_price);
  } else if (sortSelect.value === "priceLow") {
    data = data.sort((a, b) => a.current_price - b.current_price);
  } else if (sortSelect.value === "name") {
    data = data.sort((a, b) => a.name.localeCompare(b.name));
  }

  displayData(data);
}

//  Display
function displayData(data) {
  container.innerHTML = "";

  data.map((coin) => {
    const card = document.createElement("div");
    card.className = "card";

    const isFav = favorites.has(coin.id);

    card.innerHTML = `
      <img src="${coin.image}" />
      <h3>${coin.name}</h3>
      <p>💲 ${coin.current_price}</p>
      <p>Rank: ${coin.market_cap_rank}</p>
      <span class="favorite" onclick="toggleFav('${coin.id}')">
        ${isFav ? "⭐" : "☆"}
      </span>
    `;

    container.appendChild(card);
  });
}

//  Favorite Toggle (Button Interaction)
function toggleFav(id) {
  if (favorites.has(id)) {
    favorites.delete(id);
  } else {
    favorites.add(id);
  }
  applyAll();
}

//  Dark Mode
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

//  Event Listeners
searchInput.addEventListener("input", applyAll);
filterSelect.addEventListener("change", applyAll);
sortSelect.addEventListener("change", applyAll);

//  Run
fetchData();
