import { Phrases } from "../../types/SectionPhrases";
import randomNumberFromInterval from "../randomNumberFromInterval";

export default class RGB {
  name: string;
  red: number;
  green: number;
  blue: number;
  formatName: string;
  sectionPhrases: Phrases;
  private _colorOrder: number[];

  constructor() {
    this.name = "rgb";
    this.formatName = "rgb_input";
    this.sectionPhrases = {
      name: this.name.toUpperCase(),
      inputs: ["Red", "Green", "Blue"],
      inputType: "number",
      placeholder: [
        "A value from 0 to 255",
        "A value from 0 to 255",
        "A value from 0 to 255",
      ],
    };
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this._colorOrder = [this.red, this.green, this.blue];
  }

  createColor(userInputs: string[] = []): string | null {
    for (let i = 0; i < userInputs.length; i++) {
      const userValue = userInputs[i];
      if (typeof userValue === "string" && userValue.length > 0) {
        this._colorOrder[i] = Number(userValue);
      } else {
        this._colorOrder[i] = randomNumberFromInterval(0, 255);
      }
    }
    const [red, green, blue] = this._colorOrder;
    console.log(`rgb(${red}, ${green}, ${blue})`);

    return `rgb(${red}, ${green}, ${blue})`;
  }
}
