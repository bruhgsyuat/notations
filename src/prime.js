import Decimal from "break_infinity.js"
import { Notation } from "./notation"

// The maximum number we can reliably find all prime factors for.
const MAX_INT = 10006
const MAX_INT_DECIMAL = new Decimal(MAX_INT)
const MAX_INT_LOG_10 = Math.log10(MAX_INT)

// List of primes from 2-9973, because that's how many we check for.
const PRIMES = []
const visitedMarks = new Array(MAX_INT).fill(false)
const sieveLimit = Math.ceil(Math.sqrt(MAX_INT))
for (let number = 2; number < sieveLimit; number++) {
  if (visitedMarks[number]) {
    continue
  }
  PRIMES.push(number)
  for (let mark = number; mark <= MAX_INT; mark += number) {
    visitedMarks[mark] = true
  }
}
for (let number = sieveLimit; number < MAX_INT; number++) {
  if (!visitedMarks[number]) {
    PRIMES.push(number)
  }
}

const LAST_PRIME_INDEX = PRIMES.length - 1
const MAX_PRIME = PRIMES[LAST_PRIME_INDEX]
// Unicode characters for exponents ranging 0 - 13.
const EXPONENT_CHARACTERS = [
  "\u2070",
  "\u00B9",
  "\u00B2",
  "\u00B3",
  "\u2074",
  "\u2075",
  "\u2076",
  "\u2077",
  "\u2078",
  "\u2079",
  "\u00B9\u2070",
  "\u00B9\u00B9",
  "\u00B9\u00B2",
  "\u00B9\u00B3"
]

export class PrimeNotation extends Notation {
  get name() {
    return "Prime"
  }

  get infinite() {
    return "Primefinity?"
  }

  formatUnder1000(value) {
    return this.primify(new Decimal(value))
  }

  formatDecimal(value) {
    return this.primify(value)
  }

  primify(value) {
    // We take the number and do 1 of 4 things depending on how big it is.
    // If the number is less than 0, we primify its negation and add a minus sign
    // to the start.
    // If the number is smaller than maxInt, 10006, then we just find the primes and
    // format them.
    // If not we need a way of representing the number, using only primes of course.
    // So we derive an exponent that will keep the base under the maxInt, then
    // we derive prime factors for both and format them as (base)^(exponent).
    // If the number is greater than 1e10006, we need to again format it differently.
    // So we increase our stack size to three, and repeat the process above from
    // top down.
    if (value.lte(MAX_INT_DECIMAL)) {
      const floored = Math.floor(value.toNumber())
      if (floored === 0) {
        return "0"
      }
      if (floored === 1) {
        return "1"
      }
      return this.formatFromList(this.primesFromInt(floored))
    }
    let exp = value.log10() / MAX_INT_LOG_10
    let base = MAX_INT ** (exp / Math.ceil(exp))
    if (exp <= MAX_INT) {
      return this.formatBaseExp(base, exp)
    }
    const exp2 = Math.log10(exp) / Math.log10(MAX_INT)
    const exp2Ceil = Math.ceil(exp2)
    exp = MAX_INT ** (exp2 / exp2Ceil)
    base = MAX_INT ** (exp / Math.ceil(exp))
    const exp2List = this.primesFromInt(exp2Ceil)
    const formatedExp2 =
      exp2List.length === 1
        ? EXPONENT_CHARACTERS[exp2List[0]]
        : `^(${this.formatFromList(exp2List)})`
    return this.formatBaseExp(base, exp) + formatedExp2
  }

  formatBaseExp(base, exp) {
    const formatedBase = this.formatFromList(
      this.primesFromInt(Math.floor(base))
    )
    const formatedExp = this.formatFromList(this.primesFromInt(Math.ceil(exp)))
    return `(${formatedBase})^(${formatedExp})`
  }

  formatFromList(list) {
    // Formats an array of prime numbers such that all like pairs are combined,
    // they are then raised to an exponent signifying how many times the value apears.
    // Finally multiplication signs are put between all values.
    const out = []
    let last = 0
    let count = 0
    for (let i = 0; i < list.length; i++) {
      if (list[i] === last) {
        count++
      } else {
        if (last > 0) {
          if (count > 1) {
            out.push(`${last}${EXPONENT_CHARACTERS[count]}`)
          } else {
            out.push(last)
          }
        }
        last = list[i]
        count = 1
      }
      if (i === list.length - 1) {
        if (count > 1) {
          out.push(`${list[i]}${EXPONENT_CHARACTERS[count]}`)
        } else {
          out.push(list[i])
        }
      }
    }
    return out.join("\u00D7")
  }

  findGreatestLtePrimeIndex(value) {
    // Lte stands for "less than or equal"
    if (value >= MAX_PRIME) {
      return LAST_PRIME_INDEX
    }
    let min = 0
    let max = LAST_PRIME_INDEX
    while (max !== min + 1) {
      const middle = Math.floor((max + min) / 2)
      const prime = PRIMES[middle]
      if (prime === value) {
        return middle
      }
      if (value < prime) {
        max = middle
      } else {
        min = middle
      }
    }
    return min
  }

  primesFromInt(value) {
    const factors = []
    let factoringValue = value
    while (factoringValue !== 1) {
      const ltePrimeIndex = this.findGreatestLtePrimeIndex(factoringValue)
      const ltePrime = PRIMES[ltePrimeIndex]
      if (ltePrime === factoringValue) {
        factors.push(factoringValue)
        break
      }
      // Search for greatest prime that is lesser than factored / 2, because
      // all greater values won't be factors anyway
      const halfFactoring = factoringValue / 2
      let primeIndex = this.findGreatestLtePrimeIndex(halfFactoring)
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let factor
      while (factor === undefined) {
        const prime = PRIMES[primeIndex--]
        if (factoringValue % prime === 0) {
          factor = prime
        }
      }
      factoringValue /= factor
      factors.push(factor)
    }
    return factors.reverse()
  }
}
