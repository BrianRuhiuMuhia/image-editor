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
const downloadB=document.querySelector(".download")
const rangeInput=document.querySelector(".range")
const rangeBtn=document.querySelector(".light-btn")
const buttonContainer=document.querySelectorAll(".btn-container")
const canvasStates=[]
let isImageLoaded=false
let isDrawing=false
let checkDrawing=false
sBtn.addEventListener("click",(event)=>{
event.preventDefault()
toggleSelectBox()

})
rangeBtn.addEventListener("click",rangeBtnFunc)
let inputValues={"current":null,"previous":null} 
rangeInput.addEventListener("input",(event)=>{
  
  if(isImageLoaded){
      inputValues["previous"]=inputValues["current"]
  inputValues["current"]=parseInt(event.target.value)
  let dir=checkDirection(inputValues) ? 1:-1
  const magnitude=1
  changeImageBrightness(magnitude,dir)
  }
  else{
    alert("Please load an image first")
    return
  }

})
buttonContainer.forEach((container)=>{
  const span=container.querySelector("span")
  container.addEventListener("mouseover",()=>{
    span.classList.replace("hidden","display")
  })
  container.addEventListener("mouseleave",()=>{
    span.classList.replace("display","hidden")
  })

})
function checkDirection(obj)
{
  if(obj["current"]>obj["previous"])
    return true
  else if(obj["current"]<obj["previous"])
    return false
  else return null
}
canvas.addEventListener("mouseup",drawMouseUp)
downloadB.addEventListener("click",downloadCanvasImage)
canvas.addEventListener("mousedown",(event)=>{
  let color=colorInput.value
drawMouseDown(event,color)
})
canvas.addEventListener("mousemove",drawMouseMove)
undoB.addEventListener("click",undo)
   function drawMouseDown(event,color) {
    checkDrawing=true
    if (isImageLoaded && isDrawing && checkDrawing) {
      gCtx.beginPath();
      gCtx.moveTo(event.offsetX, event.offsetY);
      gCtx.strokeStyle = color||'lime';
      gCtx.lineCap = 'round';
      gCtx.lineWidth = 2;
      canvasStates.push(gCtx.getImageData(0, 0, canvas.width, canvas.height));
    }
  }
  function rangeBtnFunc(){
    rangeInput.classList.toggle("hidden")
    checkDrawing=false
  }
  function downloadCanvasImage(){
    console.log("downloading")
    checkDrawing=false
    if(isImageLoaded){
         const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${genRandomImageName()}`; 
    document.body.appendChild(link);
    link.click(); 
    document.body.removeChild(link); 
    } 
 
  }
  
  function undo(){
    if(canvasStates.length<=1)
    {
      console.log("length of canvasstates <= 1")
      return
    }
    const imageData=canvasStates.pop()
    gCtx.putImageData(imageData,0,0)

  }
  function drawMouseMove(event) {
    if (isImageLoaded && isDrawing && checkDrawing) {
      gCtx.lineTo(event.offsetX, event.offsetY);
      gCtx.stroke();
     
    }
  }
  function drawMouseUp(event) {
    if (isImageLoaded && isDrawing &&checkDrawing) {
      gCtx.closePath();
      canvasStates.push(gCtx.getImageData(0, 0, canvas.width, canvas.height));
    }
    checkDrawing=false
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
canvas.classList.toggle("drawing")
colorInput.classList.toggle("hidden")
isDrawing=true
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
function changeImageBrightness(value,dir)
{
  const image=gCtx.getImageData(0,0,canvas.width,canvas.height)
  const imageData=image.data
  for(let i=0;i<imageData.length;i++){
imageData[i]+=value*dir
imageData[i+1]+=value*dir
imageData[i+2]+=value*dir
  }
const newImageData = new ImageData(imageData, image.width, image.height);
  gCtx.putImageData(newImageData, 0, 0)
  image.src = canvas.toDataURL();
  canvasStates.push(gCtx.getImageData(0, 0, canvas.width, canvas.height));
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
  function genRandomImageName(){
    return Math.random().toString(36).substr(2, 9);
  }

