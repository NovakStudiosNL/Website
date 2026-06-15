import { BASE_PATH } from './config.js'
import { layoutTemplate } from '../../app.js'
import { renderPage } from './templates.js'

// Load i18next into page
export const initI18n = async () => {
	try {
		if (typeof i18next === 'undefined')
			throw new Error('i18next library is not loaded.')

		await i18next.init({
			lng: 'en',
			fallbackLng: 'en',
			debug: false,
		})

		await loadLanguage('en')
	} catch (error) {
		console.error('Error initializing i18next:', error)
		throw error
	}
}

// Load specific language
const loadLanguage = async (lang) => {
	try {
		if (typeof i18next === 'undefined')
			throw new Error('i18next library is not loaded.')

		const res = await fetch(`${BASE_PATH}dist/locales/${lang}.json`)
		if (!res.ok) throw new Error(`Failed to load language: ${lang}`)
		const translations = await res.json()

		i18next.addResourceBundle(lang, 'translation', translations, true, true)
		i18next.changeLanguage(lang)

		if (layoutTemplate) {
			const pageName = extractNameUrl()
			renderPage(layoutTemplate, pageName == '' ? 'index' : pageName)
		}
	} catch (error) {
		console.error('Error initializing i18next:', error)
		throw error
	}
}

// Get the page name from the url
const extractNameUrl = () => {
	const url = window.location.pathname
	const page = url.split('/').at(-1)
	return page.replace('.html', '')
}

// Language switch
export const changeLanguage = (lang) => {
	loadLanguage(lang)
}

if (typeof window !== 'undefined') {
	window.changeLanguage = changeLanguage
}
