const fileInput = document.querySelector(".file-input");
const previewImg=document.querySelector(".preview-image img")
const chooseImgBtn = document.querySelector(".choose-img");
const filterOptions=document.querySelectorAll(".filter button");
const filterName=document.querySelector(".filter-info .name");
const filterSlider=document.querySelector(".slider input");
const filterValue=document.querySelector(".filter-info .value");
const rotateOptions=document.querySelectorAll(".rotate button");
const resetFilterBtn=document.querySelector(".reset-filter");
const saveImgBtn=document.querySelector(".save-img");


let brightness=100,saturation=100,inversion=0,grayscale=0;
let rotate=0,flipHorizontal=1,flipVertical=1;


const applyFilters = () =>{
    previewImg.style.transform=`rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

const loadImage = () =>{
    let file=fileInput.files[0]; //getting user selected file
    if(!file) return;
    previewImg.src=URL.createObjectURL(file); //pasing the url file as preview img src
    previewImg.addEventListener("load",()=>{
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
    }); 
}

filterOptions.forEach(option =>{
    option.addEventListener("click", () => { //adding click event listener to all filter buttons
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText=option.innerHTML;

        if(option.id === "brightness"){
            filterSlider.max="200";
            filterSlider.value=brightness;
            filterValue.innerText=`${brightness}%`;
        }
        else if(option.id === "saturation"){
            filterSlider.max="200";
            filterSlider.value=saturation;
            filterValue.innerText=`${saturation}%`;
        }
        else if(option.id === "inversion"){
            filterSlider.max="100";
            filterSlider.value=inversion;
            filterValue.innerText=`${inversion}%`;
        }
        else{
            filterSlider.max="100";
            filterSlider.value=grayscale;
            filterValue.innerText=`${grayscale}%`;
        }
    });
});

const updateFilter = () =>{
    filterValue.innerHTML=`${filterSlider.value}`;
    const selectedFilter=document.querySelector(".filter .active"); //getting selected filter button

    if(selectedFilter.id === "brightness"){
        brightness=filterSlider.value;
    }
    else if(selectedFilter.id === "saturation"){
        saturation=filterSlider.value;
    }
    else if(selectedFilter.id === "inversion"){
        inversion=filterSlider.value;
    }
    else{ 
        grayscale=filterSlider.value;
    }

    applyFilters();
}

rotateOptions.forEach(option =>{
    option.addEventListener("click",()=>{ //adding click event listener to all rotate/flip buttons
        if(option.id==="left"){
            rotate -= 90; // if clicked button is left rotate, decrement rotate value by -90
        }
        else if(option.id ==="right")
        {
            rotate+=90; //// if clicked button is right rotate, increment rotate value by +90
        }else if(option.id==="horizontal"){
            //if flipHorizontal value is 1, set value to -1 else set 1
            flipHorizontal = (flipHorizontal === 1)? -1:1;
        }else if(option.id==="vertical"){
            flipVertical = (flipVertical === 1)? -1:1;
        }
        applyFilters();
    })
})

const resetFilter = () =>{
    //reseting all the variables to its default value
    brightness=100;saturation=100;inversion=0;grayscale=0;
    rotate=0;flipHorizontal=1;flipVertical=1;
    filterOptions[0].click(); // clicking brightness btn, so the brightness selected by default
    applyFilters();
}

const saveImage = () =>{
    const canvas = document.createElement("canvas");//craeting canvas element
    const ctx=canvas.getContext("2d") //canvas.getContext return a drawing context on the canvas
    canvas.width = previewImg.naturalWidth; // setting canvas width to actual image width
    canvas.height=previewImg.naturalHeight; // setting canvas height to actual image height

    //applying user selected filters to canvas filter
    ctx.filter=`brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2,canvas.height / 2)
    if(rotate !== 0){
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal,flipVertical)
    ctx.drawImage(previewImg,-canvas.width / 2,-canvas.height / 2,canvas.width,canvas.height);
    // document.body.appendChild(canvas);

    const link=document.createElement("a");
    link.download= "image.jpg";
    link.href=canvas.toDataURL();
    link.click();

}

fileInput.addEventListener("change",loadImage);
filterSlider.addEventListener("input",updateFilter);
resetFilterBtn.addEventListener("click",resetFilter);
saveImgBtn.addEventListener("click",saveImage);
chooseImgBtn.addEventListener("click", ()=> fileInput.click());