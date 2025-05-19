const files=document.querySelector("input")
const canvas=document.querySelector("canvas")
canvas.width=800
canvas.height=600
const gCtx=canvas.getContext("2d")
const icons=document.querySelector(".icons")
const sBtn=document.querySelector(".select")
const colorBtn=document.querySelector(".color")
const colorInput=document.querySelector(".color-input")
const inputB=document.querySelector(".input")
const undoB=document.querySelector(".undo")
const canvasStates=[]
let isImageLoaded=false
let isDrawing=false
sBtn.addEventListener("click",(event)=>{
event.preventDefault()
toggleSelectBox()

})
canvas.addEventListener("mouseup",drawMouseUp)
canvas.addEventListener("mousedown",(event)=>{
  let color=colorInput.value
drawMouseDown(event,color)
})
canvas.addEventListener("mousemove",drawMouseMove)
undoB.addEventListener("click",undo)
   function drawMouseDown(event,color) {
    if (isImageLoaded && isDrawing) {
      gCtx.beginPath();
      gCtx.moveTo(event.offsetX, event.offsetY);
      gCtx.strokeStyle = color||'lime';
      gCtx.lineCap = 'round';
      gCtx.lineWidth = 2;
      canvasStates.push(gCtx.getImageData(0, 0, canvas.width, canvas.height));
    }
  }
  function undo(){
    if(canvasStates.length<=0)
    {
      console.log("length of canvasstates <= 0")
      return
    }
    const imageData=canvasStates.pop()
    gCtx.putImageData(imageData,0,0)

  }
  function drawMouseMove(event) {
    if (isImageLoaded && isDrawing) {
      gCtx.lineTo(event.offsetX, event.offsetY);
      gCtx.stroke();
     
    }
  }
  function drawMouseUp(event) {
    if (isImageLoaded && isDrawing) {
      gCtx.closePath();
      canvasStates.push(gCtx.getImageData(0, 0, canvas.width, canvas.height));
    }
  }
function toggleSelectBox(event){
  if(event!=undefined){
event.preventDefault()
  }
inputB.classList.toggle("hidden")
}
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
  function getFile(event){
    event.preventDefault();
    event.stopPropagation();
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
  
  }
  colorBtn.addEventListener("click",startDrawing)
  function startDrawing()
  {
 isDrawing=isDrawing===true ? false:true
canvas.classList.toggle("drawing")
colorInput.classList.toggle("hidden")
console.log(isDrawing)

  }
files.addEventListener("change", getFile);
function loadImage(file){
    
    const reader = new FileReader();
    let img =undefined
    reader.onload = (e) => {
     img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        console.log("Loading Image")
        toggleSelectBox()
        drawImage(canvas,img)
        showImageIcons(img)
        canvasStates.push(gCtx.getImageData(0, 0, canvas.width, canvas.height));
        isImageLoaded=true
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
    canv.classList.add("icon")
}
  function changePos(event) {
    const clickedIcon = event.target.closest('.icon');
    if (!clickedIcon || !icons.contains(clickedIcon)) return;
    const childrenArray = Array.from(icons.children);
    const index = childrenArray.indexOf(clickedIcon);
    if (index === -1) return; 
    const lastIndex = childrenArray.length - 1;
    if (index === lastIndex) return; 
    const lastIcon = childrenArray[lastIndex];
    const clickedNext = clickedIcon.nextSibling;
    const lastNext = lastIcon.nextSibling;
    icons.insertBefore(lastIcon, clickedNext);
    icons.insertBefore(clickedIcon, lastNext);
    const imageDataURL = clickedIcon.toDataURL();
  
  }

icons.addEventListener("click",changePos)
function reDrawCanvas(image){
  drawImage(canvas,image)
}
function drawImage(canvas,image){
  if(!image){
    return ""
  }
  else{
    const ctx=canvas.getContext("2d")
    clearCanvas(ctx)
    ctx.drawImage(image,0,0,canvas.width,canvas.height)
  }

  }
  function clearCanvas(ctx){
        
 ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

