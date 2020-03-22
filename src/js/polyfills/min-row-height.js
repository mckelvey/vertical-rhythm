let givenMinRowHeight = null;
let fluidMinRowHeight = null;
let requestId = null;

const setFluidMinRowHeight = () => {
  document.documentElement.style.setProperty(
    '--fluid-min-row-height',
    `${fluidMinRowHeight}px`
  );
  requestId = null;
};

export const updateMinRowHeightIfNeeded = () => {
  const fluidVerticalRhythm = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      '--fluid-vertical-rhythm'
    ),
    10
  );
  if (!Number.isNaN(fluidVerticalRhythm)) {
    const minRowHeight =
      Math.ceil(givenMinRowHeight / fluidVerticalRhythm) * fluidVerticalRhythm;
    if (minRowHeight !== fluidMinRowHeight) {
      fluidMinRowHeight = minRowHeight;
      if (!requestId) {
        requestId = window.requestAnimationFrame(setFluidMinRowHeight);
      }
    } else if (requestId) {
      window.cancelAnimationFrame(requestId);
    }
  }
};

export const minRowHeightInit = () => {
  const given = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      '--given-min-row-height'
    ),
    10
  );
  if (!Number.isNaN(given)) {
    givenMinRowHeight = given;
    updateMinRowHeightIfNeeded();
  }
};

export default {
  minRowHeightInit,
  updateMinRowHeightIfNeeded,
};
