export function newGUID() {
  var d = new Date().getTime();

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x7) | 0x8).toString(16);
  });
}

export function findAncestor(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}

// https://medium.com/@TCAS3/debounce-deep-dive-javascript-es6-e6f8d983b7a1
export const debounce = (fn, time) => {
  let timeout;

  return function() {
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};

export function resizeHChart(ref_HighChart) {
  if (
    !ref_HighChart ||
    !ref_HighChart.container ||
    !ref_HighChart.container.current
  )
    return;

  const gridItem = findAncestor(
    ref_HighChart.container.current,
    "react-grid-item"
  );
  if (!gridItem) return;

  const chart = ref_HighChart.chart;
  //chart.setSize(null, null);

  chart.setSize(gridItem.offsetWidth - 20, gridItem.offsetHeight - 20, false);
  // chart.setSize(null);
  // chart.setSize(null, null);

  // chart.reflow();

  // chart.reflow(null);

  // chart.setSize(width, height);
  // chart.setSize(this.offsetWidth - 20, this.offsetHeight - 20, false);
}
