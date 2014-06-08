/**
 * 
 * 		title:		Creative Wave CV
 *
 *		author: 	Ovidiu Stefancu
 *					http://www.wpworks.net
 *					info@wpworks.net
 * 
 *		version:    1.1 - 20 June 2011
 *
 */

var WPW = WPW || {}; 
WPW.cfg = {};
WPW.windowFocus = true;


$(document).ready(function($){
	WPW.body = $('body');
	$('#main').removeClass('show_content');
	var cv_wave = new WPW.CVWAVE();
	
	//add that toolbox to help you chose colors and header font size
	if(WPW.waveToolbox)WPW.waveToolbox();
	
	window.onblur = function(){
		WPW.windowFocus = false;
	}
	window.onfocus = function(){
		WPW.windowFocus = true;
	}
	
	if(typeof window.showRecaptcha == 'function'){
		showRecaptcha('recaptcha_widget');
	}
});


WPW.CVWAVE = function(){
	var main = this;

	//ENGINE DECLARATIONS
	
	var header = $('#header');
	var mainNode = $('#main');
	var concentrator = $('#concentrator');
	var footer = $('#footer');
	var menu = $('<div id="menu"></div>');
	var container = $('<div id="container"></div>');
	var containerSlide = $('<div id="container_slide"></div>');
	var siteContent = $('<div id="site-content"></div>');
	var portrait = $('#portrait');
	var preloader = $('#main-preloader');
	var gigaToggle = $('<div id="giga-toggle"></div>');
	
	var callToActionDelay = 4000;
	
	WPW.body.prepend(gigaToggle);
	
	var menuOpen = false;
	var menuBusy = false;
	var menuItems = [];
	var pages = [];
	var currentPage;

	var currentIndex = -1;
	
	var visibleMenuHeight = 0;

	footer.data('top', WPW.cfg.portraitHeight);
	footer.data('margin-top', parseInt(footer.css('margin-top')));
	footer.css('top', footer.data('top') + footer.data('margin-top') + "px");
	
	concentrator.css('width', WPW.cfg.portraitWidth + "px");
	mainNode.css('width', WPW.cfg.portraitWidth*2 + WPW.cfg.menuDistance*2 + "px");
	
	
	main.width = concentrator.width();
	
	container.append(containerSlide);
	siteContent.append(container);
	siteContent.append(menu);
	siteContent.append(footer);
	concentrator.append(siteContent);
	
	var nrPages = $('.page').length;
	
	
	
	//PAGE MANAGEMENT
	
	var showCurrentPage = function(){
		for(var i = 0; i<pages.length; i++ ){
			var page = pages[i];
			
			containerSlide.stop().animate({
				left: -currentIndex * (WPW.cfg.portraitWidth + WPW.cfg.menuDistance)
			}, {
				duration: 500, 
				step:function(){},
				easing:WPW.cfg.menuAnimation,
				complete:function(){ }
			});
			
			if(i == currentIndex){
				currentPage = page;
				menuItems[i].addClass('selected_menu_item');
			} else {
				menuItems[i].removeClass('selected_menu_item');
				}
		}
		positionFooter();
	}
	
	var showPage = function(page){
		if(page.data('onScreen') == false){
			page.data('onScreen', true);
			page.addClass('visiblePage');
			page.hide().delay(WPW.cfg.pageAnimationSpeed*0.8).fadeIn(WPW.cfg.pageAnimationSpeed);
			
		}
	}

	var hidePage = function(page){
		if(page.data('onScreen') == true){
			page.data('onScreen', false);
			page.fadeOut(WPW.cfg.pageAnimationSpeed, function(){
				page.removeClass('visiblePage');	
			})
		}
	}
	//PAGE MANAGEMENT - END


	//FOOTER POSITION
	
	var positionFooter = function(){
		var pageHeight = currentPage.outerHeight(true);
		
		if(currentIndex == -1 )pageHeight = 0;
		
		var footerV = Math.max(pageHeight, WPW.cfg.portraitHeight); 


		$(footer.data()).animate({
			top: footerV
		}, {
			duration: 500, 
			step:function(){
				heightFormula();
				},
			easing:WPW.cfg.menuAnimation,
			complete:function(){

			}
		});
	}
	
	var heightFormula = function(){
		//if(!headerHeight)headerHeight = header.outerHeight(true);
		footer.css('top', footer.data('top') + footer.data('margin-top') + "px");
		container.css('height', footer.data('top') + footer.data('margin-top') + "px");
	}
	
	
	//FOOTER POSITION - end

	
	
	$('.page').each(function(index){
		var page = $(this);
		
		page.data('onScreen', false);
		
		containerSlide.append(page);
		page.css('left', index * (WPW.cfg.portraitWidth + WPW.cfg.menuDistance) + "px");
		pages.push(page);
		
		var menuItem = $('h3', page);
		menuItem.addClass('menu_item');
		menuItem.data('status', 0); // 1, 0, -1 = off, busy, on
		menuItem.data('percent', 0);
				
		//var side_index = parseInt(nrPages/2)
		if(index%2 == 0){
			menuItem.addClass('left_side');
			menuItem.data('animation_way', -1);
		} else {
			menuItem.addClass('right_side');
			menuItem.data('animation_way', 1);
		}
		
		menuItem.click(function(){
			if(!menuBusy){
				if(currentIndex != index){
					currentIndex = index;
					showCurrentPage();
				} else {
					toggleMenu();
				}	
			}
		});
		
		menuItems.push(menuItem);
		menu.append(menuItem);
		
		visibleMenuHeight = menuItem.position().top + menuItem.outerHeight();

	});
	
	//FILL WITH BLANK MENU ITEMS
	var menuItemHeight = menuItems[0].outerHeight();
	var menuItemWidth = parseInt(WPW.cfg.portraitWidth/2);
	
	var totalMenuItems = Math.ceil(WPW.cfg.portraitHeight/menuItemHeight)*2;
	
	if(menuItems.length < totalMenuItems){
		var dif = - menuItems.length + totalMenuItems;
		
		for(var j = 0; j<dif; j++){
			var menuItem = $('<div class="menu_item blank_item"></div>');
			
			menuItem.data('status', 0); // 1, 0, -1 = off, busy, on
			menuItem.data('percent', 0); 
					
			//var side_index = parseInt(nrPages/2)
			if(menuItems.length%2 == 0){
				menuItem.addClass('left_side');
				menuItem.data('animation_way', -1);
			} else {
				menuItem.addClass('right_side');
				menuItem.data('animation_way', 1);
			}
			
			menuItem.click(function(){
				if(!menuBusy)toggleMenu();
			});
			
			menuItems.push(menuItem);
			menu.append(menuItem);
		}
	}
	
	$('.menu_item').each(function(){
		$(this).addClass('no-display');
	});
	
	
	//ADD BG TO MENU ITEMS
	var col = 0;
	var row = 0;
	for(var ii = 0; ii<menuItems.length; ii++){
		var menuItemPic = $('<div class="menu_item_pic"></div>');
		
		var menuItem = menuItems[ii];
		if(!menuItem.hasClass('blank_item')){
			var menuItemBorder = $('<div class="menu_item_border"></div>');
			menuItem.append(menuItemBorder);
		}
		
		menuItem.append(menuItemPic);
		
		if(col == 2){
			col = 0;
			row++;
		}
		menuItemPic.css({ background: 'url("'+ portrait.attr('src') +'") no-repeat -'+ ((menuItemWidth + (col * menuItemWidth)) - menuItemWidth) +'px -' +  ((menuItemHeight + (row * menuItemHeight)) - menuItemHeight) + "px"});
		
		col++;		
	}
	
	
	var containerStatus = 0;	
	var toggleMenu = function(){
		var targetPercent = 0; //0 .. close the menu in portrait
		
		clearInterval(callToActionTimer);
		
		if(!menuBusy){
			menuAnimationStart();
			menuBusy = true;
			menuOpen = !menuOpen;
			if(menuOpen){
				currentIndex = 0;
				targetPercent = 1; 
			} else {
				currentIndex = -1; //set no page selected
			}

			for(var i = 0; i < menuItems.length; i++){
				animateMenuItem(menuItems[i], i * WPW.cfg.menuAnimationDelay, targetPercent);
			}
			
			if(menuOpen){
				setTimeout(function(){showCurrentPage();}, WPW.cfg.menuAnimationSpeed*0.3);
			} else {
				showCurrentPage();
			}

		}
	} 
	
	
	var animateMenuItem = function(button, targetDelay, targetPercent){
		//ANIM
		var animateButton = function(){
			button.css('left', button.data('percent')*button.data('animation_way')*(main.width/2 + WPW.cfg.menuDistance) + "px");
		}		
		
		var imgBlock = $('.menu_item_pic',button); 
		if(targetPercent == 0){
			imgBlock.delay(targetDelay * 1.5).fadeIn(WPW.cfg.menuAnimationSpeed * 2, function(){checkAnimationEnd(button)});
		} else {
			imgBlock.delay(targetDelay * 1.5).fadeOut(WPW.cfg.menuAnimationSpeed * 1.5, function(){checkAnimationEnd(button)});
		}
		
		$(button.data()).delay(targetDelay).animate({
			percent: targetPercent
		}, {
			duration: WPW.cfg.menuAnimationSpeed , 
			step:function(){animateButton()},
			easing:WPW.cfg.menuAnimation,
			complete:function(){
					animateButton();
					// if(button == menuItems[menuItems.length-1]){
							// menuBusy = false;
						// } 
				}
		});
	}
	
	var checkAnimationEnd = function(button){
		if(button == menuItems[menuItems.length-1]){ 
			menuAnimationEnd();
			}
	}
	
	
	//INTRO
	var introAnimation = function(){
		
		footer.hide();
		$('.page').show();
		
		menu.append(portrait);
		portrait.hide().fadeOut(0);	
		$('#main').removeClass('preload');
		$('#main-preloader').fadeOut(1000, function(){
			$('#main-preloader').remove();
		})
		
		portrait.delay(1000).fadeIn(2000, function(){
			portrait.click(function(){
				toggleMenu();
			});
			
			header.click(function(){
				toggleMenu();
			});

			$('.menu_item').each(function(){
				$(this).removeClass('no-display');
			});
			
				
			callToActionTimer = setInterval(main.callToActionWave, callToActionDelay);
		});	
		
		footer.delay(2000).fadeIn(1000);
	}
	
	
	//CALL TO ACTION WAVE
	var callToActionTimer;
	main.callToActionWave = function(){
		var introBrickDelay = 40;
		clearInterval(callToActionTimer);
		callToActionDelay += callToActionDelay;
		callToActionTimer = setInterval(main.callToActionWave, callToActionDelay);
		if(!menuBusy){
			menuAnimationStart();
			menuBusy = true;
			var targetPercent = 1;
			for(var i = 0; i < menuItems.length; i++){
				animateCTAMenuItem(menuItems[i], i * introBrickDelay, targetPercent);
			}
			targetPercent = 0;
			var reset = false;
			for(i = 0; i < menuItems.length; i++){
				if(i == menuItems.length-1)reset = true;
				animateCTAMenuItem(menuItems[i], i * introBrickDelay, targetPercent, reset);
			}
		}
	}
	
	var animateCTAMenuItem = function(button, targetDelay, targetPercent, reset){
		$(button).delay(targetDelay).animate({
					left: targetPercent * 13 * button.data('animation_way')
				}, {
					duration: 200 , 
					step:function(){},
					easing:"easeInOutQuad",
					complete:function(){if(reset){menuBusy = false; menuAnimationEnd();}}
				});
	}
	
	
	//MANAGE PORTRAIT
	var loadportrait = new Image();
	loadportrait = $(loadportrait);
	
	loadportrait.load(function(){
		loadportrait.attr('title',  portrait.attr('title'));
		loadportrait.attr('alt',  portrait.attr('alt'));
		loadportrait.attr('id',  portrait.attr('id'));
		portrait.remove();
		portrait = loadportrait;
		
		containerSlide.css('left', -currentIndex * (WPW.cfg.portraitWidth + WPW.cfg.menuDistance) + "px");
		
		introAnimation();
	}).attr('src', portrait.attr('src'));
	//MANAGE PORTRAIT - END

	
	
	var menuAnimationEnd = function(){
		menuBusy = false;
		if(menuOpen != true){
			menu.append(portrait);
		} else {
			container.addClass('containerOnTop');
		}
	}
	
	var menuAnimationStart = function(){
		portrait.detach();
		container.removeClass('containerOnTop');
		//container.hide();
	}
	


	heightFormula();
	
	WPW.skillDisplay();
	WPW.quoteGallery();
	WPW.parseWaveContactForm();
	header.hide().delay(1000).fadeIn(3000);
	
	gigaToggle.click(function(){
		toggleMenu();
	});

	
	$(".fancy").fancybox({}); //initialize the fancybox 
	
	//SCROLL FIX
	container.scroll(function(){
		var dd = $(this);
		dd.scrollLeft(0);
		dd.scrollTop(0);
	});
	
	containerSlide.scroll(function(){
		var dd = $(this);
		dd.scrollLeft(0);
		dd.scrollTop(0);
	});
}


