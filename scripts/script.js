// based on https://www.roboleary.net/2022/01/13/copy-code-to-clipboard-blog.html
const copyLabel = 'Copy code';

async function copyCode(block, button) {
  let code = block.querySelector('.org-src-container:not([hidden])').querySelector('pre.src');
  let text = code.innerText;
  await navigator.clipboard.writeText(text);
  button.innerText = 'Copied';
  setTimeout(() => {
    button.innerText = copyLabel;
  }, 500);
}

function addButtons() {
  let parents = document.querySelectorAll('.multilang');
  parents.forEach((parent) => {
    let buttons = document.createElement('div');
    buttons.classList.add('src-buttons');
    parent.append(buttons);

    // copy button
    let copyButton = document.createElement('button');
    copyButton.innerText = copyLabel;
    copyButton.classList.add('copy-code');
    buttons.append(copyButton);
    copyButton.addEventListener('click', async() => {
      await copyCode(parent, copyButton);
    });

    // switch button
    let srcBlocks = parent.querySelectorAll('.org-src-container');
    let orig = srcBlocks[0];
    let expanded = srcBlocks[1];
    let switchButton = document.createElement('button');
    let origPre = orig.querySelector('.src');
    let expandedPre = expanded.querySelector('.src');
    let label = orig.querySelector('.org-src-name');

    if (label) {
      expanded.prepend(label.cloneNode(true));
    }

    switchButton.innerText = 'Expand Code';
    switchButton.classList.add('code-switcher');
    buttons.append(switchButton);

    expanded.hidden = true;

    switchButton.addEventListener('click', function() {
      if (expanded.hidden) {
        let id = origPre.id;
        expandedPre.id = id;
        origPre.removeAttribute('id');
        expanded.removeAttribute('hidden');
        switchButton.innerText = 'Orignal Code';
        orig.hidden = true;
      } else {
        let id = expandedPre.id;
        origPre.id = id;
        expandedPre.removeAttribute('id');
        orig.removeAttribute('hidden');
        switchButton.innerText = 'Expand Code';
        expanded.hidden = true;
      }
    });

    // hide button
    let hideButton = document.createElement('button');
    hideButton.innerText = 'Show Code';
    hideButton.classList.add('hide-code');
    buttons.append(hideButton);

    let pres = parent.querySelectorAll('.src');
      pres.forEach((pre) => {
        pre.hidden = true;
      });
    switchButton.hidden = true;

    hideButton.addEventListener('click', () => {
      let pres = parent.querySelectorAll('.src');
      if (parent.querySelectorAll('.src:not([hidden])').length != 0) {
        pres.forEach((pre) => {
          pre.hidden = true;
        });
        switchButton.hidden = true;
        hideButton.innerText = 'Show Code';
      } else {
        pres.forEach((pre) => {
          pre.removeAttribute('hidden');
        });
        switchButton.removeAttribute('hidden');
        hideButton.innerText = 'Hide Code';
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  addButtons();
});
