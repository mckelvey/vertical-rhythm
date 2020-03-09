const ready = fn => {
  if (document.readyState !== 'loading') {
    fn();
  }
  document.addEventListener('DOMContentLoaded', fn);
};

export default ready;
