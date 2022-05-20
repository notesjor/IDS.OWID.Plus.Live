Number.prototype.pad = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};
// SOURCE: https://weeknumber.net/how-to/javascript >>>
Date.prototype.getWeek = function () {
  this.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  this.setDate(this.getDate() + 3 - ((this.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(this.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((this.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
      7
    )
  );
};
// <<<
Date.prototype.getYearWeek = function () {
  return this.getFullYear() + "-" + this.getWeek().pad(2);
};
Date.prototype.getYearQuarter = function () {
  return this.getFullYear() + "-" + (Math.floor(this.getMonth() / 3) + 1);
};
