Handlebars.registerHelper('t', function (path) {
	return new Handlebars.SafeString(
		`<span data-translation="${path}">${getTranslation(path)}</span>`,
	)
})

Handlebars.registerHelper('t-data', function (path) {
	return new Handlebars.SafeString(`${getTranslation(path)}`)
})
