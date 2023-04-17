import RGB from "./components/rgb";
import Hex from "./components/hex";
import HSL from "./components/hsl";
import generateDOMTree from "./components/generateDOMTree";

export default class RCC {
  private _controlTag: HTMLElement;
  private _radioInputs: NodeListOf<HTMLInputElement>;
  private _currentFormat: RGB | Hex | HSL;
  private _colorForm: HTMLFormElement;
  private _colorInputs!: NodeListOf<HTMLInputElement>;
  globalError: boolean;

  constructor(
    public formatControllerName: string,
    public colorFormTag: string
  ) {
    // validationError for submit event
    this.globalError = false;

    // Controller
    this._controlTag = document.querySelector(
      this.formatControllerName
    ) as HTMLElement;
    this._radioInputs = this._controlTag.querySelectorAll("input.color-format");

    // color entries
    this._colorForm = document.querySelector(
      this.colorFormTag
    ) as HTMLFormElement;
    this._colorForm.noValidate = true;
    this._currentFormat = this._changeFormat("rgb");
    this._radioBinder();
    this._bindColorEntries(this._colorForm);
    this._formBinder();
  }

  private _newFormat(inputId: string) {
    switch (inputId) {
      case "rgb":
        return new RGB();
      case "hex":
        return new Hex();
      case "hsl":
        return new HSL();
      default:
        throw new Error("The passed value is neither rgb, hex nor hsl.");
    }
  }

  private _radioBinder() {
    this._radioInputs.forEach((rInput) => {
      rInput.addEventListener("change", () => {
        if (!rInput.checked) return;
        this._currentFormat = this._changeFormat(rInput.id);
      });
    });
  }

  private _changeFormat(id: string) {
    const brandNewFormat = this._newFormat(id);
    // console.log(`Changed to ${this._currentFormat.name.toUpperCase()}`);

    generateDOMTree(this._colorForm, brandNewFormat)
      .then((res) => {
        this._bindColorEntries(res);
      })
      .catch((err) => {
        console.error(err);
      });
    return brandNewFormat;
  }

  private _bindColorEntries(result: HTMLFormElement) {
    this._colorInputs = result.querySelectorAll("input");
    this._colorInputs.forEach((input) => {
      input.addEventListener("blur", (e) => {
        e.preventDefault();
        this._checkElement(input);
      });
    });
  }

  _checkElement = (input: HTMLInputElement): [boolean, number] => {
    // 0 = default
    let inputValueLength: number = 0,
      hasError = false;

    if (!input.value) {
      return [hasError, inputValueLength];
    }
    hasError = !input.checkValidity();
    this._toggleError(input, hasError);

    // checking the same length for hex inputs
    if (input.type === "text") {
      inputValueLength = input.value.length;
    }
    return [hasError, inputValueLength];
  };

  _toggleError = (input: HTMLInputElement, hasError: boolean) => {
    input.classList.toggle("form__input--error", hasError);
  };

  private _formBinder() {
    this._colorForm.addEventListener("submit", (e: Event) => {
      e.preventDefault();

      this.globalError = false;
      let lengthOfTheFirstHexInput = 0;
      let invalidHexInputIndex = -1;
      for (let i = 0; i < this._colorInputs.length; i++) {
        const input = this._colorInputs[i];

        const [hasError, hexInputLength] = this._checkElement(input);

        if (hasError) this.globalError = true;
        if (hexInputLength) {
          if (i === 0) {
            lengthOfTheFirstHexInput = hexInputLength;
            continue;
          }
          if (lengthOfTheFirstHexInput !== hexInputLength) {
            this.globalError = true;
            invalidHexInputIndex = i;
          }
        }
      }

      if (this.globalError) {
        this._toggleError(
          this._colorInputs[invalidHexInputIndex],
          this.globalError
        );
        return;
      }
      this._createRandomColor()
        .then((res) => {
          this._createResultContainer(res);
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  }

  private _createRandomColor() {
    return new Promise<string>((result, reject) => {
      const userInputArray: string[] = [];
      this._colorInputs.forEach((element) => {
        userInputArray.push(element.value);
      });

      const returnedValue = this._currentFormat.createColor(
        userInputArray.some((el) => el !== "") ? userInputArray : new Array(3)
      );

      if (returnedValue) result(returnedValue);
      // If something went wrong...
      const errorMessage = "Something went wrong";
      reject(errorMessage);
    });
  }

  private _createResultContainer(newColor: string) {
    if (this._colorForm.nextElementSibling)
      this._colorForm.nextElementSibling.remove();

    const justBakedContainer = new DocumentFragment();

    const section = document.createElement("section");
    section.classList.add("fresh-baked");
    const h3 = document.createElement("h2");
    h3.innerText = "Here, this is your new color! 😊";

    const div = document.createElement("div");
    div.classList.add("fresh-baked__block-label");
    const colorPreviewContainer = document.createElement("div");
    colorPreviewContainer.classList.add("fresh-baked__color-preview");
    colorPreviewContainer.style.setProperty(
      "--custom-background-color",
      newColor
    );
    const outputElement = document.createElement("p");
    outputElement.classList.add("fresh-baked__output-element");
    outputElement.innerText = newColor;
    const pasteToClipboardButton = document.createElement("button");
    pasteToClipboardButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M19 3h-2.25a1 1 0 0 0-1-1h-7.5a1 1 0 0 0-1 1H5c-1.103 0-2 .897-2 2v15c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm0 17H5V5h2v2h10V5h2v15z"></path></svg>`;
    pasteToClipboardButton.classList.add("fresh-baked__clipboard-button");
    // button.onclick
    this._listenForClick(pasteToClipboardButton, newColor);

    div.append(colorPreviewContainer);
    div.append(outputElement);
    div.append(pasteToClipboardButton);
    section.append(h3);
    section.append(div);
    justBakedContainer.appendChild(section);
    this._colorForm.after(justBakedContainer);

    // creating a mini container that shows the generated value to the user with ability to copy it and a mini block to show the color live.
  }

  private _listenForClick(
    pasteToClipboardButton: HTMLButtonElement,
    newColor: string
  ) {
    pasteToClipboardButton.onclick = () => {
      navigator.clipboard.writeText(newColor);
    };
  }
}
