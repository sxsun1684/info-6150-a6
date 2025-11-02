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
        if (!res.ok) throw new Error("Pokémon not found");
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
        result.innerHTML = `<p>Pokémon not found. Try again!</p>`;
    }
});

