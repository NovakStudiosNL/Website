Handlebars.registerHelper('t', function (path) {
	return new Handlebars.SafeString(
		`<span data-translation="${path}">${getTranslation(path)}</span>`,
	)
})
