import { BASE_PATH, partials, jsScripts } from './config.js'
import { loadScript } from './helpers.js'

// Load layout.hbs
export const loadLayout = async () => {
	try {
		const res = await fetch(`${BASE_PATH}src/templates/layout.hbs`)
		if (!res.ok) throw new Error(`Failed to load layout: ${res.statusText}`)

		const source = await res.text()

		return Handlebars.compile(source)
	} catch (error) {
		console.error('Error loading layout template:', error)
		throw error
	}
}

// Load all templates loaded within other templates (aka all templates except layout.hbs)
export const loadPartials = async (dirs = partials) => {
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
	} catch (error) {
		console.error('Error loading partials:', error)
		throw error
	}
}

// Get partials metadata from dist via the manifest
async function fetchMetadata() {
	const manifestRes = await fetch(`${BASE_PATH}dist/metadata/manifest.json`)
	const manifest = await manifestRes.json()

	// Get metadata file contents
	const data = await Promise.all(
		manifest['metadata_files'].map((fileName) =>
			fetch(`${BASE_PATH}dist/metadata/${fileName}.json`).then((res) =>
				res.json(),
			),
		),
	)

	// Metadata file name: file contents
	const metadata = {}
	manifest['metadata_files'].forEach(
		(file, i) => (metadata[file.replace('.json', '')] = data[i]),
	)

	return metadata
}

// Set up page config to render
export const renderPage = async (layoutTemplate, name) => {
	const metadata = await fetchMetadata()

	const page = metadata.pages[name] || metadata.pages.project_pages[name]
	const templatePath = metadata.pages[name]
		? page.template
		: metadata.pages.project_pages.template

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

	jsScripts.forEach((script) => {
		loadScript(script.file, script.module)
	})
}

// Load in page config
export const render = (layoutTemplate, page = {}) => {
	try {
		if (typeof Handlebars === 'undefined')
			throw new Error('Handlebars library is not loaded')

		if (typeof i18next === 'undefined')
			throw new Error('i18next library is not loaded')

		const html = layoutTemplate({
			t: (key) => i18next.t(key),

			base: BASE_PATH,

			lang: i18next.language || 'en',

			head: page.head || { title: 'Novak Studios' },

			header: page.header || { page: 'index' },

			body: page.body || '',
		})

		document.getElementById('app').innerHTML = html
	} catch (error) {
		console.error('Error during render:', error)
		throw error
	}
}
