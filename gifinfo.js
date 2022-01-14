let previewGif = gifurl => {
  document.getElementById("gifimg").src = gifurl
}

// Gif Constants
var gif, colorCount
var frames = []
var pageWidth = 940 // pixels
var timelineColors = ["blue", "red", "green"]

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
  info[1].innerText = totalTime + "ms"
  info[2].innerText = (1 / (smallestDelay / 100)) + " fps"


  // Timeline
  var timeline = document.getElementById("timeline")
  timeline.innerHTML = "" // reset timeline

  frames.forEach((e, i) => {
    var frameDiv = document.createElement("div")
    var width = totalTime / pageWidth * e.delay

    frameDiv.style.backgroundColor = i % 2 ? timelineColors[1] : timelineColors[2]
    frameDiv.style.width = width + "px"
    frameDiv.setAttribute("delay", e.delay + "ms")
    frameDiv.classList = "frameDiv"

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
let move_relative = moveby => {
  var new_frame = (gif.get_current_frame() + moveby) % frames.length
  new_frame = new_frame == -1 ? frames.length - 1 : new_frame

  gif.move_to(new_frame)
  updateTimeline(new_frame)
}

// While Playing
let updateTimeline = frameIndex => {
  var timelineDivs = document.querySelectorAll("#timeline div") 
  timelineDivs.forEach((e, i) => {
    e.style.backgroundColor = i % 2 ? timelineColors[1] : timelineColors[2]
  })
  timelineDivs[frameIndex].style.backgroundColor = "blue"

  var delay = frames[frameIndex].delay
  document.getElementById("frameInfo").innerText = "Current frame: " + frameIndex + " | Delay: " + delay + "ms | Unique Colours: " + frameUnique[frameIndex]
}