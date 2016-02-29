var pijper = require("./pijper")
var fs = require("fs")
var exec = require("child_process").exec

var scriptToRun = process.argv[2]

fs.readFile("./pijpfile", "utf8", function(err, data) {
	eval(data)
	var compiledScript = pijper.exec(scriptToRun)
	console.log("pijping " + scriptToRun + " as " + compiledScript)

	exec(compiledScript, function(err, stdout, stderr) {
		if (stdout) {
			console.log(stdout)
		}
		console.log("😺  all done!")
	})
})
