type colorArrayType = (string | never)[];

function getCookieData(cookieId: string): colorArrayType {
  let returnData: colorArrayType = [];
  const cookieDecoded = decodeURIComponent(document.cookie) || "";
  const cookieElementArray = cookieDecoded.split("; ");

  const colorCookieSupposedPosition = 0;
  const colorsJSONSupposedPosition = 1;
  if (
    cookieId === cookieElementArray[colorCookieSupposedPosition] &&
    cookieElementArray.length > 1
  ) {
    const jsonArray = cookieElementArray[colorsJSONSupposedPosition].split("=");
    console.log(jsonArray);
    returnData = JSON.parse(jsonArray[1]);
  }
  return returnData;
}

// main function
export default function colorHistory(displayedColor: string) {
  const colors = getCookieData("name=color_cookie");
  console.log(colors);

  colors.push(displayedColor);
  // removes the oldest color
  if (colors.length > 10) colors.shift();

  return saveCookieData(colors);
}

function saveCookieData(colors: colorArrayType) {
  const expiresDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toUTCString();
  document.cookie = `name=color_cookie; colors=${JSON.stringify(
    colors
  )}; expires=${expiresDate}`;
  return colors;
}
