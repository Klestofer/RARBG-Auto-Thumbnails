'use strict';

let options;


chrome.storage.sync.get('options', function(items) {
  l('storage.get()', items);

  options = items.options;

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
    showBlock('#showmediainfo', '#mediainfo');
  }

  if (options.isShowFiles) {
    const isBlockShown = showBlock('#showhidefiles', '#files');
    if (isBlockShown) {
      // keep number of files
      document.querySelector('#msgfile').style.display = '';
    }
  }

  if (options.isShowNFO) {
    showBlock('#shownfo', '#populateNFO');
  }

  if (options.isMarkLinks) {
    markLinksInDescription();
    markLinksInNFO();
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




function showBlock(toggleElemSelector, blockElemSelector) {
  const toggleElem = document.querySelector(toggleElemSelector);
  if (toggleElem === null) {
    return false;
  }
  toggleElem.parentElement.removeAttribute('href'); // prevent changing of URL hash by click() in next line
  toggleElem.click();

  if (options.maxBlockHeight !== undefined) {
    const block = document.querySelector(blockElemSelector);
    block.style.maxHeight = options.maxBlockHeight + 'px';
    block.style.overflowY = 'auto';
  }

  return true;
}




function markLinksInDescription() {
  const descriptionBlock = document.querySelector('#description');
  if (descriptionBlock === null) {
    return;
  }

  const urlRegExp = /(.+)(https?:\/\/.+)/s; // some text before link text

  for (const node of descriptionBlock.childNodes) {
    n(); l(node);

    if (node.nodeType !== Node.TEXT_NODE) {
      // not a text node
      continue;
    }

    const match = node.textContent.match(urlRegExp);
    l(match);

    if (match?.length !== 3) {
      // no link
      continue;
    }

    l('match');

    // keep only text before link
    node.textContent = match[1];

    // create real link from link text
    const linkElem = document.createElement('a');
    linkElem.href = linkElem.textContent = match[2];
    linkElem.target = '_blank';
    linkElem.rel = 'noreferrer';
    node.after(linkElem);

    // we will encounter linkElem on next iteration, but this is not a big problem
  }
}




function markLinksInNFO() {
  const nfoBlock = document.querySelector('#populateNFO');
  if (nfoBlock === null) {
    return;
  }

  const urlRegExp = /https?:\/\/[^ ,\n]+/g; // not ideal

  // wait for <pre> element of NFO block
  new MutationObserver(function(mutationRecords) {
    n(); l('observer fired', mutationRecords);

    if (mutationRecords.length !== 1) {
      // skip adding 'loading' image
      return;
    }

    const preElem = mutationRecords[0].addedNodes[0]; // or nfoBlock.firstElementChild

    if (!urlRegExp.test(preElem.textContent)) {
      // no text links
      return;
    }

    preElem.innerHTML = preElem.innerHTML.replace(urlRegExp, '<a href="$&" target="_blank" rel="noreferrer">$&</a>');
  }).observe(nfoBlock, {childList: true});
}
