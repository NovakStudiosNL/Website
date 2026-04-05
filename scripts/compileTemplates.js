const { exec } = require('child_process')

function run() {
	exec(
		'handlebars src/templates -f public/js/templates.js -e hbs',
		(err, stdout, stderr) => {
			if (stdout) process.stdout.write(stdout)
			if (stderr) process.stderr.write(stderr)
			if (err) process.stderr.write(`Exited with code ${err.code}\n`)
		},
	)
}

run()
setInterval(run, 30_000)
