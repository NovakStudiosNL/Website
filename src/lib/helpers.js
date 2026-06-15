import { BASE_PATH } from './config.js'

export const registerHelpers = () => {
	try {
		if (typeof Handlebars === 'undefined')
			throw new Error('Handlebars library is not loaded.')

		// Add active class
		Handlebars.registerHelper('isActive', (string, condition) =>
			string === condition ? 'active' : '',
		)

		// Get translation
		Handlebars.registerHelper('t', (key) => {
			if (typeof i18next === 'undefined')
				throw new Error('i18next library is not loaded.')

			return i18next.t(key)
		})

		// Get translation via variables
		Handlebars.registerHelper('tVars', function (string, options) {
			if (typeof i18next === 'undefined')
				throw new Error('i18next library is not loaded.')

			const vars = options.hash || {}

			Object.entries(vars).forEach(([key, val]) => {
				string = string.replace(`\${${key}}`, String(val))
			})

			return i18next.t(string)
		})
	} catch (error) {
		console.error('Error registering helpers:', error)
		throw error
	}
}

// Load JS file after page render (i.e. swiper)
export const loadScript = (fileName, isModule = false) => {
	try {
		const script = document.createElement('script')

		script.src = `${BASE_PATH}src/lib/${fileName}.js`
		if (isModule) script.type = 'module'
		script.defer = true

		document.body.appendChild(script)
	} catch (error) {
		console.error(`Error loading script ${fileName}:`, error)
		throw error
	}
}
