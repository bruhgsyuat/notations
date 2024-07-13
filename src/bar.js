import Decimal from "break_infinity.js"
import { Notation } from "./notation"

// The reason these have to be these unicode boxes and not their escape characters
// is beyond me. However, you can trust that these will render correctly, as they
// are part of the font found in docs/MonospaceTypewriter.ttf
const BARS = ["", "", "", "", "", "", "", ""]
const NEGATIVE_BARS = ["", "", "", "", "", "", "", ""]
const LOG8 = Math.log(8)

export class BarNotation extends Notation {
  get name() {
    return "Bar"
  }

  get negativeInfinite() {
    return ""
  }

  get infinite() {
    return ""
  }

  formatVerySmallNegativeDecimal(value) {
    return this.flipBars(this.formatDecimal(value))
  }

  formatVerySmallDecimal(value) {
    return this.formatDecimal(value)
  }

  formatNegativeUnder1000(value) {
    return this.flipBars(this.formatDecimal(new Decimal(value)))
  }

  formatUnder1000(value) {
    return this.formatDecimal(new Decimal(value))
  }

  formatNegativeDecimal(value) {
    return this.flipBars(this.formatDecimal(value))
  }

  formatDecimal(value) {
    if (value.eq(0)) {
      return "0"
    }
    if (value.lessThan(1) && value.greaterThan(0)) {
      return `/${this.formatDecimal(Decimal.div(1, value))}`
    }
    const log8 = (Math.LN10 / LOG8) * value.log10()
    let wholeLog = Math.floor(log8)
    const decimalLog = log8 - wholeLog
    const decimalLog64 = Math.floor(decimalLog * 64)
    const parts = [BARS[decimalLog64 % 8], BARS[Math.floor(decimalLog64 / 8)]]
    while (wholeLog >= 8) {
      const remainder = wholeLog % 8
      wholeLog = (wholeLog - remainder) / 8
      parts.push(BARS[remainder])
    }
    parts.push(BARS[wholeLog])
    return parts.join("")
  }

  flipBars(parts) {
    const newParts = []
    for (const part of parts) {
      newParts.push(NEGATIVE_BARS[BARS.indexOf(part)])
    }
    return newParts.join("")
  }
}
