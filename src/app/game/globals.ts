export class Globals {

  static num_of_rows = 6;
  
  static num_of_columns = 7;

  static base_cells = [
    {row: 1, column: 1, base: 'red', bg_image_path: '../../assets/o_red.png'},
    {row: 2, column: 1, base: 'red', bg_image_path: '../../assets/c_red.png'},
    {row: 3, column: 1, base: 'red', bg_image_path: '../../assets/t_red.png'},
    {row: 4, column: 1, base: 'red', bg_image_path: '../../assets/i_red.png'},
    {row: 1, column: 5, base: 'green', bg_image_path: '../../assets/o_green.png'},
    {row: 2, column: 5, base: 'green', bg_image_path: '../../assets/c_green.png'},
    {row: 3, column: 5, base: 'green', bg_image_path: '../../assets/t_green.png'},
    {row: 4, column: 5, base: 'green', bg_image_path: '../../assets/i_green.png'},
  ];

  static angle_to_row_move = new Map([
    [ 0, 0 ], // same row
    [ 45, -1 ], // down
    [ 90, -1 ],
    [ 135, -1 ],
    [ 180, 0 ],
    [ 225, 1 ], // up
    [ 270, 1 ],
    [ 315, 1 ]
  ])

  static angle_to_column_move = new Map([
    [ 0, 1 ], // right
    [ 45, 1 ],
    [ 90, 0 ], // same column
    [ 135, -1 ], // left
    [ 180, -1 ],
    [ 225, -1 ],
    [ 270, 0 ],
    [ 315, 1 ]
  ])
}