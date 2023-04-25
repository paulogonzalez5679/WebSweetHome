import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DatesService {
  constructor() {}

  /**
   * *** devuelve la fecha actual ***
   * *** formato 2020-10-05 ***
   */
  getDateCurrent() {
    let date: Date = new Date();
    return (
      date.getFullYear() +
      "-" +
      this.addZero(date.getMonth() + 1) +
      "-" +
      this.addZero(date.getDate())
    );
  }

  /**
   * *** devuelve la hora actual ***
   */
  getTimeCurrent() {
    let date: Date = new Date();
    return (
      this.addZero(date.getHours()) +
      ":" +
      this.addZero(date.getMinutes()) +
      ":" +
      this.addZero(date.getSeconds())
    );
  }

  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
}
