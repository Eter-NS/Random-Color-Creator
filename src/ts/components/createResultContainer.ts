import { colorHistory } from './colorHistory';

const clipboardSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" class="clipboard-svg"><path d="M19 3h-2.25a1 1 0 0 0-1-1h-7.5a1 1 0 0 0-1 1H5c-1.103 0-2 .897-2 2v15c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm0 17H5V5h2v2h10V5h2v15z"></path></svg>`;

const checkOutSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" class="clipboard-svg"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>`;

function createColorTable(colorArray: string[]) {
  const colorHistoryContainer = document.createElement('div');
  colorHistoryContainer.className = 'fresh-baked__history-container';

  const h3 = document.createElement('h3');
  h3.className = 'fresh-baked__history-h3';
  h3.innerText = 'Colors History';

  const colorTable = document.createElement('table');
  colorTable.className = 'fresh-baked__history-table';

  const headers = document.createElement('tr');
  headers.className = 'fresh-baked__history-table-row--header';

  for (let i = -2; i < colorArray.length; i++) {
    if (i < 0) {
      const th = document.createElement('th');
      th.className = 'fresh-baked__history-table-header';
      th.innerText = i === -2 ? 'Preview' : 'Format';
      headers.append(th);
      continue;
    }

    if (!i) colorTable.append(headers);
    // binding colors
    const tr = document.createElement('tr');
    tr.className = 'fresh-baked__history-table-row';

    const previewBox = document.createElement('div');
    previewBox.className = 'fresh-baked__history-color-preview';
    previewBox.style.backgroundColor = colorArray[i];

    const outputFormat = document.createElement('p');
    outputFormat.className = 'fresh-baked__history-color-text';
    outputFormat.innerText = colorArray[i];

    tr.append(previewBox);
    tr.append(outputFormat);
    colorTable.append(tr);
  }

  colorHistoryContainer.append(h3);
  colorHistoryContainer.append(colorTable);

  return colorHistoryContainer;
}

export function createResultContainer(
  newColor: string,
  colorForm: HTMLFormElement
) {
  const colorArray = colorHistory(newColor);

  // if we've created more than 1 color
  if (colorForm.nextElementSibling) {
    const existingSection = colorForm.nextElementSibling,
      outputElement = existingSection.querySelector<HTMLParagraphElement>(
        '.fresh-baked__output-element'
      ),
      colorPreviewContainer = existingSection.querySelector<HTMLDivElement>(
        '.fresh-baked__color-preview'
      ),
      pasteToClipboardButton = existingSection.querySelector<HTMLButtonElement>(
        '.fresh-baked__clipboard-button'
      ),
      colorHistoryContainer = existingSection.querySelector<HTMLDivElement>(
        '.fresh-baked__history-container'
      );

    colorPreviewContainer!.style.backgroundColor = newColor;
    outputElement!.innerText = newColor;
    pasteToClipboardButton!.innerHTML = clipboardSVG;
    listenForClick(pasteToClipboardButton!, newColor);

    if (colorArray.length > 1) {
      if (colorHistoryContainer)
        existingSection!.removeChild(colorHistoryContainer);
      existingSection!.append(createColorTable(colorArray));
    }
    return;
  }

  const justBakedContainer = new DocumentFragment();

  const section = document.createElement('section');
  section.classList.add('fresh-baked');

  const h2 = document.createElement('h2');
  h2.innerText = 'Here, this is your new color! 😊';

  const div = document.createElement('div');
  div.classList.add('fresh-baked__block-label');

  const colorPreviewContainer = document.createElement('div');
  colorPreviewContainer.classList.add('fresh-baked__color-preview');
  colorPreviewContainer.style.backgroundColor = newColor;

  const outputElement = document.createElement('p');
  outputElement.classList.add('fresh-baked__output-element');
  outputElement.innerText = newColor;

  const pasteToClipboardButton = document.createElement('button');
  pasteToClipboardButton.innerHTML = clipboardSVG;
  pasteToClipboardButton.classList.add('fresh-baked__clipboard-button');
  pasteToClipboardButton.dataset.tooltip = 'Saved to your clipboard!';
  // button.onclick
  listenForClick(pasteToClipboardButton, newColor);

  div.append(colorPreviewContainer);
  div.append(outputElement);
  div.append(pasteToClipboardButton);
  section.append(h2);
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
      '--animation-duration',
      `${animationTime}ms`
    );
    pasteToClipboardButton.style.setProperty('--animation-name', 'fade-in-out');

    setTimeout(() => {
      pasteToClipboardButton.style.removeProperty('--animation-duration');
      pasteToClipboardButton.style.removeProperty('--animation-name');
    }, animationTime);
  };
}
