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
  active: [],
  join: lightshow,
  leave: leaveshow,
  end: () => leaveshow(...LIGHTSHOW.active),
}

function lightshow(selector, prop, options={}) {
  const { keyframes, active, options: opts } = LIGHTSHOW;

  const added = [];
  for (const el of document.querySelectorAll(selector)) {
    el.style.willChange = prop;
    const anim = el.animate(keyframes[prop], { ...opts, ...options });
    anim.startTime = opts.startTime;
    anim.easing = opts.easing;
    // console.log("Starting animation", anim, active.length, el);
    active.push(anim);
    added.push(anim);
  }
  return added;
}

function leaveshow(...anims) {
  const { active } = LIGHTSHOW;

  function cancel(anim) {
    anim.cancel();
    // console.log("Canceling animation", anim, active.length, active.indexOf(anim));
    active.splice(active.indexOf(anim), 1);
  }
  anims.forEach(cancel);
  return Array.from({ length: anims.length }, () => null);
}
