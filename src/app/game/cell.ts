import { Globals } from './globals';
import { Octagon } from './octagon';

export class Cell {
  // Default is none base properties
  bg_image_path = '../assets/board_cell.png';
  base = 'neutral';
  possible_move = false;
  octagon: Octagon = null;

  constructor(public row: number, public column: number) {
    for (let base_cell of Globals.base_cells) {
      if (row == base_cell.row && column == base_cell.column) {
        this.base = base_cell.base;
        this.bg_image_path = base_cell.bg_image_path;
        this.octagon = new Octagon(base_cell.base);
        break;
      }
    }
  }
}