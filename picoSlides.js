/* picoSlides v1.0.0
 * Copyright (c) 2014 Hector Quintero Casanova
 * Released under the MIT license
 */

/**
 * @fileOverview Adds minimal HTML 'scaffolding' to enable simple navigation and deferred loading of multiple slide sets
 * Intended to be responsive and compatible with all modern browsers (full functionality not guaranteed with IE7 and below).
 * Every effort has been made to limit the use of jQuery without compromising browser compatibility too much.
 * @version git-master
 * @author <a href="http://www.hqcasanova.com">hqcasanova</a>
 */
;(function (window, $, document, undefined) {
    'use strict';

    var PicoSlides,         //Object representing a set of slides and its navigational elements
        setsToLoad = 0,     //Number of slide sets still to be loaded (user has not seen past the first slide of those sets)
        elementLib = {},    //Library of ready-made native or jQuery objects to be inserted into the DOM
        elementDefs = {     //Default HTML attributes for injected elements (mostly style-related)
            //Non-style attributes
            altAttr: '',                //Alt attribute for all img elements
            lazyAttr: 'data-original',  //Lazy Load plugin's name for src attribute

            //AJaX loading indicator
            loadingImg: 'data:image/gif;base64,R0lGODlhKwALAMIEAP///wAAAIKCggAAABRaZhRaZhRaZhRaZiH/C05FVFNDQVBFMi4wAwEAAAAh+QQJMgADACwAAAAAKwALAAADNDiyzPNQtRbhpHfWTCP/mgduYEl+Z8mlGauG1ii+7bzadBejeL64sIfvAtQJR7yioHJsJQAAIfkECTIAAwAsAAAAACsACwAAAz84sMzzcIhJaYQ1q8bBzeAHVh0njtOJlo06uiDrRKhF14K8wNpd6x4fikfSEW0YHPCYEo6WzlBUI7s8albJMAEAIfkECTIAAwAsAAAAACsACwAAAz84sszzcIBJaYQtq6xj/dPFjaRwgZ9YrsuJWhHLui+gyiT93jino7xe4wcKCluemi127ECUS8xqM7o8alaqLwEAIfkEATIAAwAsAAAAACsACwAAA0I4sszzULUWIbgYy0kjn1UmXl8HlU40iuhStUK4YvDbyjNQe7ea671T8PEDomxHX24nTFp+zEd0UNxwKtISljobJAAAOw==',

            //Overall look & feel (in CSS units)
            cssButtonSize: '45px',  //Size of all controls
            cssPadding: '15px',     //Default padding for secondary containers (loading indicator and slide counter)
            cssFontSize: '.9em',    //Default font size for all text elements
            cssLineHeight: '1.5em', //Default line height for all text elements
            cssFontFamily: 'sans-serif', //Default font family for all text elements
            cssBgColor: 'gray',     //Background colour for controls and main container
            cssFgColor: 'white',    //Foreground colour for text and control symbols
            cssSeparation: '1.5%',  //Default separation between edge of slides container and controls
            cssRadius: '0px',       //Border radius of all elements
            cssOpacity: 0.65        //Opacity of all interface elements
        };

    /**
     * Creates the elements (native or not) that will be used later as a basis for the plugin's scaffolding
     * (slide images, navigation buttons or links). It allows partial abstraction of styles information,
     * some of which is dynamically generated (hence the absence of a CSS file).
     * @param {Element} [container = false]: If specified, no element is created, instead updating the style of the main container.
     */
    function elementLibrary(container) {
        var navCommonStyle,     //CSS properties common to all slide navigation buttons and links
            buttonSize,         //Integer-converted size of controls
            sectionHeight,      //Basic height for CSS shapes of arrows used in control buttons
            headCommonStyle,    //CSS properties for heads of arrows
            tailCommonStyle,    //CSS properties for tails of 'next' and 'previous' arrows
            vBarCommonStyle,    //CSS properties for vertical bar in FF and RW buttons
            countElem,          //Outermost native span element wrapping bottom slide counter
            countChild,         //First immediate descendant of countElem
            loadElem,           //Native image element for loading indicator
            firstElem,          //Native image element for the first slide
            slideElem,          //Native image element for slides other than the first (added in bulk)
            noSelect = {        //CSS for non-selectable items
                '-webkit-touch-callout': 'none',
                '-webkit-user-select': 'none',
                '-khtml-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none'
            };

        //If container provided, style it so that it forces images to stretch and
        //serves as the positioning reference for controls.
        container = container || false;
        if (container) {
            container.className += ' containerSlide';
            container.style.position = 'relative';
            container.style.display = 'inline-block';
            container.style.textAlign = 'center';
            container.style.lineHeight = 0; //Solves issue in HTML5 about a gap between container and the bottom of slide images
            container.style.color = elementDefs.cssFgColor;
            container.style.background = elementDefs.cssBgColor;
            container.style.borderRadius = elementDefs.cssRadius;
            $(container).css(noSelect);
            return;
        }

        //No container provided => carries on to create library of elements
        navCommonStyle = $.extend({
            display: 'block',
            position: 'absolute',
            width: elementDefs.cssButtonSize,
            height: elementDefs.cssButtonSize,
            opacity: elementDefs.cssOpacity,
            'background-color': elementDefs.cssBgColor,
            cursor: 'pointer',
            color: 'transparent',   //colour for text character used to force line-height (see elementLib below)
            'line-height': elementDefs.cssButtonSize,
            'font-size': 0.1,       //in IE9, a font-size of 0 still seems not to force line-height
            'text-align': 'center',
            'border-radius': elementDefs.cssButtonSize
        }, noSelect);

        buttonSize = parseInt(elementDefs.cssButtonSize, 10);
        sectionHeight = buttonSize / 5;
        headCommonStyle = {
            display: 'inline-block',
            width: 0,
            height: 0,
            'border-top': sectionHeight + 'px solid transparent',
            'border-bottom': sectionHeight + 'px solid transparent',
            'vertical-align': 'middle'
        };

        tailCommonStyle = {
            display: 'inline-block',
            width: buttonSize / 3,
            height: Math.floor(sectionHeight) - (Math.floor(sectionHeight) % 2),   //correct height so that it's an even number (perfect vertical centering)
            background: elementDefs.cssFgColor,
            'vertical-align': 'middle'
        };

        vBarCommonStyle = {
            display: 'inline-block',
            width: sectionHeight / 3,
            height: buttonSize * 0.4,
            background: elementDefs.cssFgColor,
            'vertical-align': 'middle'
        };

        loadElem = document.createElement('img');
        loadElem.className = 'loadingSlide';
        loadElem.src = elementDefs.loadingImg;
        loadElem.style.padding = elementDefs.cssPadding;
        loadElem.style.backgroundColor = elementDefs.cssBgColor;
        loadElem.style.opacity = elementDefs.cssOpacity;
        loadElem.style.borderRadius = elementDefs.cssRadius;
        loadElem.style.top = '50%';
        loadElem.style.left = '50%';

        firstElem = document.createElement('img');
        firstElem.alt = elementDefs.altAttr;
        firstElem.style.width = '100%';
        firstElem.style.height = 'auto';
        firstElem.style.borderRadius = elementDefs.cssRadius;
        slideElem = firstElem.cloneNode(false);
        firstElem.className = 'firstSlide';

        slideElem.style.position = 'absolute';
        slideElem.style.top = '0';
        slideElem.style.left = '0';
        slideElem.style.visibility = 'hidden';
        slideElem.style.opacity = '0';

        countElem = document.createElement('span');
        countElem.className = 'countSlide';
        countElem.style.display = 'none';   //in case the presentation is just 1 slide long
        countElem.style.position = 'absolute';
        countElem.style.bottom = '0';
        countElem.style.left = '25%';
        countElem.style.right = '25%';
        countElem.style.backgroundColor = 'transparent';
        countElem.style.cursor = 'default';
        countElem.innerHTML = '<span><span>1</span>/</span>';

        countChild = countElem.firstChild;
        countChild.style.display = 'inline-block';
        countChild.style.padding = '0 ' + elementDefs.cssPadding;
        countChild.style.lineHeight = elementDefs.cssLineHeight;
        countChild.style.fontSize = elementDefs.cssFontSize;
        countChild.style.fontFamily = elementDefs.cssFontFamily;
        countChild.style.fontWeight = 'bold';
        countChild.style.borderRadius = elementDefs.cssRadius + ' ' + elementDefs.cssRadius + ' 0 0';
        countChild.style.opacity = elementDefs.cssOpacity;
        countChild.style.backgroundColor = elementDefs.cssBgColor;

        elementLib = {
            //Skip forward to the last slide
            $skipF: $('<span/>', {
                'class': 'controlSlide hideLastSlide skipFSlide',
                css: $.extend({}, navCommonStyle, {
                    right: elementDefs.cssSeparation,
                    bottom: elementDefs.cssSeparation
                }),
                html: $('<span/>', {
                    css: $.extend({}, headCommonStyle, {
                        'border-left': tailCommonStyle.width + 'px solid ' + elementDefs.cssFgColor
                    })
                }).add($('<span/>', {css: vBarCommonStyle})).add(document.createTextNode('.'))
            //Note: some browsers like Iceweasel (v. 24.3.0) seem not to apply line-height unless at least
            //one text node is present. This applies to CSS shapes since they are just dimensionless empty spans
            //with borders. Hence the appending of a transparent '.'
            }),

            //Skip back to first slide
            $skipB: $('<span/>', {
                'class': 'controlSlide hideFirstSlide skipBSlide',
                css: $.extend({}, navCommonStyle, {
                    left: elementDefs.cssSeparation,
                    bottom: elementDefs.cssSeparation
                }),
                html: $('<span/>', {css: vBarCommonStyle}).add($('<span/>', {
                    css: $.extend({}, headCommonStyle, {
                        'border-right': tailCommonStyle.width + 'px solid ' + elementDefs.cssFgColor
                    })
                })).add(document.createTextNode('.'))
            }),

            //Next button
            $next: $('<span/>', {
                'class': 'controlSlide hideLastSlide nextSlide',
                css: $.extend({}, navCommonStyle, {
                    display: 'none',    //in case the presentation is just 1 slide long
                    right: elementDefs.cssSeparation,
                    top: '50%',
                    'margin-top': '-' + (buttonSize / 2) + 'px'
                }),
                html: $('<span/>', {css: tailCommonStyle}).add($('<span/>', {
                    css: $.extend({}, headCommonStyle, {
                        'border-left': tailCommonStyle.width + 'px solid ' + elementDefs.cssFgColor
                    })
                })).add(document.createTextNode('.'))
            }),

            //Previous button
            $prev: $('<span/>', {
                'class': 'controlSlide hideFirstSlide prevSlide',
                css: $.extend({}, navCommonStyle, {
                    left: elementDefs.cssSeparation,
                    top: '50%',
                    'margin-top': '-' + (buttonSize / 2) + 'px'
                }),
                html: $('<span/>', {
                    css: $.extend({}, headCommonStyle, {
                        'border-right': tailCommonStyle.width + 'px solid ' + elementDefs.cssFgColor
                    })
                }).add($('<span/>', {css: tailCommonStyle})).add(document.createTextNode('.'))
            }),

            //Link button
            $link: $('<a/>', {
                'class': 'controlSlide linkSlide',
                target: '_blank',
                css: $.extend({}, navCommonStyle, {
                    right: elementDefs.cssSeparation,
                    top: elementDefs.cssSeparation,
                    'border-radius': elementDefs.cssRadius
                }),
                html: $('<img/>', {
                    width: 'auto',
                    height: sectionHeight * 2,
                    css: {'vertical-align': 'middle'}
                }).add(document.createTextNode('.'))
            }),

            //Slide counter
            count: countElem,

            //Loading indicator image
            load: loadElem,

            //First slide
            first: firstElem,

            //Other slides
            slide: slideElem
        };
    }

    /**
     * Creates a new PicoSlides instance representing a different set of slides.
     * @param {Element} elem Container for all slide images.
     * @param {Object} options Literal with slideset options.
     * @constructor
     */
    PicoSlides = function (elem, options) {
        this.elem = elem;       //Native object for main container
        this.$elem = $(elem);   //jQuery object for main container
        this.options = options; //Specified once for all instances (group-wide settings). See fn.picoSlides below.
        this.metadata = this.$elem.data('options'); //Specified inline in the container's tag (individual settings)
        this.sourceUrl = this.$elem.data('src');    //URL of the presentation on Slideshare
        this.toLoad = -1;       //number of slides left to load
        this.counter = null;    //Native span element for the slide counter
        this.loadingImg = null; //Native img element for the loading indicator
        this.currentSlide = null; //Native img element for slide currently being displayed
    };

    /**
     * Defaults and methods
     */
    PicoSlides.prototype = {
        defaults: {
            aspectRatio: 3 / 4,     //Common aspect ratio of slides
            imgMaxWidth: 0,         //Max width of slide images in pixels requested from server. If 0, it takes the container's width.
            nextTitle: 'Next',      //Tooltip text for 'Next' button
            prevTitle: 'Previous',  //Tooltip text for 'Previous' button
            skipFTitle: 'Skip to last slide',   //Tooltip text for 'Skip forward' button
            skipBTitle: 'Skip to first slide',  //Tooltip text for 'Skip back' button
            fadeDuration: 0,        //Time length of fade-in effects in milliseconds. If 0, there's no fade-in
            seqLoad: true,          //Multiple slides can be loaded by number or not
            lazyLoad: {},           //Options for Lazy Loading first slide. If false, Lazy Load is not used (autodection cancelled).
            linkUrl: 0,             //URL for bottom link.  If 0, it's the presentation's URL on SlideShare
                                    //                      If false, no link button is displayed
            linkIcon: 0,            //Icon for bottom link. If 0, favicon at link URL is used instead
            linkTitle: 'View on SlideShare',    //Tooltip text for bottom link
            linkHides: true,            //The link can be shown only on the first and last slides
            holderTheme: 'picoSlide',   //Theme for Holder plugin. picoSlide = blank space coloured in cssBgColor. False = Holder not used.
            apiUrl: 'http://www.slideshare.net/api/oembed/2?url=',  //Oembed API's URL
            loadFirst: function () {},  //Callback after loading first slide image
            loadAll: function () {},    //Callback after loading all of the slides
            timeoutErr: 'The connection has timed out',
            missAttrErr: 'Missing expected attribute "data-src"',
            timeout: 15000
        },

        /**
         * Initialisation: styles main container and adds loading indicator before retrieving embedding
         * information and showing the first slide.
         */
        init: function () {
            this.settings = $.extend({}, this.defaults, this.options, this.metadata);
            elementLibrary(this.elem);
            this.loadingImg = this.elem.appendChild(elementLib.load.cloneNode(false));
            this.getCover();
            this.elem.thisRef = this;
            //The thisRef is for later use within onload event handlers (see 'onLoadHandler' function)
            //This is to avoid creating a function object for event handlers inside a for loop (see 'scaffolding' function).
            return this;
        },

        /**
         * Changes visual cues (cursor and progress indicator) according to the loading state of certain elements.
         * @param {Boolean} wait: True if element(s) not loaded yet. False if they already are.
         */
        loading: function (wait) {
            if (wait) {
                this.elem.style.cursor = 'wait';
                this.loadingImg.style.display = 'block';
            } else {
                this.elem.style.cursor = 'default';
                this.loadingImg.style.display = 'none';
            }
        },

        /**
         * Onload handler for all images except the first one in a given slide set. Counts down the
         * remaining slides to load so that the indicator is hidden only once all of them have been loaded.
         * It then executes a user-defined callback function and frees up memory if possible. Finally, it
         * forces images to load sequentially if the relevant option is enabled.
         * @param {Object} event: the object with contextual information about the event.
         */
        onLoadHandler: function () {
            var nextElem,
                _this;

            _this = this.parentNode.thisRef;
            nextElem = this.nextSibling;

            //Hides loading indicator and executes callback once all images have been loaded
            _this.toLoad -= 1;
            if (_this.toLoad === 0) {
                _this.loading(false);
                _this.settings.loadAll.call(_this.$elem);

                //Free up some memory after last slideset is fully loaded (element library not needed anymore)
                setsToLoad -= 1;
                if (setsToLoad === 0) {
                    elementLib = null;
                }
            }

            //On sequential mode, except for the last slide, adds src attribute only once previous image has loaded
            if (_this.settings.seqLoad && !this.className.match(/\blastSlide\b/)) {
                nextElem.setAttribute('src', nextElem.getAttribute('data-src'));
            }

            //Load listener not needed anymore
            this.onload = null;
        },

        /**
         * Displays a new slide with a fade-in transition and hiding controls if appropriate
         * @param newSlide: DOM object of slide image to be displayed
         * @param changeLink: true if link changes according to slide number
         */
        fadeInSlide: function (newSlide, changeLink) {
            var newSlideNum;    //number of slide to be displayed

            //Slide to display is first or last one? => prev arrow or next arrow hidden respectively
            if (newSlide.className.match(/\bfirstSlide\b/)) {
                this.$elem.find('span.hideFirstSlide').hide();
                this.$elem.find('span.hideLastSlide, a.controlSlide').show();
            } else if (newSlide.className.match(/\blastSlide\b/)) {
                this.$elem.find('span.hideLastSlide').hide();
                this.$elem.find('span.hideFirstSlide, a.controlSlide').show();

            //In between? => shows everything (incl. link to Slideshare if applicable)
            } else {
                this.$elem.find('span.controlSlide').show();
                if (this.settings.linkHides) {
                    this.$elem.find('a.controlSlide').hide();
                }
            }

            //Updates counter and changes bottom link's URL to corresponding slide on Slideshare
            newSlideNum = $(newSlide).index() + 1;
            this.counter.innerHTML = newSlideNum;
            if (changeLink) {
                this.$elem.find('a.controlSlide').attr('href', this.settings.linkUrl + newSlideNum);
            }

            //Unhides slide to be shown. Uses visibility as fallback for older browsers (opacity is still 0).
            newSlide.style.visibility = 'visible';

            //Fades corresponding slide in.
            $(newSlide).fadeTo(this.settings.fadeDuration, 0.99); //final opacity = .99 to avoid flicker on Firefox (bug 187608)

            //Hides slide on display and update slideset's pointer to current slide.
            this.currentSlide.style.visibility = 'hidden';
            this.currentSlide.style.opacity = 0;
            this.currentSlide = newSlide;
        },

        /**
         *  Adds required HTML, displays controls and attaches to them event listeners for deferred loading
         *  and slide navigation.
         *  @param data: object from JSON data retrieved from SlideShare
         */
        scaffolding: function (data) {
            var $firstSlide,    //jQuery object for first slide image
                controlNext,    //Native span element for 'Next' nav button (contains non-semantic markup for CSS shape)
                docFrag,        //document fragment used when adding new elements to DOM
                changeLink,     //make link point to corresponding slide on Slideshare
                newElem,        //native element to be appended to the DOM
                srcAttr,        //either src or data-src (for use in sequential loading)
                urlSuffix,      //last part of URL that identifies slide image
                widthSlide,     //Width of slide image as extracted from URL (for widths equal to 1024, width and height fields given by API do not coincide with real dimensions of image)
                heightSlide,    //Height of slide image (as calculated from the width and aspect ratio)
                totalSlides,    //Number of slides as obtained from Oembed API
                _this,          //backup reference to picoSlides object (for use within functions)
                i;

            //Initialisations
            docFrag = document.createDocumentFragment();
            changeLink = false; //Do not change the link's URL to point to corresponding slide when moving to the next slide.
            urlSuffix = data.slide_image_baseurl_suffix + '?cb=' + data.version_no;
            widthSlide = data.slide_image_baseurl_suffix.split(/[-.]/)[1];
            heightSlide = Math.round(widthSlide * this.settings.aspectRatio);
            totalSlides = data.total_slides;
            this.toLoad = totalSlides;
            _this = this;

            //Feedback: show loading indicator (centered on image) and wait cursor
            this.loadingImg.style.position = 'absolute';
            this.loadingImg.style.marginLeft = '-' + ($(this.loadingImg).width() / 2 + parseInt(elementDefs.cssPadding, 10)) + 'px';
            this.loadingImg.style.marginTop = '-' + ($(this.loadingImg).height() / 2 + parseInt(elementDefs.cssPadding, 10)) + 'px';
            this.loading(true);

            //Builds and prepares first slide, next button and counter for DOM insertion
            this.currentSlide = elementLib.first.cloneNode(false);
            this.currentSlide.width = widthSlide;
            this.currentSlide.height = heightSlide;
            this.currentSlide.setAttribute(elementDefs.lazyAttr, data.slide_image_baseurl + '1' + urlSuffix);
            $firstSlide = $(this.currentSlide);
            docFrag.appendChild(this.currentSlide);

            controlNext = elementLib.$next[0].cloneNode(true);
            controlNext.title = this.settings.nextTitle;
            docFrag.appendChild(controlNext);

            this.counter = elementLib.count.cloneNode(true);
            this.counter.firstChild.appendChild(document.createTextNode(totalSlides));
            docFrag.appendChild(this.counter);

            //Builds and sets up bottom link button if enabled
            if (this.settings.linkUrl !== false) {

                //Uses the url of the slides on Slideshare by default
                if (this.settings.linkUrl === 0) {
                    this.settings.linkUrl = this.sourceUrl + '/';
                    changeLink = true;
                }

                //Uses the favicon found at the provided link URL by default
                if (this.settings.linkIcon === 0) {
                    this.settings.linkIcon = /^https?:\/\/[^\/]+/.exec(this.settings.linkUrl) + '/favicon.ico';
                }

                //Adds the HTML for the link button
                newElem = elementLib.$link[0].cloneNode(true);
                newElem.title = this.settings.linkTitle;
                newElem.href = this.settings.linkUrl;
                newElem.firstChild.src = this.settings.linkIcon;
                docFrag.appendChild(newElem);
            }

            //Adds all elements created so far to the container's top
            this.elem.insertBefore(docFrag, this.elem.firstChild);

            //Add action for first slide
            this.currentSlide.onload = function () {

                //If Holder or Lazy Load plugins present, waits till second load event (first triggered by placeholder)
                if (this.className.match(/\benabled\b/)) {
                    _this.toLoad -= 1;
                    _this.loading(false);

                    //Only sets up navigation if more than one slide.
                    if (totalSlides > 1) {
                        controlNext.style.display = 'block';
                        _this.counter.style.display = 'block';
                        _this.counter = _this.counter.firstChild.firstChild;

                        //First click on 'next' button triggers the insertion of remaining DOM elements
                        $(controlNext).one('click', function () {
                            _this.loading(true);
                            docFrag = document.createDocumentFragment();

                            //Prevents image load if sequential mode enabled
                            if (_this.settings.seqLoad) {
                                srcAttr = 'data-src';
                            } else {
                                srcAttr = 'src';
                            }

                            //Create the DOM elements, seting each image's URL accordingly
                            for (i = 2; i <= totalSlides; i += 1) {
                                newElem = elementLib.slide.cloneNode(false);
                                newElem.setAttribute(srcAttr, data.slide_image_baseurl + i + urlSuffix);
                                newElem.onload = _this.onLoadHandler;
                                docFrag.appendChild(newElem);
                            }

                            //Mark last slide image out
                            newElem.className = 'lastSlide';

                            //Creates element for 'previous' button and sets it up for insertion
                            newElem = elementLib.$prev[0].cloneNode(true);
                            newElem.title = _this.settings.prevTitle;
                            docFrag.appendChild(newElem);

                            //Creates element for 'skip forward' button and sets it up for insertion
                            newElem = elementLib.$skipF[0].cloneNode(true);
                            newElem.title = _this.settings.skipFTitle;
                            docFrag.appendChild(newElem);

                            //Creates element for 'skip back' button and sets it up for insertion
                            newElem = elementLib.$skipB[0].cloneNode(true);
                            newElem.title = _this.settings.skipBTitle;
                            docFrag.appendChild(newElem);

                            //Inserts newly created elements into DOM
                            _this.elem.insertBefore(docFrag, this);

                            //Triggers sequential loading if applicable: adds src for second slide
                            if (_this.settings.seqLoad) {
                                $firstSlide.next()[0].src = $firstSlide.next()[0].getAttribute('data-src');
                            }

                            //Navigation events
                            _this.$elem.delegate('.controlSlide', 'click', function () {

                                //Skip to last
                                if (this.className.match(/\bskipFSlide\b/)) {
                                    if (!_this.currentSlide.className.match(/\blastSlide\b/)) {
                                        _this.fadeInSlide(_this.elem.children[totalSlides - 1], changeLink);
                                    }

                                //Skip to first
                                } else if (this.className.match(/\bskipBSlide\b/)) {
                                    if (!_this.currentSlide.className.match(/\bfirstSlide\b/)) {
                                        _this.fadeInSlide(_this.elem.firstChild, changeLink);
                                    }

                                //Next
                                } else if (this.className.match(/\bnextSlide\b/)) {
                                    if (!_this.currentSlide.className.match(/\blastSlide\b/)) {
                                        _this.fadeInSlide(_this.currentSlide.nextSibling, changeLink);
                                    }

                                //Previous
                                } else if (this.className.match(/\bprevSlide\b/)) {
                                    if (!_this.currentSlide.className.match(/\bfirstSlide\b/)) {
                                        _this.fadeInSlide(_this.currentSlide.previousSibling, changeLink);
                                    }
                                }
                            });
                        });
                    }

                    //Fades control in on hover
                    _this.$elem.delegate('.controlSlide', {
                        mouseenter: function () {
                            $(this).stop(false).animate({opacity: 0.99}, _this.settings.fadeDuration);
                        },
                        mouseleave: function () {
                            $(this).stop(false).animate({opacity: elementDefs.cssOpacity}, _this.settings.fadeDuration);
                        }
                    });

                    //Executes user-defined callback after loading first slide
                    _this.settings.loadFirst.call(_this.$elem);

                    //Load listener for first slide image is not needed anymore
                    this.onload = null;

                } else {
                    $(this).addClass('enabled');
                }
            };

            //If Holder plugin present and autodetection enabled, show fluid placeholder while first slide loads
            //Canvas fallback doesn't resize on Android 2.1 at least (even with 'auto', dimensions remain fixed).
            //As a temporary fix, the dimensions fed to Holder are computed ones, as opposed to the 'width' and 'height' attributes in the IMG tag.
            if ((typeof Holder !== 'undefined') && (_this.settings.holderTheme !== false)) {
                $firstSlide.attr('data-src', 'holder.js/' + $firstSlide.width() + 'x' + Math.round($firstSlide.width() * _this.settings.aspectRatio) + '/auto/' + _this.settings.holderTheme);
                //$firstSlide.attr ('data-src', 'holder.js/' +$firstSlide.attr('width')+ 'x' +$firstSlide.attr('height')+ '/auto/' +_this.settings.holderTheme);

                //No custom Holder theme defined => get rid of default text and use solid background
                if (_this.settings.holderTheme === 'picoSlide') {
                    Holder.add_theme('picoSlide', {background: elementDefs.cssBgColor, text: ' '}); // jshint ignore:line
                }
                Holder.run({images: $firstSlide[0]}); // jshint ignore:line
            }

            //If Lazy Load plugin present and autodetection enabled, apply it to first slide. First load event will not count (triggered by lazyload's own placeholder).
            if ($.fn.lazyload && (_this.settings.lazyLoad !== false)) {
                $firstSlide.lazyload(_this.settings.lazyLoad);

            //Just load the image straight away.
            } else {
                $firstSlide.addClass('enabled').attr('src', $firstSlide.attr(elementDefs.lazyAttr));
            }
        },

        /**
         * Requests data from Slideshare through the Oembed API and, if everything is OK,
         * inserts the necessary elements to show the first slide.
         */
        getCover: function () {
            var url,    //full request URL for embedding information using Oembed
                _this = this;

            //data-src attribute present => request data on first slide, set up deferred loading of the rest and add features from other plugins.
            if (this.sourceUrl) {
                url = this.settings.apiUrl + this.sourceUrl + '&format=jsonp';    //Very ocassionally (esp. poor connection), server responds with XML => force jsonp
                if (!this.settings.imgMaxWidth) {                       //By default, dimensions according to container's width
                    this.settings.imgMaxWidth = this.$elem.width();     //If the container has no fixed width, fetches smallest image
                }
                url += '&maxwidth=' + this.settings.imgMaxWidth;        //Request image of equal or smaller width

                //Jsonp request
                $.ajax({
                    type: 'GET',
                    url: url,
                    dataType: 'jsonp',
                    timeout: this.settings.timeout

                    //If request successful, show first slide and minimal navigation controls.
                }).done(function (data) {
                    _this.scaffolding(data);

                //Show feedback upon timeout
                }).fail(function (j, t, e) {  // jshint ignore:line
                    if (t === 'timeout') {
                        _this.$elem.html(_this.settings.timeoutErr);
                    }
                });

            //data-src attribute not found in main container
            } else {
                _this.$elem.html(_this.settings.missAttrErr);
            }
        }
    };

    //Adds the plugin to the jQuery.fn object
    $.fn.picoSlides = function (slideOps) {
        elementLibrary();    //populates the library once for all subsequent PicoSlides instances
        setsToLoad = this.length;
        return this.each(function () {
            new PicoSlides(this, slideOps).init();
        });
    };

    //Exposes the PicoSlides object and makes all default values public
    PicoSlides.slideDefs = PicoSlides.prototype.defaults;  //Now they can be set globally (for all sets of slides)
    PicoSlides.elemDefs = elementDefs;
    window.PicoSlides = PicoSlides;
}(window, jQuery, document));