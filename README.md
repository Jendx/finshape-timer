# ⏱️ Timer Plugin for Alfons

This plugin provides a flexible and reusable timer mechanism that can trigger actions at specific intervals. It supports pause, reset, and repeat functionality, making it suitable for use cases like countdowns, recurring triggers, or simple scheduling logic within Alfons.

## 🧩 Plugin Configuration

| Property      | Type     | Default | Description                                                                 |
|---------------|----------|---------|-----------------------------------------------------------------------------|
| `interval`    | `number` | `0`     | The delay (in milliseconds) before triggering the action.                  |
| `onInterval`  | `action` | —       | A reference to the action to execute when the timer ends.                  |
| `repeat`      | `boolean`| `false` | Whether the timer should repeat continuously after each interval.          |
| `pause`       | `boolean`| `false` | When true, pauses the timer and stores the remaining time to resume later. |
| `reset`       | `boolean`| `false` | When true, resets (clears) the active timer.                               |

---

## ▶️ Behavior Overview

### 🔁 Repeat
When `repeat` is enabled, the timer automatically restarts after each interval and continues indefinitely (unless paused or reset).

### ⏸ Pause / Resume
When `pause` is enabled:
- The current interval is paused.
- The remaining time is stored and used when resumed.

When `pause` is disabled again:
- The timer resumes using the stored remaining time.

### 🔄 Reset
When `reset` is enabled:
- Any active timer is cleared immediately.
- A new interval does **not** start automatically. You must trigger it again (e.g., via component re-render or external trigger).

## 🚀 Installation

### 1. Install via NPM

```bash
npm install @jendx/finshape-effects-timer
```

### 2. Local Development

+ pull the repo
+ instal PNPM
+ run `pnpm install & pnpm install ./ --save-dev`
+ run `pnpm sandbox`

If `pnpm sandbox` fails try installing bun globaly `npm install bun -g`

<img width="1918" height="916" alt="image" src="https://github.com/user-attachments/assets/dc7e679b-df0b-4d48-8608-c69f3c0d6fa6" />
