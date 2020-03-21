import ready from 'utils/ready';
import { vrHandler } from './vr';
// import { resizeHandler as gridCellHeightResizeHandler } from './grid/cell/height';
// import { resizeHandler as gridChildHeightResizeHandler } from './grid/height';

ready(() => {
  // gridCellHeightResizeHandler();
  // gridChildHeightResizeHandler();
  vrHandler();
});
