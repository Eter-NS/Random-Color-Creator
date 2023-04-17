import { Phrases } from "../types/SectionPhrases";
import randomNumberFromInterval from "./randomNumberFromInterval";

export default class HSL {
  name: string;
  hue: number;
  saturation: string;
  lightness: string;
  formatName: string;
  sectionPhrases: Phrases;
  private _colorOrder: (string | number)[];

  constructor() {
    this.name = "hsl";
    this.formatName = "hsl_input";
    this.sectionPhrases = {
      name: this.name.toUpperCase(),
      inputs: ["Hue", "Saturation", "Lightness"],
      inputType: "number",
      placeholder: [
        "A value from 0 to 360",
        "A value from 0 to 100",
        "A value from 0 to 100",
      ],
    };
    this.hue = 0;
    this.saturation = "";
    this.lightness = "";
    this._colorOrder = [this.hue, this.saturation, this.lightness];
  }

  createColor(userInputs: string[]): string | null {
    for (let i = 0; i < userInputs.length; i++) {
      const userValue = userInputs[i];
      if (typeof userValue === "string" && userValue.length > 0) {
        this._colorOrder[i] = Number(userValue);
      } else {
        i === 0
          ? (this._colorOrder[i] = randomNumberFromInterval(0, 360))
          : (this._colorOrder[i] = randomNumberFromInterval(0, 100));
      }
    }
    const [hue, saturation, lightness] = this._colorOrder;
    console.log(`hsl(${hue}, ${saturation}%, ${lightness}%)`);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
}
