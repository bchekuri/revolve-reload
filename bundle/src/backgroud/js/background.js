/**
* BChekuri
*/

(function () {
	'use strict';

	var bg = {};

	bg.WINDOWS_STORES = [];

	chrome.browserAction.onClicked.addListener(function (activeTab) {
		bg.onClickEventWrapper(activeTab);
	});

	bg.onClickEventWrapper = function (activeTab) {
		if (activeTab && activeTab.windowId) {
			this.onClickEvent(activeTab.windowId);
		}
	};

	bg.onClickEvent = function (windowId) {
		this.getOptions().then(function (storedOptions) {
			bg.startActions(windowId, storedOptions);
		}, function () {
			bg.startActions(windowId, DEFAULT_OPTIONS);
		}).catch(function (err) {
			bg.startActions(windowId, DEFAULT_OPTIONS);
		});
	}

	bg.getExistingOrCreateWindowStore = function (windowId) {
		var windowStore = this.checkAndGetOldWindowStoreIfExist(windowId);
		if (windowStore) {
			return windowStore;
		}
		windowStore = this.getDefaultWindowStore(windowId);
		this.WINDOWS_STORES.push(windowStore);
		return windowStore;
	};

	bg.getDefaultWindowStore = function (windowId) {
		var windowStore = {};
		windowStore.windowId = windowId;
		windowStore.tabs = [];
		windowStore.options = {};
		windowStore.state = EXTENSION_STATES.STOP;
		return windowStore;
	};

	bg.getOptions = function () {
		return new Promise(function (resolve, reject) {
			chrome.storage.sync.get(SYNC_STORAGE_NAME, function (storedOptions) {
				if (storedOptions && storedOptions[SYNC_STORAGE_NAME]) {
					resolve(storedOptions[SYNC_STORAGE_NAME]);
				} else {
					reject();
				}
			});
		});
	};

	bg.startActions = function (windowId, options) {
		if (windowId && options) {
			if (!options.revolve && !options.reload) {
				this.showOptions();
				return;
			}
			var windowStore = this.getExistingOrCreateWindowStore(windowId);
			windowStore.options = options;
			var exit = this.updateExtensionNextState(windowId);
			if (exit) {
				return;
			}
			this.doRevolveAndReload(windowId);
		}
	};

	bg.changeStateIcons = function (windowStore) {
		if (windowStore) {
			if (windowStore.state === EXTENSION_STATES.REVOLVE_RELOAD) {
				this.changeIconForAllTabs(windowStore.tabs, REVOLVE_RELOAD_STAT_ICONS);
			} else if (windowStore.state === EXTENSION_STATES.PAUSE) {
				this.changeIconForAllTabs(windowStore.tabs, PAUSE_STAT_ICONS);
			} else {
				this.changeIconForAllTabs(windowStore.tabs, STOP_STAT_ICONS);
			}
		}
	};

	bg.changeIconForAllTabs = function (tabs, paths) {
		tabs.forEach(function (tab) {
			chrome.browserAction.setIcon({
				tabId: tab.tabId,
				path: paths
			});
		});
	};

	bg.updateExtensionNextState = function (windowId) {
		var windowStore = this.checkAndGetOldWindowStoreIfExist(windowId);
		var results = false;
		if (windowStore) {
			if (windowStore.state === EXTENSION_STATES.STOP) {
				windowStore.state = EXTENSION_STATES.REVOLVE_RELOAD;
			} else if (windowStore.state === EXTENSION_STATES.REVOLVE_RELOAD) {
				if (windowStore.options.pause) {
					windowStore.state = EXTENSION_STATES.PAUSE;
					this.triggerPauseEvent(windowStore);
					results = true;
				} else {
					results = this.stopEvent(windowStore);
				}
			} else if (windowStore.state === EXTENSION_STATES.PAUSE) {
				results = this.stopEvent(windowStore);
			}
			this.changeStateIcons(windowStore);
		}
		return results;
	};

	bg.stopEvent = function(windowStore) {
		windowStore.state = EXTENSION_STATES.STOP;
		if(windowStore.pauseCall) {
			clearTimeout(windowStore.pauseCall);
		}
		this.checkAndDeleteOldWindowStoreIfExist(windowStore.windowId);
		return true;
	}

	bg.triggerPauseEvent = function (windowStore) {
		var pauseInterval = (typeof windowStore.options.pauseInterval === 'undefined'
			|| windowStore.options.pauseInterval <= 0) ? 0
			: windowStore.options.pauseInterval * 1000;
		var pauseCall = setTimeout(function () {
			if (pauseInterval > 0) {
				windowStore.state = EXTENSION_STATES.STOP;
				pauseInterval = pauseInterval < PAUSE_DEFAULT_INTERVAL 
									? PAUSE_DEFAULT_INTERVAL : pauseInterval;
			}
			bg.onClickEvent(windowStore.windowId);
		}, pauseInterval);
		windowStore.pauseCall = pauseCall;
	};

	bg.checkAndDeleteOldWindowStoreIfExist = function (windowId) {
		var found = false;
		var index = 0;
		for (; index < this.WINDOWS_STORES.length; index++) {
			if (this.WINDOWS_STORES[index] && this.WINDOWS_STORES[index].windowId === windowId) {
				found = true;
				break;
			}
		}
		if (found) {
			this.WINDOWS_STORES.splice(index, 1);
		}
	};

	bg.checkAndGetOldWindowStoreIfExist = function (windowId) {
		var windowStore = this.WINDOWS_STORES.find(function (window) {
			return window.windowId === windowId;
		});
		return windowStore;
	};

	bg.doRevolveAndReload = function (windowId) {
		var tabQueryInfo = {
			currentWindow: true
		};
		var windowStore = this.checkAndGetOldWindowStoreIfExist(windowId);
		if (windowStore) {
			chrome.tabs.query(tabQueryInfo, function (tabs) {
				if (tabs && tabs.length > 0) {
					windowStore.tabs = tabs;
					bg.changeStateIcons(windowStore);
					if (windowStore.options.revolve) {
						bg.highlightTabAtGivenIntervalWrapper(windowId);
					}
					if (windowStore.options.reload) {
						bg.reloadTabAtGivenIntervalWrapper(windowId);
					}
					if((windowStore.options.reload || windowStore.options.revolve) 
							&& windowStore.options.onStartFullScreen) {
						chrome.windows.update(windowId, { state: "fullscreen" });
					}
				}
			});
		} else {
			// TO DO
		}
	};

	bg.reloadTabAtGivenIntervalWrapper = function (windowId) {
		this.reloadTabAtGivenInterval(windowId, 0, 0);
	}

	bg.reloadTabAtGivenInterval = function (windowId, index, level) {
		var windowStore = this.checkAndGetOldWindowStoreIfExist(windowId);
		if (typeof windowStore === 'undefined') {
			return;
		}
		var tabs = windowStore.tabs;
		if (tabs == undefined || tabs.length <= 0)
			return;
		if (this.isInActive(windowStore.state)) {
			return;
		}
		if (tabs.length <= index) {
			index = 0;
		}
		if (level !== 0) {
			this.reloadTabs(tabs[index]);
		}
		var intervalInMilliseconds = this.calculateIntervalInMilliseconds(windowStore, windowStore.options.reloadInterval);
		if (intervalInMilliseconds === 0) {
			return;
		}
		setTimeout(function () {
			bg.reloadTabAtGivenInterval(windowId, index + 1, 1);
		}, intervalInMilliseconds);
	};

	bg.isInActive = function (state) {
		if (state === EXTENSION_STATES.STOP
			|| state === EXTENSION_STATES.PAUSE) {
			return true;
		} else {
			return false;
		}
	};

	bg.calculateIntervalInMilliseconds = function (windowStore, intervalInSec) {
		if (typeof windowStore === 'undefined' || typeof windowStore.options === 'undefined'
			|| this.isInActive(windowStore.state)) {
			return 0;
		} else if (windowStore.state === EXTENSION_STATES.PAUSE) {
			return (typeof windowStore.options.pauseInterval === 'undefined'
				|| windowStore.options.pauseInterval <= 0) ? 0
				: windowStore.options.pauseInterval * 1000;
		} else {
			if (intervalInSec <= 0) {
				return INVALID_INTERVAL_MAPPING_VALUE;
			} else {
				return intervalInSec * 1000;
			}
		}
	};

	bg.highlightTabAtGivenIntervalWrapper = function (windowId) {
		this.highlightTabAtGivenInterval(windowId, 0);
	}

	bg.highlightTabAtGivenInterval = function (windowId, index) {
		var windowStore = this.checkAndGetOldWindowStoreIfExist(windowId);
		if (typeof windowStore === 'undefined') {
			return;
		}
		var tabs = windowStore.tabs;
		if (tabs == undefined || tabs.length <= 0)
			return;
		if (index > 0) {
			this.unHighlightTab(tabs[index - 1]);
		}
		if (this.isInActive(windowStore.state)) {
			return;
		}
		if (tabs.length <= index) {
			index = 0;
		}
		this.highlightTab(tabs[index]);
		var intervalInMilliseconds = this.calculateIntervalInMilliseconds(windowStore, windowStore.options.revolveInterval);
		if (intervalInMilliseconds === 0) {
			this.unHighlightTab(tabs[index]);
			return;
		}
		setTimeout(function () {
			bg.highlightTabAtGivenInterval(windowId, index + 1);
		}, intervalInMilliseconds);
	};

	bg.reloadTabs = function (tab) {
		if (tab == undefined)
			return;
		if (tab.url === "chrome://extensions/") {
			return;
		} else {
			chrome.tabs.reload(tab.id);
		}
	};

	bg.highlightTab = function (tab) {
		if (tab == undefined)
			return;
		var tabUpdateProperties = {
			highlighted: true
		};
		chrome.tabs.update(tab.id, tabUpdateProperties, function (tab) {
		});
	};


	bg.unHighlightTab = function (tab) {
		if (tab == undefined)
			return;
		var tabUpdatePropertiesRevert = {
			highlighted: false
		};
		chrome.tabs.update(tab.id, tabUpdatePropertiesRevert, function (tab) {
		});
	};

	bg.showOptions = function (callback) {
		var optionsUrl = "src/client/views/index.html";
		if ("windows" in chrome) {
			var fullOptionsUrl = chrome.extension.getURL(optionsUrl);
			chrome.tabs.query({}, function (tabs) {
				var tab = tabs.find(function (tab) {
					return tab.url === fullOptionsUrl
				});
				if (tab) {
					chrome.windows.update(tab.windowId, { focused: true });
					chrome.tabs.update(tab.id, { active: true });
				} else {
					chrome.tabs.create({ url: fullOptionsUrl }, callback);
				}
			});
		} else {
			chrome.tabs.create({ url: optionsUrl }, callback);
		}
	};

	chrome.windows.onRemoved.addListener(function (windowId) {
		bg.checkAndDeleteOldWindowStoreIfExist(windowId);
	});


	chrome.tabs.onRemoved.addListener(function (tabId, window) {
		var windowStore = bg.checkAndGetOldWindowStoreIfExist(window.windowId);
		if (windowStore) {
			var found = false, index = 0;
			for (index = 0; index < windowStore.tabs.length; index++) {
				if (tabId === windowStore.tabs[index].id) {
					found = true;
					break;
				}
			}
			if (found) {
				windowStore.tabs.splice(index, 1);
			}
		}
	});


}());
