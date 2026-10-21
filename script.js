// The design is authored on a fixed 1920px-wide stage; scale it to the viewport width.
(function () {
  var DESIGN_W = 1920, DESIGN_H = 8552;
  var viewport = document.getElementById('viewport');
  var stage = document.getElementById('stage');
  function fit() {
    var s = window.innerWidth / DESIGN_W;
    stage.style.transform = 'scale(' + s + ')';
    viewport.style.height = DESIGN_H * s + 'px';
  }
  fit();
  window.addEventListener('resize', fit);
})();
