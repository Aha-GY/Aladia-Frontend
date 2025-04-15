export function secondToTime(second) {
  const add0 = (num) => (num < 10 ? `0${num}` : String(num));
  const hour = Math.floor(second / 3600);
  const min = Math.floor((second - hour * 3600) / 60);
  const sec = Math.floor(second - hour * 3600 - min * 60);
  return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':');
}

export function secondToTime2(second) {
  const hour = Math.floor(second / 3600);
  const min = Math.floor((second - hour * 3600) / 60);
  const sec = Math.floor(second - hour * 3600 - min * 60);
  return hour > 0 ? `${hour}h ${min}m ${sec}s` : `${min}m ${sec}s`;
}

export function loadImg(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    if (image.complete) {
      resolve(image);
    } else {
      image.onload = () => resolve(image);
      image.onerror = () => reject(url);
    }
  });
}

export function zeroFormat(num) {
  return num >= 10 ? num : `0${num}`;
}

export function sleep(time = 100) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function checkMail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email || '');
}

export function checkPassword(password) {
  return /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,31}$/.test(
    password,
  );
}

export function moneyFormat(amount, fixed = 2) {
  const number = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(number)) {
    return 'Invalid input';
  }
  const parts = number.toFixed(fixed).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
}

export function moneyFormatCut(amount) {
  const stringifiedAmount = `${parseInt(amount, 10)}`;
  const length = stringifiedAmount.length;

  if (length > 9) {
    // Format as billions
    return `${(amount / 1_000_000_000).toFixed(2)}B`;
  }

  if (length > 6) {
    // Format as millions
    return `${(amount / 1_000_000).toFixed(2)}M`;
  }

  if (length <= 5) {
    return moneyFormat(amount, 2);
  }
  if (length === 6) {
    return moneyFormat(amount, 1);
  }
  return moneyFormat(amount, 0);
}

export function getCheckedNodes(nodes) {
  const result = [];
  function checkNode(node) {
    if (node._state === 'checked') {
      result.push(node);
      return;
    }
    if (node.folders) {
      node.folders.forEach(checkNode);
    }
    if (node.courses) {
      node.courses.forEach(checkNode);
    }
  }
  nodes.forEach(checkNode);
  return result;
}

export function isDef(v) {
  return v !== undefined && v !== null;
}

export function truncateString(str, maxLength) {
  if (!maxLength || str.length <= maxLength) {
    return str;
  } else {
    return `${str.substring(0, maxLength - 3)}...`;
  }
}

export function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
export function isEmptyObject(obj) {
  if (!isObject(obj)) {
    return true;
  }
  return Object.keys(obj)?.length === 0;
}

export function filterNullAndUndefinedValues(obj) {
  if (!isObject(obj)) {
    return obj;
  }
  return Object.fromEntries(
    Object.entries(obj).filter(
      // eslint-disable-next-line no-unused-vars
      ([_key, value]) => value !== null && value !== undefined,
    ),
  );
}

export function htmlHasContent(htmlString = '') {
  const textContent = htmlString?.replace(/<[^>]*>/g, '')?.trim();
  return textContent?.length > 0;
}

export const openLink = (link) => {
  if (link) {
    const location = link.includes('http') ? link : `https://${link}`;
    window.open(location, '_blank');
  }
};

export function checkPopupBlocked() {
  const popup = window.open('', '', 'width=100, height=100');
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    console.log('Popup is blocked.');
    return true;
  } else {
    console.log('Popup is not blocked.');
    popup.close();
    return false;
  }
}

export const validateURL = (url) => {
  const urlRegex =
    /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(:[0-9]{1,5})?(\/.*)?$/;
  return urlRegex.test(url);
};

export const getPhoneNumberStr = ({ value, flag, prefix }) =>
  [value, flag, prefix].join(',');

