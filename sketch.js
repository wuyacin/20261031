
let screen = "start";

const QUESTION_TIME = 20;

let current = 0;
let timeLeft = QUESTION_TIME;
let startTime = 0;

let correctQuestions = new Set();
let wrongQuestions = new Set();

let feedback = "";
let feedbackStart = 0;

let choices = [];
let buttons = [];
let selectedAnswer = null;

let levelStartTime = 0;

const questions = [
  { a: 12, op: "+", b: 5, ans: 17, choices: [15, 16, 17, 18] },
  { a: 10, op: "+", b: 4, ans: 14, choices: [12, 14, 15, 16] },
  { a: 8, op: "+", b: 7, ans: 15, choices: [14, 15, 16, 17] },
  { a: 16, op: "-", b: 5, ans: 11, choices: [10, 11, 12, 13] },
  { a: 9, op: "+", b: 3, ans: 12, choices: [11, 12, 13, 14] },

  { a: 13, op: "+", b: 7, ans: 20, choices: [17, 18, 19, 20] },
  { a: 20, op: "-", b: 6, ans: 14, choices: [13, 14, 15, 16] },
  { a: 9, op: "+", b: 8, ans: 17, choices: [15, 16, 17, 18] },
  { a: 17, op: "-", b: 9, ans: 8, choices: [7, 8, 9, 10] },
  { a: 6, op: "+", b: 11, ans: 17, choices: [15, 16, 17, 18] },

  { a: 18, op: "+", b: 2, ans: 20, choices: [17, 18, 19, 20] },
  { a: 20, op: "-", b: 17, ans: 3, choices: [2, 3, 4, 5] },
  { a: 8, op: "+", b: 12, ans: 20, choices: [17, 18, 19, 20] },
  { a: 15, op: "-", b: 9, ans: 6, choices: [4, 6, 7, 8] },
  { a: 19, op: "-", b: 8, ans: 11, choices: [9, 10, 11, 12] }
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("sans-serif");
  rectMode(CORNER);
  textAlign(CENTER, CENTER);
}

function draw() {
  drawBackground();

  if (screen === "start") {
    drawStart();
  } else if (screen === "game") {
    drawQuestion();
  } else if (screen === "level") {
    drawLevel();
  } else if (screen === "result") {
    drawResult();
  }
}

// 背景
function drawBackground() {
  background("#fff0f5");

  noStroke();

  for (let i = 0; i < 35; i++) {
    let x = (i * 137) % width;
    let y = (i * 89) % height;

    fill(255, 255, 255, 130);
    circle(x, y, 5);
  }

  fill("#ffffff");
  rect(0, 0, width, 75);

  fill("#d78fae");
  textSize(25);
  textStyle(BOLD);
  text("🍬 數學小偵探 🍬", width / 2, 38);

  textStyle(NORMAL);
}

// 共用面板
function drawPanel(x, y, w, h) {
  noStroke();
  fill(230, 190, 210, 70);
  rect(x + 5, y + 6, w, h, 25);

  fill("#ffffff");
  rect(x, y, w, h, 25);
}

// 共用按鈕
function drawButton(x, y, w, h, label, color) {
  noStroke();
  fill("#e8c4d5");
  rect(x, y + 5, w, h, 18);

  fill(color);
  rect(x, y, w, h, 18);

  fill("#ffffff");
  textSize(22);
  textStyle(BOLD);
  text(label, x + w / 2, y + h / 2);

  textStyle(NORMAL);
}

// 開始畫面
function drawStart() {
  let pw = min(width - 40, 550);
  let ph = 390;
  let x = (width - pw) / 2;
  let y = (height - ph) / 2;

  drawPanel(x, y, pw, ph);

  fill("#d78fae");
  textSize(34);
  textStyle(BOLD);
  text("數學小偵探", width / 2, y + 75);

  fill("#777777");
  textSize(19);
  textStyle(NORMAL);
  text("準備好接受數學挑戰了嗎？", width / 2, y + 135);
  text("共 3 關，每關 5 題", width / 2, y + 180);
  text("答對題目就能繼續前進！", width / 2, y + 220);

  drawButton(
    width / 2 - 100,
    y + 280,
    200,
    60,
    "開始遊戲",
    "#dca6c0"
  );
}

// 開始遊戲
function startGame() {
  current = 0;

  correctQuestions.clear();
  wrongQuestions.clear();

  selectedAnswer = null;

  startQuestion();
}

// 開始新題目
function startQuestion() {
  screen = "game";

  feedback = "";
  timeLeft = QUESTION_TIME;
  startTime = millis();

  selectedAnswer = null;
  choices = shuffle([...questions[current].choices]);

  buttons = [];
}

// 記錄答錯題目
function recordWrongQuestion() {
  wrongQuestions.add(current);
  correctQuestions.delete(current);
}

