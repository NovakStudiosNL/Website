import { BASE_PATH } from './config.js'
import { renderPage } from './templates.js'

export const initI18n = async (layoutTemplate) => {
	await i18next.init({
		lng: 'en',
		fallbackLng: 'en',
		debug: false,
	})

	await loadLanguage('en', layoutTemplate)
}

const loadLanguage = async (lang, layoutTemplate) => {
	const res = await fetch(`${BASE_PATH}dist/locales/${lang}.json`)
	const translations = await res.json()

	i18next.addResourceBundle(lang, 'translation', translations, true, true)
	i18next.changeLanguage(lang)

	const url = window.location.pathname
	const page = url.split('/').at(-1)
	const pageName = page.replace('.html', '')

	renderPage(layoutTemplate, pageName == '' ? 'index' : pageName)
}

const changeLanguage = (lang) => {
	loadLanguage(lang)
}
