console.log("WOOHOO.");

var SLIDE_DURATION = 200;
var HIDE_INTERVAL = 4000;
var RESIZE_INTERVAL = 100;

var hideTimer, resizeTimer;
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
    console.log("updating viewport");

    var bh = document.body.scrollHeight;
    var bw = document.body.scrollWidth;

    var mmw = $("#minimap").width();
    var mmh = $("#minimap").height();

    // scale viewport relative to full page size
    var ww = $(window).width();
    var wh = $(window).height();
    var vw = mmw * ww/bw;
    var vh = mmh * wh/bh;
    var left = mmw * $(window).scrollLeft()/bw;
    var top = mmh * $(window).scrollTop()/bh;

    $("#viewport").css({width: vw, height: vh,
                        marginLeft: left, marginTop: top});

    // canvas box repositioning
    var ch = $("#canvas-box").height();
    // only do it if the image is longer than the window

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
    document.getElementById("minimap").style.display = "none";
    
    html2canvas( [ document.body ], {
                // general
        logging: true,

        // preload options
        proxy: false,
        timeout: 0,    // no timeout
        useCORS: false, // try to load images as CORS (where available), before falling back to proxy (not yet implemented?)
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


function hideMinimap() {
    console.log("HELLO!!!");
    $("#minimap").animate({"right":"-160px","opacity":"0.2"},SLIDE_DURATION);
}

function showMinimap() {
    $("#minimap").animate({"right":"16px","opacity":"1.0"},SLIDE_DURATION);
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideMinimap,HIDE_INTERVAL);
}


createMinimap();

$(window).resize(function(){
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(updatePageCanvas, RESIZE_INTERVAL);
});

$(window).scroll(showMinimap);
$(window).bind('scroll resize', updateViewport);
