import { Phrases } from "../types/SectionPhrases";

export default class Hex {
  name: string;
  red: string;
  green: string;
  blue: string;
  formatName: string;
  sectionPhrases: Phrases;

  constructor() {
    this.name = "hex";
    this.formatName = "hex_input";
    this.sectionPhrases = {
      name: this.name.toUpperCase(),
      inputs: ["Red", "Green", "Blue"],
      inputType: "text",
      placeholder: [
        "A value from 0 to ff",
        "A value from 0 to ff",
        "A value from 0 to ff",
      ],
    };
    this.red = "";
    this.green = "";
    this.blue = "";
  }

  generateDOMTree() {}
}
