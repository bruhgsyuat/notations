import { CustomNotation } from "./custom"

const EMOJI = [
  "😠",
  "🎂",
  "🎄",
  "💀",
  "🍆",
  "👪",
  "🌈",
  "💯",
  "🍦",
  "🎃",
  "💋",
  "😂",
  "🌙",
  "⛔",
  "🐙",
  "💩",
  "❓",
  "☢",
  "🙈",
  "👍",
  "☂",
  "✌",
  "⚠",
  "❌",
  "😋",
  "⚡"
]

export class EmojiNotation extends CustomNotation {
  constructor() {
    super(EMOJI)
  }

  get name() {
    return "Emoji"
  }
}
