const files=document.querySelector("input")
const canvas=document.querySelector("canvas")
canvas.width=800
canvas.height=600
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
      if(files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
          img.onerror = () => {
            alert("Error loading the image file.");
          };
        };
        reader.onerror = () => {
          alert("Error reading the file.");
        };
        reader.readAsDataURL(file);
      } else {
        alert("No file selected.");
      }
    }
    else{
      alert("must be Images")
      files=[]
    }
  
  });