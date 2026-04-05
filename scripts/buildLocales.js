const fs = require('fs')
const path = require('path')
// import fs from 'fs'
// import path from 'path'
const fallbackLang = 'en'
const overwriteMissingTranslations = true

const fixMissingTranslations = () => {
	const localesDir = path.join(
		__dirname.substring(0, __dirname.lastIndexOf('/')),
		'src',
		'locales',
	)
	if (fs.readdirSync(path.join(localesDir, fallbackLang)).length == 0) {
		console.log(`No directories in "${fallbackLang}". Cancelling build...`)
		return false
	}

	// iterate through each lang
	for (const lang of fs.readdirSync(localesDir)) {
		if (lang == fallbackLang) continue
		// directory to lang folder
		const langDir = path.join(localesDir, lang)
		const fallbackDir = path.join(localesDir, fallbackLang)
		if (!fs.statSync(langDir).isDirectory()) continue

		if (
			fs.readdirSync(langDir).length == 0 &&
			fs.readdirSync(fallbackDir).length !== 0
		) {
			console.log(
				`No directories found in ${langDir}. Copying over fallback translations to locale.`,
			)
			fs.cp(fallbackDir, langDir, { recursive: true }, (err) => {
				if (err) throw new Error(err)
			})
			continue
		}

		fixMissingFolders(langDir, fallbackDir)
	}

	return true
}

const fixMissingFolders = (dir, fallbackDir) => {
	for (const file of fs.readdirSync(fallbackDir)) {
		const fileDir = path.join(fallbackDir, file)

		if (fs.readdirSync(dir).includes(file)) {
			if (!fs.statSync(fileDir).isDirectory()) {
				fixMissingKeys(file, dir, fileDir)
				continue
			}
			fixMissingFolders(path.join(dir, file), fileDir)
			continue
		}

		if (!fs.statSync(fileDir).isDirectory()) {
			console.log(`Missing file in ${dir}: "${file}". Copying file.`)
			fixMissingFiles(file, dir, fileDir)
			continue
		}

		console.log(
			`Missing directory in ${dir}: "${file}". Copying folder and its subfolders/files.`,
		)
		fs.cp(fileDir, path.join(dir, file), { recursive: true }, (err) => {
			if (err) throw new Error(err)
		})
	}
}

const fixMissingFiles = (file, dir, fallbackDir) => {
	fs.copyFile(fallbackDir, path.join(dir, file), 0, (err) => {
		if (err) throw new Error(err)
	})
}

const fixMissingKeys = (file, dir, fallbackDir) => {
	const content = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
	const fallbackContent = JSON.parse(fs.readFileSync(fallbackDir, 'utf8'))

	if (Object.keys(fallbackContent).length !== Object.keys(content).length) {
		Object.keys(fallbackContent).forEach((key) => {
			if (!key.includes(Object.keys(content))) {
				content[key] = fallbackContent[key]
				console.log(
					`Missing key in ${dir}: "${key}". Adding it to translation object.`,
				)
			}
		})
	}

	fs.writeFileSync(path.join(dir, file), JSON.stringify(content), 'utf8')
}

const populateTranslations = (dir) => {
	const langTranslations = {}

	for (const file of fs.readdirSync(dir)) {
		const fileDir = path.join(dir, file)
		const statSync = fs.statSync(fileDir)
		if (statSync.isDirectory()) {
			langTranslations[file] = populateTranslations(fileDir)
			continue
		}
		if (!file.endsWith('.json')) continue
		if (statSync.size == 0) continue

		const ns = path.basename(file, '.json')
		const content = fs.readFileSync(path.join(dir, file), 'utf8')
		langTranslations[ns] = JSON.parse(content)
	}

	return langTranslations
}

const loadTranslations = () => {
	const localesDir = path.join(
		__dirname.substring(0, __dirname.lastIndexOf('/')),
		'src',
		'locales',
	)
	const translations = {}

	// iterate through each lang
	for (const lang of fs.readdirSync(localesDir)) {
		// directory to lang folder
		const langDir = path.join(localesDir, lang)
		if (!fs.statSync(langDir).isDirectory()) continue

		translations[lang] = populateTranslations(langDir)
	}

	// console.log(translations)
	return translations
}

const buildTranslations = () => {
	if (overwriteMissingTranslations) {
		console.log(
			'Overwrite missing translations setting is on. Checking for missing translations...',
		)
		if (!fixMissingTranslations()) {
			console.log('Canceled build translations.')
			return
		}

		console.log('Finished checking for missing translations.')
	}

	const translations = loadTranslations()

	fs.writeFileSync(
		path.join(
			__dirname.substring(0, __dirname.lastIndexOf('/')),
			'public',
			'locales',
			'locales.js',
		),
		`const locales = ${JSON.stringify(translations)}`,
		'utf8',
	)

	console.log(`Wrote JSON of all locales`)
}

buildTranslations()
