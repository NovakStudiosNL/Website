const fixRelativeLinks = () => {
	if (location.hostname == 'localhost' || location.hostname == '127.0.0.1') {
		document.querySelectorAll('a').forEach((link) => {
			const href = link.getAttribute('href')
			if (href && href.includes('/Website')) {
				link.href = href.replace('/Website', '')
				console.log(link.getAttribute('href'))
			}
		})
	}
}

fixRelativeLinks()
