const copyLabel = "<i class='bx bx-copy-alt' ></i>";

async function copyCode(block, button) {
  let code = block.querySelector('pre.src');
  let text = code.innerText;
  await navigator.clipboard.writeText(text);
  button.innerText = 'Copied';
  setTimeout(() => {
    button.innerHTML = copyLabel;
  }, 500);
}

function addCopyCodeButtons() {
  if (!navigator.clipboard) return;
  let blocks = document.querySelectorAll('.org-src-container');
  blocks.forEach((block) => {
    let button = document.createElement('button');
    button.innerHTML = copyLabel;
    button.classList.add('copy-code');
    block.append(button);
    button.addEventListener('click', async() => {
      await copyCode(block, button);
    });
    block.setAttribute('tabindex', 0);
  });
}

function hideExpandedCode() {
  let parents = document.querySelectorAll('.multilang');
  parents.forEach((parent) => {
    let srcBlocks = parent.querySelectorAll('.org-src-container');
    let orig = srcBlocks[0];
    let expanded = srcBlocks[1];
    let label = orig.querySelector('.org-src-name');

    if (label) {
      expanded.prepend(label.cloneNode(true));
    }

    expanded.hidden = true;
  });
}

function addExpandButton() {
  let parents = document.querySelectorAll('.multilang');
  parents.forEach((parent) => {
    let expandSection = document.createElement('div');
    const selectedClass = 'selected';

    expandSection.classList.add('src-expand-section');
    ['noweb', 'expand'].forEach((elt) => {
      let button = document.createElement('span');
      button.innerText = elt;
      button.classList.add('src-' + elt);
      expandSection.append(button);
    });

    let buttons = expandSection.childNodes;
    let srcContainers = parent.querySelectorAll('.org-src-container');
    buttons[0].classList.add(selectedClass);
    buttons.forEach((button, index) => {
      button.addEventListener('click', (event) => {
        event.currentTarget.classList.add(selectedClass);
        buttons[1 - index].classList.remove(selectedClass);
        srcContainers[1 - index].hidden = true;
        srcContainers[index].hidden = false;
      });
    });

    parent.prepend(expandSection);
  });
}

function addSidenotes() {
  let references = document.querySelectorAll('.footref');
  references.forEach((ref) => {
    let sidenote = document.createElement('aside');
    let footdef = document.querySelector("#fn\\." + ref.innerText).closest('.footdef');
    let footnoteText = footdef.firstElementChild.innerText + ". " +
        footdef.lastElementChild.innerHTML;
    sidenote.classList.add('sidenote');
    sidenote.innerHTML = footnoteText.replace("\n", "");
    ref.parentElement.nextElementSibling.after(sidenote);
  });
}

document.addEventListener("DOMContentLoaded", function() {
  hideExpandedCode();
  addExpandButton();
  addCopyCodeButtons();
  addSidenotes();
});
