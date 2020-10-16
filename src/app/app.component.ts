import { Component } from '@angular/core';
import { Board } from './game/board';
import { Cell } from './game/cell';
import { Globals } from './game/globals';
import { Move } from './game/move';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'angular-octi';
  board: Board;
  cur_base: string;
  chosen_cell: Cell;
  cur_status: string;
  cur_guidance: string;
  cur_warning: string;
  chosen_angle: number;
  possible_immediate_moves: Move[] = [];
  visited_cells: Cell[] = []; // to prevent never ending loops
  
  // TODO: inject this in the CSS
  podWidth = 55;
  podHeight = 55;

  constructor() {
    this.reset();
  }

  onCellDoubleClick(cell: Cell, e){
    console.log("Mouse position: x: " + e.offsetX + "y: " + e.offsetY);
    let movedOffsetX: number = e.offsetX - this.podWidth / 2 
    let movedOffsetY: number = -(e.offsetY - this.podHeight / 2)
    console.log("Moved position: x: " + movedOffsetX + "y: " + movedOffsetY);
    let offsetAngleRad : number = Math.atan2(movedOffsetY, movedOffsetX);
    let offsetDegrees : number = offsetAngleRad * (180/Math.PI); 
    console.log("Offset angle [degrees]: " + offsetDegrees);
    // Assign angle to section of (360/8 = 45)
    let sectionAngle: number = Math.round(offsetDegrees/(360/8))*(360/8);
    console.log("Section angle [degrees]: " + sectionAngle);
    let sectionAnglePositive : number = sectionAngle < 0 ? 360 + sectionAngle : sectionAngle;
    this.armAngle(sectionAnglePositive);
  }

  onCellPress(cell: Cell) {
    switch (this.cur_status) {
      case 'choose_octagon':
        if (cell.octagon == null) {
          this.cur_warning = 'You must choose an octagon'
        } else if (cell.octagon.base != this.cur_base) {
          this.cur_warning = 'You must choose an octagon from your own base!'
        } else {
          this.chosen_cell = cell;
          this.updateStatus('arm_or_first_move');
        }
        break;

      case 'arm_or_first_move':
        if (cell.octagon != null && cell.octagon.base == this.cur_base) {
          // Change octagon choice

          this.clearPossibleMoves();
          this.chosen_cell = cell;
          this.updateStatus('arm_or_first_move');

        } else {
          let next_move = this.getMoveFromCell(cell);
          
          if (next_move != null) {
            // Legal move
            this.performMove(next_move);
          } else {
            // can move again
            this.cur_warning = 'Illegal move!'
          }
        }

        break;

      case 'jump_over':
        let next_move = this.getMoveFromCell(cell);
        if (next_move != null) {
          // Legal move
          this.performMove(next_move);
        } else {
          // illegal move
          this.cur_warning = 'Illegal move! only jumps are allowed.'
        }
        break;

      case 'choose_next_cell':
        alert(this.cur_status);
        break;

      default:
        break;
    }
  }

  updateStatus(next_status: string) {
    this.cur_warning = '';

    switch (next_status) {
      case 'choose_octagon':
        this.cur_guidance = 'Choose your octagon.';
        break;

      case 'arm_or_first_move':
        this.calcPossibleImmediateMoves(false); // only_jumps_allowed is false because we're not searching only for jumps
        this.cur_guidance = 
          'Octush location is (' + this.chosen_cell.row + ',' + this.chosen_cell.column + '). Choose arming or attacking.';
        break;

      case 'jump_over':
        this.cur_guidance = 'You may jump again.';
        break;

      case 'choose_next_cell':
        this.cur_guidance = 'Attack!';
        break;

      default:
        alert('Illegal game status was chosen: ' + next_status + ' Reseting game...');
        this.reset();
        break;
    }
    this.cur_status = next_status;
  }

  getMoveFromCell(cell: Cell) {
    let next_move: Move = null;
    this.possible_immediate_moves.forEach(move => {
      if (move.next_cell == cell) {
        next_move = move;
      }
    });
    return next_move;
  }

  clearPossibleMoves() {
    // clear possible moves
    this.possible_immediate_moves.forEach(move => {
      move.next_cell.possible_move = false;
    });
    this.possible_immediate_moves = [];
  }

  isGameEnded() {
    let isEnded = false;

    Globals.base_cells.forEach(base_cell => {
      if (this.chosen_cell != null && this.chosen_cell.octagon != null) {
        if (base_cell.base != this.chosen_cell.octagon.base) {
          console.log(base_cell);
          if (base_cell.row == this.chosen_cell.row && 
            base_cell.column == this.chosen_cell.column) {
            isEnded = true;
          }
        }
      }
    });
    return isEnded;
  }

  switchBase() {
    // Clear possible moves
    this.clearPossibleMoves();

    // Clear visited cells
    this.visited_cells = [];

    if (this.isGameEnded()) {
      setTimeout( () => 
      { 
        // Game ended, notify players
        alert(this.cur_base + ' won!'); 

        // Reset
        this.reset();
      }, 100 );
    } else {
      // clear chosen cell
      this.chosen_cell = null;

      // switch bases
      this.cur_base = (this.cur_base == 'red') ? 'green' : 'red'

      // initiate status
      this.updateStatus('choose_octagon');
    }
  }

  armAngle(angle) {
    if ((this.cur_base == 'red' && this.board.red_remaining_arms == 0) 
        ||
        (this.cur_base == 'green' && this.board.green_remaining_arms == 0)) {
      this.cur_warning = 'No ammunation left!';
      return;
    }

    let warning_msg = this.chosen_cell?.octagon.addArm(angle)
    
    if (warning_msg == '') {
      if (this.cur_base == 'red') {
        this.board.red_remaining_arms--;
      } else {
        this.board.green_remaining_arms--;
      }
      this.switchBase(); // move the turn to the other base
    } else {
      // whatever
      this.cur_warning = warning_msg;
    }
  }

  performMove(move: Move) {
    let visited_cell = this.chosen_cell;
    this.moveOctagon(move.next_cell.row, move.next_cell.column);
    if (move.jumped_over_cell == null) {
      // Can't jump again. Turn ends
      this.switchBase(); 

    } else {
      // Maybe can move again

      // TODO - remember to delete opposite base octagons if needed, and add ammuniation      
      // Save visited_cells - don't allow visit the same cells twice unless a kill ocures
      if (move.jumped_over_cell.octagon.base != this.chosen_cell.octagon.base) {
        // That's a kill
        let victimArms = this.killOctagon(move.jumped_over_cell);
        this.gainArms(victimArms);
        this.visited_cells = [];
      } else {
        this.visited_cells.push(visited_cell);
      }

      this.clearPossibleMoves();
      this.calcPossibleImmediateMoves(true); // only jumps allowed
      if (this.possible_immediate_moves.length == 0) {
        // Can't jump again. Turn ends
        this.switchBase(); 
      } else {
        this.updateStatus('jump_over');
      }
    }
  }

  gainArms(num_of_arms) {
    if (this.cur_base == 'red') {
      this.board.red_remaining_arms += num_of_arms;
    } else {
      this.board.green_remaining_arms += num_of_arms;
    }
  }

  killOctagon(victimCell: Cell) : number {
    let victimArms = 0;

    // Count victim arms
    victimCell.octagon.arms.forEach((is_arm: boolean, angle: number) => {
      if (is_arm) {
        victimArms++;
      }
    });

    // Kill victim:
    this.board.octagons = this.board.octagons.filter(victim => victim == victimCell.octagon);
    victimCell.octagon = null;

    return victimArms;
  }

  moveOctagon(row: number, column: number) {
    this.board.cells[row][column].octagon = this.chosen_cell.octagon;
    this.chosen_cell.octagon = null;
    this.chosen_cell = this.board.cells[row][column];
  }

  getNextCell(cur_cell: Cell, angle: number) {
    let next_possible_row : number;
    let next_possible_column : number;

    next_possible_row = cur_cell.row + Globals.angle_to_row_move.get(angle);
    next_possible_column = cur_cell.column + Globals.angle_to_column_move.get(angle);

    if (0 <= next_possible_row && next_possible_row < Globals.num_of_rows &&
      0 <= next_possible_column && next_possible_column < Globals.num_of_columns) {
      return this.board.cells[next_possible_row][next_possible_column];
    }

    return null;
  }

  // we can show calcPossibleImmediateMoves and if there is more available moves, the player is then given the choice if he wants to end his turn or if not
  calcPossibleImmediateMoves(only_jumps_allowed: boolean) {
    let next_possible_column : number;
    let next_possible_row : number;
    let next_possible_cell: Cell;
    let jumped_over_cell: Cell;

    this.chosen_cell.octagon.arms.forEach((is_arm: boolean, angle: number) => {
      if (is_arm) {
        next_possible_cell = this.getNextCell(this.chosen_cell, angle);
        if (next_possible_cell != null) {
          if (next_possible_cell.octagon == null && only_jumps_allowed == false) {
            // simple move
            console.log('angle: ' + angle + ' leads to: (' + next_possible_row + ',' + next_possible_column + ')');
            this.possible_immediate_moves.push(new Move(next_possible_cell));
            
          } else if (next_possible_cell.octagon != null) {
            // check jump move
            jumped_over_cell = next_possible_cell
            next_possible_cell = this.getNextCell(next_possible_cell, angle);
            if (next_possible_cell != null && next_possible_cell.octagon == null &&
              (!this.visited_cells.includes(next_possible_cell))) {
              console.log('angle: ' + angle + ' leads to: (' + next_possible_row + ',' + next_possible_column + ')');
              this.possible_immediate_moves.push(new Move(next_possible_cell,
                                                          jumped_over_cell));
            }
          }
        }
      }
    });

    this.possible_immediate_moves.forEach(move => {
      move.next_cell.possible_move = true;
    });
    
  }

  reset() {
    this.board = new Board(Globals.num_of_rows, Globals.num_of_columns);
    this.cur_base = 'red';
    this.cur_status = 'choose_octagon';
    this.chosen_cell = null;
    this.cur_guidance = 'Choose your octagon.';
    this.cur_warning = '';
    this.chosen_angle = 0;
  }

}