// 答題判斷
function checkAnswer(answer) {
  if (screen !== "game") return;
  if (feedback === "correct") return;

  let q = questions[current];

  if (answer === q.ans) {

    // 曾經答錯的題目，不會再改成答對
    if (!wrongQuestions.has(current)) {
      correctQuestions.add(current);
    }

    feedback = "correct";
    feedbackStart = millis();

  } else {

    // 只要曾經答錯，就永久記錄
    recordWrongQuestion();

    feedback = "wrong";
    feedbackStart = millis();
  }
}

// 題目畫面
function drawQuestion() {

  // 只有尚未作答時才倒數
  if (feedback === "") {
    timeLeft = max(
      0,
      QUESTION_TIME - floor((millis() - startTime) / 1000)
    );

    // 時間到也算答錯
    if (timeLeft <= 0) {
      recordWrongQuestion();

      feedback = "wrong";
      feedbackStart = millis();
    }
  }

  let q = questions[current];

  let pw = min(width - 30, 650);
  let ph = min(height - 105, 600);
  let x = (width - pw) / 2;
  let y = max(85, (height - ph) / 2 + 35);

  drawPanel(x, y, pw, ph);

  // 關卡與題數
  let level = floor(current / 5) + 1;
  let questionNumber = current % 5 + 1;

  fill("#d78fae");
  textSize(20);
  textStyle(BOLD);
  text("第 " + level + " 關", width / 2, y + 35);

  fill("#888888");
  textSize(16);
  textStyle(NORMAL);
  text("第 " + questionNumber + " / 5 題", width / 2, y + 68);

  // 進度條
  let barW = pw - 80;

  noStroke();
  fill("#f5e2eb");
  rect(x + 40, y + 90, barW, 12, 10);

  fill("#dca6c0");
  rect(x + 40, y + 90, barW * ((current + 1) / 15), 12, 10);

  // 倒數時間
  fill(timeLeft <= 5 ? "#e58b91" : "#d78fae");
  textSize(19);
  textStyle(BOLD);
  text("⏰ " + timeLeft + " 秒", width / 2, y + 135);

  // 題目
  fill("#555555");
  textSize(min(42, width / 12));
  text(
    q.a + " " + q.op + " " + q.b + " = ?",
    width / 2,
    y + 195
  );

  // 答錯提示
  if (feedback === "wrong") {
    fill("#e58b91");
    textSize(18);
    textStyle(BOLD);
    text("答錯囉！再想一想，試試看！", width / 2, y + 235);

    drawCandyHint(q);

  } else if (feedback === "correct") {
    fill("#8cbf9b");
    textSize(22);
    textStyle(BOLD);
    text("答對了！太棒了！🎉", width / 2, y + 235);

    if (millis() - feedbackStart > 1100) {
      nextQuestion();
      return;
    }

  } else {
    fill("#999999");
    textSize(16);
    text("請選擇正確答案", width / 2, y + 235);
  }

  drawOptions(x, y, pw, ph);
}

// 糖果提示
function drawCandyHint(q) {
  let centerX = width / 2;
  let baseY = min(height - 185, height / 2 + 125);

  fill("#a987d5");
  textSize(14);
  textStyle(BOLD);
  text("可以利用糖果數量幫助計算喔！", centerX, baseY - 35);

  if (q.op === "+") {

    // 加法：顯示兩組完整糖果
    drawCandyGroup(q.a, centerX - 115, baseY, 0);

    fill("#d78fae");
    textSize(26);
    textStyle(BOLD);
    text("+", centerX, baseY);

    drawCandyGroup(q.b, centerX + 115, baseY, 0);

  } else {

    // 減法：被減掉的糖果會變成灰色
    drawCandyGroup(q.a, centerX, baseY, q.b);

    fill("#888888");
    textSize(14);
    textStyle(NORMAL);
    text("灰色糖果代表拿走的數量", centerX, baseY + 48);
  }
}

// 畫糖果：完整顯示數量
function drawCandyGroup(count, centerX, y, removed = 0) {
  let candySize = 14;
  let spacing = 20;
  let perRow = 10;

  for (let i = 0; i < count; i++) {

    // 每排最多 10 顆
    let col = i % perRow;
    let row = floor(i / perRow);

    // 計算目前這一排實際有幾顆
    let rowCount = min(perRow, count - row * perRow);

    // 每一排分別置中
    let x = centerX + (col - (rowCount - 1) / 2) * spacing;
    let candyY = y + row * spacing;

    // 最後 removed 顆變成灰色
    let isRemoved = i >= count - removed;

    if (isRemoved) {
      fill("#cccccc");
    } else {
      fill("#f2a8c4");
    }

    noStroke();
    circle(x, candyY, candySize);

    // 糖果上的小亮點
    fill(255, 255, 255, 180);
    circle(x - 2, candyY - 2, 3);
  }
}

