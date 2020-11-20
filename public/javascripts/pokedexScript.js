document.addEventListener('DOMContentLoaded', () => {


  const pokedexdisplay = document.getElementById('pokedex-display');

      axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=151`)
      .then((result)=>{
        result.data.results.forEach((pokemon)=>{
          const pokeImg = document.createElement('img');
          const pokeAnchor = document.createElement('a');
          pokeAnchor.setAttribute('href', `/pokemon/${pokemon.name}`);
          pokeImg.setAttribute('src', `/images/${pokemon.name}.png`);
          pokeImg.setAttribute('alt', `${pokemon.name} image`);
          pokeImg.setAttribute('style', 'width: 100px;');
          pokeImg.setAttribute('href', `/pokemon/${pokemon.name}`);
          pokeAnchor.append(pokeImg);
          pokedexdisplay.append(pokeAnchor);
        });
      })
      .catch((err)=>{
        console.log(err);
      });
  
 

  



}, false);