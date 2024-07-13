import { Notation } from "./notation"

export class LogarithmNotation extends Notation {
  get name() {
    return "Logarithm"
  }

  formatDecimal(value, places, placesExponent) {
    const log10 = value.log10()
    return `e${this.formatExponent(
      log10,
      places,
      (n, p) => n.toFixed(p),
      placesExponent
    )}`
  }
}
