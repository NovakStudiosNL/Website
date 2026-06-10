const swiperEl = document.querySelector('.swiper')

if (swiperEl) {
	const swiper = new Swiper('.swiper', {
		slidesPerView: 'auto',
		spaceBetween: 16,

		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			clickable: true,
		},

		breakpoints: {
			[breaks.lg]: {
				slidesPerView: 3,
			},
		},
	})
}
