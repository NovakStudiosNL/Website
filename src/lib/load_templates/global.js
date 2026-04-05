// console.log(Handlebars.templates)

const templateHead = Handlebars.templates['layout/head']
document.querySelector('head').insertAdjacentHTML(
	'afterbegin',
	templateHead({
		pageTitle: 'Home',
	}),
)

const templateHeader = Handlebars.templates['layout/header']
document
	.querySelector('header')
	.insertAdjacentHTML('beforeend', templateHeader())

const templateFooter = Handlebars.templates['layout/footer']
document
	.querySelector('footer')
	.insertAdjacentHTML('beforeend', templateFooter())
