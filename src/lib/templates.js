import { BASE_PATH } from './config.js'
import { loadScript } from './helpers.js'

export const loadLayout = async () => {
	const res = await fetch(`${BASE_PATH}src/templates/layout.hbs`)
	const source = await res.text()
	return Handlebars.compile(source)
}

export const loadPartials = async (dirs = []) => {
	try {
		await Promise.all(
			dirs.map(async (dir) => {
				const res = await fetch(`${BASE_PATH}${dir}`)
				if (!res.ok) throw new Error(`Failed to load partial: ${dir}`)
				const source = await res.text()
				const name = dir.split('/').pop().replace('.hbs', '')

				Handlebars.registerPartial(name, source)
			}),
		)
	} catch (err) {
		console.error('Error loading partials:', err)
		throw error
	}
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

export const renderPage = async (layoutTemplate, name) => {
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

	render(layoutTemplate, {
		head: page.head,
		header: page.header,
		body,
	})

	loadScript('swiper', true)
}

export const render = (layoutTemplate, page = {}) => {
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
