picoSlides
==========

<img src="http://hqcasanova.github.io/picoSlides/picoSlides.png" align="left" hspace="10" vspace="1">

Trying to craft a nifty gallery of presentations but IFRAMEs keep getting in the way? That's what *picoSlides* is for: a **jQuery plugin** for directly embedding *SlideShare* presentations without using IFRAMEs. It leverages SlideShare's [oEmbed API](http://www.slideshare.net/developers/oembed) to offer a **responsive** interface that enables optimal use of bandwidth and simple slide navigation. Two features set this plugin apart:

- **Adaptive slide images**: fetches device-appropriate versions of images depending on the dimensions of the slideset container. See the [`imgMaxWidth` option](http://github.com/hqcasanova/picoSlides#slide-related-interface-holder-and-lazy-load-options-callbacks-and-errors).

- **Lazy slide loading**: the first slide image is used as a preview poster of the whole presentation, a la YouTube.  The remaining slides are downloaded only if the user hits the 'Next' button.

![Responsive SlideShare Embeds](http://hqcasanova.github.io/picoSlides/responsive.jpg)

You can check out the plugin in action on the [project page](http://hqcasanova.github.io/picoSlides/). Read [below](http://github.com/hqcasanova/picoSlides#features) for a list of all the features.

Quick Setup
-----------

To install with default [options](http://github.com/hqcasanova/picoSlides#options), follow the steps below:

1. **Download the [latest release](https://github.com/hqcasanova/picoSlides/releases)** from GitHub. Alternatively, you can use the Bower or NPM repositories:
	```bash
	bower install picoSlides
	```
	```bash
	npm install picoslides
	```
	Notice that an all-lowercase name must be provided to NPM.

2. Include the **`picoSlides.min.js` script in your HTML**:
	```html
	<script src="picoSlides.min.js"></script>
	```

3. If not present already, include **`jQuery.js` (version 1.6.0 at least)** too:
	```html
	<script src="jquery.min.js"></script>
	```

4. For each presentation, **add a `data-src` attribute** pointing to its URL on SlideShare:
	```html
	<span class="slides" data-src="http://www.slideshare.net/hqcasanova/adapro"></span>
	```
	The container can be any tag and may be given a class to facilitate selection. However, the latter is not required either.

5. Finally, **call the picoSlides plugin** on all containers:
	```javascript
	$('span.slides').picoSlides();
	```

Features
--------

- **Compatible with all modern browsers**: tested in IE8+, Android 2.1+, iPhone 3+ and various versions of other browsers (Firefox/IceWeasel and Chromium).
- **Auto-detects Lazy Load and Holder***: ensures smooth lazy loading of the first slide image. Includes [options](http://github.com/hqcasanova/picoSlides#options) that control Holder's theme and Lazy Load's behaviour.
- **Highly customisable**: from slide aspect ratio, through button size to callback functions; there's an [option](http://github.com/hqcasanova/picoSlides#options) for nearly everything.
- **Responsive design**: by default, slide image size depends on the width of the container and thumb-friendly buttons are provided.
- **Bandwidth efficient**: slide images can be made adaptive. Also, only the cover slide is shown at first. The remaining slides are "lazy loaded".
- **Self-contained**: doesn't require loading any additional CSS or image file. All navigation icons are CSS shapes.
- **Multi-language**: all displayed text can be customised.

*Please note that neither Lazy Load nor Holder are required. In fact, if the relative `width` of the slides' container is set on page load and the aspect ratio is known, a better alternative to Holder would be [CSS proportional resizing](http://wellcaffeinated.net/articles/2012/12/10/very-simple-css-only-proportional-resizing-of-elements/). That's precisely the technique used on the [project page](http://hqcasanova.github.io/picoSlides/):

```css
body > span {
	display: inline-block;
	overflow: hidden;
	width: 33.3%;          /* 3-column layout */
	padding-top: 24.95%;   /* aspect ratio 4:3 */
}
span.containerSlide > img:first-child {
	position: absolute;    /* counteracts fixed height */
	top: 0;
	left: 0;
}
```

Minimum Requirements
--------------------

- **Modern browser**: the plugin's functionality on outdated browsers such as IE6/7 is severely limited. Nevertheless, it degrades as gracefully as possible. IE8 is supported.
- **jQuery 1.6.0+**: though still usable with jQuery 1.5, full functionality and satisfactory performance is only guaranteed with 1.6. Notice also that jQuery 2.x does not support IE6-8.

Options
-------

There are two kinds of settings: those having to do with the slides and those more related to the HTML elements used in the plugin. Below is a list of all of them, including their default values indicated in italics.

#### Slide-related: interface, Holder and Lazy Load options, callbacks and errors

- `aspectRatio` *3 / 4*: common aspect ratio of slides.
- `imgMaxWidth` *0*: corresponds to the `maxwidth` parameter in the [oEmbed API](http://www.slideshare.net/developers/oembed). It is effectively the minimum width in pixels of the slide images to be fetched. If equal to `0`, it takes the container's width. However, if the container has no defined width, then the smallest image is fetched. SlideShare currently serves slide images with the following dimensions:
  * 320 × 240
  * 425 × 319
  * 1024 × 768
- `nextTitle` *'Next'*: tooltip text for 'Next' button.
- `prevTitle` *'Previous'*: tooltip text for 'Previous' button.
- `skipFTitle` *'Skip to last slide'*: tooltip text for 'Skip forward' button.
- `skipBTitle` *'Skip to first slide'*: tooltip text for 'Skip back' button.
- `fadeDuration` *0*: time length of all fade-in effects in milliseconds. It corresponds to the `duration` parameter of jQuery's fadeIn and fadeOut functions. If equal to `0`, there's no fade-in.
- `seqLoad` *true*: if enabled, multiple slides are forced to be downloaded and displayed according to slide number. Set to `false` for better performance.
- `lazyLoad` *{}*: options for lazy loading the first slide. Equivalent to the object passed to the `lazyload()` function. If `false`, Lazy Load is not used even if present.
- `linkUrl` *0*: URL for bottom link.  If equal to `0`, it's the presentation's URL on SlideShare. If `false` instead, then no link button is displayed.
- `linkIcon` *0*: icon for bottom link. If equal to `0`, the favicon at the link's URL is used instead.
- `linkTitle` *'View on SlideShare'*: tooltip text for the bottom link.
- `linkHides` *true*: the link can be shown only on the first and last slides.
- `holderTheme` *'picoSlide'*: theme for Holder plugin. The default `picoSlide` theme makes the placeholder blank with its background colour being [`cssBgColor`](http://github.com/hqcasanova/picoSlides#element-related-attributes-loading-indicator-and-css-styles). A value of `false` disables the use of Holder, even if present.
- `apiUrl` *'http://www.slideshare.net/api/oembed/2?url='*: oEmbed API's URL.
- `loadFirst` *function () {}*: callback after loading first slide image.
- `loadAll` *function () {}*: callback after loading all of the slides.
- `timeoutErr` *'The connection has timed out'*: error message displayed after timeout.
- `missAttrErr` *'Missing expected attribute "data-src"'*: error message displayed when no `data-src` attribute is found.
- `timeout` *15000*: timeout in milliseconds for the request to the oEmbed service.

#### Element-related: attributes, loading indicator and CSS styles.

- `altAttr` *''*: alt attribute for all img elements.
- `lazyAttr` *'data-original'*: lazy Load plugin's name for src attribute.
- `loadingImg` *base-64 gif*: animated image displayed while loading in progress.
- `cssButtonSize` *'45px'*: size of all controls.
- `cssPadding` *'15px'*: default padding for secondary containers (loading indicator and slide counter).
- `cssFontSize` *'.9em'*: default font size for all text elements.
- `cssLineHeight` *'1.5em'*: default line height for all text elements.
- `cssFontFamily` *'sans-serif'*: default font family for all text elements.
- `cssBgColor` *'gray'*: background colour for controls and main container.
- `cssFgColor` *'white'*: foreground colour for text and control symbols.
- `cssSeparation` *'1.5%'*: default separation between edge of slides container and controls.
- `cssRadius` *'0px'*: border radius of all elements.
- `cssOpacity` *0.65*: opacity of all interface elements.

#### Usage

Slide-related settings can be changed at the global, selection and instance levels. On the other hand, element-related settings can only be changed globally.

- **Global level**: changes at this level affect all the presentations.

```javascript
PicoSlides.slideDefs.imgMaxWidth = 1024;
PicoSlides.elemDefs.cssRadius = '10px';
```

- **Selection level**: changes affect the presentations within a certain jQuery selection.

```javascript
$('span.slides').picoSlides ({nextTitle: 'Next slide',
                              prevTitle: 'Previous slide',
                              linkTitle: 'Check it out on SlideShare!'});
```

- **Instance level**: changes here are specified in the HTML, through a `data-options` attribute of the container for a specific presentation.

```html
<span data-src="http://www.slideshare.net/hqcasanova/adapro"
      data-options='{"linkUrl": "http://adapro.iter.es",
                     "linkIcon": "http://adapro.iter.es/favicon.ico",
                     "linkTitle": "Official project webpage"}'
      class="slides"
></span>
```

Plugin Architecture
-------------------

- The plugin's structure is based on the **"highly configurable" pattern** proposed by [Mark Dalgleish](http://markdalgleish.com/2011/05/creating-highly-configurable-jquery-plugins/).
- To minimise the performance penalty derived from DOM manipulation and the heavy use of inline styles, a kind of **factory pattern** is employed. All DOM elements are generated only once and stored in an object that acts as a "library" of elements. Whenever insertion is due, the relevant element is pulled from the library and cloned.
- Each slideset has the following basic HTML structure, assuming a `<div>` tag as the container:

```html
  <div class="containerSlide">
  	<img class="firstSlide" />
  	...
  	<img class="lastSlide" />
  	<span class="controlSlide hideFirstSlide prevSlide"></span>   <!-- 'Previous' button -->
  	<span class="controlSlide hideLastSlide skipFSlide"></span>   <!-- 'Skip forward' button -->
  	<span class="controlSlide hideFirstSlide skipBSlide"></span>  <!-- 'Skip backward' button -->
  	<span class="controlSlide hideLastSlide nextSlide"></span>    <!-- 'Next' button -->
  	<span class="countSlide"></span>                              <!-- Slide counter -->
  	<span class="loadingSlide"></span>                            <!-- Loading indicator -->
  </div>
```
- The plugin tries to make **minimal use of jQuery**. Future implementations will ultimately be library-agnostic.

License
-------

All code is licensed under the [MIT License](http://en.wikipedia.org/wiki/MIT_License). In essence, use and modify at your own peril and leave the copyright header intact.

Feedback
--------

If you find a bug or shortcoming while using the plugin, please feel free to report it using github's [issue tracker](https://github.com/hqcasanova/picoSlides/issues). For other matters, you are more than welcome to leave a message on my [website](http://www.hqcasanova.com). Let me know if you find *picoSlides* useful. Thank you.
