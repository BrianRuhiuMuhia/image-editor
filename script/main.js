const files=document.querySelector("input")
const canvas=document.querySelector("canvas")
const icons=document.querySelector(".icons")
const ctx=canvas.getContext("2d")
function checkIfImage(files) {
for (let file of files)
{
  if(!file.type.startsWith("image"))
  {
  return false
  }
}
return true
  
  }
  files.addEventListener("change", (event) => {
    const files = event.target.files;
    if(checkIfImage(files)){
     for(let file of files){
loadImage(file)
     }
    
    }
    else{
      alert("must be Images")
      files=[]
    }
  
  });
function loadImage(file){
    
    const reader = new FileReader();
    let img =undefined
    reader.onload = (e) => {
     img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        console.log("Loading Image")
        drawImage(canvas,img)
        showImageIcons(img)
      };
      img.onerror = () => {
        alert("Error loading the image file.");
      };
    };
    reader.onerror = () => {
      alert("Error reading the file.");
    };
    reader.readAsDataURL(file);
    
  } 

function showImageIcons(image){
    let canv=document.createElement("canvas")
    icons.append(canv)
    const canvCtx=canv.getContext("2d")
    drawImage(canv,image)
}
function drawImage(canvas,image){
  if(!image){
    return ""
  }
  else{
    const ctx=canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image,0,0,canvas.width,canvas.height)
  }

  }

