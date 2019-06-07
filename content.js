'use strict';

// disable default thumbnail popup
const script = document.createElement('script');
script.innerHTML = `
  document.onmousemove = null;

  function overlib() {
    // nothing
  }
`;
document.head.appendChild(script);
script.remove();

// create thumbnails near links
for (const link of document.querySelectorAll('.lista2t a[onmouseover], .lista_related a[onmouseover]')) {
  const cell = link.parentElement;
//  cell.style.display = 'flex';
//  cell.style.alignItems = 'center';

  // move original cell content to DIV
  const contentDiv = document.createElement('div');
  contentDiv.style.display = 'inline-block';
  contentDiv.style.verticalAlign = 'middle';
  contentDiv.append(...cell.children);
  cell.append(contentDiv);

  // create link with thumbnail
  const imageLink = document.createElement('a');
  imageLink.href = link.getAttribute('href');

  const image = document.createElement('img');
  image.style.verticalAlign = 'middle';
  image.src = link.getAttribute('onmouseover').match(/\\'(.+)\\'/)[1];

  imageLink.append(image);
  contentDiv.before(imageLink);
}
