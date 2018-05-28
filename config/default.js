/*
    BChekuri
*/

module.exports = {
    "extension_config": "manifest.json",
    "thirdpartylibs": {
        "js": [
            "public/thirdpartylibs/jquery/dist/jquery.min.js",
            "public/thirdpartylibs/tether/dist/js/tether.min.js",
            "public/thirdpartylibs/bootstrap/dist/js/bootstrap.min.js",
            "public/thirdpartylibs/angular/angular.min.js",
            "public/thirdpartylibs/angular-animate/angular-animate.min.js"
        ],
        "css": [
            "public/thirdpartylibs/font-awesome/css/font-awesome.min.css",
            "public/thirdpartylibs/tether/dist/css/tether.min.css",
            "public/thirdpartylibs/bootstrap/dist/css/bootstrap.min.css",
            "public/thirdpartylibs/animate.css/animate.min.css"
        ],
        "thirdpartylibsbundlefromview": "./../../../"
    },
    "src": {
        "options": {
            "css": [
                "src/client/css/onoffswitch.css",
                "src/client/css/index.css",
                "src/client/css/contact.css",
                "src/client/css/howtouse.css",
                "src/client/css/options.css"
            ],
            "js": [
                "src/client/js/optionsUtils.js",
                "src/client/js/smartFeedback.js",
                "src/client/js/angularconfig.js",
                "src/client/js/optionsModules.js",
                "src/client/js/optionsService.js",
                "src/client/js/optionsController.js"
            ],
            "view": [
                "src/client/views/index.html",
                "src/client/views/options.html",
                "src/client/views/contact.html",
                "src/client/views/howtouse.html",
                "src/client/views/includes/navbar.html"
            ],
            "srcbundlefromview": "../../.."
        },
        "backgroundjs": {
            "files": [
                "src/backgroud/js/background.js"
            ]
        },
        "backgroundview": {
            "files": [
                "src/backgroud/views/popup.html"
            ]
        },
        "commonjs": {
            "files": [
                "src/common/js/optionsConstants.js"
            ],
            "commonjsbundlefromview": "../../.."
        }
    },
    "images": [
        "assets/img/*.png"
    ],
    "fonts" : [
        "public/thirdpartylibs/font-awesome/fonts/*.*"
    ]
}