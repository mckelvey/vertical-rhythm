import ready from 'utils/ready';
import { vrHandler } from './vr';
// import { resizeHandler as gridCellHeightResizeHandler } from './grid/cell/height';
// import { headerVRHandler } from './grid/height';

ready(() => {
  // gridCellHeightResizeHandler();
  vrHandler();
  // headerVRHandler();
});
