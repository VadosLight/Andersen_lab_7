"use strict";
import Solver from "./Solver.js";

document.querySelector(".calculator").addEventListener("click", (e) => {

  if (e.target.classList.contains("calculator__button")) {
    console.log(e.target.innerText);
  }
});
