import { updateChildMinHeightsIfNeeded } from './child-min-height';
import { updateMinRowHeightIfNeeded } from './min-row-height';

let root = null;
let requestId = null;
let verticalRhythm = null;

const getVerticalRhythm = () =>
  parseFloat(getComputedStyle(root).getPropertyValue('line-height'), 10);

const setVerticalRhythm = () => {
  if (verticalRhythm) {
    document.documentElement.style.setProperty(
      '--fluid-vertical-rhythm',
      `${verticalRhythm}px`
    );
    updateMinRowHeightIfNeeded();
    updateChildMinHeightsIfNeeded();
  }
  requestId = null;
};

const floorVerticalRhythm = () => {
  const rhythm = getVerticalRhythm();
  const flooredRhythm = Math.floor(rhythm);
  if (flooredRhythm === rhythm) {
    verticalRhythm = null;
    if (requestId) {
      window.cancelAnimationFrame(requestId);
    }
  } else {
    verticalRhythm = flooredRhythm;
    requestId = window.requestAnimationFrame(setVerticalRhythm);
  }
};

export const verticalRhythmInit = () => {
  root = document.documentElement;
  if (root) {
    window.addEventListener('resize', floorVerticalRhythm);
    floorVerticalRhythm();
  }
};

export default {
  verticalRhythmInit,
};
