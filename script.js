let video = document.getElementById("video");
let model;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let windowHeight = window.outerHeight * 0.4;
let windowWidth = window.outerWidth - 100;
var fps = 30;

var thresholdRightKneeAndHipDownDistance = 20;
var thresholdRightKneeAndHipUpDistance = 30;

var targetCount = 10;

const detectorConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
  };
  
  // var upValue = 150;
  // var downValue = 130;
  
  // var threshHoldKneeAnkleDistance = 30;
  let detector;
  
  var canCountIncrease = false;
  var countValue = 0;



// Hacks for Mobile Safari
video.setAttribute("playsinline", true);
video.setAttribute("controls", true);
setTimeout(() => {
    video.removeAttribute("controls");
});
const setupCamera = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 300, height: 500 },
        audio: false,
      })
      .then((stream) => {
        video.srcObject = stream;
        // document.getElementById('goalCount').innerHTML = goalCount
      });
  };

  setupCamera();
  video.addEventListener("loadeddata", async () => {
  
    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // if (urlParams.get("goal")) {
    //   targetCount = urlParams.get("goal");
    // }
    // document.getElementById("targetCount").innerHTML = targetCount;
  
    // console.log("queryString", targetCount);
  
    canvas.width = document.getElementById("video").offsetWidth;
    canvas.height = document.getElementById("video").offsetHeight;
    canvas.setAttribute("width", windowWidth);
    canvas.setAttribute("height", windowHeight);

    
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
  
    // document.getElementById("loadingText").innerHTML =
    //   "Please stand in front of camera";
  
    // document.getElementById("upscoreThreshold").innerHTML =upValue;
    // document.getElementById("downscoreThreshold").innerHTML =downValue;
  
    setInterval(detectPose, fps);
  });