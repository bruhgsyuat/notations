import { Notation } from "./notation"

const DOT_DIGITS =
  "⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿" +
  "⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿" +
  "⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿" +
  "⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿"

export class DotsNotation extends Notation {
  get name() {
    return "Dots"
  }

  get infinite() {
    return "⣿⠀⣿"
  }

  formatUnder1000(value) {
    return this.dotify(value * 254)
  }

  formatDecimal(value) {
    if (value.lt(16387063.9980315)) {
      return this.dotify(value.toNumber() * 254)
    }
    const log = value.log(254)
    const exponent = Math.floor(log - 2)
    const mantissa = 254 ** (log - exponent)
    return `${this.dotify(exponent)}⣿${this.dotify(mantissa * 254)}`
  }

  dotify(rawValue, pad = false) {
    const value = Math.round(rawValue)
    if (!pad && value < 254) {
      return DOT_DIGITS[value + 1]
    }
    if (value < 64516) {
      return (
        DOT_DIGITS[Math.floor(value / 254) + 1] + DOT_DIGITS[(value % 254) + 1]
      )
    }
    return (
      this.dotify(Math.floor(value / 64516)) + this.dotify(value % 64516, true)
    )
  }
}
