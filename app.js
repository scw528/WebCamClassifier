navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMEdia

const video = document.querySelector("#video")
const canvas = document.querySelector("#canvas")
const context = canvas.getContext('2d')
const table = document.getElementById("table");
let model;

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Not adding `{ audio: true }` since we only want video now
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
      //video.src = window.URL.createObjectURL(stream);
      video.srcObject = stream;
      video.play();
  });
}

// take photo and make predicitons
document.getElementById("snap").addEventListener("click", function() {
  let img = new Image()

  context.drawImage(video, 0, 0, 640, 480);

  // get the image data from the canvas object
  var dataURL = canvas.toDataURL();
 
  // set the source of the img tag
  img.setAttribute('src', dataURL);

  //Load the model.
  cocoSsd.load().then(model => {
    model.detect(img).then(predictions => {
      console.log('Predictions: ');
      console.log(predictions);

      // remove all previous rows
      for(var i = table.rows.length - 1; i > 0; i--) {
          table.deleteRow(i);
      }

      // populate table with new data, draw bbox
      for (var i = 0; i < predictions.length; i++) {
        tr = table.insertRow(table.rows.length);
        td = tr.insertCell(tr.cells.length);
        td.setAttribute("align", "center");
        td.innerHTML = predictions[i].class;
        td = tr.insertCell(tr.cells.length);
        td.innerHTML = predictions[i].score;
        td.setAttribute("align", "center");

        context.beginPath();
        context.rect(predictions[i].bbox[i], predictions[i].bbox[i + 1], predictions[i].bbox[i + 2], predictions[i].bbox[i + 3]);
        context.stroke();
    }
      
    })
  })
});



