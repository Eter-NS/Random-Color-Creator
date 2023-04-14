import { Phrases } from "../types/SectionPhrases";

export default class HSL {
  name: string;
  hue: number;
  saturation: string;
  lightness: string;
  formatName: string;
  sectionPhrases: Phrases;

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
  }

  generateDOMTree() {}
}
