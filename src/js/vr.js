import { computeHeights, headerVRHandler } from './grid/height';

let root = null;
let requestId = null;
let verticalRhythm = null;

const getVerticalRhythm = () =>
  parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('line-height'),
    10
  );

const setVerticalRhythm = () => {
  if (verticalRhythm) {
    document.documentElement.style.setProperty(
      '--fluid-vertical-rhythm',
      `${verticalRhythm}px`
    );
    computeHeights();
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

export const vrHandler = () => {
  root = document.documentElement;
  if (root) {
    window.addEventListener('resize', floorVerticalRhythm);
    floorVerticalRhythm();
    headerVRHandler();
  }
};

export default {
  vrHandler,
};
