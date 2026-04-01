const container = document.getElementById("container");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("search");

let cryptoData = [];

//  Fetch API
async function fetchData() {
  try {
    loading.style.display = "block";

    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
    );
    const data = await res.json();

    cryptoData = data;

    displayData(data);
  } catch (error) {
    console.log("Error:", error);
  } finally {
    loading.style.display = "none";
  }
}

// Display Data
function displayData(data) {
  container.innerHTML = "";

  data.forEach((coin) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${coin.image}" />
      <h3>${coin.name}</h3>
      <p>💲 ${coin.current_price}</p>
    `;

    container.appendChild(card);
  });
}

// Search (HOF - filter)
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = cryptoData.filter((coin) =>
    coin.name.toLowerCase().includes(value)
  );

  displayData(filtered);
});

// Run
fetchData();