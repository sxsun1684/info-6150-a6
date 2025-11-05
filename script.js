const searchBtn = document.getElementById("searchBtn");
const input = document.getElementById("pokemonInput");
const result = document.getElementById("result");

searchBtn.addEventListener("click", async () => {
    const name = input.value.trim().toLowerCase();

    if (!name) {
        result.innerHTML = "<p>Please enter a Pokémon name or ID:</p>";
        return;
    }
    result.innerHTML = "<p>Loading...</p>";

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!res.ok) {
            // 404 means the Pokémon does not exist
            if (res.status === 404) {
                throw new Error("404: Pokémon not found.");
            }
            // 5xx indicates a server-side problem
            else if (res.status >= 500 && res.status < 600) {
                throw new Error("500: Server error. Please try again later.");
            }
            // Any other unexpected status code
            else {
                throw new Error(`Error ${res.status}: Something went wrong.`);
            }
        }
        const data = await res.json();
        const types = data.types.map((t) => t.type.name).join(", ");
        const stats = data.stats
            .map((s) => `<li>${s.stat.name}: ${s.base_stat}</li>`)
            .join("");

        result.innerHTML = `<article class="card horizontal">
                <div class="img-box">
                    <img src="${data.sprites.front_default}" alt="${data.name}">
                </div>
                <div class="info">
                    <h2>${data.name.toUpperCase()}</h2>
                    <p class="type"><strong>Type:</strong> ${types.toUpperCase()}</p>
                    <h3>Basic Information</h3>
                    <ul>${stats}</ul>
                </div>
            </article>
`;

    } catch (error) {
        // Handle connection and fetch errors
        if (!navigator.onLine) {
            // No internet connection
            result.innerHTML = "<p>No internet connection. Please check your network and try again.</p>";
        } else if (error.message.startsWith("404")) {
            // Pokémon not found
            result.innerHTML = "<p>Pokémon not found (404).</p>";
        } else if (error.message.startsWith("500")) {
            // Server error
            result.innerHTML = "<p>The server is having issues (5xx). Try again later.</p>";
        } else {
            // Other unexpected errors
            result.innerHTML = `<p>Unexpected error: ${error.message}</p>`;
        }
    }
});

