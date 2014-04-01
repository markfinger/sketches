(function () {

  var two = new Two({
    fullscreen: true,
    autostart: true,
    type: Two.Types.webgl || Two.Types.canvas || undefined
  }).appendTo(document.body);

  var settings = {
    radius: 1.3
  };

  var bg;
  var circle;

  var initShapes = function() {
    two.clear();

    bg = two.makePolygon(
      0, 0,
      two.width, 0,
      two.width, two.height,
      0, two.height
    );

    circle = two.makeCircle(
        two.width / 2,
        two.height / 2,
        Math.min(two.width, two.height) / 2 / settings.radius
    );
    circle.noStroke();

    onUpdate();
  };

  var onUpdate = function(frameCount) {
    var colour = $c.rand();
    bg.fill = colour;
    circle.fill = $c.complement(colour);
  };

  var onGUIChange = function() {
    initShapes();
  };

  var initGUI = function() {
    var gui = new dat.GUI();
    gui.remember(settings);
    _.each(settings, function(value, setting) {
      if (_.contains(value, '#')) {
        gui.addColor(settings, setting).onChange(onGUIChange);
      } else {
        gui.add(settings, setting).onChange(onGUIChange);
      }
    });
  };

  window.onload = function() {
//    initGUI();
    initShapes();
    two.bind('update', onUpdate);
    window.onresize = initShapes;
  };

})();