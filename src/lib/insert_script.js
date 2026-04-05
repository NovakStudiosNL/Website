const insertScriptsFiles = () => {
	const files = [
		'/public/locales/locales.js',
		'/src/lib/translate.js',
		'/src/lib/helpers.js',
		'/public/js/templates.js',
		'/src/lib/load_templates/pages/index.js',
		'/src/lib/load_templates/global.js',
		'/src/lib/relative_links.js',
	]
	let prefix = '/Website'
	if (location.hostname == 'localhost' || location.hostname == '127.0.0.1') {
		console.log(`Dev environment detected, removing "${prefix}" prefix...`)
		prefix = ''
	}

	files.forEach((file) => {
		const script = document.createElement('script')
		script.src = `${prefix}${file}`
		document.querySelector('head').appendChild(script)
	})
}

insertScriptsFiles()
