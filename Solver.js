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

  constructor() {
    if (this instanceof Solver) {
      throw Error("A static class cannot be instantiated.");
    }
  }

  static solveExpression(expr) {
    expr = expr.replace(/\s/g, "");
    expr = this.replacePlusMinus(expr);

    while (expr.match(this.regBrkt)) {
      const subExprMatch = expr.match(this.regBrkt);
      const subExpr = subExprMatch[1];
      expr = expr.replace(subExprMatch[0], this.solvePrimitive(subExpr));
      expr = this.replacePlusMinus(expr);
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

  static replacePlusMinus(expr) {
    const minMin = new RegExp("--", "g");
    const plusMin = new RegExp("/+-/", "g");
    const minPlus = new RegExp("-+", "g");
    const PlusPlus = new RegExp("/+/+", "g");

    while (
      minMin.test(expr) ||
      plusMin.test(expr) ||
      minPlus.test(expr) ||
      PlusPlus.test(expr)
    ) {
      expr = expr.replace(/--/g, "+");
      expr = expr.replace(/\+-/g, "-");
      expr = expr.replace(/-\+/g, "-");
      expr = expr.replace(/\+\+/g, "+");
    }
    return expr;
  }
}
