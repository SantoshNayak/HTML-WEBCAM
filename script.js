let video = document.getElementById("video");
// Hacks for Mobile Safari
// video.setAttribute("playsinline", true);
// video.setAttribute("controls", true);
// setTimeout(() => {
//     video.removeAttribute("controls");
// });
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

  setupCamera()