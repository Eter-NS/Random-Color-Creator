type colorArrayType = string[];

// main function
export function colorHistory(displayedColor: string) {
  const colors = getCookieData('colors');

  colors.unshift(displayedColor);
  // removes the oldest color
  if (colors.length > 10) colors.pop();

  return saveCookieData(colors);
}

function getCookieData(cookieId: string): colorArrayType {
  let returnData: colorArrayType = [];
  const cookieSplittedBody = document.cookie.split('=');

  const colorsArrayPosition = 1;

  if (cookieSplittedBody.includes(cookieId)) {
    const cookieIdJSON = cookieSplittedBody[colorsArrayPosition];
    returnData = JSON.parse(cookieIdJSON);
  }
  return returnData;
}

function saveCookieData(colors: colorArrayType) {
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const expiresDate = new Date(Date.now() + sevenDays).toUTCString();
  const colorsJSON = JSON.stringify(colors);
  const cookieBody = `colors=${colorsJSON}; expires=${expiresDate}; path=/`;

  document.cookie = cookieBody;

  return colors;
}
