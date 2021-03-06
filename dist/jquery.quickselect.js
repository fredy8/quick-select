;(function ( $, window, document, undefined ) {

	"use strict";

	// Create the defaults once
	var pluginName = "quickselect",
		defaults = {
			activeButtonClass: 'active', // added to active/selected button
			breakOutAll: false,
			breakOutValues: [], // options to break out of select box
			buttonClass: '', // added to each button
			namespace: pluginName, // CSS prepend: namespace_class
			selectDefaultText: 'More&hellip;', // text to display on select button
			wrapperClass: '' // class on wrapping div
		};

	// The actual plugin constructor
	function Plugin ( element, options ) {
		this.element = element;
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {
		init: function () {
			var el                = this.element,
				activeButtonClass = this.settings.activeButtonClass,
				breakOutAll       = this.settings.breakOutAll,
				breakOutValues    = this.settings.breakOutValues,
				buttonClass       = this.settings.buttonClass,
				namespace         = this.settings.namespace,
				selectDefaultText = this.settings.selectDefaultText,
				wrapperClass      = this.settings.wrapperClass;

			// Select element wrapper
			var wrapper = $('<div class="' + namespace + '__wrapper ' + wrapperClass + '"></div>');
			$(el).addClass(namespace + '__select').before(wrapper);

			// if breakOutAll true then set breakOutValues array to all options
			breakOutValues = (breakOutAll) ? $('option', el).map(function() {return this.value;}).get() : breakOutValues;

			// Add buttons
			$.each(breakOutValues, function(index, value){
				var opVal = $(  'option[value="' + value + '"]', el ).attr('value'),
					opTxt = $(  'option[value="' + value + '"]', el ).text();

				if (opVal) {
					$(wrapper)
						.append(
							'<span data-'
								+ namespace
								+ '-value="'
								+ opVal
								+ '" class="'
								+ namespace
								+ '__btn '
								+ buttonClass
								+ '">'
								+ opTxt
							+ '</span>'
						);
				}
			});


			if(breakOutAll) {
				// Hide select overflow as all elements have been broken out. Can't use display none as
				// the value will not be submitted.
				$(el).addClass(namespace + '__hidden');
			} else {
				// move select box inside wrapper
				$(el)
					.wrap('<div class="' + namespace + '__btn ' + namespace + '__more ' + buttonClass + '"></div>')
					.before('<span class="' + namespace + '__more--label">' + selectDefaultText + '</span>')
					.parent()
					.detach()
					.appendTo(wrapper);
			}
			

			// On select option change
			$(el).change(function() {
				var value = $(this).val();

				// reset active classes
				$('.' + namespace + '__btn', $(wrapper)).removeClass(activeButtonClass);

				var moreButtonLabel = selectDefaultText;

				// if option's value is a breakout button
				if ( $.inArray(value, breakOutValues) !== -1 || breakOutAll == true ) {
					// Button active
					$('.' + namespace + '__btn[data-' + namespace + '-value="' + value + '"]', $(wrapper)).addClass(activeButtonClass);
				}
				// else option must reside only in overflow
				else if ( value ) {
					// More-button label
					moreButtonLabel = $(el).find('option:selected').text();
					// More-button active
					$('.' + namespace + '__more', $(wrapper)).addClass(activeButtonClass);
				}

				// Set More-button label
				$('.' + namespace + '__more--label', $(wrapper)).html(moreButtonLabel);
			});

			// On button click trigger change
			$('.' + namespace + '__btn[data-' + namespace + '-value]', $(wrapper)).click(function() {
				if ( $(this).hasClass(activeButtonClass) ) {
					$(el).val($("option:first", el).val()).change();
				} else {
					$(el).val($(this).attr('data-' + namespace + '-value')).change();
				}
			});

			// Tigger change on load
			$(el).val($(el).val()).change();
			
		}
	});

	$.fn[ pluginName ] = function ( options ) {
		return this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
			}
		});
	};

})( jQuery, window, document );