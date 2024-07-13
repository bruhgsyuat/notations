import { Notation } from "./notation"
import { Settings } from "./settings"
import { formatWithCommas } from "./utils"

const LOG10_MAX_VALUE = Math.log10(Number.MAX_VALUE)

export class InfinityNotation extends Notation {
  get name() {
    return "Infinity"
  }

  formatDecimal(value, places) {
    const log10 = value.log10()
    const infinities = log10 / LOG10_MAX_VALUE
    const infPlaces = infinities < 1000 ? 4 : 3
    const formatted = infinities.toFixed(Math.max(infPlaces, places))
    if (Settings.exponentCommas.show) {
      return `${formatWithCommas(formatted)}∞`
    }

    return `${formatted}∞`
  }
}
