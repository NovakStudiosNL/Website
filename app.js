import { registerHelpers } from './src/lib/helpers.js'

const BASE_PATH =
	location.hostname == 'localhost' || location.hostname == '127.0.0.1'
		? '/'
		: '/Website/'
let layoutTemplate
const breaks = {
	// see root: em number * text-size number
	xs: 30 * 16,
	sm: 36 * 16,
	md: 48 * 16,
	lg: 62 * 16,
	xl: 75 * 16,
}

function loadScript(fileName, isModule = false) {
	const script = document.createElement('script')
	script.src = `${BASE_PATH}src/lib/${fileName}.js`
	if (isModule) script.type = 'module'
	script.defer = true
	document.body.appendChild(script)
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

	let page = metadata.pages[name] || metadata.pages.project_pages[name]
	let templatePath = page.template

	if (!metadata.pages[name]) {
		page = metadata.pages.project_pages[name]
		templatePath = metadata.pages.project_pages.template
	}

	const res = await fetch(`${BASE_PATH}${templatePath}`)
	const source = await res.text()

	const template = Handlebars.compile(source)

	const body = template({
		t: (key) => i18next.t(key),

		base: BASE_PATH,

		key: page.key || '',
		projects: metadata.projects || {},
		partners: metadata.partners || {},
		reviews: metadata.reviews || {},
		team: metadata.team || {},
	})

	render({
		head: page.head,
		header: page.header,
		body,
	})

	loadScript('swiper')
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
		'src/templates/pages/method.hbs',
		'src/templates/pages/project.hbs',
		'src/templates/pages/projects.hbs',
		'src/templates/pages/team.hbs',

		'src/templates/cards/project.hbs',
		'src/templates/cards/review.hbs',
		'src/templates/cards/team.hbs',
	])
	await initI18n()
})()
