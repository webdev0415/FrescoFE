interface Arguments {
  count: number;
  spacing: number;
  width: number;
  height: number;
  min: number;
  max: number;
}

export interface PossibleSquare {
  square: number;
  count: number;
  column: number;
  rows: number;
}

export class SquaresInRectangle {
  spacing: number = 0;
  square: number = 0;
  columns: number = 0;
  rows: number = 0;
  count: number = 0;
  maxCount: number = 0;

  constructor(args: Arguments) {
    this.spacing = args.spacing;
    this.calculateActualSquare(args);
  }

  calculateActualSquare(args: Arguments): void {
    const possibleSquares: PossibleSquare[] = [];
    let maxCount = 0;
    const range = Array(Math.trunc(args.max - args.min))
      .fill(Math.trunc(args.min))
      .map((item, index) => item + index);
    range.forEach(item => {
      const rows = Math.trunc((args.height - args.spacing) / item);
      const column = Math.trunc((args.width - args.spacing) / item);
      const count = Math.trunc(rows * column);
      if (count >= args.count) {
        const index = possibleSquares.findIndex(item => item.count === count);
        if (index > -1) {
          possibleSquares[index] = {
            square: item,
            count: count,
            column,
            rows,
          };
        } else {
          possibleSquares.push({
            square: item,
            count: count,
            column,
            rows,
          });
        }
        if (!maxCount) {
          maxCount = count;
        }
      }
    });
    possibleSquares.sort((a, b) => {
      return a.count - b.count;
    });
    console.log(possibleSquares);

    this.maxCount = maxCount;
    if (possibleSquares.length) {
      const item = possibleSquares[0];
      this.square = item.square - args.spacing;
      this.count = item.count;
      this.columns = item.column;
      this.rows = item.rows;
    }
  }
}
