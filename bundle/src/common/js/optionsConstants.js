/**
* BChekuri
*/

var APP_NAME = "Revolve & Reload";

var SYNC_STORAGE_NAME = "__revolveAndReloadExtensionOptions";

var DEFAULT_OPTIONS = {
    revolve: true,
    revolveInterval: 12,
    reload: false,
    reloadInterval: 12,
    reloadWhenTabNotShown: false,
    pause: true,
    pauseInterval: 600,
    onStartFullScreen : false
};

var EXTENSION_STATES = {
	REVOLVE_RELOAD: 1,
	PAUSE: 2,
	STOP: 3
};

var PAUSE_DEFAULT_INTERVAL = 1999;

var INVALID_INTERVAL_MAPPING_VALUE = 1000;

var STOP_STAT_ICONS = {
    "20": "./assets/img/logo_20.png",
    "24": "./assets/img/logo_24.png",
    "32": "./assets/img/logo_32.png",
    "48": "./assets/img/logo_48.png",
    "64": "./assets/img/logo_64.png",
    "128": "./assets/img/logo_128.png"
};

var REVOLVE_RELOAD_STAT_ICONS = {
    "20": "./assets/img/logo_go_20.png",
    "24": "./assets/img/logo_go_24.png",
    "32": "./assets/img/logo_go_32.png",
    "48": "./assets/img/logo_go_48.png",
    "64": "./assets/img/logo_go_64.png",
    "128": "./assets/img/logo_go_128.png"
};

var PAUSE_STAT_ICONS = {
    "20": "./assets/img/logo_pause_20.png",
    "24": "./assets/img/logo_pause_24.png",
    "32": "./assets/img/logo_pause_32.png",
    "48": "./assets/img/logo_pause_48.png",
    "64": "./assets/img/logo_pause_64.png",
    "128": "./assets/img/logo_pause_128.png"
};