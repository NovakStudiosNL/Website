import { BASE_PATH, partials } from './src/lib/config.js'
import { registerHelpers } from './src/lib/helpers.js'
import {
	loadLayout,
	loadPartials,
	render,
	renderPage,
} from './src/lib/templates.js'
import { initI18n } from './src/lib/i18n.js'

let layoutTemplate

const initApp = async () => {
	try {
		registerHelpers()

		layoutTemplate = await loadLayout()

		await loadPartials(partials)

		await initI18n(layoutTemplate)
	} catch (err) {
		console.error('Error initializing page:', err)
		throw error
	}
}

initApp()
