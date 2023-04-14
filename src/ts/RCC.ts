import { RGB } from "./components/rgb";
import Hex from "./components/hex";
import HSL from "./components/hsl";
import generateDOMTree from "./components/generateDOMTree";

export default class RCC {
  private _controlTag: HTMLElement;
  private _radioInputs: NodeListOf<HTMLInputElement>;
  private _currentFormat: RGB | Hex | HSL;
  private _colorForm: HTMLFormElement;

  constructor(
    public formatControllerName: string,
    public colorFormTag: string
  ) {
    // Controller
    this._controlTag = document.querySelector(
      this.formatControllerName
    ) as HTMLElement;
    this._radioInputs = this._controlTag.querySelectorAll("input.color-format");

    // color entries
    this._colorForm = document.querySelector(
      this.colorFormTag
    ) as HTMLFormElement;
    this._currentFormat = new RGB(); // Default format

    this._formBinder();
    this._radioBinder();
  }

  private _formBinder() {
    this._colorForm.addEventListener("submit", (e: Event) => {
      e.preventDefault();
    });
  }

  private _radioBinder() {
    this._radioInputs.forEach((rInput) => {
      rInput.addEventListener("change", () => {
        if (!rInput.checked) return;
        this._currentFormat = this._newFormat(rInput.id);
        // console.log(`Changed to ${this._currentFormat.name.toUpperCase()}`);

        generateDOMTree(this._colorForm, this._currentFormat);
      });
    });
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
}
