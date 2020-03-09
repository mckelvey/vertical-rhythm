import { VERTICAL_RHYTHM } from 'js/defaults';

let gridCells = [];
let requestId = null;

const cellsNeedingUpdate = {};

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
    const naturalHeight = getNaturalHeight(cell);
    if (naturalHeight % VERTICAL_RHYTHM !== 0) {
      cellsNeedingUpdate[i] = {
        cell,
        minHeight: Math.ceil(naturalHeight / VERTICAL_RHYTHM) * VERTICAL_RHYTHM,
      };
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
