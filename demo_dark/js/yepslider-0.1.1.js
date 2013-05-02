var self = null;
var interval = null;

/**
 * YepSlider v0.1.1
 * @constructor
 * @param {number} duration duration (ms) of the slide animation
 * @param {boolean} autoplay start automatically ?
 * @param {number} waiting_time time (ms) between photos in autoplay mode
 */
function YepSlider(duration, autoplay, waiting_time) {
  // Keep the reference (when we are in a jQuery handler)
  self = this;
  // Slider root element
  self.root_element = $('#yep-slider');
  // Images
  self.elements = self.getImg();
  // Yep button
  self.yep_button = $('#yep-button');
  // Animations duration
  self.duration = duration;
  // Autoplay
  self.auto_play = autoplay;
  // Waiting time
  self.waiting_time = waiting_time;

  // Initiate the slider
  self.init();
}

/**
 * Initiate the slider
 */
YepSlider.prototype.init = function() {
  // Define which image is on the left, and which is on the right
  self.defineLeftAndRight(self.root_element.find('img:first-child')[0]);

  // On click on image
  self.root_element.on('auto', 'img[class*="yep"]', { slider: self.root_element, auto: true }, self.slide);
  self.root_element.on('click', 'img[class*="yep"]', { slider: self.root_element, auto: false }, self.slide);

  // On click on the yep-button
  self.yep_button.click(function() {
    self.auto_play = !self.auto_play;
    self.autoPlay();
  });

  // Launch the autoPlay to init the yep button status, and maybe start the slideshow if the user specified "true"
  self.autoPlay();
}

/**
 * Get the images of the slider
 * @return {jQuery} Array of DOM elements
 */
YepSlider.prototype.getImg = function() {
  return $(self.root_element).find('img');
}

/**
 * Slide an image
 * @param {} event
 */
YepSlider.prototype.slide = function(event) {
  var image = event.target;
  var slider = event.data.slider;
  var auto = event.data.auto;

  // If we clicked manually
  if (!auto) {
    // Stop the auto_play mode
    self.auto_play = false;
    self.autoPlay();

    // Hide the help span
    $('#yep-help').fadeOut();
  }

  // Calculate the new position of the slider
  var new_position = $(image).width() + parseInt($(image).css('margin-left'));

  // Animaaaate
  if ($(image).hasClass('yep-left')) {
    $(slider).animate({ left: '+=' + new_position }, self.duration);
  } else {
    $(slider).animate({ left: '-=' + new_position }, self.duration);
  }

  // We redefine the left and right image
  self.defineLeftAndRight(image);
}

/**
 * Define which image is on the left, and which is on the right
 * It add the class "yep-left" on the left one, and "yep-right" on the right one.
 * @param {DOM element} image The image which is presented
 */
YepSlider.prototype.defineLeftAndRight = function(image) {
  // We remove the yep classes of all elements
  $(self.elements).removeClass('yep-left yep-right');

  // Get the current image position in the element list
  var current_index = $.inArray(image, self.elements);

  if (self.elements[current_index - 1] != undefined) {
     $(self.elements[current_index - 1]).addClass('yep-left');
  }
  if (self.elements[current_index + 1] != undefined) {
     $(self.elements[current_index + 1]).addClass('yep-right');
  }
}

/**
 * Start or stop the auto play mode
 * @param {bool} auto_play true to start the auto play, false to stop
 */
YepSlider.prototype.autoPlay = function(event) {
  // Play
  if (self.auto_play) {
    // Start the interval
    interval = setInterval(function() {
      // If we can slide to the right, just do it
      if ($('.yep-right').length > 0) {
        $('.yep-right').trigger('auto');

      // Else, back to the start
      } else {
        self.root_element.animate({left: self.root_element.find('img:first-child').css('margin-left')});
        self.defineLeftAndRight(self.root_element.find('img:first-child')[0]);
      }

    }, self.waiting_time);

    // Change the label
    $('#yep-button').html('Stop');

  // Stop
  } else {
    // Stop the interval
    clearInterval(interval);
    interval = null;

    // Change the label
    $('#yep-button').html('Start');
  }
}
