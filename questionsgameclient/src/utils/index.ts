const decodeHTML = (html: string) => {
  var el = document.createElement('textarea');
  el.innerHTML = html;
  return el.value;
};

const getWebSocketURL: any = () =>
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_WEBSOCKETS_URL
    : process.env.REACT_APP_DEV_WEBSOCKETS_URL;

export { decodeHTML, getWebSocketURL };
