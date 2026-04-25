const BASE_PATH =
	location.hostname == 'localhost' || location.hostname == '127.0.0.1'
		? '/'
		: '/Website/'
let layoutTemplate

function registerHelpers() {
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

async function loadLayout() {
	const res = await fetch(`${BASE_PATH}src/templates/layout.hbs`)
	const source = await res.text()
	layoutTemplate = Handlebars.compile(source)
}

async function loadPartials(dirs = []) {
	for (const dir of dirs) {
		const res = await fetch(`${BASE_PATH}${dir}`)
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
	const res = await fetch(`${BASE_PATH}dist/locales/${lang}.json`)
	const translations = await res.json()

	i18next.addResourceBundle(lang, 'translation', translations, true, true)
	i18next.changeLanguage(lang)

	const url = window.location.pathname
	const page = url.split('/').at(-1)
	const pageName = page.replace('.html', '')

	renderPage(pageName == '' ? 'index' : pageName)
}

// Language switch
function changeLanguage(lang) {
	loadLanguage(lang)
}

async function fetchMetadata() {
	const manifest = await fetch(`${BASE_PATH}dist/metadata/manifest.json`)
	const files = await manifest.json()

	const data = await Promise.all(
		files['metadata_files'].map((fileName) =>
			fetch(`${BASE_PATH}dist/metadata/${fileName}.json`).then((res) =>
				res.json(),
			),
		),
	)

	const metadata = {}
	files['metadata_files'].forEach(
		(file, iteration) =>
			(metadata[file.replace('.json', '')] = data[iteration]),
	)

	return metadata
}

async function renderPage(name) {
	const metadata = await fetchMetadata()

	const page = metadata.pages[name]

	const res = await fetch(`${BASE_PATH}${page.template}`)
	const source = await res.text()

	const template = Handlebars.compile(source)

	const body = template({
		t: (key) => i18next.t(key),
		projects: metadata.projects || {},
		reviews: metadata.reviews || {},
		team: metadata.team || {},
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
	registerHelpers()

	await loadLayout()
	await loadPartials([
		'src/templates/layout/head.hbs',
		'src/templates/layout/header.hbs',
		'src/templates/layout/footer.hbs',

		'src/templates/pages/index.hbs',
		'src/templates/pages/team.hbs',

		'src/templates/cards/project.hbs',
		'src/templates/cards/review.hbs',
		'src/templates/cards/team.hbs',
	])
	await initI18n()
})()
