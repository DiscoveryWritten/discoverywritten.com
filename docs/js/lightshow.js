const frames = [
  { offset: 0,   color: "#00d0ff", filter: "hue-rotate(0deg)" },
  { offset: .15, color: "#00b7ff", filter: "hue-rotate(10deg)" },
  { offset: .18, color: "#00d0ff", filter: "hue-rotate(0deg)" },
  { offset: .20, color: "#00e1ff", filter: "hue-rotate(20deg)" },
  { offset: .23, color: "#00b7ff", filter: "hue-rotate(10deg)" },
  { offset: .25, color: "#00d0ff", filter: "hue-rotate(0deg)" },
  { offset: .30, color: "#00b7ff", filter: "hue-rotate(10deg)" },
  { offset: .42, color: "#00e1ff", filter: "hue-rotate(20deg)" },
  { offset: .48, color: "#00fffb", filter: "hue-rotate(60deg)" },
  { offset: .50, color: "#00b7ff", filter: "hue-rotate(10deg)" },
  { offset: .70, color: "#00ccff", filter: "hue-rotate(30deg)" },
  { offset: .75, color: "#00d0ff", filter: "hue-rotate(0deg)" },
  { offset: .80, color: "#00fffb", filter: "hue-rotate(60deg)" },
  { offset: .92, color: "#ff8c00", filter: "hue-rotate(180deg)" },
  { offset: 1,   color: "#00d0ff", filter: "hue-rotate(0deg)" },
]

const LIGHTSHOW = {
  options: {
    startTime: document.timeline.currentTime,
    duration: 60 * 1000,
    iterations: Infinity,
    easing: "cubic-bezier(0.7, -1, 0.3, 2)",
  },
  keyframes: {
    color: frames.map(({ filter, ...frame }) => frame),
    filter: frames.map(({ color, ...frame }) => frame),
  },
  join: lightshow,
}

function lightshow(selector, prop, options={}) {
  for (const el of document.querySelectorAll(selector)) {
    el.style.willChange = prop;
    el.animate(LIGHTSHOW.keyframes[prop], { ...LIGHTSHOW.options, ...options });
  }
}
