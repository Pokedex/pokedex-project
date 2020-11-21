document.addEventListener('DOMContentLoaded', () => {


  const pokedexdisplay = document.getElementById('pokedex-display');
  const capturedArr = document.getElementById('data-transport').innerText.split('-');
  console.log(capturedArr);

  
  axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=151`)
  .then((result)=>{
    result.data.results.forEach((pokemon)=>{
      const pokeImg = document.createElement('img');
      const pokeAnchor = document.createElement('a');
      if(capturedArr.includes(pokemon.name)){
        pokeImg.setAttribute('style', 'width: 100px; opacity: 1;');
      } else {
        pokeImg.setAttribute('style', 'width: 100px; opacity: .3;');
      }
      pokeAnchor.setAttribute('href', `/pokemon/${pokemon.name}`);
      pokeImg.setAttribute('src', `/images/${pokemon.name}.png`);
      pokeImg.setAttribute('alt', `${pokemon.name} image`);
      pokeImg.setAttribute('id', `${pokemon.name}-pokedex`)
      pokeAnchor.append(pokeImg);
      pokedexdisplay.append(pokeAnchor);
    });
  })
  .catch((err)=>{
    console.log(err);
  });


  



}, false);