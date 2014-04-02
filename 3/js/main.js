(function () {

  var two = new Two({
    fullscreen: true,
    autostart: true,
    type: Two.Types.webgl || Two.Types.canvas || undefined
  }).appendTo(document.body);

  var settings = {
    background: '#000000',
    colour: '#0ef537',
    duration: 150,
    count: 20,
    topWidth: 0.4,
    bottomWidth: -0.25
  };

  var lines;

  var initShapes = function() {
    two.clear();

    var background = two.makePolygon(
      0, 0,
      two.width, 0,
      two.width, two.height,
      0, two.height,
      true
    );
    background.fill = settings.background;

    lines = _.map(_.range(settings.count), function(index) {
      var shape = two.makePolygon(
        0, 0,
        two.width, 0,
        true
      );
      shape.stroke = settings.colour;
      shape.timeOffset = (settings.duration / settings.count) * index;
      return shape;
    });

    var leftBlock = two.makePolygon(
      0, 0,
      two.width * settings.topWidth, 0,
      two.width * settings.bottomWidth, two.height,
      0, two.height
    );
    leftBlock.fill = settings.background;

    var rightBlock = two.makePolygon(
      two.width * (1 - settings.topWidth), 0,
      two.width, 0,
      two.width, two.height,
      two.width * (1 - settings.bottomWidth), two.height
    );
    rightBlock.fill = settings.background;
  };

  var positionElements = function(frameCount) {
    _.each(lines, function(line) {
      var time = (frameCount - line.timeOffset) % settings.duration;
      var y = easeInQuintic(time, -5, two.height, settings.duration);
      if (y > two.height) {
        y = 0;
      }
      line.translation.y = y;
    });
  };

  var easeInQuintic = function(t, b, c, d) {
    // t: current time, b: beginning value, c: change in value, d: duration
    var ts=(t/=d)*t;
    var tc=ts*t;
    return b+c*(tc*ts);
  };

  var onGUIChange = function() {
    initShapes();
  };

  var initGUI = function() {
    var gui = new dat.GUI();
    gui.remember(settings);
    for (var setting in settings) {
      if (settings.hasOwnProperty(setting)) {
        if (_.contains(settings[setting], '#')) {
          gui.addColor(settings, setting).onChange(onGUIChange);
        } else {
          gui.add(settings, setting).onChange(onGUIChange);
        }
      }
    }
    gui.closed = true;
  };

  window.onload = function() {
    document.body.classList.remove('loading');
//    initGUI();
    initShapes();
    two.bind('update', positionElements);
    window.onresize = initShapes;
  };

})();