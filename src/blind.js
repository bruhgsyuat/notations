import { Notation } from "./notation"

export class BlindNotation extends Notation {
  get name() {
    return "Blind"
  }

  get negativeInfinite() {
    return " "
  }

  get infinite() {
    return " "
  }

  formatVerySmallNegativeDecimal() {
    return " "
  }

  formatVerySmallDecimal() {
    return " "
  }

  formatNegativeUnder1000() {
    return " "
  }

  formatUnder1000() {
    return " "
  }

  formatNegativeDecimal() {
    return " "
  }

  formatDecimal() {
    return " "
  }
}
