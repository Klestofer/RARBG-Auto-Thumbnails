'use strict';

chrome.storage.sync.get('options', function({options}) {
  l('storage.get()', options);

  if (options.isFocusSearchField) {
    const searchInput = document.querySelector('#searchinput');
    if (searchInput !== null) {
      searchInput.focus();
      searchInput.select();
    }
  }

  if (options.isShowThumbnails) {
    showThumbnails();
  }

  if (options.isShowMediaInfo) {
    showBlock('#showmediainfo', '#mediainfo', options.maxBlockHeight);
  }

  if (options.isShowFiles) {
    const isBlockShown = showBlock('#showhidefiles', '#files', options.maxBlockHeight);
    if (isBlockShown) {
      // keep number of files
      document.querySelector('#msgfile').style.display = '';
    }
  }

  if (options.isShowNFO) {
    showBlock('#shownfo', '#populateNFO', options.maxBlockHeight);
  }
});




function showThumbnails() {
  // disable default thumbnail popup
  const script = document.createElement('script');
  script.innerHTML = `
    document.onmousemove = null;

    function overlib() {
      // nothing
    }

    function nd() {
      // nothing
    }
  `;
  document.head.appendChild(script);
  script.remove();

  // create thumbnails near links
  for (const link of document.querySelectorAll('.lista2t a[onmouseover], .lista_related a[onmouseover]')) {
    const cell = link.parentElement;
    link.removeAttribute('title');

    // create link with thumbnail
    const thumbnailLink = document.createElement('a');
    thumbnailLink.href = link.getAttribute('href');

    // create thumbnail
    const thumbnail = document.createElement('img');
    thumbnail.src = link.getAttribute('onmouseover').match(/\\'(.+)\\'/)[1];
    thumbnailLink.append(thumbnail);

    // move original cell content to DIV
    const originalContentDiv = document.createElement('div');
    originalContentDiv.append(...cell.children);

    // create DIV for entire cell
    const cellDiv = document.createElement('div');
    cellDiv.style.display = 'flex';
    cellDiv.style.alignItems = 'center';
    cellDiv.append(thumbnailLink, originalContentDiv);

    cell.append(cellDiv);
  }
}




function showBlock(toggleElemSelector, blockElemSelector, maxHeight) {
  const toggleElem = document.querySelector(toggleElemSelector);
  if (toggleElem === null) {
    return false;
  }
  toggleElem.parentElement.removeAttribute('href'); // prevent changing of URL hash by following click
  toggleElem.click();

  if (maxHeight !== undefined) {
    const block = document.querySelector(blockElemSelector);
    block.style.maxHeight = maxHeight + 'px';
    block.style.overflowY = 'auto';
  }

  return true;
}
