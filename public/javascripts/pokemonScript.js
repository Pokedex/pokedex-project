document.addEventListener('DOMContentLoaded', () => {

  const pokemonPath = (window.location.pathname).toLowerCase();

  const pokemonName = pokemonPath.split('/')[2];

  const pokedisplay = document.getElementById('pokemon-display');

      axios.get(`https://pokeapi.co/api/v2${pokemonPath}`)
      .then((result)=>{
        pokedisplay.innerHTML = `
        <img src="/images/${result.data.name}.png" style="width: 150px;">
        <p>Name: ${result.data.name}</p>
        <p>Weight: ${result.data.weight}</p>

        <form action="/addteam/${result.data.name}" method="POST">
          <button type="submit">Add to my team</button>
        </form>

        <form action="/capture/${result.data.name}" method="POST">
          <button id="capture-button" type="submit">Capture</button>
        </form>

        <form action="/remove/${result.data.name}" method="POST">
          <button type="submit">Remove from team</button>
        </form>
        `;
      })
      .catch((err)=>{
        console.log(err);
      });


      axios.get('')

  

  



}, false);