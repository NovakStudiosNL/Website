const carousels = document.querySelectorAll('.swiper')

if (carousels.length > 0) {
	carousels.forEach((carousel) => {
		const swiper = new Swiper(`.${carousel.dataset.class}`, {
			slidesPerView: 'auto',
			spaceBetween: 16,

			pagination: {
				el: `.${carousel.dataset.class}-pagination`,
				type: 'bullets',
				clickable: true,
			},

			breakpoints: {
				[breaks.lg]: {
					slidesPerView: 3,
				},
			},
		})
	})
}
