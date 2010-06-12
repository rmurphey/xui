/**
 *
 * @namespace {Style}
 * @example
 *
 * Style
 * ---
 *	
 * Anything related to how things look. Usually, this is CSS.
 * 
 */
function hasClass(el, className) {
    return getClassRegEx(className).test(el.className);
}

// Via jQuery - used to avoid el.className = ' foo';
// Used for trimming whitespace
var rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;

function trim(text) {
  return (text || "").replace( rtrim, "" );
}

xui.extend({

    /**
	 * 
	 * Sets a single CSS property to a new value.
	 * 
	 * @param {String} prop The property to set.
	 * @param {String} val The value to set the property.
	 * @return self
	 * @example
	 *
	 * ### setStyle
	 *	
	 * syntax: 
	 *
	 * 	x$(selector).setStyle(property, value);
	 *
	 * arguments: 
	 *
	 * - property:string the property to modify
	 * - value:string the property value to set
	 *
	 * example:
	 * 
	 * 	x$('.txt').setStyle('color', '#000');
	 * 
	 */
    setStyle: function(prop, val) {
        return this.each(function(el) {
            el.style[prop] = val;
        });
    },

    /**
	 * 
	 * Retuns a single CSS property. Can also invoke a callback to perform more specific processing tasks related to the property value.
	 * 
	 * @param {String} prop The property to retrieve.
	 * @param {Function} callback A callback function to invoke with the property value.
	 * @return self if a callback is passed, otherwise the individual property requested
	 * @example
	 *
	 * ### getStyle
	 *	
	 * syntax: 
	 *
	 * 	x$(selector).getStyle(property, callback);
	 *
	 * arguments: 
	 * 
	 * - property:string a css key (for example, border-color NOT borderColor)
	 * - callback:function (optional) a method to call on each element in the collection 
	 *
	 * example:
	 *
	 *	x$('ul#nav li.trunk').getStyle('font-size');
	 *	
	 * 	x$('a.globalnav').getStyle( 'background', function(prop){ prop == 'blue' ? 'green' : 'blue' });
	 *
	 */
    getStyle: function(prop, callback) {
        return (callback === undefined) ?
            
            getStyle(this[0], prop) :
            
            this.each(function(el) {
                callback(getStyle(el, prop));
            });
    },

    /**
	 *
	 * Adds the classname to all the elements in the collection. 
	 * 
	 * @param {String} className The class name.
	 * @return self
	 * @example
	 *
	 * ### addClass
	 *	
	 * syntax:
	 *
	 * 	$(selector).addClass(className);
	 * 
	 * arguments:
	 *
	 * - className:string the name of the CSS class to apply
	 *
	 * example:
	 * 
	 * 	$('.foo').addClass('awesome');
	 *
	 */
    addClass: function(className) {
        return this.each(function(el) {
            if (hasClass(el, className) === false) {
              el.className = trim(el.className + ' ' + className);
            }
        });
    },
    /**
	 *
	 * Checks to see if classname is one the element. If a callback isn't passed, hasClass expects only one element in collection
	 * 
	 * @param {String} className The class name.
	 * @param {Function} callback A callback function (optional)
	 * @return self if a callback is passed, otherwise true or false as to whether the element has the class
	 * @example
	 *
	 * ### hasClass
	 *	
	 * syntax:
	 *
	 * 	$(selector).hasClass('className');
	 * 	$(selector).hasClass('className', function(element) {});	 
	 * 
	 * arguments:
	 *
	 * - className:string the name of the CSS class to apply
	 *
	 * example:
	 * 
	 * 	$('#foo').hasClass('awesome'); // returns true or false
	 * 	$('.foo').hasClass('awesome',function(e){}); // returns XUI object
	 *
	 */
    hasClass: function(className, callback) {
        return (callback === undefined && this.length == 1) ?
            hasClass(this[0], className) :
            this.each(function(el) {
                if (hasClass(el, className)) {
                    callback(el);
                }
            });
    },

    /**
	 *
	 * Removes the classname from all the elements in the collection. 
	 * 
	 * @param {String} className The class name.
	 * @return self
	 * @example
	 *
	 * ### removeClass
	 *	
	 * syntax:
	 *
	 * 	x$(selector).removeClass(className);
	 * 
	 * arguments:
	 *
	 * - className:string the name of the CSS class to remove.
	 *
	 * example:
	 * 
	 * 	x$('.bar').removeClass('awesome');
	 * 
	 */
    removeClass: function(className) {
        if (className === undefined) {
            this.each(function(el) {
                el.className = '';
            });
        } else {
            var re = getClassRegEx(className);
            this.each(function(el) {
                el.className = el.className.replace(re, '');
            });
        }
        return this;
    },


    /**
	 *
	 * Set a number of CSS properties at once.
	 * 
	 * @param {Object} props An object literal of CSS properties and corosponding values.
	 * @return self
	 * @example	
	 *
	 * ### css
	 *	
	 * syntax: 
	 *
	 * 	x$(selector).css(object);
	 *
	 * arguments: 
	 *
	 * - an object literal of css key/value pairs to set.
	 *
	 * example:
	 * 
	 * 	x$('h2.fugly').css({ backgroundColor:'blue', color:'white', border:'2px solid red' });
	 *  
	 */
    css: function(o) {
        for (var prop in o) {
            this.setStyle(prop, o[prop]);
        }
        return this;
    }
// --
});

function getStyle(el, p) {
    // this *can* be written to be smaller - see below, but in fact it doesn't compress in gzip as well, the commented
    // out version actually *adds* 2 bytes.
    // return document.defaultView.getComputedStyle(el, "").getPropertyValue(p.replace(/([A-Z])/g, "-$1").toLowerCase());
    return document.defaultView.getComputedStyle(el, "").getPropertyValue(p.replace(/[A-Z]/g, function(m){ return '-'+m.toLowerCase();}));
}

// RS: now that I've moved these out, they'll compress better, however, do these variables
// need to be instance based - if it's regarding the DOM, I'm guessing it's better they're
// global within the scope of xui

// -- private methods -- //
var reClassNameCache = {},
    getClassRegEx = function(className) {
        var re = reClassNameCache[className];
        if (!re) {
            re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            reClassNameCache[className] = re;
        }
        return re;
    };