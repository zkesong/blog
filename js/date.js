/**
 * date format tool
 */

//default-pattern: "yyyy-MM-dd hh-mm"
Date.prototype.format = function() {
	var y = this.getFullYear();
	var m = this.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = this.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = this.getHours();
	var minute = this.getMinutes();
	minute = minute < 10 ? ('0' + minute) : minute;
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
}