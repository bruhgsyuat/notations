import Decimal from "break_infinity.js"
import { Notation } from "./notation"

// The first column is the size in pL
// the second is the name
// the third is an index offset (going backwards) to the smallest unit that
// is larger than "roudning error" for the unit in question (so, for a tun,
// this is 7, which means that if we're within one pin of a tun, we'll say we're
// "almost a tun" rather than "a pin short of a tun"
const VOLUME_UNITS = [
  [0, "pL", 0],
  [61611520, "minim", 0],
  [61611520 * 60, "dram", 1],
  [61611520 * 60 * 8, "ounce", 2],
  [61611520 * 60 * 8 * 4, "gill", 2],
  [61611520 * 60 * 8 * 4 * 2, "cup", 3],
  [61611520 * 60 * 8 * 4 * 2 * 2, "pint", 4],
  [61611520 * 60 * 8 * 4 * 2 * 2 * 2, "quart", 4],
  [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4, "gallon", 4],
  [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 4.5, "pin", 3],
  [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 9, "firkin", 3],
  [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 18, "kilderkin", 4],
  [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 36, "barrel", 4],
  [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 54, "hogshead", 5],
  [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 72, "puncheon", 6],
  [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 108, "butt", 7],
  [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 216, "tun", 7]
]
const MINIMS = VOLUME_UNITS[1]
const VOLUME_ADJECTIVES = [
  "minute ",
  "tiny ",
  "petite ",
  "small ",
  "modest ",
  "medium ",
  "generous ",
  "large ",
  "great ",
  "grand ",
  "huge ",
  "gigantic ",
  "immense ",
  "colossal ",
  "vast ",
  "galactic ",
  "cosmic ",
  "infinite ",
  "eternal "
]
const VOWELS = new Set("aeiouAEIOU")
const MAX_VOLUME = 10 * VOLUME_UNITS[VOLUME_UNITS.length - 1][0]
const LOG_MAX_VOLUME = Math.log10(MAX_VOLUME)
const REDUCE_RATIO = Math.log10(MAX_VOLUME / MINIMS[0])

export class ImperialNotation extends Notation {
  get name() {
    return "Imperial"
  }

  formatUnder1000(value) {
    return this.formatDecimal(new Decimal(value))
  }

  formatDecimal(value) {
    if (value.lt(MAX_VOLUME)) {
      return this.convertToVolume(value.toNumber(), VOLUME_ADJECTIVES[0])
    }
    let logValue = value.log10() - LOG_MAX_VOLUME
    let adjectiveIndex = 1
    while (logValue > REDUCE_RATIO) {
      adjectiveIndex++
      logValue /= REDUCE_RATIO
    }
    return this.convertToVolume(
      10 ** logValue * MINIMS[0],
      VOLUME_ADJECTIVES[adjectiveIndex]
    )
  }

  convertToVolume(x, adjective) {
    const volIdx = this.findVolumeUnit(x)
    if (volIdx === 0) {
      return this.formatMetric(x)
    }

    const smallStr = this.checkSmallUnits(adjective, x, volIdx)
    if (smallStr !== undefined) {
      return smallStr
    }

    const big = VOLUME_UNITS[volIdx]
    const numBig = Math.floor(x / big[0])
    const remainder = x - numBig * big[0]
    // When we are within a specified rounding error, unit break:
    if (volIdx < VOLUME_UNITS.length - 1) {
      const volume = this.checkAlmost(adjective, x, 0, volIdx + 1)
      if (volume !== undefined) {
        return volume
      }
    }
    const nearMultiple = this.checkAlmost(adjective, remainder, numBig, volIdx)
    if (nearMultiple !== undefined) {
      return nearMultiple
    }
    // Just over a multiple, in units that are too small:
    if (remainder < VOLUME_UNITS[volIdx - big[2]][0]) {
      return this.pluralOrArticle(numBig, adjective + big[1])
    }
    // Search for the best unit to pair with:
    let numBest = Math.floor(remainder / VOLUME_UNITS[volIdx - 1][0])
    let bestUnitIndex = volIdx - 1
    let bestUnitError = remainder - numBest * VOLUME_UNITS[volIdx - 1][0]
    for (
      let thirdUnitIndex = volIdx - 2;
      thirdUnitIndex > 0 && thirdUnitIndex > volIdx - big[2];
      --thirdUnitIndex
    ) {
      const third = VOLUME_UNITS[thirdUnitIndex]
      const numThird = Math.floor(remainder / third[0])
      // If we have a lot of the unit under consideration -- then stop. The exception is in
      // case of minims, where it may be normal to have a bunch of them; in that case, we print
      // drams if possible.
      if (numThird > 9 && thirdUnitIndex !== 1) {
        break
      }
      // We are using floor, so we can compare error diretly, without abs
      const thirdUnitError = remainder - numThird * third[0]
      if (thirdUnitError < 0.99 * bestUnitError) {
        numBest = numThird
        bestUnitIndex = thirdUnitIndex
        bestUnitError = thirdUnitError
      }
    }
    return this.bigAndSmall(
      adjective,
      numBig,
      big,
      numBest,
      VOLUME_UNITS[bestUnitIndex]
    )
  }

