(function () {

  var stage = new PIXI.Stage(0xffffff);
  var renderer;
  var start;

  var settings = {
    duration: 5000,
    animMod: 1.25,
    alphaFade: 1.8,
    lineWidth: 4,
    widthFactor: 4
  };

  var setRendererSize = function() {
    renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null, false, true);
    _.each(document.getElementsByTagName('canvas'), function(element) {
      element.remove();
    });
    document.body.appendChild(renderer.view);
  };

  var paint = function() {
    stage.children.length = 0;
    
    var elapsed = (+new Date - start) % settings.duration;
    
    var duration = settings.duration;

    var firstStage;
    var secondStage = 0;
    var thirdStage = 0;
    var fourthStage = 0;

    var animationStage = elapsed / (duration / 4);
    if (animationStage > 1) {
      firstStage = 1;
      if (animationStage > 2) {
        secondStage = 1;
        if (animationStage >= 3) {
          thirdStage = 1;
          if (animationStage >= 4) {
            fourthStage = 1;
          } else {
            fourthStage = animationStage % 1;
          }
        } else {
          thirdStage = animationStage % 1;
        }
      } else {
        secondStage = animationStage % 1;
      }
    } else {
      firstStage = animationStage % 1;
    }

    var graphics = new PIXI.Graphics();

    var lineWidth = settings.lineWidth;

    graphics.lineStyle(
      lineWidth,
      Math.pow(16, 6) * (animationStage * settings.animMod),
      fourthStage > 0 ? 1 - fourthStage * settings.alphaFade : 1
    );

    var width = Math.min(window.innerWidth, window.innerHeight) / settings.widthFactor;

    var cX = window.innerWidth / 2;
    var cY = window.innerHeight / 2;
    var x1;
    var y1;
    var x2;
    var y2;

    if (firstStage > 0) {
      // Left vert
      x1 = cX - width;
      y1 = cY - width;
      x2 = x1;
      y2 = y1 + (2 * width * firstStage);
      graphics.moveTo(x1, y1);
      graphics.lineTo(x2, y2);

      // Right vert
      x1 = cX + width;
      y1 = cY - width;
      x2 = x1;
      y2 = y1 + (2 * width * firstStage);
      graphics.moveTo(x1, y1);
      graphics.lineTo(x2, y2);

      if (secondStage > 0) {
        // Top horiz
        x1 = cX - width - (lineWidth / 2);
        y1 = cY - width + (lineWidth / 2);
        x2 = x1 + ((2 * (width + (lineWidth / 2))) * secondStage);
        y2 = y1;
        graphics.moveTo(x1, y1);
        graphics.lineTo(x2, y2);

        // Bottom horiz
        x1 = cX + width + (lineWidth / 2);
        y1 = cY + width - (lineWidth / 2);
        x2 = x1 - ((2 * (width + (lineWidth / 2))) * secondStage);
        y2 = y1;
        graphics.moveTo(x1, y1);
        graphics.lineTo(x2, y2);

        if (thirdStage > 0) {
          // Top left diag
          x1 = cX - width;
          y1 = cY + width - (lineWidth / 2);
          x2 = x1 + (2 * width * thirdStage);
          y2 = y1 - (2 * width * thirdStage) + lineWidth;
          graphics.moveTo(x1, y1);
          graphics.lineTo(x2, y2);

          // Top right diag
          x1 = cX + width;
          y1 = cY + width - (lineWidth / 2);
          x2 = x1 - (2 * width * thirdStage);
          y2 = y1 - (2 * width * thirdStage) + lineWidth;
          graphics.moveTo(x1, y1);
          graphics.lineTo(x2, y2);
        }
      }
    }

    stage.addChild(graphics);
    renderer.render(stage);
  };

  var animate = function() {
    requestAnimationFrame(function() {
      paint();
      requestAnimationFrame(animate);
    });
  };

  var onGUIChange = function() {
    paint();
  };

  var initGUI = function() {
    var gui = new dat.GUI();
    gui.remember(settings);
    _.each(settings, function(value, setting) {
      if (_.isString(value)) {
        gui.addColor(settings, setting).onChange(onGUIChange);
      } else {
        gui.add(settings, setting).onChange(onGUIChange);
      }
    });
  };

  window.onload = function() {
    start = +new Date;
//    initGUI();
    setRendererSize();
//    paint();
    animate();
    window.onresize = _.debounce(setRendererSize, 50);
  };

})();