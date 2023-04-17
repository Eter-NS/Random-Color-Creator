import { Phrases } from "../types/SectionPhrases";

export default function generateDOMTree(
  colorFormElement: HTMLFormElement,
  formatClass: { formatName: string; sectionPhrases: Phrases }
) {
  const { formatName, sectionPhrases } = formatClass;

  return new Promise<HTMLFormElement>((resolve, reject) => {
    if (colorFormElement.id === formatName) {
      resolve(colorFormElement);
      return;
    }
    colorFormElement.id = formatName;
    const container = colorFormElement.querySelector("fieldset");
    if (!container) throw new Error("fieldset not found");

    const DOMTree = new DocumentFragment();

    // creating form elements for this section
    const { name, inputs, inputType, placeholder } = sectionPhrases;

    const h3 = document.createElement("h2");
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
      const specialCharacterAfterInputTag = document.createElement("p");
      specialCharacterAfterInputTag.style.display = "none";

      // validation attributes settings
      if (inputType === "text") {
        inputTag.pattern = /^([0-9a-fA-F]{1}|[0-9a-fA-F]{2})$/.source;
      } else if (inputType === "number") {
        inputTag.min = "0";

        if (name === "RGB") {
          inputTag.max = "255";
        }
        if (name === "HSL") {
          i === 0 ? (inputTag.max = "360") : (inputTag.max = "100");
        }
      } else {
        reject("Unknown color format");
      }

      label.append(p);
      label.append(inputTag);
      if (name === "HSL") {
        inputTag.style.width = "calc(100% - 1.8rem)";
        if (i === 0) {
          specialCharacterAfterInputTag.style.display = "inline-block";
          specialCharacterAfterInputTag.innerText = "deg";
        }
        if (i > 0) {
          specialCharacterAfterInputTag.style.display = "inline-block";
          specialCharacterAfterInputTag.innerText = "%";
        }
      }

      label.append(specialCharacterAfterInputTag);

      DOMTree.append(label);
    }
    container.innerHTML = ""; // removes the previous tree
    container.style.opacity = "0";
    container.style.transform = "translateX(100%)";
    container.append(DOMTree);
    setTimeout(() => {
      container.style.opacity = "1";
      container.style.transform = "translateX(0%)";
      resolve(colorFormElement);
    }, 1000);
  });
}
