console.log("WOOHOO.");

function canvasRendered(canvas) {
    /* canvas is the actual canvas element, 
       to append it to the page call for example 
       document.body.appendChild( canvas );
    */
    document.body.appendChild(canvas);
}


function updateMinimap(){
    html2canvas( [ document.body ], {
                // general
        logging: true,

        // preload options
        proxy: "http://html2canvas.appspot.com/",
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

updateMinimap();
