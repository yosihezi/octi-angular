import { Cell } from './cell';
import { Octagon } from './octagon';
import { Globals } from './globals';

export class Board {
  cells: Cell[][] = [];
  octagons: Octagon[] = [];
  green_remaining_arms = 12;
  red_remaining_arms = 12;
  
  constructor(rows: number, columns: number) {
    for (let r = 0; r < rows; r++) {
      this.cells[r] = [];
      for (let c = 0; c < columns; c++) {
        this.cells[r][c] = new Cell(r, c);
      }
    }
    Globals.base_cells.forEach(base_cell => {
      this.octagons.push(new Octagon(base_cell.base));  
    });
  }
}