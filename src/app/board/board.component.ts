import { Cell } from '../game/cell';
import { Pod } from '../game/pod';
import { Globals } from '../game/globals';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  cells: Cell[][] = [];
  pods: Pod[] = [];
  green_remaining_progs = 12;
  red_remaining_progs = 12;
  readonly num_of_rows = Globals.num_of_rows;
  readonly num_of_columns: number = Globals.num_of_columns;

  constructor() {
    for (let r = 0; r < this.num_of_rows; r++) {
      this.cells[r] = [];
      for (let c = 0; c < this.num_of_columns; c++) {
        this.cells[r][c] = new Cell(r, c);
      }
    }
    Globals.base_cells.forEach(base_cell => {
      this.pods.push(new Pod(base_cell.base));  
    });
  }

  ngOnInit(): void {
  }

}