WPW.skillDisplay = function(){
	
	var starNr = 5;
	
	$('.skill').each(function(){
		var node = $(this);
		
		var stars = $('<div class="skill-stars"></div>');
		node.append(stars);

		var fillStars = parseInt(node.attr('title')); 
		for(var i = 0; i < starNr; i++){
			var star =  $('<div class="skill-star"></div>');
			stars.prepend(star);
			if(i < fillStars){
				star.addClass('full-star');
			}

		}
		
		
	});
}



WPW.quoteGallery = function(){
	var main = this;
	var currentIndex = 0;
	var items = [];
	
	
	$('.quote-item').each(function(index){
		var quote = $(this);
		
		items.push(quote);
		quote.data('onScreen', true);
		
		if(index != 0){
			quote.hide();
			quote.data('onScreen', false);
		}
	})
	
	
	main.nextQuote = function(){
		if(WPW.windowFocus){
			currentIndex ++;
			if(currentIndex > items.length-1)currentIndex = 0;
			
			for(var i = 0; i<items.length; i++){
				var quote = items[i];
				if(i == currentIndex){
					if(!quote.data('onScreen')){
						quote.delay(500).fadeIn(1000);
						quote.data('onScreen', true);
					}
				} else {
					if(quote.data('onScreen')){
						quote.fadeOut(1000);
						quote.data('onScreen', false);
					}
				}
				
			}
		}
	}
	
	var quoteTimer;
	if(items.length > 1){
		quoteTimer = setInterval(main.nextQuote, 6000);
	}
}


