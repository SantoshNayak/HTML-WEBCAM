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
  
    // setInterval(detectPose, fps);
  });


  function distanceBetweenTwo(x2, x1, y2, y1) {
    var a = x2 - x1;
    var b = y2 - y1;
  
    return Math.sqrt(a * a + b * b);
  }
  

  const detectPose = async () => {
    // alert(document.getElementById("video").offsetWidth)
    const poses = await detector.estimatePoses(document.querySelector("video"));
  
    // const predictions = await model.estimateHands(document.querySelector("video"));
    console.log(poses);
  
    // temporary area
    if (poses.length) {
      let left_hip = poses[0].keypoints.find((x) => x.name == "left_hip");
      let left_knee = poses[0].keypoints.find((x) => x.name == "left_knee");
  
      let right_hip = poses[0].keypoints.find((x) => x.name == "right_hip");
      let right_knee = poses[0].keypoints.find((x) => x.name == "right_knee");
  
      if (
        left_hip.score > 0.5 &&
        left_knee.score > 0.5 &&
        right_knee.score > 0.5 &&
        right_hip.score > 0.5
      ) {
        document.getElementById("message").innerHTML =
          "We are good to count Squarts now ";
  
        var rightKneeAndHipDistance = distanceBetweenTwo(
          right_knee.x,
          right_hip.x,
          right_knee.y,
          right_hip.y
        );
  
        // var rightKneeAndAnkleDistance = distanceBetweenTwo(
        //   right_knee.x,
        //   right_ankle.x,
        //   right_knee.y,
        //   right_ankle.y
        // );
  
        // document.getElementById(
        //   "rightKneeAndHipDistance"
        // ).innerHTML = rightKneeAndHipDistance;
  
        if (rightKneeAndHipDistance > thresholdRightKneeAndHipUpDistance) {
          canCountIncrease = true;
        }
        if (
          rightKneeAndHipDistance <= thresholdRightKneeAndHipDownDistance &&
          canCountIncrease
        ) {
          countValue = countValue + 1;
          canCountIncrease = false;
  
          document.getElementById("countValue").innerHTML = countValue;
  
          if (countValue >= targetCount) {
            document.getElementById("targetAchievedMessage").innerHTML =
              "🎇 Target Achieved 🎇";
              console.log(true)
          }
        }
      } else {
        document.getElementById("message").innerHTML =
          "We are not able to see your whole body";
      }
    }
  
    //temporary area
  
    // if (poses.length) angleCalculation(poses[0].keypoints);
    // canvas.width = windowWidth;
    // canvas.height = windowHeight;
    ctx.drawImage(video, 0, 0, windowWidth, windowHeight);
  
    poses.forEach((eachPose) => {
      ctx.beginPath();
      ctx.lineWidth = "4";
      ctx.strokeStyle = "blue";
      //  ctx.rect(
      //   eachPose.keypoints.topLeft[0],
      //   eachPose.keypoints.topLeft[1],
      //   eachPose.keypoints.bottomRight[0] -eachPose.keypoints.topLeft[0],
      //   eachPose.keypoints.bottomRight[1] -eachPose.keypoints.topLeft[1]
  
      //  )
  
      ctx.fillStyle = "red";
      eachPose.keypoints.forEach((key, index) => {
        ctx.fillRect(key.x, key.y, 5, 5);
  
        // if(index == 0){
        //   ctx.moveTo(0, 0);
        // }
        // ctx.lineTo(key.x, key.y);
      });
      // ctx.lineTo(1,5,5,100,25,20);
  
      ctx.stroke();
    });
  };