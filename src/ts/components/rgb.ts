import { Phrases } from "../types/SectionPhrases";

class RGB {
  name: string;
  red: number;
  green: number;
  blue: number;
  formatName: string;
  sectionPhrases: Phrases;

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
  }
}

export { RGB };
