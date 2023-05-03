import colorHistory from "./colorHistory";

const clipboardSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" class="clipboard-svg"><path d="M19 3h-2.25a1 1 0 0 0-1-1h-7.5a1 1 0 0 0-1 1H5c-1.103 0-2 .897-2 2v15c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm0 17H5V5h2v2h10V5h2v15z"></path></svg>`;

const checkOutSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" class="clipboard-svg"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>`;

function createColorTable(colorArray: string[]) {
  let colorTable: null | HTMLTableElement = null;
  const p = document.createElement("p");
  p.innerText = "Colors History";

  colorTable = document.createElement("table");

  const headers = document.createElement("tr");

  for (let i = -2; i < colorArray.length; i++) {
    if (i < 0) {
      const th = document.createElement("th");
      th.innerText = i === -2 ? "Preview" : "Format";
      headers.append(th);
      continue;
    }

    if (!i) colorTable.append(headers);
    // binding colors
    const tr = document.createElement("tr");

    const previewBox = document.createElement("div");
    previewBox.classList.add("fresh-baked__color-preview");
    previewBox.style.backgroundColor = colorArray[i];

    const outputFormat = document.createElement("p");
    outputFormat.innerText = colorArray[i];

    tr.append(previewBox);
    tr.append(outputFormat);
    colorTable.append(tr);
  }

  return colorTable;
}

export function createResultContainer(
  newColor: string,
  colorForm: HTMLFormElement
) {
  const colorArray = colorHistory(newColor);

  if (colorForm.nextElementSibling) {
    const existingSection = colorForm.nextElementSibling,
      outputElement = existingSection.querySelector<HTMLParagraphElement>(
        ".fresh-baked__output-element"
      ),
      colorPreviewContainer = existingSection.querySelector<HTMLDivElement>(
        ".fresh-baked__color-preview"
      ),
      pasteToClipboardButton = existingSection.querySelector<HTMLButtonElement>(
        ".fresh-baked__clipboard-button"
      ),
      outputColorContainer = existingSection.querySelector<HTMLDivElement>(
        ".fresh-baked__block-label"
      );

    if (
      !outputElement ||
      !colorPreviewContainer ||
      !pasteToClipboardButton ||
      !outputColorContainer
    )
      return;

    colorPreviewContainer.style.backgroundColor = newColor;
    outputElement.innerText = newColor;
    pasteToClipboardButton.innerHTML = clipboardSVG;
    listenForClick(pasteToClipboardButton, newColor);
    if (colorArray.length > 2) {
      outputColorContainer.lastElementChild?.remove();
      outputColorContainer.append(createColorTable(colorArray));
    }

    return;
  }

  const justBakedContainer = new DocumentFragment();

  const section = document.createElement("section");
  section.classList.add("fresh-baked");

  const h3 = document.createElement("h2");
  h3.innerText = "Here, this is your new color! 😊";

  const div = document.createElement("div");
  div.classList.add("fresh-baked__block-label");

  const colorPreviewContainer = document.createElement("div");
  colorPreviewContainer.classList.add("fresh-baked__color-preview");
  colorPreviewContainer.style.backgroundColor = newColor;

  const outputElement = document.createElement("p");
  outputElement.classList.add("fresh-baked__output-element");
  outputElement.innerText = newColor;

  const pasteToClipboardButton = document.createElement("button");
  pasteToClipboardButton.innerHTML = clipboardSVG;
  pasteToClipboardButton.classList.add("fresh-baked__clipboard-button");
  pasteToClipboardButton.dataset.tooltip = "Saved to your clipboard!";
  // button.onclick
  listenForClick(pasteToClipboardButton, newColor);

  div.append(colorPreviewContainer);
  div.append(outputElement);
  div.append(pasteToClipboardButton);
  section.append(h3);
  section.append(div);
  if (colorArray.length > 1) section.append(createColorTable(colorArray));
  justBakedContainer.append(section);
  colorForm.after(justBakedContainer);

  // creating a mini container that shows the generated value to the user with ability to copy it and a mini block to show the color live.
}

export function listenForClick(
  pasteToClipboardButton: HTMLButtonElement,
  newColor: string
) {
  pasteToClipboardButton.onclick = () => {
    navigator.clipboard.writeText(newColor);

    pasteToClipboardButton.innerHTML = checkOutSVG;
    const animationTime = 2500;
    pasteToClipboardButton.style.setProperty(
      "--animation-duration",
      `${animationTime}ms`
    );
    pasteToClipboardButton.style.setProperty("--animation-name", "fade-in-out");

    setTimeout(() => {
      pasteToClipboardButton.style.removeProperty("--animation-duration");
      pasteToClipboardButton.style.removeProperty("--animation-name");
    }, animationTime);
  };
}
