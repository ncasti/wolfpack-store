window.tiendaNubeInstaTheme = (function($) {
	return {
		waitFor: function() {
			return [];
		},
		handlers: function(instaElements) {
			return {
				logo: new instaElements.Logo({
					$storeName: $('.text-logo-desktop'),
					$logo: $('#logo')
				})
			};
		}
	};
})(jQuery);