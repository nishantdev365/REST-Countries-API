let themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
let themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");
let themeToggleName = document.getElementById("theme-btn-name");
let countryName = document.getElementById("country-name");
let showMoreButton = document.getElementById("btn");
let searchBar = document.getElementById('search');
let countryRegion = document.getElementById('countries')

// Change the icons inside the button based on previous settings
if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  themeToggleLightIcon.classList.remove("hidden");
} else {
  themeToggleDarkIcon.classList.remove("hidden");
}

let themeToggleBtn = document.getElementById("theme-toggle");

themeToggleBtn.addEventListener("click", function () {
  // toggle icons inside button
  themeToggleDarkIcon.classList.toggle("hidden");
  themeToggleLightIcon.classList.toggle("hidden");

  // if set via local storage previously
  if (localStorage.getItem("color-theme")) {
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
      themeToggleName.textContent = "Light Mode";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
      themeToggleName.textContent = "Dark Mode";
    }

    // if NOT set via local storage previously
  } else {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  }
});

let data = []; // Populate this array with country data

async function fetchData() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    data = await response.json();
    const slicedData = data.slice(0, 52);
    console.log(slicedData);

    // Function to create a card for a country
    function createCountryCard(country) {
      const card = document.createElement("div");
      card.className =
        "mb-5 max-w-sm max-h-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-700 transition-transform transform-gpu hover:scale-95";

      const link = document.createElement("a");
      link.href = "#";

      const img = document.createElement("img");
      img.className = "rounded-t-lg w-full h-2/5";
      img.src = country.flags.png;
      img.alt = `${country.name.common} Flag`;
      link.appendChild(img);
      card.appendChild(link);

      const cardContent = document.createElement("div");
      cardContent.className = "p-5";

      const countryTitle = document.createElement("h5");
      countryTitle.className =
        "mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white";
      const countryName = document.createTextNode(country.name.common);
      countryTitle.appendChild(countryName);
      cardContent.appendChild(countryTitle);

      const population = document.createElement("p");
      population.className =
        "mb-3 font-normal text-gray-700 dark:text-gray-400";
      const populationText = document.createTextNode(
        `Population: ${country.population}`
      );
      population.appendChild(populationText);
      cardContent.appendChild(population);

      const region = document.createElement("p");
      region.className = "mb-3 font-normal text-gray-700 dark:text-gray-400";
      const regionText = document.createTextNode(`Region: ${country.region}`);
      region.appendChild(regionText);
      cardContent.appendChild(region);

      const capital = document.createElement("p");
      capital.className = "mb-3 font-normal text-gray-700 dark:text-gray-400";
      const capitalText = document.createTextNode(
        `Capital: ${country.capital}`
      );
      capital.appendChild(capitalText);
      cardContent.appendChild(capital);

      card.appendChild(cardContent);

      countriesContainer.appendChild(card);

    }

    // Display initially sliced data (first 10 countries)
    slicedData.forEach((country) => {
      createCountryCard(country);
    });

    // Search functionality
    searchBar.addEventListener('keyup', (e) => {
      const searchString = e.target.value.toLowerCase();
      const filteredCountries = data.filter(country => country.name.common.toLowerCase().includes(searchString));
      
      countriesContainer.innerHTML = ''; // Clear previous content

      // Display filtered countries
      filteredCountries.forEach((country) => {
        createCountryCard(country);
      });

      // Show "Show More" button again after filtering
      showMoreButton.style.display = 'block';
    });

    // "Show More" button functionality
    showMoreButton.addEventListener("click", function () {
      // Display the rest of the countries
      for (let i = 51; i < data.length; i++) {
        createCountryCard(data[i]);
      }

      showMoreButton.style.display = "none"; // Hide the button after displaying all items
    });

    countryRegion.addEventListener("change", function (e) {
      const selectedRegion = e.target.value;

      if (selectedRegion === "All") {
        countriesToDisplay = data.slice(0, 52); // Reset to initial display
      } else {
        const filteredByRegion = data.filter(
          (country) => country.region === selectedRegion
        );
        countriesToDisplay = filteredByRegion.slice(0, 52);
      }

      countriesContainer.innerHTML = ''; // Clear previous content
      countriesToDisplay.forEach((country) => {
        createCountryCard(country);
      });
    });


  } catch (error) {
    console.error("Error:", error);
  }
}

fetchData();