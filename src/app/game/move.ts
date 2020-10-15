import { Cell } from './cell';

export class Move {
  constructor(
    public next_cell: Cell, 
    public jumped_over_cell: Cell = null) {}
}