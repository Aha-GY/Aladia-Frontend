/**
 * @description Track logs on live website to debug. It's Chase's personal server, will be removed after the project is done.
 * @param {Object} message - The message to log.
 * @param {String} level - The level of the log, 'info' || 'error'.
 */
export function logToDebug(message, level = 'info') {
  console.log('log', message);

  fetch(`https://cv.dashuaibi.asia/log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      level,
      message,
    }),
  });
}
