'use strict';

chrome.runtime.onInstalled.addListener(function(details) {
  l('chrome.runtime.onInstalled()', details);

  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // save default options to extension storage
    chrome.storage.sync.set({
      options: DEFAULT_OPTIONS,
    }, function() {
      l('storage.set()');
    });
  }
  else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    // merge user options with default options and save them
    chrome.storage.sync.get({
      options: DEFAULT_OPTIONS,
    }, function({options: mergedOptions}) {
      l('storage.get()', mergedOptions);

      chrome.storage.sync.set({
        options: mergedOptions,
      }, function() {
        l('storage.set()');
      });
    });
  }
});




// dev
Object.defineProperty(window, 's', {
  get() {
    console.group('current situation');
    chrome.storage.sync.get(function(items) {
      l('storage.get()', items);
      console.groupEnd();
    });
  },
});
