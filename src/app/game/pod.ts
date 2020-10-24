export class Pod {
  public arms: Map<number, boolean>;
  public can_attack = false;
  public can_arm = true;

  constructor(public base: string) {
    this.arms = new Map([
      [ 0, false ],
      [ 45, false ],
      [ 90, false ],
      [ 135, false ],
      [ 180, false ],
      [ 225, false ],
      [ 270, false ],
      [ 315, false ]
    ])
  }

  addArm(string_angle: any) : string {
    let angle : number = parseInt(string_angle);
    let warning : string = '';
    if (!this.arms.has(angle)){
      warning = 'Illegal angle (' + angle + '), try again.';
    } else if (!this.can_arm) {
      warning = 'Can\'t arm anymore!';
    } else if (this.arms.get(angle)) {
      warning = 'Arm already exists!';
    } else {

      // Arming!
      this.arms.set(angle, true);
      console.log(this.arms);

      // update can_arm if can't arm anymore:
      this.can_arm = false;
      this.arms.forEach((is_arm: boolean, angle: number) => {
        if (!is_arm) {
          this.can_arm = true;
          // console.log(`Can arm because direction angle: ${angle} is not armed`);
        }
      });

      if (true /* here - check if can attack */) {
        this.can_attack = true;
      }
    }
    return warning;
  }

}