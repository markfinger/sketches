(function () {

  var stage = new PIXI.Stage(0xffffff);
  var renderer;

  var settings = {
    // Start on the golden angle
    angle: 180 * (3 - Math.sqrt(5)),
    circleRadius: 1,
    count: 741
  };

  var setRendererSize = function() {
    renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null, false, true);
    _.each(document.getElementsByTagName('canvas'), function(element) {
      element.remove();
    });
    document.body.appendChild(renderer.view);
  };

  var circleIterator = _.range(settings.count + 1);
  var circleRadius = settings.circleRadius;

  var paint = function() {
    stage.children.length = 0;

    var angleAsRad = settings.angle * (Math.PI / 180);
    var constant = parseInt((Math.min(window.innerWidth, window.innerHeight) / 60));
    var originX = window.innerWidth / 2;
    var originY = window.innerHeight / 2;
    var g = new PIXI.Graphics();

    g.beginFill(0x000000, 1);

    _.each(circleIterator, function(i) {
      var radius = constant * Math.sqrt(i);
      var angle = i * angleAsRad;
      g.drawCircle(
        originX + (Math.cos(angle) * radius),
        originY + (Math.sin(angle) * radius),
        circleRadius
      );
    });

    stage.addChild(g);
    renderer.render(stage);
  };

  var animate = function() {
    requestAnimationFrame(function() {
      settings.angle += 0.01;
      paint();
      requestAnimationFrame(animate);
    });
  };

  window.onload = function() {
    setRendererSize();
    paint();
    animate();
    window.onresize = _.debounce(setRendererSize, 50);
  };

})();