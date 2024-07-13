import Decimal from "break_infinity.js"
import { Notation } from "./notation"
import { ScientificNotation } from "./scientific"
import { LettersNotation } from "./letters"
import { StandardNotation } from "./standard"
import { LogarithmNotation } from "./logarithm"
import { BracketsNotation } from "./brackets"
import { InfinityNotation } from "./infinity"
import { RomanNotation } from "./roman"
import { DotsNotation } from "./dots"
import { ZalgoNotation } from "./zalgo"
import { HexNotation } from "./hex"
import { ImperialNotation } from "./imperial"
import { ClockNotation } from "./clock"
import { PrimeNotation } from "./prime"
import { BarNotation } from "./bar"
import { ShiNotation } from "./shi"
import { BlobsNotation } from "./blobs"
import { BlindNotation } from "./blind"

const notationList = [
  new ScientificNotation(),
  new LettersNotation(),
  new StandardNotation(),
  new LogarithmNotation(),
  new BracketsNotation(),
  new InfinityNotation(),
  new RomanNotation(),
  new DotsNotation(),
  new ZalgoNotation(),
  new HexNotation(),
  new ImperialNotation(),
  new ClockNotation(),
  new PrimeNotation(),
  new BarNotation(),
  new ShiNotation(),
  new BlobsNotation(),
  new BlindNotation()
]

export class AllNotation extends Notation {
  get name() {
    return "ALL"
  }

  formatNegativeUnder1000(value, places) {
    return this.formatDecimal(new Decimal(-value), places)
  }

  formatUnder1000(value, places) {
    return this.formatDecimal(new Decimal(value), places)
  }

  formatNegativeDecimal(value, places) {
    return this.formatDecimal(new Decimal(-value), places)
  }

  formatDecimal(value, places) {
    // eslint-disable-next-line newline-per-chained-call
    const index = Math.floor(
      Math.log2(
        value
          .abs()
          .plus(2)
          .log2()
      )
    )
    const notation = notationList[index % notationList.length]
    return notation.format(value, places, places)
  }
}
