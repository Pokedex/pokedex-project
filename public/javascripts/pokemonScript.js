document.addEventListener('DOMContentLoaded', () => {

  const pokemonPath = (window.location.pathname).toLowerCase();

  const pokemonName = (window.location.pathname).split('/')[2];

  const pokedisplay = document.getElementById('pokemon-display');
 

  axios.get(`https://pokeapi.co/api/v2${pokemonPath}`)
  .then((result)=>{
    const name = result.data.name.toUpperCase()
    const typeLetter = result.data.types[0].type.name.slice(0,1).toUpperCase()
    const upperCasedType = typeLetter + result.data.types[0].type.name.slice(1)
    const abilityLetter = result.data.abilities[0].ability.name.slice(0,1).toUpperCase()
    const upperCasedAbility = abilityLetter + result.data.abilities[0].ability.name.slice(1)
      pokedisplay.innerHTML = `
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${result.data.id}.png" style="width: 300px;">
      <p class="name-title">Nº${result.data.id}. ${name}</p>
      <p><span>Weight:</span> ${result.data.weight} lb</p>
      <p><span>Height:</span> ${result.data.height} in</p>
      <p><span>Type:</span> ${upperCasedType}</p>
      <p><span>Ability:</span> ${upperCasedAbility}</p>
      
  
      <form action="/addteam/${result.data.name}/${result.data.id}" method="POST">
        <button class="btn-pkmn" type="submit">Add to my team</button>
      </form>
  
      <form action="/capture/${result.data.name}/${result.data.id}" method="POST">
        <button class="btn-pkmn" id="capture-button" type="submit">Capture</button>
      </form>
  
      <form action="/remove/${result.data.name}" method="POST">
        <button class="btn-pkmn" type="submit">Remove from team</button>
      </form>
      `;
  })
  .catch((err)=>{
    console.log(err);
  });

}, false);