// 答案選項
function drawOptions(x, y, pw, ph) {
  buttons = [];

  let gap = 15;
  let bw = min(210, (pw - 70) / 2);
  let bh = 55;

  let startX = width / 2 - bw - gap / 2;
  let startY = y + ph - 145;

  for (let i = 0; i < choices.length; i++) {
    let col = i % 2;
    let row = floor(i / 2);

    let bx = startX + col * (bw + gap);
    let by = startY + row * (bh + 12);

    let color = "#bcd7f3";

    if (
      feedback === "wrong" &&
      choices[i] === selectedAnswer
    ) {
      color = "#e58b91";
    }

    if (
      feedback === "correct" &&
      choices[i] === selectedAnswer
    ) {
      color = "#a987d5";
    }

    // 答錯左右跳動
    let offsetX = 0;
    let offsetY = 0;

    if (
      feedback === "wrong" &&
      choices[i] === selectedAnswer
    ) {
      offsetX = sin(millis() / 35) * 5;
    }

    // 答對上下跳動
    if (
      feedback === "correct" &&
      choices[i] === selectedAnswer
    ) {
      offsetY = sin(millis() / 70) * 5;
    }

    drawButton(
      bx + offsetX,
      by + offsetY,
      bw,
      bh,
      choices[i],
      color
    );

    buttons.push({
      x: bx,
      y: by,
      w: bw,
      h: bh,
      answer: choices[i]
    });
  }
}

// 前往下一題
function nextQuestion() {
  selectedAnswer = null;

  if (current === 14) {
    finishGame();
    return;
  }

  // 每 5 題顯示關卡完成畫面
  if (current % 5 === 4) {
    screen = "level";
    levelStartTime = millis();
    return;
  }

  current++;
  startQuestion();
}

// 關卡完成
function drawLevel() {
  let pw = min(width - 40, 500);
  let ph = 300;
  let x = (width - pw) / 2;
  let y = (height - ph) / 2;

  drawPanel(x, y, pw, ph);

  fill("#d78fae");
  textSize(32);
  textStyle(BOLD);

  let completedLevel = floor(current / 5) + 1;

  text("第 " + completedLevel + " 關完成！", width / 2, y + 90);

  fill("#888888");
  textSize(20);
  textStyle(NORMAL);
  text("太棒了！繼續挑戰下一關吧！", width / 2, y + 155);

  fill("#e6a9c2");
  textSize(35);
  text("🍬 ⭐ 🍬", width / 2, y + 210);

  if (millis() - levelStartTime > 1600) {
    current++;
    startQuestion();
  }
}

// 結束遊戲
function finishGame() {
  screen = "result";
}

// 結果畫面
function drawResult() {

  // 曾經答錯的題目數
  let wrongCount = wrongQuestions.size;

  // 其餘題目全部算答對
  let correctCount = 15 - wrongCount;

  let pw = min(width - 40, 550);
  let ph = 430;
  let x = (width - pw) / 2;
  let y = (height - ph) / 2;

  drawPanel(x, y, pw, ph);

  fill("#d78fae");
  textSize(32);
  textStyle(BOLD);
  text("🎉 挑戰完成！", width / 2, y + 65);

  fill("#777777");
  textSize(19);
  textStyle(NORMAL);
  text("你的答題成績", width / 2, y + 120);

  // 答對題數
  fill("#8cbf9b");
  textSize(25);
  textStyle(BOLD);
  text("答對題數：" + correctCount + " 題", width / 2, y + 180);

  // 答錯題數
  fill("#e58b91");
  textSize(25);
  text("答錯題數：" + wrongCount + " 題", width / 2, y + 230);

  // 總題數
  fill("#888888");
  textSize(18);
  textStyle(NORMAL);
  text("總題數：15 題", width / 2, y + 275);

  // 統計加總
  text(
    correctCount + " + " + wrongCount + " = 15",
    width / 2,
    y + 310
  );

  fill("#d78fae");
  textSize(18);
  textStyle(BOLD);

  if (correctCount === 15) {
    text("太厲害了！全部答對！", width / 2, y + 345);
  } else if (correctCount >= 10) {
    text("表現很棒，繼續加油！", width / 2, y + 345);
  } else {
    text("再練習一次，你會越來越進步！", width / 2, y + 345);
  }

  drawButton(
    width / 2 - 100,
    y + 375,
    200,
    45,
    "重新挑戰",
    "#dca6c0"
  );
}

// 滑鼠點擊
function mousePressed() {
  if (screen === "start") {
    let ph = 390;
    let y = (height - ph) / 2;

    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > y + 280 &&
      mouseY < y + 340
    ) {
      startGame();
    }
  }

  else if (screen === "game") {
    if (feedback === "correct") return;

    for (let b of buttons) {
      if (
        mouseX >= b.x &&
        mouseX <= b.x + b.w &&
        mouseY >= b.y &&
        mouseY <= b.y + b.h
      ) {
        selectedAnswer = b.answer;
        checkAnswer(b.answer);
        break;
      }
    }
  }

  else if (screen === "result") {
    let ph = 430;
    let y = (height - ph) / 2;

    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > y + 375 &&
      mouseY < y + 420
    ) {
      selectedAnswer = null;
      startGame();
    }
  }
}

// 視窗大小改變
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

