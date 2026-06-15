// Get base path string to use for relative links
export const BASE_PATH = ['localhost', '127.0.0.1'].includes(location.hostname)
	? '/'
	: '/Website/'

// Check SCSS root for breakpoints (em * text-size)
export const breaks = {
	xs: 30 * 16,
	sm: 36 * 16,
	md: 48 * 16,
	lg: 62 * 16,
	xl: 75 * 16,
}

// All templates loaded within other templates (aka all templates except layout.hbs)
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

// JS files necessary after render without .js
export const jsScripts = [
	{
		file: 'i18n',
		module: true,
	},
	{
		file: 'swiper',
		module: true,
	},
]

export const swiperConfig = {
	default: {
		slidesPerView: 'auto',

		pagination: {
			el: '',
			type: 'bullets',
			clickable: true,
		},

		breakpoints: {
			[breaks.lg]: {
				slidesPerView: 3,
			},
		},
	},
	endless: {
		slidesPerView: 'auto',
		loop: true,
		speed: 12000,
		allowTouchMove: true,
		autoplay: {
			delay: 1,
			disableOnInteraction: false,
			pauseOnMouseEnter: true,
		},
	},
	none: {
		slidesPerView: 'auto',
	},
}
