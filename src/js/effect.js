const getVerticalRhythm = el =>
  parseFloat(getComputedStyle(el).getPropertyValue('line-height'), 10);

const getNaturalHeight = el => {
  const definedHeight = getComputedStyle(el).getPropertyValue('minHeight');
  if (definedHeight !== 'auto') {
    const { style } = el;
    style.paddingTop = 0;
    style.minHeight = 'auto';
  }
  return el.offsetHeight;
};

const flowChildren = (el, documentLineHeight) => {
  const children = el.childNodes;
  if (children.length > 0) {
    return children.values().reduce((a, child) => flowChildren(child), []);
  }
  const lineHeight = getVerticalRhythm(el);
  if (lineHeight % documentLineHeight !== 0) {
    const naturalHeight = getNaturalHeight(el);
    const minHeight =
      Math.ceil(naturalHeight / documentLineHeight) * documentLineHeight;
    const { style } = el;
    style.paddingTop = (minHeight - naturalHeight) / 2;
    style.minHeight = minHeight;
  }
  return el;
};

export const reflow = root => {
  const vrgLineHeight = getVerticalRhythm(document.documentElement);
  flowChildren(root, vrgLineHeight);
};

export default {
  flowChildren,
};
