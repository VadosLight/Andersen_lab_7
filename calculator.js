"use strict";
import Solver from "./Solver.js";

const inputField = document.getElementById("calculator__input");
const arrNums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const arrSym = ["*", "/", "+", "-", ".", "(", ")"];

document.querySelector(".calculator").addEventListener("click", (e) => {
  if (e.target.classList.contains("calculator__button")) {
    processingButton(e.target.innerText);
  }
});

document.addEventListener("keydown", (e) => {
  if (arrNums.indexOf(e.key) > -1 || arrSym.indexOf(e.key) > -1) {
    processingButton(e.key);
  } else if (e.code === "Backspace") {
    processingButton("del");
  } else if (e.key === "Enter") {
    processingButton("=");
  }
});

function processingButton(val) {
  const expr = inputField.value;

  if (expr === "Infinity" || expr === "Invalid") inputField.value = "";

  if (val === "del" && expr.length > 0) {
    inputField.value = expr.slice(0, -1);
  } //
  else if (arrNums.indexOf(val) > -1) {
    inputField.value += val;
  } //
  else if (arrSym.indexOf(val) > -1) {
    inputField.value += val;
  } //
  else if (val === "=" && expr.length > 0) {
    if (Solver.isValidExpr(expr)) {
      inputField.value = Intl.NumberFormat("en", {
        maximumFractionDigits: 8,
      }).format(Solver.solveExpression(expr));
    } else {
      inputField.value = "Invalid";
    }
  }
}
