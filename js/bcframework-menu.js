$(document).ready(function(){
	var $menu = $('.plug-menu'),
		$menuHead = $('[class^="plug-menu-head"]'),
		$menuRoller = $('.plug-menu-roller');

	$menuRoller.click(function(){
		if (!$menu.hasClass('clicked')) {
			$menu.addClass('clicked');
		}
		else{
			$menu.removeClass('clicked');
		}	
	})

	$menuHead.click(function(){
		if (!$(this).parent().hasClass('clicked')) {
			$(this).parent().addClass('clicked');
		}
		else{
			$(this).parent().removeClass('clicked');
		}		
	});
});