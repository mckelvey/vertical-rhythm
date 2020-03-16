let gridCells = [];
let requestId = null;

const cellsNeedingUpdate = {};

const getVerticalRhythm = () =>
  parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('line-height'),
    10
  );

const setMinHeights = () => {
  const updates = Object.values(cellsNeedingUpdate);
  for (let i = 0; i < updates.length; i += 1) {
    const { cell, minHeight } = updates[i];
    if (minHeight !== 'auto') {
      cell.style.minHeight = minHeight;
    }
  }
  requestId = null;
};

const getNaturalHeight = cell => {
  const definedHeight = getComputedStyle(cell).getPropertyValue('minHeight');
  if (definedHeight !== 'auto') {
    cell.style.minHeight = 'auto'; // eslint-disable-line no-param-reassign
  }
  return cell.offsetHeight;
};

const computeCellHeights = () => {
  let updateNeeded = false;
  for (let i = 0; i < gridCells.length; i += 1) {
    const cell = gridCells[i];
    const verticalRhythm = getVerticalRhythm();
    console.log('cell VR', verticalRhythm); // eslint-disable-line
    const naturalHeight = getNaturalHeight(cell);
    console.log('cell NH', naturalHeight, naturalHeight % verticalRhythm, Math.ceil(naturalHeight / verticalRhythm) * verticalRhythm); // eslint-disable-line
    const minHeight =
      Math.ceil(naturalHeight / verticalRhythm) * verticalRhythm;
    if (naturalHeight !== minHeight) {
      cellsNeedingUpdate[i] = { cell, minHeight };
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
