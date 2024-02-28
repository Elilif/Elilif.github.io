let toc, tocPath, tocItems;

// Factor of screen size that the element must cross
// before it's considered visible
let TOP_MARGIN = 0.1,
    BOTTOM_MARGIN = 0.2;

let pathLength;

let lastPathStart, lastPathEnd, lastItem;

function setTocInfo () {
  toc = document.querySelector('#text-table-of-contents');
  if (toc) {
    toc.innerHTML += "<svg class=\"toc-marker\" width=\"200\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\"> <path stroke=\"#444\" stroke-width=\"3\" fill=\"transparent\" stroke-dasharray=\"0, 0, 0, 1000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" transform=\"translate(-0.5, -0.5)\" /> </svg>";
    tocPath = document.querySelector( '.toc-marker path' );
  }
}

function drawPath() {

  tocItems = [].slice.call( toc.querySelectorAll( 'li' ) );

  // Cache element references and measurements
  tocItems = tocItems.map( function( item ) {
    let anchor = item.querySelector( 'a' );
    let target = document.getElementById( anchor.getAttribute( 'href' ).slice( 1 ) );

    return {
      listItem: item,
      anchor: anchor,
      target: target
    };
  } );

  // Remove missing targets
  tocItems = tocItems.filter( function( item ) {
    return !!item.target;
  } );

  let path = [];
  let pathIndent;

  tocItems.forEach( function( item, i ) {

    let x = item.anchor.offsetLeft - 5,
        y = item.anchor.offsetTop,
        height = item.anchor.offsetHeight;

    if( i === 0 ) {
      path.push( 'M', x, y, 'L', x, y + height );
      item.pathStart = 0;
    }
    else {
      // Draw an additional line when there's a change in
      // indent levels
      if( pathIndent !== x ) path.push( 'L', pathIndent, y );

      path.push( 'L', x, y );

      // Set the current path so that we can measure it
      tocPath.setAttribute( 'd', path.join( ' ' ) );
      item.pathStart = tocPath.getTotalLength() || 0;

      path.push( 'L', x, y + height );
    }

    pathIndent = x;

    tocPath.setAttribute( 'd', path.join( ' ' ) );
    item.pathEnd = tocPath.getTotalLength();

  } );

  pathLength = tocPath.getTotalLength();

  sync();

}

function sync() {

  let windowHeight = window.innerHeight;

  let pathStart = pathLength,
      pathEnd = 0;

  let visibleItems = 0;

  tocItems.forEach( function( item ) {

    let targetBounds = item.target.getBoundingClientRect();

    if( targetBounds.bottom > windowHeight * TOP_MARGIN && targetBounds.top < windowHeight * ( 1 - BOTTOM_MARGIN ) ) {
      pathStart = Math.min( item.pathStart, pathStart );
      pathEnd = Math.max( item.pathEnd, pathEnd );

      visibleItems += 1;

      item.listItem.classList.add( 'visible' );

      lastItem = item;
    }
    else {
      if ( item != lastItem) {
        item.listItem.classList.remove( 'visible' );
      }
    }

  } );

  // Specify the visible path or hide the path altogether
  // if there are no visible items
  if( visibleItems > 0 && pathStart < pathEnd ) {
    if( pathStart !== lastPathStart || pathEnd !== lastPathEnd ) {
      tocPath.setAttribute( 'stroke-dashoffset', '1' );
      tocPath.setAttribute( 'stroke-dasharray', '1, '+ pathStart +', '+ ( pathEnd - pathStart ) +', ' + pathLength );
      tocPath.setAttribute( 'opacity', 1 );
    }
  }
  // else {
  //   tocPath.setAttribute( 'opacity', 0 );
  // }

  lastPathStart = pathStart;
  lastPathEnd = pathEnd;

}


document.addEventListener("DOMContentLoaded", function() {
  setTocInfo();
  if (toc) {
    window.addEventListener( 'resize', drawPath, false );
    window.addEventListener( 'scroll', sync, false );

    drawPath();
  }
});
