let children = [];
let requestId = null;

const childUpdatesNeeded = {};

const getVerticalRhythm = el =>
  parseFloat(getComputedStyle(el).getPropertyValue('line-height'), 10);

const setChildStyles = () => {
  const updates = Object.values(childUpdatesNeeded);
  for (let i = 0; i < updates.length; i += 1) {
    const { el, styles } = updates[i];
    const styleKeys = Object.keys(styles);
    for (let j = 0; j < styleKeys.length; j += 1) {
      el.style[styleKeys[j]] = styles[styleKeys[j]];
    }
  }
  requestId = null;
};

const getNaturalHeight = el => {
  const definedHeight = getComputedStyle(el).getPropertyValue('minHeight');
  if (definedHeight !== 'auto') {
    el.style.paddingTop = 0; // eslint-disable-line no-param-reassign
    el.style.minHeight = 'auto'; // eslint-disable-line no-param-reassign
  }
  return el.offsetHeight;
};

const computeHeights = () => {
  let updateNeeded = false;
  for (let i = 0; i < children.length; i += 1) {
    const el = children[i];
    const verticalRhythm = getVerticalRhythm(el);
    console.log('child', verticalRhythm); // eslint-disable-line
    const naturalHeight = getNaturalHeight(el);
    if (naturalHeight % verticalRhythm !== 0) {
      const minHeight =
        Math.ceil(naturalHeight / verticalRhythm) * verticalRhythm;
      childUpdatesNeeded[i] = {
        el,
        styles: {
          minHeight,
          paddingTop: (minHeight - naturalHeight) / 2,
        },
      };
      updateNeeded = true;
    } else {
      childUpdatesNeeded[i] = { el, styles: {} };
    }
  }
  if (requestId) {
    if (!updateNeeded) {
      window.cancelAnimationFrame(requestId);
    }
  } else {
    requestId = window.requestAnimationFrame(setChildStyles);
  }
};

export const resizeHandler = () => {
  // children = document.querySelectorAll(
  //   '.grid > * h2, .grid > * h3, .grid > * h4'
  // );
  children = [];
  if (children.length > 0) {
    window.addEventListener('resize', computeHeights);
    computeHeights();
  }
};

export default {
  resizeHandler,
};
