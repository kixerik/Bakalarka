$(document).ready(function(){
	var $menu = $('.plug-menu'),
		$menuItem = $('.plug-menu-item'),
		$menuRoller = $('.plug-menu-roller');

	$menuRoller.click(function(){
		if (!$menu.hasClass('clicked')) {
			$menu.addClass('clicked');
		}
		else{
			$menu.removeClass('clicked');
		}	
	})

	$menuItem.click(function(){
		if (!$(this).hasClass('clicked')) {
			$(this).addClass('clicked');
		}
		else{
			$(this).removeClass('clicked');
		}		
	});
});