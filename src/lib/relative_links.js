const fixRelativeLinks = () => {
	if (location.hostname == 'localhost' || location.hostname == '127.0.0.1') {
		document.querySelectorAll('a').forEach((link) => {
			replaceLinkString(link)
		})
		document.querySelectorAll('link').forEach((stylesheet) => {
			replaceLinkString(stylesheet)
		})
	}
}

const replaceLinkString = (el) => {
	const href = el.getAttribute('href')
	if (href && href.includes('/Website')) {
		el.href = href.replace('/Website', '')
	}
}

fixRelativeLinks()
