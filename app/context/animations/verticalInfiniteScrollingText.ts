import gsap from 'gsap';

export function verticalLoop(items: any[], config: any) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
  });
  let length = items.length;
  let startY = items[0].offsetTop;
  let times: number[] = [];
  let heights: number[] = [];
  let yPercents: number[] = [];
  let curIndex = 0;
  let pixelsPerSecond = (config.speed || 1) * 100;
  
  // Use config.duration directly if provided, otherwise calculate from pixelsPerSecond
  // Note: Your component passes 'duration', so we prioritize that logic or simple speed mapping
  let snap = config.snap === false ? (v: number) => v : gsap.utils.snap(config.snap || 1);

  gsap.set(items, {
    yPercent: (i, el: any) => {
      let h = (heights[i] = parseFloat(gsap.getProperty(el, "height", "px") as string));
      yPercents[i] = snap(parseFloat(gsap.getProperty(el, "y", "px") as string) / h * 100 + (gsap.getProperty(el, "yPercent") as number));
      return yPercents[i];
    }
  });
  gsap.set(items, { y: 0 });
  
  let totalHeight = items[length - 1].offsetTop + (yPercents[length - 1] / 100 * heights[length - 1]) - startY + items[length - 1].offsetHeight * (gsap.getProperty(items[length - 1], "scaleY") as number) + (parseFloat(config.paddingBottom) || 0);
  
  // If config.duration is set, overwrite pixelsPerSecond logic
  let totalDuration = config.duration || (totalHeight / pixelsPerSecond);

  for (let i = 0; i < length; i++) {
    let item = items[i];
    let curY = yPercents[i] / 100 * heights[i];
    let distanceToStart = item.offsetTop + curY - startY;
    let distanceToLoop = distanceToStart + heights[i] * (gsap.getProperty(item, "scaleY") as number);
    
    tl.to(item, { 
      yPercent: snap((curY - distanceToLoop) / heights[i] * 100), 
      duration: (distanceToLoop / totalHeight) * totalDuration 
    }, 0)
    .fromTo(item, { 
      yPercent: snap((curY - distanceToLoop + totalHeight) / heights[i] * 100) 
    }, { 
      yPercent: yPercents[i], 
      duration: ((totalHeight - distanceToLoop) / totalHeight) * totalDuration, 
      immediateRender: false 
    }, (distanceToLoop / totalHeight) * totalDuration)
    .add("label" + i, distanceToStart / totalHeight * totalDuration);
    times[i] = distanceToStart / totalHeight * totalDuration;
  }
  
  if (config.reversed) {
    tl.vars.onReverseComplete?.();
    tl.reverse();
  }
  return tl;
}