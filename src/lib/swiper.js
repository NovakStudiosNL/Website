import { breaks } from './config.js'
import { swiperConfig } from './config.js'

const carousels = document.querySelectorAll('.swiper')
const activeSwipers = {}

// Find which kind of swiper to load form the config
const getSwiperOpts = (carousel) => {
	let config = 'default'
	let opts = swiperConfig.default
	opts.pagination.el = `.${carousel.dataset.class}-pagination`

	// Partners only has a swiper for smaller screens
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

// Update swiper if it's different than what is currently loaded
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
