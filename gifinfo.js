let previewGif = gifurl => {
  document.getElementById("gifimg").src = gifurl
}

// Gif Constants
var gif, colorCount
var frames = []
var pageWidth = 940 // pixels
var timelineColors = ["grey", "lightgrey"]

// Git init
let loadGif = () => {
  var viewer = document.getElementById("viewer")
  var gifurl = document.getElementById("gifimg").src

  // Clear viewer then load libgif canvas
  viewer.innerHTML = "<img id=viewerimg src=" + gifurl + ">"

  gif = new SuperGif({ gif: document.getElementById('viewerimg') } );
  gif.load(loadGifInfo)

  // Set viewer position
  document.getElementById("viewer").style.top = "20px"
  document.getElementById("viewer").style.left = "20px"

  // Reset Colour count
  unique = []
  frameUnique = []
}

let loadGifInfo = () => {
  // Basic info
  var info = document.querySelectorAll("#info span")

  frames = gif.get_frames()
  info[0].innerText = frames.length

  var totalTime = 0
  var smallestDelay = 1000000000
  frames.forEach(e => { 
    totalTime += e.delay 
    smallestDelay = e.delay < smallestDelay ? e.delay : smallestDelay
  });
  info[1].innerText = totalTime * 10 + "ms"
  info[2].innerText = (1 / (smallestDelay / 100)) + " fps"


  // Timeline
  var timeline = document.getElementById("timeline")
  timeline.innerHTML = "" // reset timeline

  frames.forEach((e, i) => {
    var frameDiv = document.createElement("div")
    var width = (pageWidth / totalTime) * e.delay

    frameDiv.style.backgroundColor = i % 2 ? timelineColors[1] : timelineColors[0]
    frameDiv.style.width = width + "px"
    frameDiv.setAttribute("delay", e.delay * 10 + "ms")
    frameDiv.classList = "frameDiv"
    frameDiv.onclick = () => {
      if (gif.get_playing()) togglePlay(document.getElementById("play"))

      gif.move_to(i)
      updateTimeline(i)
    }

    timeline.appendChild(frameDiv)
  })
}

// Color count
var unique = []
var frameUnique = []
let updateColorCount = ct => {
  var newUniques = []
  ct.forEach(e => {
    var string = e[0] + "," + e[1] + "," + e[2]
    if (!unique.includes(string)) unique.push(string)
    if (!newUniques.includes(string)) newUniques.push(string)
  })

  frameUnique.push(newUniques.length)
  document.getElementById("colorCount").innerText = unique.length + " colours"
}

// Controls
let togglePlay = button => {
  if (gif.get_playing()) {
    gif.pause()
    button.innerText = "▶"
  } else {
    gif.play()
    button.innerText = "⏸"
  }
}

let move_relative = moveby => {
  if (gif.get_playing()) togglePlay(document.getElementById("play"))
  var new_frame = (gif.get_current_frame() + moveby) % frames.length
  new_frame = new_frame == -1 ? frames.length - 1 : new_frame

  gif.move_to(new_frame)
  updateTimeline(new_frame)
}

let togglefullscreen = () => {
  var viewwrap = document.getElementById("viewwrap")
  viewwrap.classList = viewwrap.classList == "fullscreen" ? "" : "fullscreen"
}

// While Playing
let updateTimeline = frameIndex => {
  var timelineDivs = document.querySelectorAll("#timeline div") 
  timelineDivs.forEach((e, i) => {
    e.id = ""
  })
  timelineDivs[frameIndex].id = "currentFrame"

  var delay = frames[frameIndex].delay
  var frameInfo = document.querySelectorAll("#frameInfo span")

  frameInfo[0].innerText = frameIndex + 1
  frameInfo[1].innerText = delay * 10 + "ms"
  frameInfo[2].innerText = frameUnique[frameIndex]
}

// Keyboard shortcuts

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "ArrowDown":
      zoomBy(0.5)
      break;
    case "ArrowUp":
      zoomBy(2)
      break;
    case "ArrowLeft":
      move_relative(-1)
      break;
    case "ArrowRight":
      move_relative(+1)
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);
// the last option dispatches the event to the listener first,
// then dispatches event to window
