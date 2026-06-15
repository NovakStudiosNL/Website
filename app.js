import { BASE_PATH } from './src/lib/config.js'
import { registerHelpers } from './src/lib/helpers.js'
import {
	loadLayout,
	loadPartials,
	render,
	renderPage,
} from './src/lib/templates.js'
import { initI18n } from './src/lib/i18n.js'

export let layoutTemplate

const initApp = async () => {
	try {
		// Custom Handlebars functions
		registerHelpers()

		// layout.hbs template
		layoutTemplate = await loadLayout()

		// Templates used within a template
		await loadPartials()

		// Load translations with the page (rendering the page is done within)
		await initI18n()
	} catch (error) {
		console.error('Error initializing page:', error)
		throw error
	}
}

initApp()
