type colorArrayType = string[];

// main function
export default function colorHistory(displayedColor: string) {
  const colors = getCookieData("colors");

  colors.unshift(displayedColor);
  // removes the oldest color
  if (colors.length > 10) colors.pop();

  return saveCookieData(colors);
}

function getCookieData(cookieId: string): colorArrayType {
  let returnData: colorArrayType = [];
  const cookieDecoded = decodeURIComponent(document.cookie);
  const cookieElementArray = cookieDecoded.split("=");

  const colorsJSONSupposedPosition = 1;

  if (cookieElementArray.includes(cookieId)) {
    const cookieIdJSON = cookieElementArray[colorsJSONSupposedPosition];
    returnData = JSON.parse(cookieIdJSON);
  }
  return returnData;
}

function saveCookieData(colors: colorArrayType) {
  const expiresDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toUTCString();
  const colorsJSON = JSON.stringify(colors);
  const cookieBody = `colors=${colorsJSON}; expires=${expiresDate}; path=/`;

  document.cookie = cookieBody;

  return colors;
}
