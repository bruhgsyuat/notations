import { Notation } from "./notation"
import { formatMantissaWithExponent, formatMantissaBaseTen } from "./utils"

export class EngineeringNotation extends Notation {
  get name() {
    return "Engineering"
  }

  formatDecimal(value, places, placesExponent) {
    return formatMantissaWithExponent(
      formatMantissaBaseTen,
      this.formatExponent.bind(this),
      10,
      3,
      (x, _) => formatMantissaBaseTen(x, 0)
    )(value, places, placesExponent)
  }
}
