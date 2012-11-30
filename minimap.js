console.log("WOOHOO.");

var SLIDE_DURATION = 200;
var HIDE_INTERVAL = 4000;
var FADE_OUT_DURATION = 1000;
var RESIZE_INTERVAL = 100;

// "reading" vs "seeking" options
var SCROLL_DISTANCE_SAMPLES = 10; // Kind of a hack: the number of scroll-events ago to check if scroll-distance was surpassed
var SCROLL_SAMPLE_INTERVAL_MS = 50; // I have autocomplete ;)
var SCROLL_DISTANCE_TO_SHOW = 500; // Number of pixels after above constant scroll events to show minimap. -1 shows minimap on all scroll events


// scroll sample stuff
var scroll_samples;
scroll_samples = [];
// initialize scroll samples to current pos
for (var i = 0; i < SCROLL_DISTANCE_SAMPLES; i++) scroll_samples[i] = document.body.scrollHeight;

window.setInterval(function() {
    scroll_samples.splice(0, 0, window.pageYOffset);
    scroll_samples.pop();
},SCROLL_SAMPLE_INTERVAL_MS);

var hideTimer, resizeTimer;


// render worker stuff
var render_worker = new Worker('renderworker.js');
render_worker.onmessage = function(event) {
    canvasRendered(event.data);
};


// minimap stuff
var minimap =
    '<div id="minimap">'+
    '    <div id="viewport"></div>'+
    '    <div id="canvas-box"></canvas>'+
    '</div>';


function createMinimap() {
    console.log("createMiniMap");
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
    var ch = $("#canvas-box").height();
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
    canvas.removeAttribute("style");

    $('#canvas-box').html(canvas);
    updateViewport();
    $("#minimap").show();
}

function updatePageCanvas(){
    $("#minimap").hide();
    document.getElementById("minimap").style.display = "none";
    render_worker.postMessage(document.body.outerHTML);
}

function scrollHandler() {
    var scrolledDistance = Math.abs(window.pageYOffset - scroll_samples[scroll_samples.length - 1]);
    console.log(scrolledDistance);
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
    $("#minimap").stop().animate({"right":"16px","opacity":"1.0"},SLIDE_DURATION);
    $("#viewport").stop().animate({"opacity":"1.0"},{"duration":SLIDE_DURATION,"queue":false});
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideMinimap,HIDE_INTERVAL);
}


createMinimap();

var mouseInside = false;


$('#minimap').bind('mouseenter', function() {
    mouseInside = true;
    showMinimap();
    clearTimeout(hideTimer);
});

$('#minimap').bind('mouseleave', function() {
    mouseInside = false;
    hideTimer = setTimeout(hideMinimap,HIDE_INTERVAL);
});

$(window).resize(function(){
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(updatePageCanvas, RESIZE_INTERVAL);
});

$(window).scroll(scrollHandler); //TODO: Consider only showing when user scrolls a lot, and is clearly "seeking", not reading
$(window).bind('scroll resize', updateViewport);
