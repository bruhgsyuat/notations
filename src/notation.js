import Decimal from "break_infinity.js"
import { Settings } from "./settings"
import { formatWithCommas, noSpecialFormatting, showCommas } from "./utils"

export class Notation {
  format(value, places = 0, placesUnder1000 = 0, placesExponent = places) {
    if (typeof value === "number" && !Number.isFinite(value)) {
      return this.infinite
    }

    const decimal = Decimal.fromValue_noAlloc(value)

    if (decimal.exponent < -300) {
      return decimal.sign() < 0
        ? this.formatVerySmallNegativeDecimal(decimal.abs(), placesUnder1000)
        : this.formatVerySmallDecimal(decimal, placesUnder1000)
    }

    if (decimal.exponent < 3) {
      const number = decimal.toNumber()
      return number < 0
        ? this.formatNegativeUnder1000(Math.abs(number), placesUnder1000)
        : this.formatUnder1000(number, placesUnder1000)
    }

    if (Settings.isInfinite(decimal.abs())) {
      return decimal.sign() < 0 ? this.negativeInfinite : this.infinite
    }

    return decimal.sign() < 0
      ? this.formatNegativeDecimal(decimal.abs(), places, placesExponent)
      : this.formatDecimal(decimal, places, placesExponent)
  }

  get negativeInfinite() {
    return `-${this.infinite}`
  }

  get infinite() {
    return "Infinite"
  }

  formatVerySmallNegativeDecimal(value, places) {
    return `-${this.formatVerySmallDecimal(value, places)}`
  }

  formatVerySmallDecimal(value, places) {
    // We switch to very small formatting as soon as 1e-300 due to precision loss,
    // so value.toNumber() might not be zero.
    return this.formatUnder1000(value.toNumber(), places)
  }

  formatNegativeUnder1000(value, places) {
    return `-${this.formatUnder1000(value, places)}`
  }

  formatUnder1000(value, places) {
    return value.toFixed(places)
  }

  formatNegativeDecimal(value, places, placesExponent) {
    return `-${this.formatDecimal(value, places, placesExponent)}`
  }

  formatExponent(
    exponent,
    precision = Settings.exponentDefaultPlaces,
    specialFormat = (n, _) => n.toString(),
    largeExponentPrecision = Math.max(2, precision)
  ) {
    // This is for log notation, which wants a digit of precision on all small exponents.
    if (noSpecialFormatting(exponent)) {
      return specialFormat(exponent, Math.max(precision, 1))
    }
    if (showCommas(exponent)) {
      // need this to use specialformat first
      return formatWithCommas(specialFormat(exponent, 0))
    }
    return this.formatDecimal(
      new Decimal(exponent),
      largeExponentPrecision,
      largeExponentPrecision
    )
  }
}
