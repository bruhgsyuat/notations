import { Notation } from "./notation"
import { StandardNotation } from "./standard"
import { formatMantissaWithExponent, formatMantissaBaseTen } from "./utils"

const standard = new StandardNotation()

export class MixedEngineeringNotation extends Notation {
  get name() {
    return "Mixed engineering"
  }

  formatDecimal(value, places, placesExponent) {
    if (value.exponent < 33) {
      return standard.formatDecimal(value, places, placesExponent)
    }
    return formatMantissaWithExponent(
      formatMantissaBaseTen,
      this.formatExponent.bind(this),
      10,
      3,
      (x, _) => formatMantissaBaseTen(x, 0)
    )(value, places, placesExponent)
  }
}
