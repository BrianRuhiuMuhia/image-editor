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
const red=document.querySelector(".red")
const blue=document.querySelector(".blue")
const green=document.querySelector(".green")
const opacity=document.querySelector(".opacity")
const rangeBlue=document.querySelector(".range-blue")
const rangeRed=document.querySelector(".range-red")
const rangeGreen=document.querySelector(".range-green")
const rangeOpacity=document.querySelector(".range-opacity")
const blackWhite=document.querySelector(".black-white")
const magnitude=5
const canvasStates=[]
let isImageLoaded=false
let isDrawing=false
let checkDrawing=false
function getCurrentImage(){
  const newImage=new Image()
  newImage.src=canvas.toDataURL()
  return newImage
}
sBtn.addEventListener("click",(event)=>{
event.preventDefault()
toggleSelectBox()

})
rangeBtn.addEventListener("click",rangeBtnFunc)
const inputValues={"current":null,"previous":null} 
opacity.addEventListener("click",function(){
  rangeOpacity.classList.toggle("hidden")
  checkDrawing=false
})
red.addEventListener("click",function(){
  rangeRed.classList.toggle("hidden")
  checkDrawing=false
})
blue.addEventListener("click",function(){
  rangeBlue.classList.toggle("hidden")
  checkDrawing=false
})
green.addEventListener("click",function(){
  rangeGreen.classList.toggle("hidden")
  checkDrawing=false
})
rangeGreen.addEventListener("input",function(event){
  inputValues["previous"]=inputValues["current"]
  inputValues["current"]=parseInt(event.target.value)
  let dir=checkDirection(inputValues) ? 1:-1
  
  changeGreen(magnitude,dir)
})
rangeRed.addEventListener("input",function(event){
  inputValues["previous"]=inputValues["current"]
  inputValues["current"]=parseInt(event.target.value)
  let dir=checkDirection(inputValues) ? 1:-1
  changeRedness(magnitude,dir)
})
rangeBlue.addEventListener("input",function(event){
  inputValues["previous"]=inputValues["current"]
  inputValues["current"]=parseInt(event.target.value)
  let dir=checkDirection(inputValues) ? 1:-1
  changeBlue(magnitude,dir)
})
rangeBlue.addEventListener("input",function(event){
  inputValues["previous"]=inputValues["current"]
  inputValues["current"]=parseInt(event.target.value)
  let dir=checkDirection(inputValues) ? 1:-1
  changeOpacity(magnitude,dir)
})
function changeRedness(value,dir){
  const {image,data}=getImageData()
  for(let i=0;i<data.length;i+=4){
checkRange(data[i]) ? data[i]=255:data[i]+=value*dir
   
  }
  imageDataToCanvas({image,data})
}
let count=0
function changeToblackWhite(){
  const {image,data}=getImageData()
  if(count>=1)
  {
    return
  }
  for(let i=0;i<data.length;i+=4){
    checkRange(data[i]) ? data[i]=255:data[i]*=0.299
    checkRange(data[i+1]) ? data[i+1]=255:data[i+1]*=0.587
    checkRange(data[i+2]) ? data[i+2]=255:data[i+2]*=0.114
    data[4]=255
  }
  imageDataToCanvas({image,data})
  count+=1
}
blackWhite.addEventListener("click",changeToblackWhite)
function changeBlue(value,dir){
  const {image,data}=getImageData()
  for(let i=0;i<data.length;i+=4){
    checkRange(data[i+3]) ? data[i+3]=255:data[i+3]+=value*dir
  }
  imageDataToCanvas({image,data})
}
function changeGreen(value,dir){
  const {image,data}=getImageData()
  
  for(let i=0;i<data.length;i+=4){
    checkRange(data[i+2]) ? data[i+2]=255:data[i+2]+=value*dir
    data[i+2]+=value*dir
  }
  imageDataToCanvas({image,data})
}
function changeOpacity(value,dir){
  const {image,data}=getImageData()
  console.log(data.length)
  for(let i=0;i<data.length;i+=4){
    checkRange(data[i+4]) ? data[i+4]=255:data[i+4]+=value*dir
    
  }
  imageDataToCanvas({image,data})
}
rangeInput.addEventListener("input",(event)=>{
  
  if(isImageLoaded){
      inputValues["previous"]=inputValues["current"]
  inputValues["current"]=parseInt(event.target.value)
  let dir=checkDirection(inputValues) ? 1:-1
  changeImageBrightness(magnitude,dir)
  }
  else{
    alert("Please load an image first")
    return
  }

})
function checkRange(color){
return color>=255
}
buttonContainer.forEach((container)=>{
  const span=container.querySelector("span")
  if(span!=undefined)
  {
    container.addEventListener("mouseover",()=>{
    span.classList.replace("hidden","display")
  })
  container.addEventListener("mouseleave",()=>{
    span.classList.replace("display","hidden")
  })
  }
  

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
  const {image,data}=getImageData()
  for(let i=0;i<data.length;i++){
checkRange(data[i]) ? data[i]=255:data[i]+=value*dir
checkRange(data[i+1]) ? data[i+1]=255:data[i+1]+=value*dir
checkRange(data[i+2]) ? data[i+2]=255:data[i+2]+=value*dir
  }
imageDataToCanvas({image,data})
}
function getImageData()
{
  const image = gCtx.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;
  const imageData={image,data}
  return imageData
}
function imageDataToCanvas({image,data}){
  const newImageData = new ImageData(data, image.width, image.height);
  gCtx.putImageData(newImageData, 0, 0)
  image.src = canvas.toDataURL();
  saveState()
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
  const newImage=new Image()
  newImage.src=imageDataURL
  newImage.onload=()=>{
    reDrawCanvas(newImage)

  }
  }

icons.addEventListener("click",changePos)
function reDrawCanvas(image){
  drawImage(canvas,image)
}
function drawImage(canvas, image, degrees) {
  if (!image) {
    throw new Error("No Image");
  } else {
    const ctx = canvas.getContext("2d");
    clearCanvas(ctx);
    ctx.save();
    const radians = degrees * Math.PI / 180;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(radians);
    ctx.drawImage(image, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();
    saveState()
  }
}
  function clearCanvas(ctx){
 ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  function genRandomImageName(){
    return Math.random().toString(36).substr(2, 9);
  }
  function saveState()
  {
     canvasStates.push(gCtx.getImageData(0, 0, canvas.width, canvas.height));
  }

