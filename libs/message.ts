export default function Message(text, warn){
  console.log(text)
  if(warn){ text = '<warn>'+text+'</warn>' }
  let msg = document.getElementById('message')
  if(msg){ msg.innerHTML = text }
}