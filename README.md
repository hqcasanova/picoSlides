picoSlides
==========

A jQuery plugin for directly embedding SlideShare presentations without using iframes. It leverages SlideShare's oEmbed API to offer a responsive interface enabling optimal use of bandwidth and simple slide navigation. Its plethora of options allows, for instance, making the dimensions of any slide images to be fetched dependent on the size of the container for the slides. Also, the first slide image is used as preview of the whole presentation, downloading the rest of it only if the user goes to the next slide.

Quick Setup
-----------

Follow these steps for an installation with default [options](//github.com/hqcasanova/picoSlides#options):

1. If not present already, include **`jQuery.js` (version 1.6.0 at least)** in your HTML:
	```html
	<script src="jquery.js"></script>
	```

2. Include also the **`picoSlides.js` script**, preferably at the bottom; right before the closing body tag:
	```html
	<script src="picoSlides.js"></script>
	```

3. For each presentation, **add a `data-src` attribute** pointing to its URL on SlideShare:
	```html
	<span class="slides" data-src="http://www.slideshare.net/hqcasanova/adapro"></span>
	```
	The container can be any tag and may be given a class to facilitate selection. However, the latter is not required.

4. Finally, **call the picoSlides plugin** on all containers:
	```javascript
	$('span.slides').picoSlides();
	```

Features
--------

- **Compatible with all modern browsers**: tested in IE8+, Android 2.1+, iPhone 3+ and various versions of Firefox, IceWeasel and Chrome.
- **Compatible with Holder**: includes an [option](//github.com/hqcasanova/picoSlides#options) for customised Holder themes for the first slide.
- **Compatible with Lazy Load**: lazyload-specific [options](//github.com/hqcasanova/picoSlides#options) can be set for the first slide.
- **Highly customisable**: from slide aspect ratio, through font colour to callback functions; there's an [option](//github.com/hqcasanova/picoSlides#options) for nearly everything.
- **Responsive design**: by default, slide image size depends on the width of the container and thumb-friendly buttons are provided.
- **Bandwidth efficient**: only the cover slide is shown at first. The remaining slides are "lazy loaded", once the user goes past the first one.
- **Optimised footprint**: it's 10KB minified and doesn't require loading an additional CSS file.
- **Multi-language**: all displayed text can be customised.

Minimum Requirements
--------------------

- **Modern browser**: the plugin's functionality on outdated browsers such as IE6/7 is severely limited. Nevertheless, it degrades as gracefully as possible.
- **jQuery 1.6.0+**: though still usable with jQuery 1.5, full functionality and satisfactory performance is only guaranteed with 1.6

Options
-------

There are two kinds of settings: those having to do with the slides and those more related to the HTML elements used in the plugin. Below is a list of all of them, including their default values indicated in italics.

#### Slide-related: interface, Holder and Lazy Load options, callbacks and errors

- `aspectRatio` *3 / 4*: common aspect ratio of slides.
- `imgMaxWidth` *0*: maximum width of slides in pixels. If equal to `0`, it takes the container's width. However, if the container has no defined width, then the smallest image is fetched.
- `nextTitle` *'Next'*: tooltip text for 'Next' button.
- `prevTitle` *'Previous'*: tooltip text for 'Previous' button.
- `skipFTitle` *'Skip to last slide'*: tooltip text for 'Skip forward' button.
- `skipBTitle` *'Skip to first slide'*: tooltip text for 'Skip back' button.
- `fadeDuration` *0*: time length of all fade-in effects in milliseconds. It corresponds to the `duration` parameter of jQuery's fadeIn and fadeOut functions. If equal to `0`, there's no fade-in.
- `seqLoad` *true*: if enabled, multiple slides are forced to be downloaded and displayed according to slide number. Set to `false` for better performance.
- `lazyLoad` *{}*: options for lazy loading the first slide. Equivalent to the object passed to the `lazyload()` function.
- `linkUrl` *0*: URL for bottom link.  If equal to `0`, it's the presentation's URL on SlideShare. If `false` instead, then no link button is displayed.
- `linkIcon` *0*: icon for bottom link. If equal to `0`, the favicon at the link's URL is used instead.
- `linkTitle` *'View on SlideShare'*: tooltip text for the bottom link.
- `linkHides` *true*: the link can be shown only on the first and last slides.
- `holderTheme` *'picoSlide'*: theme for Holder plugin. The default `picoSlide` theme makes the placeholder blank with its background colour being [`cssBgColor`](//github.com/hqcasanova/picoSlides#element-related-attributes-loading-indicator-and-css-styles).
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
- `cssFontSize` *'.9em'*: default font size for all elements.
- `cssLineHeight` *'1.5em'*: default line height for all elements.
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
$('span.slides').picoSlides ({nextTitle: 'Next slide', prevTitle: 'Previous slide', linkTitle: 'Check it out on SlideShare!'});
```

- **Instance level**: changes here are specified in the HTML, through a `data-options` attribute of the container for a specific presentation.

```html
<span id="adapro" class="slides" data-src="http://www.slideshare.net/hqcasanova/adapro" data-options='{"linkUrl": "http://adapro.iter.es", "linkIcon": "http://adapro.iter.es/favicon.ico", "linkTitle": "Official project webpage"}'></span>
```

Live Example
------------

You can see the plugin in action [here](http://www.hqcasanova.com/en/projects/#glastir).

Plugin Architecture
-------------------

- The plugin's structure is based on the **"highly configurable" pattern** proposed by [Mark Dalgleish](http://markdalgleish.com/2011/05/creating-highly-configurable-jquery-plugins/).
- To minimise the performance penalty derived from the heavy use of inline styles, a kind of **factory pattern** is employed. All DOM elements are generated only once and stored in an object that acts as a "library" of elements. Whenever insertion is due, the relevant element is pulled from the library and cloned.
- The plugin makes **minimal use of jQuery**. Future implementations will be library agnostic.

License
-------

All code is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php). In essence, use and modify at your own peril and please keep the licence notice intact.

Feedback
--------

If you find a bug or shortcoming while using the plugin, please feel free to report it using github's [issue tracker](https://github.com/hqcasanova/picoSlides/issues). For other matters, you are more than welcome to leave a message on my [website](http://www.hqcasanova.com). Let me know if you find **picoSlides** useful. Thank you.