({
    baseUrl: 'static/scripts/src/',
    name: "../../../main"
    ,paths:{
        'jquery':'lib/jquery/jquery'
        ,'workjs01':'work/workjs01'
        ,'workjs02':'work/workjs02'
    }
    ,shim: {
        'jquery': {
            exports: "$"
        }
    }
    ,out: "main-built.js"
})