  /**
   * Format a small quantity that is less than the smallest minim; this is done without adjective
   * @param {number} x
   */
  formatMetric(x) {
    // The jump from metric to minim is sudden. Small values (< 10) get more decimal places
    // because that's usually something like sacrifice multiplier
    if (x < 1000) {
      return `${x < 10 || x === Math.round(x) ? x.toFixed(2) : x.toFixed(0)}pL`
    }
    if (x < 1e6) {
      return `${(x / 1000).toPrecision(4)}nL`
    }
    return `${(x / 1e6).toPrecision(4)}μL`
  }

  /**
   * Handles cases involving everything up to ounces; in the case of ounces it may
   * return nothing, in which case, the normal code path should be used.
   * @param {string} adjective will be attached to unit
   * @param {number} x value to be formatted
   * @param {number} volIdx index into VOLUME_UNITS for x (largest unit smaller than x)
   * @returns {string?} the formatted output, if within the capabilities of this function
   */
  checkSmallUnits(adjective, x, volIdx) {
    const big = VOLUME_UNITS[volIdx]
    // Check for some minims short of a small unit break:
    if (volIdx <= 3 && x + 9.5 * MINIMS[0] > VOLUME_UNITS[volIdx + 1][0]) {
      return this.almostOrShortOf(
        x,
        adjective,
        1,
        VOLUME_UNITS[volIdx + 1],
        MINIMS
      )
    }
    // Minims to drams. This goes:
    // a minim
    // 1.5 minims                  <-- we don't do this with larger units
    // 10 minims ... 50 minims
    // 9 minims short of a dram
    // a minim short of a dram
    // almost a dram               <-- handled above
    if (volIdx === 1) {
      const deciMinims = Math.round((x * 10) / big[0])
      if (deciMinims === 10) {
        return this.addArticle(adjective + big[1])
      }
      const places = deciMinims < 100 ? 1 : 0
      return `${(deciMinims / 10).toFixed(places)} ${adjective}${big[1]}s`
    }
    if (volIdx === 2) {
      const numBig = Math.floor(x / big[0])
      const remainder = x - numBig * big[0]
      if (remainder > 50.5 * MINIMS[0]) {
        // 9 minims short of a dram
        return this.almostOrShortOf(x, adjective, numBig + 1, big, MINIMS)
      }
      // For example, a dram and 15 minims
      const numSmall = Math.round(remainder / MINIMS[0])
      return this.bigAndSmall(adjective, numBig, big, numSmall, MINIMS)
    }
    return undefined
  }

  /**
   * Search for the largest unit smaller than x
   * @param {number} x
   * @returns {number} index into VOLUME_UNITS
   */
  findVolumeUnit(x) {
    let low = 0
    let high = VOLUME_UNITS.length
    let guess = 0
    while (high - low > 1) {
      guess = Math.floor((low + high) / 2)
      if (VOLUME_UNITS[guess][0] > x) {
        high = guess
      } else {
        low = guess
      }
    }
    return low
  }

  // Try to do "almost a big thing" or "a thing short of a big thing", based on the setting
  // we have for rounding error units; may return nothing if we are not actually near something
  // eslint-disable-next-line max-params
  checkAlmost(adjective, x, numBig, bigIndex) {
    const big = VOLUME_UNITS[bigIndex]
    if (x + VOLUME_UNITS[bigIndex - big[2]][0] >= big[0]) {
      return this.almost(adjective, numBig + 1, big)
    }
    const small = VOLUME_UNITS[bigIndex + 1 - big[2]]
    if (x + small[0] >= big[0]) {
      return this.shortOf(adjective, numBig + 1, big, 1, small)
    }
    return undefined
  }

  // eslint-disable-next-line max-params
  bigAndSmall(adjective, numBig, big, numSmall, small) {
    const bigStr = this.pluralOrArticle(numBig, adjective + big[1])
    return numSmall === 0
      ? bigStr
      : `${bigStr} and ${this.pluralOrArticle(numSmall, small[1])}`
  }

  almost(adjective, numBig, big) {
    return `almost ${this.pluralOrArticle(numBig, adjective + big[1])}`
  }

  // eslint-disable-next-line max-params
  almostOrShortOf(x, adjective, numBig, big, small) {
    const short = Math.round((numBig * big[0] - x) / small[0])
    return short === 0
      ? this.almost(adjective, numBig, big)
      : this.shortOf(adjective, numBig, big, short, small)
  }

  // eslint-disable-next-line max-params
  shortOf(adjective, numBig, big, numSmall, small) {
    return `${this.pluralOrArticle(
      numSmall,
      small[1]
    )} short of ${this.pluralOrArticle(numBig, adjective + big[1])}`
  }

  pluralOrArticle(num, str) {
    return num === 1 ? this.addArticle(str) : `${num} ${str}s`
  }

  addArticle(x) {
    return (VOWELS.has(x[0]) ? "an " : "a ") + x
  }
}
