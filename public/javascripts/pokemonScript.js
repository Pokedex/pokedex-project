document.addEventListener('DOMContentLoaded', () => {

  const pokemonPath = (window.location.pathname).toLowerCase();

  const pokedisplay = document.getElementById('pokemon-display');

      axios.get(`https://pokeapi.co/api/v2${pokemonPath}`)
      .then((result)=>{
        pokedisplay.innerHTML = `
        <img src="/images/${result.data.name}.png" style="width: 150px;">
        <p>Name: ${result.data.name}</p>
        <p>Weight: ${result.data.weight}</p>
        `;
      })
      .catch((err)=>{
        console.log(err);
      });
  
 

  



}, false);