import RGB from "./components/formats/rgb";
import Hex from "./components/formats/hex";
import HSL from "./components/formats/hsl";
import generateDOMTree from "./components/generateDOMTree";
import { createResultContainer } from "./components/createResultContainer";

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
      rInput.onchange = () => {
        if (!rInput.checked) return;
        this._currentFormat = this._changeFormat(rInput.id);
      };
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
      input.onblur = (e) => {
        e.preventDefault();
        this._checkElement(input);
      };
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
    input?.classList.toggle("form__input--error", hasError);
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
        if (this._colorForm.id === "hex_input") {
          this._toggleError(
            this._colorInputs[invalidHexInputIndex],
            this.globalError
          );
        }
        return;
      }
      this._createRandomColor().then((res) => {
        createResultContainer(res, this._colorForm);
      });
      // .catch((err) => {
      //   throw new Error(err);
      // });
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
}
