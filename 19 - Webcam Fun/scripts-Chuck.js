//Declare Variables
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


//Connect to camera
function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            console.log(localMediaStream);
            //The line below has been depricated and no longer works
            //video.src = window.URL.createObjectURL(localMediaStream); 
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch((err) => {
            console.log('Oh No ...', err);
        });
}


function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    console.log(width, height);

    return setInterval(()=> {
        ctx.drawImage(video, 0, 0, width, height);

        //take pixels out of photo
        let pixels = ctx.getImageData(0,0,width,height);
        //Change the pixels
        //pixels = redEffect(pixels);
        //pixels = rgbSplit(pixels);
        pixels = greenScreen(pixels);
        //Put the pixels back
        ctx.putImageData(pixels,0,0);
    }, 15);
}

//Take Picture
function takePhoto() {
    console.log('smile');

    //play sound
    snap.currentTime = 0;
    snap.play();

    //Take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Photo" />`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 150; //r
        pixels.data[i + 1] = pixels.data[i + 1] - 50; //g
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //b
    }
    return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; //r
    pixels.data[i + 100] = pixels.data[i + 1]; //g
    pixels.data[i - 150] = pixels.data[i + 2]; //b
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach(input => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);

//video at 23:56