export const highlightKeywords = (str, keywords = []) => {
  const wordlist =
    keywords.filter(
      (item) => item !== '' && item !== null && item !== undefined,
    ) || [];
  if (!str || !wordlist.length) {
    return str;
  }
  const escapeRegExp = (string) =>
    string?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${wordlist.map(escapeRegExp).join('|')})`, 'gi');
  return str.replace(
    regex,
    '<span class="!text-[#E0B92C] bg-[#E0B92C]/20">$1</span>',
  );
};

export const highlightHTMLByKeywords = (html, keywords) => {
  const escapedKeywords = keywords.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${escapedKeywords})(?![^<]*>)`, 'gi');

  return html.replace(
    regex,
    '<span class="!text-[#E0B92C] bg-[#E0B92C]/20">$1</span>',
  );
};

export function isElementFullyInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  );
}

export function stripHtml(html = '') {
  if (!html) {
    return '';
  }
  return html.replace(/<[^>]*>/g, '');
}

export function replacePath(type, id, path) {
  if (type === 'organization') {
    const newPath = path
      .replace('/user/', '/organization/')
      .replace(/hub\/[a-z0-9]+/, `hub/${id}`);
    return newPath;
  } else {
    const newPath = path
      .replace('/organization/', '/user/')
      .replace(/hub\/[a-z0-9]+/, `hub/${id}`);
    return newPath;
  }
}

export function shortenString(str) {
  if (str?.length > 4) {
    return `${str.substring(0, 2)}...${str.substring(str.length - 2)}`;
  }
  return str;
}

export function checkVideoPlayable(file) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const objectUrl = URL.createObjectURL(file);
    video.oncanplay = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(true);
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(false);
    };
    video.src = objectUrl;
  });
}

export function hexToRgba(hex, opacity) {
  if (!hex) {
    return `rgba(0, 0, 0, ${opacity})`;
  }
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b},  ${opacity})`;
}

export function getAverageColor(element) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (element instanceof HTMLVideoElement) {
    canvas.width = element.videoWidth;
    canvas.height = element.videoHeight;
  } else if (element instanceof HTMLImageElement) {
    canvas.width = element.naturalWidth;
    canvas.height = element.naturalHeight;
  } else {
    throw new Error('Element is not an image or video');
  }
  context.drawImage(element, 0, 0, canvas.width, canvas.height);
  try {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let r = 0,
      g = 0,
      b = 0;
    const pixelCount = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    r = Math.round(r / pixelCount);
    g = Math.round(g / pixelCount);
    b = Math.round(b / pixelCount);
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return null;
  }
}

export function removeHtmlTags(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, '');
}

export function getDeviceType(device, os) {
  const deviceInfo = `${device} ${os}`.toLowerCase();
  const mobileAgent = ['mobile', 'android', 'iphone', 'harmonyos'];
  const pcAgent = ['window', 'mac', 'linux'];
  const padAgent = ['pad', 'ipad', 'tablet'];
  if (padAgent.some((agent) => deviceInfo.includes(agent))) {
    return 'Pad';
  }
  if (mobileAgent.some((agent) => deviceInfo.includes(agent))) {
    return 'Mobile';
  }
  if (pcAgent.some((agent) => deviceInfo.includes(agent))) {
    return 'PC';
  }
  return 'Unknown';
}

export function formatNumber(num = 0) {
  if (num < 0) {
    return '0';
  }
  if (num < 100) {
    return num.toString();
  }
  if (num < 1000) {
    return '99+';
  }
  if (num < 10000) {
    return `${(num / 1000).toFixed(1).replace('.0', '')}K`;
  }
  if (num < 1000000) {
    return `${Math.floor(num / 1000)}K`;
  }
  return `${(num / 1000000).toFixed(1).replace('.0', '')}M`;
}

export function loadCSS(url) {
  if (document.querySelector(`link[href="${url}"]`)) {
    console.log(`CSS ${url} has already been loaded.`);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;

    link.onload = () => {
      console.log(`CSS ${url} has been loaded.`);
      resolve();
    };

    link.onerror = (error) => {
      console.error(`Failed to load CSS from ${url}`, error);
      reject(error);
    };

    document.head.appendChild(link);
  });
}
