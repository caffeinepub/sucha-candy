# Sucha Candy

## Current State
Match-3 game with 8x8 board, 500 levels, special candies (striped-h, striped-v, colorbomb), fruit emojis, scoring (20/50/80), bonus chance, home screen, level select screen.

## Requested Changes (Diff)

### Add
- Special combo: when a Striped Candy (striped-h or striped-v) is swapped with a Color Bomb (colorbomb), trigger a powerful blast:
  - All candies of the striped candy's color get destroyed
  - Each destroyed candy also clears its entire row or column (like striped)
  - +100 bonus score for this combo
- Color Bomb + Color Bomb combo: clears the entire board, +100 bonus score
- Animated blast visual effect on the board during these combos

### Modify
- `gameLogic.ts`: Add `checkSpecialCombo()` function called in `selectCell` before normal swap processing
- `useGameState.ts`: Detect special combo swap before running normal match logic; if special combo, run the blast instead
- `constants.ts`: Add COMBO_BLAST_SCORE = 100

### Remove
- Nothing removed

## Implementation Plan
1. Add COMBO_BLAST_SCORE = 100 to constants.ts
2. Add `applySpecialCombo()` to gameLogic.ts: detects striped+colorbomb or colorbomb+colorbomb combos and returns affected positions + score
3. In useGameState.ts selectCell: after swap, check if swapped cells form a special combo; if yes, animate blast and skip normal match cascade
4. Add blast animation state to trigger visual feedback in GameBoard/CandyCell
