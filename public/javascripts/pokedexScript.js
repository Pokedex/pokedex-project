document.addEventListener('DOMContentLoaded', () => {


  const pokedexdisplay = document.getElementById('pokedex-display');
  const pikachuload = document.getElementById('pikachu-load');
  const loadbox = document.getElementById('load-box');
  const capturedArr = document.getElementById('data-transport').innerText.split('-');

  setTimeout(()=>{
    pikachuload.style.display = 'none';
    loadbox.style.display = 'block';
  }, 6500);

  axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=151`)
  .then((result)=>{
    result.data.results.forEach((pokemon, index)=>{
      const number = index + 1;
      const pokeImg = document.createElement('img');
      const pokeAnchor = document.createElement('a');
      if(capturedArr.includes(pokemon.name)){
        pokeImg.setAttribute('style', 'opacity: 1;');
      } else {
        pokeImg.setAttribute('style', 'opacity: .25;');
      }
      pokeImg.setAttribute('class', 'pokedex-pkmn')
      pokeAnchor.setAttribute('href', `/pokemon/${number}`);
      pokeImg.setAttribute('src', `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${number}.png`);
      pokeImg.setAttribute('alt', `${pokemon.name} image`);
      // pokeImg.setAttribute('id', `${pokemon.name}-pokedex`)
      pokeAnchor.append(pokeImg);
      pokedexdisplay.append(pokeAnchor);

    });
    
  })
  .catch((err)=>{
    console.log(err);
  });


  



}, false);