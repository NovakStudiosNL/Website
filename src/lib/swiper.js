import { breaks } from '../../app.js'

const carousels = document.querySelectorAll('.swiper')
const swiperConfig = {
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
const activeSwipers = {}

const getSwiperOpts = (carousel) => {
	let config = 'default'
	let opts = swiperConfig.default
	opts.pagination.el = `.${carousel.dataset.class}-pagination`

	if (carousel.dataset.class == 'partners') {
		config = 'none'
		opts = swiperConfig.none
		carousel.querySelectorAll('.extra').forEach((slide) => {
			slide.style.display = 'none'
		})

		if (window.screen.width < breaks.lg) {
			carousel.querySelectorAll('.extra').forEach((slide) => {
				slide.style.display = 'block'
			})

			config = 'endless'
			opts = swiperConfig.endless
		}
	}

	return { opts: opts, config: config }
}

const updateSwiper = () => {
	if (carousels.length == 0) return

	carousels.forEach((carousel) => {
		const name = carousel.dataset.class
		const settings = getSwiperOpts(carousel)

		if (activeSwipers[name] && settings.config == activeSwipers[name].config)
			return

		if (activeSwipers[name]) activeSwipers[name].swiper.destroy(true, true)

		const swiper = new Swiper(`.swiper-${name}`, settings.opts)
		activeSwipers[name] = { config: [settings.config], swiper: swiper }
	})
}

let resizeTimeout
window.addEventListener('resize', () => {
	clearTimeout(resizeTimeout)

	resizeTimeout = setTimeout(() => {
		carousels.forEach(updateSwiper)
	}, 150)
})

updateSwiper()
