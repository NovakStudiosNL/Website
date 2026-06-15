import { BASE_PATH } from './config.js'

export const registerHelpers = () => {
	Handlebars.registerHelper('isActive', (string, condition) =>
		string === condition ? 'active' : '',
	)

	Handlebars.registerHelper('tVariables', function (string, options) {
		const vars = options.hash || {}

		Object.keys(vars).forEach((key) => {
			string = string.replace('${' + key + '}', String(vars[key]))
		})

		return i18next.t(string)
	})

	Handlebars.registerHelper('t', (key) => i18next.t(key))
}

export const loadScript = (fileName, isModule = false) => {
	const script = document.createElement('script')
	script.src = `${BASE_PATH}src/lib/${fileName}.js`
	if (isModule) script.type = 'module'
	script.defer = true
	document.body.appendChild(script)
}
