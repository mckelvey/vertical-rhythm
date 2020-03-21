let gridCells = [];
let requestId = null;

const cellsNeedingUpdate = {};

const getVerticalRhythm = () =>
  parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('line-height'),
    10
  );

const setMinHeights = () => {
  Object.values(cellsNeedingUpdate).forEach(({ cell, minHeight }) => {
    console.log('update', cell, minHeight); // eslint-disable-line
    if (minHeight !== 'auto') {
      cell.style.minHeight = minHeight; // eslint-disable-line no-param-reassign
    }
  });
  requestId = null;
};

const getNaturalHeight = cell => {
  const definedHeight = getComputedStyle(cell).getPropertyValue('minHeight');
  if (definedHeight !== 'auto') {
    cell.style.minHeight = 'auto'; // eslint-disable-line no-param-reassign
  }
  const { height } = cell.getBoundingClientRect();
  return height;
};

const computeCellHeights = () => {
  let updateNeeded = false;
  for (let i = 0; i < gridCells.length; i += 1) {
    const cell = gridCells[i];
    const verticalRhythm = getVerticalRhythm();
    const naturalHeight = getNaturalHeight(cell);
    const minHeight =
      Math.ceil(naturalHeight / verticalRhythm) * verticalRhythm;
    if (naturalHeight !== minHeight) {
      cellsNeedingUpdate[i] = { cell, minHeight: `${minHeight}px` };
      updateNeeded = true;
    } else {
      cellsNeedingUpdate[i] = { cell, minHeight: 'auto' };
    }
  }
  if (requestId) {
    if (!updateNeeded) {
      window.cancelAnimationFrame(requestId);
    }
  } else {
    requestId = window.requestAnimationFrame(setMinHeights);
  }
};

export const resizeHandler = () => {
  gridCells = document.querySelectorAll('.grid > *');
  if (gridCells.length > 0) {
    window.addEventListener('resize', computeCellHeights);
    computeCellHeights();
  }
};

export default {
  resizeHandler,
};