WPW.parseWaveContactForm = function(){
	$('#wpw-wave-form').each(function(){
		var form = $(this);
		
		var submitBtn = $('#submit_btn', form);
		var formMsg = $('#msg', form);
		var formEmail = $('#email', form);
		var formSubject = $('#subject', form);
		var formName = $('#name', form);
		var formCode = $('#recaptcha_response_field', form);
		var formCode2 = $('#recaptcha_challenge_field', form);
		var formError = false;
		
		submitBtn.click(function(e){
			formError = false;
			
			formCode = $('#recaptcha_response_field', form);
			formCode2 = $('#recaptcha_challenge_field', form);
			
			checkText(formMsg);
			checkEmail(formEmail);
			checkText(formSubject);
			checkText(formName);
			checkText(formCode);
			
			if(formError)return false;
			else {
				$.post(form.attr('action'), { 
					name: formName.val(),
					email: formEmail.val(),
					subject: formSubject.val(),
					msg: formMsg.val(),
					recaptcha_response_field: formCode.val(),
					recaptcha_challenge_field: formCode2.val()
					},
				   function(data) {
				     //alert("Data Loaded: " + data);
				     $('#form-confirmation').html(data);
				     if($('#form-ok', '#form-confirmation').length > 0){
				     	formMsg.val('');
				     	formEmail.val('');
				     	formName.val('');
				     	formSubject.val('');
				     }
				     
				     $('#form-confirmation').hide().slideUp(0).slideDown(500).delay(5000).slideUp("slow", function(){$('#form-confirmation').html("data");});
				   });
			}
			e.preventDefault();
		});
		
		var checkText = function(node){
			if(node.length > 0){
				if(node.val().length < 2){
					formError = true;
					highlightError(node);
				}
			}
		}
		
		var checkEmail = function(node){
			var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
			if(reg.test(node.val()) == false) {
				formError = true;
				highlightError(node);
			}
		}
		
		var highlightError = function(node){
			var shakeValue = 30; 
			var shakeSpeed = 130; 
			var shakeEase = "easeInOutCirc"; 

			var shakeNode = function(moveValue){
				node.animate({
					left: moveValue
				}, {
					duration: shakeSpeed, 
					step:function(){},
					easing:shakeEase,
					complete:function(){if(moveValue == 0){node.val('')}}
				});
			}
			
			shakeNode(shakeValue);
			shakeNode(-shakeValue);
			shakeNode(shakeValue*0.5);
			shakeNode(-shakeValue*0.5);
			shakeNode(0);
		}
	});
}





//
// DEBUG CONSOLE
//
WPW.console_status = -1;
WPW.debug_console;
WPW.console = function($msg, $break, $clear){
	if(WPW.console_status < 0){
		if($("body").hasClass("debug")){
			WPW.console_status = 1;
			WPW.debug_console = $('<div id="console"></div');
			$('body').prepend(WPW.debug_console);
		} else {
			WPW.console_status = 0;
		}
	}
	if(WPW.console_status ==  1){
	 	if($clear)WPW.debug_console.html("");
		if(WPW.debug_console.html().length > 1000)WPW.debug_console.html("");
		var _break = " | ";
		if($break)_break = "<br />"
	 	WPW.debug_console.html(WPW.debug_console.html() + $msg + _break);
	}
}