console.log("WOOHOO.");

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
    var vw = mmw * $(window).width()/bw;
    var vh = mmh * $(window).height()/bh;
    var left = mmw * $(window).scrollLeft()/bw;
    var top = mmh * $(window).scrollTop()/bh;

    $("#viewport").css({width: vw, height: vh,
                        marginLeft: left, marginTop: top});

    var canvas = $("#canvas-box canvas")
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
        width: null,
        height: null,
        taintTest: true, // do a taint test with all images before applying to canvas
        renderer: "Canvas",
        onrendered: canvasRendered
    });
}

createMinimap();

var resizeTimeout = null;

$(window).scroll(updateViewport);
$(window).resize(updateViewport);

$(window).resize(function(){
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(updatePageCanvas, 100);
});
