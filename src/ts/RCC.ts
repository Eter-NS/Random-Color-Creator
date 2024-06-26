import RGB from './components/formats/rgb';
import Hex from './components/formats/hex';
import HSL from './components/formats/hsl';
import generateDOMTree from './components/generateDOMTree';
import { createResultContainer } from './components/createResultContainer';
import { returnSmallestInputValueLength } from './components/returnInputValueLength';

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
    this._radioInputs = this._controlTag.querySelectorAll('input.color-format');

    // color entries
    this._colorForm = document.querySelector(
      this.colorFormTag
    ) as HTMLFormElement;
    this._colorForm.noValidate = true;
    this._currentFormat = this._changeFormat('rgb');
    this._radioBinder();
    this._bindColorEntries(this._colorForm);
    this._formBinder();
  }

  private _newFormat(inputId: string) {
    switch (inputId) {
      case 'rgb':
        return new RGB();
      case 'hex':
        return new Hex();
      case 'hsl':
        return new HSL();
      default:
        throw new Error('The passed value is neither rgb, hex nor hsl.');
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
    this._colorInputs = result.querySelectorAll('input');
    this._colorInputs.forEach((input) => {
      input.onblur = (e) => {
        e.preventDefault();
        this._checkElement(input);
      };
    });
  }

  _checkElement = (input: HTMLInputElement): boolean => {
    // 0 = default
    let hasError = false;

    // if (!input.value) {
    //   return hasError;
    // }
    hasError = !input.checkValidity();
    this._toggleError(input, hasError);

    return hasError;
  };

  _toggleError = (input: HTMLInputElement, hasError: boolean) => {
    input?.classList.toggle('form__input--error', hasError);
  };

  private _formBinder() {
    this._colorForm.addEventListener('submit', (e: Event) => {
      e.preventDefault();

      this.globalError = false;
      let invalidHexInputIndex = -1;
      let hexInputLength = 0;

      if (this._colorForm.id === 'hex_input') {
        hexInputLength = returnSmallestInputValueLength(this._colorInputs);
      }

      for (let i = 0; i < this._colorInputs.length; i++) {
        const input = this._colorInputs[i];

        const hasError = this._checkElement(input);
        if (this._colorForm.id === 'hex_input') {
          // if the hexInputValue is more than 0, then run
          if (hexInputLength) {
            if (
              input.value.length !== hexInputLength &&
              input.value.length !== 0
            ) {
              this.globalError = true;
              invalidHexInputIndex = i;
            }
          }
        }

        if (hasError) this.globalError = true;
      }

      if (this.globalError) {
        if (this._colorForm.id === 'hex_input') {
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
        userInputArray.some((el) => el !== '')
          ? userInputArray
          : new Array<string>(3).fill('')
      );

      if (returnedValue) result(returnedValue);
      // If something went wrong...
      const errorMessage = 'Something went wrong';
      reject(errorMessage);
    });
  }
}
