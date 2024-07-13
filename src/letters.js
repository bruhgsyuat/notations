import { CustomNotation } from "./custom"

const LETTERS = "abcdefghijklmnopqrstuvwxyz"

export class LettersNotation extends CustomNotation {
  constructor() {
    super(LETTERS)
  }

  get name() {
    return "Letters"
  }
}
