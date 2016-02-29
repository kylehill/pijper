var _pijperscripts = {}

var Pijper = function(text, last, scriptName){
	text = text || ""

	var next = function(updatedText, current) {
		if (scriptName) {
			_pijperscripts[scriptName] = updatedText
		}
		return new Pijper(updatedText, current, scriptName)
	}

	var lastSeparator = function(text, last) {
		switch (last) {
			case "do":
			case "then":
			case "else":
			case "into":
			case "pipe":
			case "from":
			case "replace":
			case "exec":
			case "group":
				return text + "; "
			default:
				return text
		}
	}

	var parseCommand = function(args) {
		args = Array.prototype.slice.call(args)
		
		var str = args.map(function(arg){
			if (typeof arg === "string") {
				return arg
			}

			if (arg.length) {
				return arg.map(function(c){ return "-" + c }).join(" ")
			}

			var optionString = ""
			for (var prop in arg) {
				optionString += ("--" + prop + " ")
				if (arg[prop] === null || arg[prop] === prop) {
					continue
				}
				optionString += (arg[prop] + " ")
			}
			return optionString
		}).join(" ")

		return str
	}

	this.script = function(scriptName) {
		return new Pijper("", "", scriptName)
	}

	this.do = function() {
		command = parseCommand(arguments)
		text = lastSeparator(text, last)
		return next(text + command, "do")
	}

	this.then = function() {
		command = parseCommand(arguments)
		text = text + " && "
		return next(text + command, "then")
	}

	this.else = function() {
		command = parseCommand(arguments)
		text = text + " || "
		return next(text + command, "else")
	}

	this.background = function() {
		command = parseCommand(arguments)
		return next(text + command + " & ", "background")
	}

	this.pipe = function() {
		command = parseCommand(arguments)
		return next(text + " | " + command, "pipe")
	}

	this.into = function() {
		command = parseCommand(arguments)
		return next(text + " >> " + command, "into")
	}

	this.replace = function() {
		command = parseCommand(arguments)
		return next(text + " > " + command, "replace")
	}

	this.from = function() {
		command = parseCommand(arguments)
		return next(text + " < " + command, "from")
	}

	this.exec = function(scriptName) {
		text = lastSeparator(text, last)
		return next(text + _pijperscripts[scriptName], "exec")
	}

	this.group = function() {
		command = parseCommand(arguments)
		return next(text + "( " + command + " )", "group")
	}

	this.valueOf = this.toString = function() {
		return text
	}
}

module.exports = new Pijper()