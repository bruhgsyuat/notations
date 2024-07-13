import { Notation } from "./notation"
import { ScientificNotation } from "./scientific"

const scientific = new ScientificNotation()

export class MixedLogarithmSciNotation extends Notation {
  get name() {
    return "Mixed Logarithm (Sci)"
  }

  formatDecimal(value, places, placesExponent) {
    if (value.exponent < 33) {
      return scientific.formatDecimal(value, places, placesExponent)
    }
    const log10 = value.log10()
    return `e${this.formatExponent(
      log10,
      places,
      (n, p) => n.toFixed(p),
      placesExponent
    )}`
  }
}
