const BASE_PATH =
	location.hostname == 'localhost' || location.hostname == '127.0.0.1'
		? ''
		: '/Website'
let layoutTemplate

async function loadLayout() {
	const res = await fetch(`${BASE_PATH}/src/templates/layout.hbs`)
	const source = await res.text()
	layoutTemplate = Handlebars.compile(source)
}

async function loadPartials(dirs = []) {
	for (const dir of dirs) {
		const res = await fetch(`${BASE_PATH}/${dir}`)
		const source = await res.text()
		const name = dir.split('/').pop().replace('.hbs', '')

		Handlebars.registerPartial(name, source)
	}
}

// Initialize i18next
async function initI18n() {
	await i18next.init({
		lng: 'en',
		fallbackLng: 'en',
		debug: false,
	})

	await loadLanguage('en')
}

async function loadLanguage(lang) {
	const res = await fetch(`${BASE_PATH}/dist/locales/${lang}.json`)
	const translations = await res.json()

	i18next.addResourceBundle(lang, 'translation', translations, true, true)
	i18next.changeLanguage(lang)

	renderPage('index')
}

// Language switch
function changeLanguage(lang) {
	loadLanguage(lang)
}

async function renderPage(name) {
	const pagesRes = await fetch(`${BASE_PATH}/dist/pages.json`)
	const pages = await pagesRes.json()

	const page = pages[name]

	const res = await fetch(`${BASE_PATH}/${page.template}`)
	const source = await res.text()
	console.log(`${BASE_PATH}/${page.template}`)

	const template = Handlebars.compile(source)

	const body = template({
		t: (key) => i18next.t(key),
	})

	render({
		head: page.head,
		body,
	})
}

// Render function
function render(page = {}) {
	const html = layoutTemplate({
		t: (key) => i18next.t(key),

		base: BASE_PATH,

		lang: i18next.language || 'en',

		head: page.head || { title: 'Novak Studios' },

		header: page.header || { page: 'index' },

		body: page.body || '',
	})

	document.getElementById('app').innerHTML = html
}

// Init app
;(async function () {
	Handlebars.registerHelper('isActive', (string, condition) =>
		string === condition ? 'active' : '',
	)
	await loadLayout()
	await loadPartials([
		'src/templates/layout/head.hbs',
		'src/templates/layout/header.hbs',
		'src/templates/layout/footer.hbs',
		'src/templates/pages/index.hbs',
		'src/templates/cards/project.hbs',
	])
	await initI18n()
})()
