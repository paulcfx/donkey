var TimesThree = function(number) {
	this.number = number;
}

TimesThree.prototype.set = function(number) {
	return number = number * 3;
}

module.export.gen = function(number) {
	return new TimesThree(number)
}