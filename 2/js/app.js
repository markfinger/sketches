(function() {
  var wrapHandler = function(handler, func) {
    if (typeof window[handler] !== 'function') {
      window[handler] = func;
    } else {
      var _onresize = window[handler];
      window[handler] = function() {
        _onresize();
        func();
      };
    }
  };

  var paper;
  var paper2;

  var requestAnimationFrame = window.requestAnimationFrame || function(func) {
    return setTimeout(func, 0);
  };

  var getAnimate = function(xCorner, yCorner) {

    // SVG dimensions and layout
    var width = window.innerWidth;
    var height = window.innerHeight;

    // Radial paths
    var maxRadius = Math.min(width, height) / 7;
    var minRadius = maxRadius * 0.1;
    var offset = 45;
    var degreesBetween = 90;

    var originX = width / 2;
    var originY = height / 4;

    if (paper && paper.clear) {
      paper.clear()
    }
    paper = Raphael(xCorner, yCorner, width, height);

    var paths = [];

    var getPath = function(radians) {
      var radius = getRandomInt(minRadius, maxRadius);
      var pathX = (radius * Math.cos(radians));
      var pathY = (radius * Math.sin(radians));

      return 'M' + originX + ',' + originY + 'L' + (originX + pathX) + ',' + (originY + pathY);
    };

    var getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Build paths radiating from the origin
    for (var degrees = offset; degrees <= 360; degrees += degreesBetween) {
      var radians = (degrees * Math.PI) / 180;

      var pathElement = paper.path(
        getPath(radians)
      );
      pathElement.attr('stroke', '#f5de50');

      pathElement.radians = radians;
      paths.push(pathElement);
    }

    var animationFunction = function() {
      for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        path.attr('path', getPath(path.radians));
      }
      requestAnimationFrame(animationFunction);
    };

    return animationFunction;
  };

  var getAnimate2 = function(xCorner, yCorner) {

    // SVG dimensions and layout
    var width = window.innerWidth;
    var height = window.innerHeight;

    // Radial paths
    var maxRadius = Math.min(width, height) / 7;
    var minRadius = maxRadius * 0.1;
    var offset = 45;
    var degreesBetween = 90;

    var originX = width / 2;
    var originY = height * 0.75;

    if (paper2 && paper2.clear) {
      paper2.clear()
    }
    paper2 = Raphael(xCorner, yCorner, width, height);

    var paths = [];

    var getPath = function(radians) {
      var radius = getRandomInt(minRadius, maxRadius);
      var pathX = (radius * Math.cos(radians));
      var pathY = (radius * Math.sin(radians));

      return 'M' + originX + ',' + originY + 'L' + (originX + pathX) + ',' + (originY + pathY);
    };

    var getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Build paths radiating from the origin
    for (var degrees = offset; degrees <= 360; degrees += degreesBetween) {
      var radians = (degrees * Math.PI) / 180;

      var pathElement = paper2.path(
        getPath(radians)
      );
      pathElement.attr('stroke', '#f07575');

      pathElement.radians = radians;
      paths.push(pathElement);
    }

    var animationFunction = function() {
      for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        path.attr('path', getPath(path.radians));
      }
      requestAnimationFrame(animationFunction);
    };

    return animationFunction;
  };

  var init = function() {
    getAnimate(0, 0)();
    getAnimate2(0, 0)();
  };

  wrapHandler('onload', function() {
    init();
    wrapHandler('onresize', init);
  });

}());