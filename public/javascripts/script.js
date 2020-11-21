document.addEventListener('DOMContentLoaded', () => {
 
  const clickSound = document.getElementById('clickAudio')

  document.getElementById('log').onclick = () => {
    const logRedirect = ()=>{
      setTimeout(() => {
        
      }, 0);
    }
    clickSound.play()
  }
  
  document.getElementById('sign').onclick = () => {
    clickSound.play()
    console.log('signclick')
  }
  console.log(document.getElementById('audio'))


}, false);


