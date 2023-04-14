import { Phrases } from "../types/SectionPhrases";

export default function generateDOMTree(
  colorFormElement: HTMLFormElement,
  {
    formatName,
    sectionPhrases,
  }: { formatName: string; sectionPhrases: Phrases }
) {
  colorFormElement.id = formatName;
  const container = colorFormElement.querySelector("fieldset");
  if (!container) throw new Error("fieldset not found");

  const DOMTree = new DocumentFragment();

  // creating form elements for this section
  const { name, inputs, inputType, placeholder } = sectionPhrases;

  const h3 = document.createElement("h3");
  h3.innerText = name;
  DOMTree.append(h3);

  for (let i = 0; i < inputs.length; i++) {
    inputs[i];

    const label = document.createElement("label");
    const p = document.createElement("p");
    p.innerText = inputs[i];
    const inputTag = document.createElement("input");
    inputTag.id = inputs[i].toLowerCase();
    inputTag.classList.add("form__input");
    inputTag.placeholder = placeholder[i];
    inputTag.type = inputType;

    // validation attributes settings
    if (inputType === "text") {
      inputTag.pattern = /^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.source;
    } else if (inputType === "number") {
      if (name === "RGB") {
        inputTag.min = "0";
        inputTag.max = "255";
      }
      if (name === "HSL") {
        inputTag.min = "0";
        i === 0 ? (inputTag.max = "360") : (inputTag.max = "100");
      }
    } else {
      throw new Error("Unknown format type");
    }

    label.append(p);
    label.append(inputTag);
    if (name === "HSL" && i === 0) label.append("deg");
    if (name === "HSL" && i > 0) label.append("%");
    DOMTree.append(label);
  }
  container.innerHTML = ""; // removes the previous tree
  container.append(DOMTree);
}
