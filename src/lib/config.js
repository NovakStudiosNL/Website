export const BASE_PATH = ['localhost', '127.0.0.1'].includes(location.hostname)
	? '/'
	: '/Website/'

export const breaks = {
	// see root: em number * text-size number
	xs: 30 * 16,
	sm: 36 * 16,
	md: 48 * 16,
	lg: 62 * 16,
	xl: 75 * 16,
}

export const partials = [
	// layout
	'src/templates/layout/head.hbs',
	'src/templates/layout/header.hbs',
	'src/templates/layout/footer.hbs',

	// pages
	'src/templates/pages/index.hbs',
	'src/templates/pages/method.hbs',
	'src/templates/pages/project.hbs',
	'src/templates/pages/projects.hbs',
	'src/templates/pages/team.hbs',

	// cards
	'src/templates/cards/project.hbs',
	'src/templates/cards/review.hbs',
	'src/templates/cards/team.hbs',
]
