console.log("WOOHOO.");

var SLIDE_DURATION = 200;
var HIDE_INTERVAL = 4000;
var FADE_OUT_DURATION = 1000;
var RESIZE_INTERVAL = 100;

// "reading" vs "seeking" options
var SCROLL_DISTANCE_SAMPLES = 10; // Kind of a hack: the number of scroll-events ago to check if scroll-distance was surpassed
var SCROLL_SAMPLE_INTERVAL_MS = 50; // I have autocomplete ;)
var SCROLL_DISTANCE_TO_SHOW = 700; // Number of pixels after above constant scroll events to show minimap. -1 shows minimap on all scroll events

var mouseInside = false; // mouse inside minimap currently?
var draggingViewport = false; // currently dragging minimap viewport?


var scroll_samples;
scroll_samples = [];
// initialize scroll samples to current pos
var i;
for (i = 0; i < SCROLL_DISTANCE_SAMPLES; i += 1){
    scroll_samples[i] = document.body.scrollHeight;
}

window.setInterval(function() {
    scroll_samples.splice(0, 0, window.pageYOffset);
    scroll_samples.pop();
},SCROLL_SAMPLE_INTERVAL_MS);

var hideTimer, resizeTimer;
var minimap =
    '<div id="minimap">'+
    '    <div id="viewport"></div>'+
    '    <img id="mm-image">'+
    '</div>';

function hasVerticalScroll (element){
    if (element.style.overflow === 'hidden'){
        return false;
    } else if (window.getComputedStyle){
        if (window.getComputedStyle(element, null).overflow === 'hidden') return false;
    } else if (element.currentStyle) {
        if (element.currentStyle.overflow === 'hidden') return false;
    }
    return  document.body.scrollHeight > $(window).height();
}

function createMinimap() {
    $('body').append(minimap);
    $("#minimap").css("background-color",
                        $("body").css("background-color"));
    updatePageCanvas();
}

function updateViewport() {
    var bh = document.body.scrollHeight;
    var bw = document.body.scrollWidth;
    var mmw = $("#minimap").width();
    var mmh = $("#minimap").height();

    // scale viewport relative to full page size
    var ww = $(window).width();
    var wh = $(window).height();
    var wt = $(window).scrollTop();
    var vw = mmw * ww/bw;
    var vh = mmh * wh/bh;
    var left = mmw * $(window).scrollLeft()/bw;
    var top = mmh * wt/bh;

    // canvas box repositioning
    var ch = $("#mm-image").height();
    var percentage = (wt/bh);
    var mapMargin = -1*(ch - wh)*percentage;
   
    // only do it if the image is longer than the window
    if (ch > wh) {
        $("#minimap").css("margin-top", mapMargin);
    }

    $("#viewport").css({width: vw, height: vh,
                        marginLeft: left, marginTop: top});


}

function canvasRendered(canvas) {
    /* canvas is the actual canvas element,
       to append it to the page call for example
       document.body.appendChild( canvas );
    */

    var dataURL = canvas.toDataURL();
    $("#mm-image").attr("src", dataURL);
    updateViewport();
    $("#minimap").show();
}

function updatePageCanvas(){
    document.getElementById("minimap").style.display = "none";

    if (!hasVerticalScroll(document.body)) {
        return;
    }

    html2canvas( [ document.body ], {
                // general
        logging: false,

        // preload options
        proxy: false,
        timeout: 0,    // no timeout
        useCORS: true, // try to load images as CORS (where available), before falling back to proxy (not yet implemented?)
        allowTaint: false, // whether to allow images to taint the canvas, won't need proxy if set to true

        // parse options
        svgRendering: false, // use svg powered rendering where available (FF11+)
        iframeDefault: "default",
        ignoreElements: "IFRAME|OBJECT|PARAM",
        useOverflow: true,
        letterRendering: false,

        // render options

        flashcanvas: undefined, // path to flashcanvas
        width: null, // TODO: set size here instead?
        height: null,
        taintTest: true, // do a taint test with all images before applying to canvas
        renderer: "Canvas",
        onrendered: canvasRendered
    });
}

function scrollHandler() {
    var scrolledDistance = Math.abs(window.pageYOffset - scroll_samples[scroll_samples.length - 1]);

    if (scrolledDistance > SCROLL_DISTANCE_TO_SHOW) {
        showMinimap();
    }
}


function hideMinimap() {
    // Fading first to minimize distraction, consider doing them at the same time
    $("#minimap").stop().animate({"opacity":"0.2"},FADE_OUT_DURATION);
    $("#viewport").stop().animate({"opacity":"0.0"},{"duration":FADE_OUT_DURATION,"queue":false});
    $("#minimap").animate({"right":"-160px"},SLIDE_DURATION);
}

function showMinimap() {
    if (mouseInside) {return;} // Its already showing, i promise
    $("#minimap").stop().animate({"right":"16px","opacity":"1.0"},SLIDE_DURATION);
    $("#viewport").stop().animate({"opacity":"0.2"},{"duration":SLIDE_DURATION,"queue":false});
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideMinimap,HIDE_INTERVAL);
}

$(document).ready(function(){
    createMinimap();

    $('#minimap').live('mouseenter', function() {
        showMinimap();
        mouseInside = true;
        clearTimeout(hideTimer);
    }).live('mouseleave', function() {
        mouseInside = false;
        hideTimer = setTimeout(hideMinimap,HIDE_INTERVAL);
    }).live('mousedown', function(e){
        e.preventDefault();
        draggingViewport = true;
    });

    $(window).resize(function(){
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(updatePageCanvas, RESIZE_INTERVAL);
    });

    $(window).scroll(scrollHandler);
    $(window).bind('scroll resize', updateViewport);

});

function scrollViewport(pageY){
    if (draggingViewport){
        var y = pageY - $("#minimap").offset().top;
        var mmh = $("#minimap").height();
        var wh = $(window).height();
        var vph = $("#viewport").height();
        var bh = document.body.scrollHeight;

        var percentage = y/mmh;
        if (percentage > 1){ percentage = 1; }
        var top = percentage*bh - wh/2;
        
        $(window).scrollTop(top);
    }
}

$("body").bind('mouseup mouseleave', function(e){
    scrollViewport(e.pageY);
    draggingViewport = false;
}).bind('mousemove', function(e){
    scrollViewport(e.pageY);
});
