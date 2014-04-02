# Tonal
# http://github.com/markfinger/tonal

class Tonal
	# Colours available
	colourSpectrum = [
		'#eee',
		'#ccc',
		'#aaa',
		'#888',
		'#666',
		'#444',
		'#222'
	]
	animationSpeed = Math.ceil(1000 / 15)
	# Animation switch
	runAnimation = true
	# Rounding of each rectangle's corners.
	elementBorderRadius = 0
	elementScale = 24
	elementSpacing = 1
	container = null
	canvasWidth = null
	canvasHeight = null
	# Number of objects on the y-plane
	yNum = null
	# Number of objects on the x-plane
	xNum = null
	# Raphael API, initialised in `init`
	paper = null
	timeouts = []

	init: ->
		container = document.getElementById('tonal-container')

		canvasWidth = container.clientWidth
		canvasHeight = parseInt(
			getComputedStyle(container)['height']
		)
		# If the container doesn't have an explicit height, render the canvas fullscreen
		if not canvasHeight
			document.body.style.overflow = 'hidden'
			canvasHeight = window.innerHeight # 5px allowance for scrollbars

		# Number of objects on the x-plane
		xNum = Math.ceil(canvasWidth / (elementScale + elementSpacing))
		# Number of objects on the y-plane
		yNum = Math.ceil(canvasHeight / elementScale)

		paper = Raphael(container, canvasWidth, canvasHeight)

		draw();

		if runAnimation
			animate()

	debug: ->
		debugger

	debouncer: (func, timeout) ->
		# Delays calling `func` until `timeout` has expired,
		# successive calls reset timeout and enforce the wait

		timeout = timeout || 200;
		timeoutID = null

		return ->
			scope = this
			args = arguments

			clearTimeout(timeoutID)
			timeoutID = setTimeout(
				->
					func.apply(
						scope,
						Array.prototype.slice.call(args)
					)
				timeout
			)

	stopAndRedraw: ->
		# Clear out the animation timeouts and redraw the canvas

		if runAnimation
			for i in timeouts
				clearTimeout(timeouts[i])

		paper.remove()
		tonal.init()

	animate = ->
		# Begin the animation cycle
		if runAnimation
			timeouts.push(
				setTimeout(
					->
						changeColours()
						animate()
					animationSpeed
				)
			)

	randColour = ->
		# Select and return a new colour

		colourSpectrum[Math.round(
			Math.random() * (colourSpectrum.length - 1)
		)]

	changeElementColours = (element) ->
		colour = randColour()
		element.attr({
			fill: colour,
			stroke: colour
		})

	changeColours = ->
		paper.forEach(
			changeElementColours
		)

	draw = ->
		# Primary draw method. Outputs many, many squares

		xCoord = 0
		# Shift the first row down by the spacing used
		yCoord = elementSpacing

		for i in [0...yNum]
			for j in [0...xNum]
				# Draw a rectangle and assign it a colour
				changeElementColours(
					paper.rect(xCoord, yCoord, elementScale, elementScale, elementBorderRadius)
				)
				# Bump the horizontal positioning along
				xCoord += elementScale + elementSpacing
			# Reset the horizontal positioning
			xCoord = 0
			# Bump the vertical positioning along
			yCoord += elementScale + elementSpacing

# Inject event handlers for Tonal, without overriding pre-existing ones
do (window = this) ->

	window.tonal = new Tonal

	eventBindings = {
		onload: tonal.init,
		onresize: tonal.debouncer(tonal.stopAndRedraw)
	}

	for eventName, eventHandler of eventBindings
		# If no event hander already exist
		if (typeof window[eventName] != 'function')
			window[eventName] = eventHandler
		else
			# Package our binding in with the pre-existing handler
			windowEvent = window[eventName] || ->
			window[eventName] = ->
				windowEvent()
				eventHandler()