import { Phrases } from '../../types/SectionPhrases';
import randomNumberFromInterval from '../randomNumberFromInterval';
import { returnSmallestStringLength } from '../returnInputValueLength';

export default class Hex {
  name: string;
  red: string;
  green: string;
  blue: string;
  formatName: string;
  sectionPhrases: Phrases;
  private _hexCharTable: string;
  private _hexColor: string[];

  constructor() {
    this.name = 'hex';
    this.formatName = 'hex_input';
    this.sectionPhrases = {
      name: this.name.toUpperCase(),
      inputs: ['Red', 'Green', 'Blue'],
      inputType: 'text',
      placeholder: [
        'A value from 0 to ff',
        'A value from 0 to ff',
        'A value from 0 to ff',
      ],
    };
    this.red = '';
    this.green = '';
    this.blue = '';
    this._hexCharTable = '0123456789ABCDEF';
    this._hexColor = [this.red, this.green, this.blue];
  }

  selectHexNumber() {
    return this._hexCharTable[randomNumberFromInterval(0, 15)];
  }

  createColor(userInputs: string[]): string | null {
    const isShorthand = returnSmallestStringLength(userInputs) === 1;

    for (let i = 0; i < this._hexColor.length; i++) {
      if (typeof userInputs[i] === 'string' && userInputs[i].length > 0) {
        this._hexColor[i] = userInputs[i].toUpperCase();
        continue;
      }

      if (isShorthand) {
        this._hexColor[i] = this.selectHexNumber();
      } else {
        this._hexColor[i] = this.selectHexNumber() + this.selectHexNumber();
      }
    }

    return '#' + this._hexColor.join('');
  }
}
