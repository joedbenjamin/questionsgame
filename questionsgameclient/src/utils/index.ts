const decodeHTML = (html: string) => {
  var el = document.createElement('textarea');
  el.innerHTML = html;
  return el.value;
};

export { decodeHTML };
