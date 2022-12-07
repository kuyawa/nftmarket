export default function Button(text, disabled){
  let button = document.getElementById('action-button')
  if(button){ 
    button.innerHTML = text 
    button.setAttribute('disabled', disabled?'disabled':'')
  }
}