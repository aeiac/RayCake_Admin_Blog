<template>
  <div class="minesweeper">
    <h2>扫雷小游戏</h2>
    <div class="board">
      <div
        v-for="(row, r) in board"
        :key="r"
        class="row"
      >
        <div
          v-for="(cell, c) in row"
          :key="c"
          class="cell"
          :class="{
            open: cell.isOpen,
            mine: cell.isOpen && cell.isMine,
            flag: cell.isFlagged
          }"
          @click.left.prevent="openCell(r, c)"
          @click.right.prevent="toggleFlag(r, c)"
          @contextmenu.prevent
        >
          <template v-if="cell.isOpen && !cell.isMine && cell.neighbor > 0">
            {{ cell.neighbor }}
          </template>
          <template v-if="cell.isFlagged">🚩</template>
          <template v-if="cell.isOpen && cell.isMine">💣</template>
        </div>
      </div>
    </div>
    <p v-if="gameOver">{{ gameResult }}</p>
    <button @click="reset">重新开始</button>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const rows = 10
const cols = 10
const mineCount = 15

const board = reactive([])
const gameOver = ref(false)
const gameResult = ref('')

function createBoard() {
  const arr = []
  for (let r = 0; r < rows; r++) {
    const row = []
    for (let c = 0; c < cols; c++) {
      row.push({
        isMine: false,
        isOpen: false,
        isFlagged: false,
        neighbor: 0
      })
    }
    arr.push(row)
  }
  return arr
}

// 随机布雷
function placeMines() {
  let placed = 0
  while (placed < mineCount) {
    const r = Math.floor(Math.random() * rows)
    const c = Math.floor(Math.random() * cols)
    if (!board[r][c].isMine) {
      board[r][c].isMine = true
      placed++
    }
  }
}

// 计算每格周围雷数
function calcNeighbors() {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],          [0, 1],
    [1, -1], [1, 0], [1, 1]
  ]

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) {
        board[r][c].neighbor = -1
        continue
      }
      let count = 0
      for (const [dx, dy] of directions) {
        const nr = r + dx
        const nc = c + dy
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (board[nr][nc].isMine) count++
        }
      }
      board[r][c].neighbor = count
    }
  }
}

function reset() {
  gameOver.value = false
  gameResult.value = ''
  const newBoard = createBoard()
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      board[r] ? (board[r][c] = newBoard[r][c]) : board.push(newBoard[r])
    }
  }
  placeMines()
  calcNeighbors()
}

// 递归打开空白区域
function floodFill(r, c) {
  if (
    r < 0 || r >= rows || c < 0 || c >= cols ||
    board[r][c].isOpen || board[r][c].isFlagged
  ) return
  board[r][c].isOpen = true
  if (board[r][c].neighbor === 0) {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1], [1, 0], [1, 1]
    ]
    for (const [dx, dy] of directions) {
      floodFill(r + dx, c + dy)
    }
  }
}

function openCell(r, c) {
  if (gameOver.value) return
  const cell = board[r][c]
  if (cell.isOpen || cell.isFlagged) return

  cell.isOpen = true

  if (cell.isMine) {
    gameOver.value = true
    gameResult.value = '💥 游戏失败！踩到雷了'
    // 全部打开雷显示
    for (let rr = 0; rr < rows; rr++) {
      for (let cc = 0; cc < cols; cc++) {
        if (board[rr][cc].isMine) board[rr][cc].isOpen = true
      }
    }
    return
  }

  if (cell.neighbor === 0) {
    floodFill(r, c)
  }

  checkWin()
}

function toggleFlag(r, c) {
  if (gameOver.value) return
  const cell = board[r][c]
  if (cell.isOpen) return
  cell.isFlagged = !cell.isFlagged
  checkWin()
}

function checkWin() {
  // 只要所有非雷格子都打开即赢
  let safeCount = 0
  let openCount = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].isMine) safeCount++
      if (board[r][c].isOpen) openCount++
    }
  }
  if (openCount === safeCount) {
    gameOver.value = true
    gameResult.value = '🎉 你赢了！'
    // 自动标记所有雷
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c].isMine) board[r][c].isFlagged = true
      }
    }
  }
}

reset()
</script>

<style scoped>
.minesweeper {
  max-width: 360px;
  margin: 20px auto;
  text-align: center;
  user-select: none;
  font-family: "微软雅黑", Arial, sans-serif;
}
.board {
  display: grid;
  grid-template-columns: repeat(10, 32px);
  grid-template-rows: repeat(10, 32px);
  gap: 2px;
  margin-bottom: 10px;
  background: #a0a0a0;
  padding: 8px;
  border-radius: 8px;
}
.row {
  display: contents;
}
.cell {
  width: 32px;
  height: 32px;
  background-color: #d0d0d0;
  border-radius: 4px;
  line-height: 32px;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  user-select: none;
  text-align: center;
  box-shadow: inset 2px 2px 6px #f0f0f0,
    inset -2px -2px 6px #a0a0a0;
  transition: background-color 0.3s;
}
.cell.open {
  background-color: #f0f0f0;
  cursor: default;
  box-shadow: none;
}
.cell.open.mine {
  background-color: #f44336;
  color: white;
  font-size: 20px;
}
.cell.flag {
  color: red;
  font-size: 20px;
}
.cell:hover:not(.open):not(.flag) {
  background-color: #b0b0b0;
}
</style>
