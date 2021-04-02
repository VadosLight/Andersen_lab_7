export default class Solver {
  static regBrkt = new RegExp(String.raw`\(([^\(|\)]+)\)`);
  static regReplaceMinusOnPlusMinus = new RegExp(
    String.raw`(?!^)(-)(?=\d(?:\.\d)?(?:\*|\/))`,
    "g"
  );
  static regMultDiv = new RegExp(String.raw`\*|\/`, "g");
  static regSumMin = new RegExp(
    String.raw`\b(?:(?!^|\*|\/))-(?!\d\/|\*)|\b(?:(?!^|\*|\/))\+`,
    "g"
  );
  static regCorrectOperand = new RegExp(
    String.raw`(?:[\/\*\+\-\.][\/\*\+\-\.])|(?:^[\*\/\+])|(?:[\/\*\-\+]$)|[a-zA-zа-яА-Я]|(?:\.[\d]*\.)|(?:\.[\*\/\-\+]*\.)|(?:\d\(|\)\d|\.\(|\)\.)|\(\)`,
    "g"
  );

  constructor() {
    if (this instanceof Solver) {
      throw Error("A static class cannot be instantiated.");
    }
  }

  static solveExpression(expr) {
    expr = this.prepareExpr(expr);
    if (!this.isValidExpr(expr)) return "Invalid";

    while (expr.match(this.regBrkt)) {
      const subExprMatch = expr.match(this.regBrkt);
      const subExpr = subExprMatch[1];
      expr = expr.replace(subExprMatch[0], this.solvePrimitive(subExpr));
      expr = this.prepareExpr(expr);
    }

    return this.solvePrimitive(expr);
  }

  static solvePrimitive(expr) {
    expr = expr.replace(this.regReplaceMinusOnPlusMinus, "+-");
    let arrMulDiv = expr.match(this.regMultDiv) || false;
    let arrPlusMinus = expr.match(this.regSumMin) || false;

    if (arrPlusMinus && arrMulDiv) {
      let arrSubExpr = expr.split(this.regSumMin);

      for (let i in arrSubExpr) {
        arrSubExpr[i] = this.solveMulDiv(arrSubExpr[i]);
      }
      return this.solvePlusMinus(arrSubExpr, arrPlusMinus);
    } else if (arrPlusMinus) {
      return this.solvePlusMinus(expr);
    } else if (arrMulDiv) {
      return this.solveMulDiv(expr);
    } else if (parseFloat(expr)) {
      return parseFloat(expr);
    }

    return 0;
  }

  static solvePlusMinus(...args) {
    let numbers, actions;

    if (args[1]) {
      numbers = args[0];
      actions = args[1];
    } else {
      numbers = args[0].split(this.regSumMin);
      actions = args[0].match(this.regSumMin) || [];
    }

    numbers = numbers.map((e) => parseFloat(e));

    for (let act of actions) {
      if (act === "+") {
        numbers[1] = numbers[0] + numbers[1];
        numbers.shift();
      } else if (act === "-") {
        numbers[1] = numbers[0] - numbers[1];
        numbers.shift();
      }
    }
    return numbers[0] || 0;
  }

  static solveMulDiv(...args) {
    let numbers, actions;

    if (args[1]) {
      numbers = args[0];
      actions = args[1];
    } else {
      numbers = args[0].split(this.regMultDiv);
      actions = args[0].match(this.regMultDiv) || [];
    }

    numbers = numbers.map((e) => {
      return parseFloat(e);
    });

    for (let act of actions) {
      if (act === "*") {
        numbers[1] = numbers[0] * numbers[1];
        numbers.shift();
      } else if (act === "/") {
        numbers[1] = numbers[0] / numbers[1];
        numbers.shift();
      }
    }
    return numbers[0] || 0;
  }

  static prepareExpr(expr) {
    const minMin = new RegExp(String.raw`--`, "g");
    const plusMin = new RegExp(String.raw`\+-`, "g");
    const minPlus = new RegExp(String.raw`-\+`, "g");
    const plusPlus = new RegExp(String.raw`\+\+`, "g");
    const emptyBrackets = new RegExp(String.raw`\(\)`, "g");

    expr = expr.replace(/$/gm, "");
    expr = expr.replace(/\s/g, "");
    expr = expr.replace(/,/g, ".");

    while (
      minMin.test(expr) ||
      plusMin.test(expr) ||
      minPlus.test(expr) ||
      plusPlus.test(expr) ||
      emptyBrackets.test(expr)
    ) {
      expr = expr.replace(minMin, "+");
      expr = expr.replace(plusMin, "-");
      expr = expr.replace(minPlus, "-");
      expr = expr.replace(plusPlus, "+");
      expr = expr.replace(emptyBrackets, "");
    }

    return expr;
  }

  static isValidExpr(expr) {
    expr = this.prepareExpr(expr);
    const isValidOperand = !(expr.match(this.regCorrectOperand) || false);
    return isValidOperand && this.isValidBrackets(expr);
  }

  static isValidBrackets(expr) {
    let count = 0;
    for (let i = 0; i < expr.length; i++) {
      if (expr[i] == "(") {
        count++;
      } else if (expr[i] == ")") {
        if (count == 0) {
          return false;
        } else {
          count--;
        }
      }
    }

    if (count == 0) {
      return true;
    }

    return false;
  }
}
