const fallbackLang = 'en'
const langOptions = Object.keys(locales)
let currentLang = fallbackLang

const setCurrentLang = () => {
	const browserLang = []
	langOptions.forEach((option) => {
		if (navigator.language.includes(option)) browserLang.push(option)
	})
	if (browserLang.length == 0) fallbackLang
	// just to be safe: if there is more than 1 browser langauge currently loaded
	if (browserLang.length > 1) {
		browserLang.forEach((lang) => {
			// fallback language takes priority
			if (lang == fallbackLang) return fallbackLang
			// else pick whichever language is first in the loop
			return lang
		})
	}

	return browserLang
}

currentLang = setCurrentLang()

const getTranslation = (path) => {
	let translation = locales[currentLang]
	path.split('/').forEach((key) => {
		translation = translation[key]
	})
	return translation
}

const updateTranslations = () => {
	document.querySelectorAll('[data-translation]').forEach((el) => {
		const path = el.getAttribute('data-translation')
		el.textContent = getTranslation(path)
	})
}

const switchLang = (lang = fallbackLang) => {
	currentLang = lang
	updateTranslations()
}
