let children = [];
let requestId = null;

const childUpdatesNeeded = {};

const getVerticalRhythm = el =>
  parseFloat(getComputedStyle(el).getPropertyValue('line-height'), 10);

const setChildStyles = () => {
  Object.values(childUpdatesNeeded).forEach(({ el, styles }) => {
    Object.keys(styles).forEach(property => {
      el.style[property] = `${styles[property]}px`; // eslint-disable-line no-param-reassign
    });
  });
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

export const updateChildMinHeightsIfNeeded = () => {
  let updateNeeded = false;
  for (let i = 0; i < children.length; i += 1) {
    const el = children[i];
    const verticalRhythm = getVerticalRhythm(document.body);
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

export const childMinHeightInit = () => {
  children = document.querySelectorAll(
    '.grid > * h2, .grid > * h3, .grid > * h4'
  );
  if (children.length > 0) {
    window.addEventListener('resize', updateChildMinHeightsIfNeeded);
    updateChildMinHeightsIfNeeded();
  }
};

export default {
  childMinHeightInit,
  updateChildMinHeightsIfNeeded,
};
