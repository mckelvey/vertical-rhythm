import { verticalRhythmInit } from './polyfills/vertical-rhythm';
import { minRowHeightInit } from './polyfills/min-row-height';
import { childMinHeightInit } from './polyfills/child-min-height';

export const vrgInit = () => {
  verticalRhythmInit();
  minRowHeightInit();
  childMinHeightInit();
};

export default {
  vrgInit,
};
