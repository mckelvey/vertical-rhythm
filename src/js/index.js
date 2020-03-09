import ready from 'utils/ready';
import { resizeHandler as gridCellHeightResizeHandler } from './grid/cell/height';

ready(() => {
  gridCellHeightResizeHandler();
});
