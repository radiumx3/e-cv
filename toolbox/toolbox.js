WPW.waveToolbox = function(){
	
	var main = this;
	
	var toolboxContainer = $('<div id="toolbox-container"></div>');
	WPW.body.append(toolboxContainer);
	
	toolboxContainer.load("toolbox/toolbox.html", function(){
	
			var setColorBtn = function(btnName, colorTarget, defaultColor, theTarget, theCss){
				var targets = theTarget.split(",");
				var csss = theCss.split(",");
						
				defaultColor = $(targets[0]).css(csss[0]);
				var btn = $('<div class="btn_color" title="ELEMENTS: '+ theTarget +' \nCSS: '+ theCss +'">[?] '+btnName+': <div class="color-box" style="background-color: '+ defaultColor +'"></div></div>');
				$('#wpw-toolbox-colors').append(btn);
				
				btn.ColorPicker({
					color: defaultColor,
					onShow: function (colpkr) {
						$(colpkr).fadeIn(500);
						return false;
					},
					onHide: function (colpkr) {
						$(colpkr).fadeOut(500);
						return false;
					},
					onChange: function (hsb, hex, rgb) {

						$("div", btn).css("backgroundColor", '#' + hex);
						
						$.each(targets, function(index, value) {
							var tt = $(value);
							$.each(csss, function(index2, value2) {
								tt.css(value2, '#' + hex);
							});
						});
					}
				});	
			}
			
			var setInputText = function(btnName, theTarget, defaultValue, inputType){
				if(!inputType)inputType = "text";
				var btn = $('<div class="toolbox-btn" title="ELEMENTS: '+ theTarget +'">[?] '+btnName+': </div>');
				var theInput = $('<input class="toolbox-input-field" type="'+inputType+'" name="' + btnName.replace(" ", "") + '" size="30" value="'+ defaultValue +'"/>');
				btn.append(theInput);
				theTarget = $(theTarget);
				theInput.change(function(){
					theTarget.html(theInput.val());
				});
				theInput.keyup(function(){
					theTarget.html(theInput.val());
				});
				
				$('#wpw-toolbox-colors').append(btn);
				//$('#wpw-toolbox-colors').append($('<br/>'));
			}


			// ADD OPTIONS
			
			
			setInputText('Name', 'h1', "Jen Smith");
			$('#wpw-toolbox-colors').append(new WPW.simpleSlider("Size: ", 10, 120, "h1", 58));
			$('#wpw-toolbox-colors').append($('<br/>'));
			setInputText('Subtitle', 'h2', "Architect");
			$('#wpw-toolbox-colors').append(new WPW.simpleSlider("Size: ", 8, 50, "h2", 20));

			$('#wpw-toolbox-colors').append($('<hr>'));
			
			setColorBtn("Background Color", "#ffffff", '#ffffff', 'html', 'backgroundColor');
			setColorBtn("Header and Footer", "#444444", '#444444', 'h1,h2,#footer', 'color,borderColor');
			$('#wpw-toolbox-colors').append($('<br/>'));
			
			//MENU
			setColorBtn("Menu Item Default", "#aaaaaa", '#aaaaaa', '.menu_item,.menu_item_border', 'color,borderColor');
			setColorBtn("Menu Item Selected", "#000000", '#000000', '.selected_menu_item,.selected_menu_item .menu_item_border', 'color,borderColor');
			$('#wpw-toolbox-colors').append($('<br/>'));
			
			//TEXT
			setColorBtn("Text Normal", "#777777", '#777777', 'html', 'color');
			setColorBtn("Text Title", "#000000", '#000000', 'h4', 'color,borderColor');
			setColorBtn("Text SubTitle", "#000000", '#000000', 'h5', 'color');
			setColorBtn("Text Strong", "#111111", '#111111', 'strong', 'color,borderColor');
			
			

			
			
			
			var close_btn = $('#control-panel-close-button');
			var onScreen = false;
			close_btn.click(function(){
				onScreen = !onScreen;
				toggleControlPanel();
			});
			
			var toggleControlPanel = function(){
				if(onScreen){
					toolboxContainer.css('left', 0 + "px");
				} else {
					toolboxContainer.css('left', -toolboxContainer.width() + "px");
				}
			}
			
			toggleControlPanel();
		});
}

WPW.simpleSlider = function(name, min, max, theTarget, defaultValue){

	var workingValue = max - min;
	var percent = 0;
	
	theTarget = $(theTarget);
	
	var slider = $('<div class="wpw-simple-slider"></div>');
	var sliderPad = $('<div class="wpw-simple-slider-pad"></div>');
	var sliderValue = $('<div class="wpw-simple-slider-value"></div>');
	var sliderName = $('<div class="wpw-simple-slider-name"></div>');
	slider.append(sliderPad);
	sliderName.html(name);
	sliderName.append(sliderValue);
	slider.append(sliderName);
	
	var left = 0;
	var oldLeft = 0;
	
	sliderPad.mousedown(function(e){
		left = e.pageX;
		startMove();
		e.preventDefault();
	});
	
	var startMove = function(){
		oldLeft = left;
		$('html').mousemove(function(e){
			left = e.pageX;
			moveSlider();
			e.preventDefault();
		});
		
		$('html').mouseup(function(){
			$('html').unbind('mousemove');
		});
	}
	
	var moveSlider = function(){
		var dist = slider.width() - sliderPad.width();
		
		
		var dif = left - oldLeft;
		var newLeft = sliderPad.position().left + dif;
		if(newLeft < 0)newLeft = 0;
		if(newLeft > dist)newLeft = dist;
		
		var percent = newLeft/dist;
		var newVal = parseInt(workingValue * percent + min); 
		
		sliderPad.css('left', newLeft + "px");
		
		
		theTarget.css('font-size', newVal + "px");
		sliderValue.html(newVal + "px");
		
		oldLeft = left;
	}
	
	//preset
	setTimeout(function(){
		percent = defaultValue/workingValue;
		var presetLeft = parseInt((slider.width() - sliderPad.width()) * percent);
		sliderPad.css('left', presetLeft + "px");
		//theTarget.css('font-size', defaultValue + "px");
		sliderValue.html(defaultValue + "px");
	}, 10);
	
	return slider;
}
