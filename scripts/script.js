// based on https://www.roboleary.net/2022/01/13/copy-code-to-clipboard-blog.html
const copyIcon = "<i class='bx bx-copy-alt' ></i>";
const hideIcon = "<i class='bx bx-collapse-vertical' ></i>";
const showIcon = "<i class='bx bx-expand-vertical' ></i>";
const expandIcon = "<i class='bx bx-expand-horizontal'></i>";
const originalIcon = "<i class='bx bx-reset' ></i>";
const copyTitle = "Copy code";
const hideTitle = "Hide code";
const showTitle = "Show code";
const expandTitle = "Expand code";
const originalTitle = "Show original code";

async function copyCode(block, button) {
  let code = block.querySelector('.org-src-container:not([hidden])').querySelector('pre.src');
  let text = code.innerText;
  await navigator.clipboard.writeText(text);
  button.innerText = 'Copied';
  setTimeout(() => {
    button.innerHTML = copyIcon;
  }, 500);
}

function addButtons() {
  let parents = document.querySelectorAll('.multilang');
  parents.forEach((parent) => {
    let buttons = document.createElement('div');
    buttons.classList.add('src-buttons');
    parent.prepend(buttons);

    // copy button
    let copyButton = document.createElement('button');
    copyButton.innerHTML = copyIcon;
    copyButton.setAttribute('title', copyTitle);
    copyButton.classList.add('copy-code');
    buttons.prepend(copyButton);
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

    switchButton.innerHTML = expandIcon;
    switchButton.setAttribute('title', expandTitle);
    switchButton.classList.add('code-switcher');
    buttons.prepend(switchButton);

    expanded.hidden = true;

    switchButton.addEventListener('click', function() {
      if (expanded.hidden) {
        let id = origPre.id;
        expandedPre.id = id;
        origPre.removeAttribute('id');
        expanded.removeAttribute('hidden');
        switchButton.innerHTML = originalIcon;
        switchButton.setAttribute('title', originalTitle);
        orig.hidden = true;
      } else {
        let id = expandedPre.id;
        origPre.id = id;
        expandedPre.removeAttribute('id');
        orig.removeAttribute('hidden');
        switchButton.innerHTML = expandIcon;
        switchButton.setAttribute('title', expandTitle);
        expanded.hidden = true;
      }
    });

    // hide button
    let hideButton = document.createElement('button');
    hideButton.innerHTML = hideIcon;
    hideButton.setAttribute('title', hideTitle);
    hideButton.classList.add('hide-code');
    buttons.prepend(hideButton);

    // let pres = parent.querySelectorAll('.src');
    //   pres.forEach((pre) => {
    //     pre.hidden = true;
    //   });
    // switchButton.hidden = true;

    hideButton.addEventListener('click', () => {
      let pres = parent.querySelectorAll('.src');
      if (parent.querySelectorAll('.src:not([hidden])').length != 0) {
        pres.forEach((pre) => {
          pre.hidden = true;
        });
        switchButton.hidden = true;
        hideButton.innerHTML = showIcon;
        hideButton.setAttribute('title', showTitle);
      } else {
        pres.forEach((pre) => {
          pre.removeAttribute('hidden');
        });
        switchButton.removeAttribute('hidden');
        hideButton.innerHTML = hideIcon;
        hideButton.setAttribute('title', hideTitle);
      }
    });
  });
}

function addSidenotes() {
  let references = document.querySelectorAll('.footref');
  references.forEach((ref) => {
    let sidenote = document.createElement('aside');
    let footdef = document.querySelector("#fn\\." + ref.innerText).closest('.footdef');
    let footnoteText = footdef.firstElementChild.innerText + ". " +
        footdef.lastElementChild.innerText;
    sidenote.classList.add('sidenote');
    sidenote.innerHTML = footnoteText.replace("\n", "");
    ref.parentElement.nextElementSibling.after(sidenote);
  });
}

document.addEventListener("DOMContentLoaded", function() {
  addButtons();
  addSidenotes();
});
