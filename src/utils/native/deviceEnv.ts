const ua = navigator.userAgent.toLowerCase();

export const isUniApp = (function () {
  return /uni-app/.test(ua) || /Html5Plus/.test(ua);
})();

export const isIcome: boolean = (function () {
  return window.ic && window.ic.isIcome;
})();

export const isIcomeIOS: boolean = (function () {
  return window.ic && window.ic.isIOS;
})();

export const isIcomeAndroid: boolean = (function () {
  return window.ic && window.ic.isAndroid;
})();

export const isIcomeMobile = isIcomeIOS || isIcomeAndroid;

export const isIcomePC = isIcome && !isIcomeMobile;

export const isIOS = (function () {
  return isIcomeIOS || (isUniApp && /iphone/.test(ua));
})();

export const isAndroid = (function () {
  return isIcomeAndroid || (isUniApp && /android/.test(ua));
})();

export const isMobile = isIOS || isAndroid;
