({
    baseUrl: './static/scripts/src/',
    name: "../../../main",
    paths: {
        'jquery': "vendor/jquery/jquery"
        ,'dialog': "module/dialog/dialog"
        ,'drag': "module/drag/drag"
        ,'fulltip': "module/fulltip/fulltip"
    },
    shim: {
        'jquery': {
            exports: "$"
        }
    },
    out: "main-built.js",
})