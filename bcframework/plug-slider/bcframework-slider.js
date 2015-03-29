$(document).ready(function(){
    
   var  $clickerSlider = $('.plug-slider'),
        $defSliderItem = $('.plug-slider-item'),
        $defSliderContainer = $('.plug-slider-container'),
        $slider,
        $element,   //obal vsetkych slidov
        $el,     //obal jedneho slidu
        mXclick,    //aktualna x-ova pozicia kliknutia na obrazovke
        slide = 0,    //aktialne zobrazeny slide cislovany od 0
        maxSlide,     //pocet slidov-1, lebo pocitame od 0
        distance,   //vzdialenost mysi od miesta kliku
        clicking,   //true ak drzim slider
        aTransform; //finalna hodnota transformu po pusteni mysi(posunuti slidera)   
        
    function scrollUpdate(e){
        $(window).scrollTop($(window).scrollTop() + (clickY - e.pageY));
    }
        
    function redraw(e){
        aTransform = parseInt(e.attr("slide"))*(-parseInt(e.find(".plug-slider-item").css("width"))); 
        e.find(".plug-slider-container").css("-webkit-transform","translate3d("+aTransform+"px, 0px, 0px)");
        e.find(".plug-slider-container").css("-moz-transform","translate3d("+aTransform+"px, 0px, 0px)");                
        e.find(".plug-slider-container").css("-ms-transform","translate3d("+aTransform+"px, 0px, 0px)");   
        e.find(".plug-slider-container").css("transform","translate3d("+aTransform+"px, 0px, 0px)"); 
        e.find(".plug-slider-container").css("-webkit-transition","0s");
        e.find(".plug-slider-container").css("-moz-transition","0s");
        e.find(".plug-slider-container").css("-ms-transition","0s"); 
        e.find(".plug-slider-container").css("transition","0s"); 
    }

    function calculateDistance(mouseXclick, mouseX) {
        return mouseX-mouseXclick;
    }
    
    function mLeft(){   //hyberm sa zo sliderom(mysou) dolava
        if( slide != maxSlide ){
                slide += 1;     //nasledujuci slide
        }else{
            slide = 0;    //prvy slide
        }
        $slider.attr("slide",slide);
    }
    
    function mRight(){  //hyberm sa zo sliderom(mysou) doprava
        if( slide != 0 ){
                slide -= 1;     //predchadzajuci slide
        }else{
            slide = maxSlide;   //posledny slide
        }
        $slider.attr("slide",slide);
    }
    
    function mDown(pageXmove){  //stlacim slider
        mXclick = pageXmove;        //
        aTransform = parseInt( $element.css("transform").split(',')[4] );
        clicking = true;    
        $element.css("-webkit-transition","0s");
        $element.css("-moz-transition","0s");
        $element.css("-ms-transition","0s"); 
        $element.css("transition","0s"); 
    }
    
    
    
    function mMove(pageXmove){  //hybem so sliderom
        var transform,  //hodnota od laveho kraja na aku sa ma transformovat pri pohybe sliderom 
            rLimit, //pravy limit hodnoty transform
            lLimit = 0; //pravy limit hodnoty transform
        if( clicking == true ){     //je kliknute
            rLimit = maxSlide*parseInt($el.css("width")); //pravy limit hodnoty transform
            distance = calculateDistance( mXclick, pageXmove ); //vzdialenost od miesta kliku
            transform = aTransform+distance;    //priebezna hodnota pre efekt posuvania 
            if(transform > lLimit){     //posuvam za lavy okraj kde nic nieje
                transform = lLimit;     //dalej za tento okraj neposuniem
            }
            if(transform < -rLimit){    //posuvam za pravy okraj kde nic nieje
                transform = -rLimit;    //dalej za tento okraj neposuniem
            }
            $element.css("-webkit-transform","translate3d("+transform+"px, 0px, 0px)");
            $element.css("-moz-transform","translate3d("+transform+"px, 0px, 0px)");                
            $element.css("-ms-transform","translate3d("+transform+"px, 0px, 0px)");   
            $element.css("transform","translate3d("+transform+"px, 0px, 0px)");  
        }
    }
    
    function mUp(){     //pustim slider
        if(clicking == true){
            if(-distance > parseInt($el.css("width"))/5){ //posuvanie slideru mysou vlavo o 1/5tinu?
                mLeft();    //posuniem sa o slide dolava
            }
            if(distance > parseInt($el.css("width"))/5){ //posuvanie slideru mysou vpravo o 1/5tinu?
                mRight();   //posuniem sa o slide doprava
            }

            aTransform = slide*(-parseInt($el.css("width")));   //hodnota transformu pre zobrazenie slidu v premenej slide
            $element.css("-webkit-transform","translate3d("+aTransform+"px, 0px, 0px)");
            $element.css("-moz-transform","translate3d("+aTransform+"px, 0px, 0px)");                
            $element.css("-ms-transform","translate3d("+aTransform+"px, 0px, 0px)");   
            $element.css("transform","translate3d("+aTransform+"px, 0px, 0px)"); 
            $element.css("-webkit-transition","1s");
            $element.css("-moz-transition","1s");
            $element.css("-ms-transition","1s"); 
            $element.css("transition","1s"); 
            
            distance = 0; //pretoze mousedown na elemente sa nemusi vykonat 
        }
        clicking = false;
    }
    //---------ACTION LISTENERS
    $clickerSlider.mousedown(function( event ) {    //stlacim mys na slideri
        $slider = $(this);
        $element = $(this).find(".plug-slider-container");
        $el = $(this).find(".plug-slider-item");
        slide = parseInt($(this).attr("slide"));
        maxSlide = parseInt($el.length-1);
        mDown(event.pageX);
    });  
    $(document).mouseup(function() {    //pustim mys hocikde na obrazovke
        mUp();
    });    
    $clickerSlider.mousemove(function( event ) {    //hybem sa po slideri
        mMove(event.pageX);
    });
    //MOBILE
    $clickerSlider.on('touchstart click', function (event) {    //stlacim na slider
        // if (typeof event.originalEvent.touches !== 'undefined' && event.originalEvent.touches.length > 0) {
            var touch = event.originalEvent.touches[0];
            $slider = $(this);
            $element = $(this).find(".plug-slider-container");
            $el = $(this).find(".plug-slider-item");
            slide = parseInt($(this).attr("slide"));
            maxSlide = parseInt($el.length-1);
            mDown(touch.pageX);
        // }
    });
   $clickerSlider.on('touchend', function (event) {        //pustim slider
        // if (typeof event.originalEvent.touches !== 'undefined' && event.originalEvent.touches.length > 0) {
            var touch = event.originalEvent.touches[0];
            mUp();
        // }
    });
    $clickerSlider.on('touchmove', function (event) {       //hybem sa po slideri
        // if (typeof event.originalEvent.touches !== 'undefined' && event.originalEvent.touches.length > 0) {
            var touch = event.originalEvent.touches[0];
            mMove(touch.pageX);
            scrollUpdate(touch.pageY);
            return false;
        // }
    });
    
    
    
//   --------------------------------------RESPONSIVE
    $('.plug-slider-item img').on('dragstart', function( event ) { event.preventDefault(); });
    $( window ).resize(function() {
        $defSliderItem.each(function(){
            $(this).css("width",$(this).parent().parent('.plug-slider').width());
        });
        // $clickerSlider.each(function(){
        //     $(".plug-slide-item",this).css("width",$(this).width());
        // });
//        $('.plug-slider.full ul').css("max-height",$( window ).height());   //nastavenie na fullscreen aj na mobilnom
//        $('.plug-slider.full ul').css("min-height",$( window ).height());   //nastavenie na fullscreen aj na mobilnom  
        // $element.css("width",$slider.width()*($el.length+1));  //nastavenie sirky kontaineru
        $defSliderContainer.each(function(){
            $(this).css("width",$(this).parent('.plug-slider').width()*($(this).find('.plug-slider-item').length+1));  //nastavenie sirky kontaineru
        });

        $clickerSlider.each(function(){
            // aTransform = slide*(-parseInt($el.css("width"))); 
            aTransform = parseInt($(this).attr("slide"))*(-parseInt($(this).find(".plug-slider-item").css("width"))); 
            $(this).find(".plug-slider-container").css("-webkit-transform","translate3d("+aTransform+"px, 0px, 0px)");
            $(this).find(".plug-slider-container").css("-moz-transform","translate3d("+aTransform+"px, 0px, 0px)");                
            $(this).find(".plug-slider-container").css("-ms-transform","translate3d("+aTransform+"px, 0px, 0px)");   
            $(this).find(".plug-slider-container").css("transform","translate3d("+aTransform+"px, 0px, 0px)"); 
            $(this).find(".plug-slider-container").css("-webkit-transition","0s");
            $(this).find(".plug-slider-container").css("-moz-transition","0s");
            $(this).find(".plug-slider-container").css("-ms-transition","0s"); 
            $(this).find(".plug-slider-container").css("transition","0s"); 
        });
    });
    
    $defSliderItem.each(function(){
        $(this).css("width",$(this).parent().parent('.plug-slider').width());
    });

    $defSliderContainer.each(function(){
        $(this).css("max-height",$( window ).height()); //po 1 nacitani stranky
        $(this).css("width",$(this).parent('.plug-slider').width()*($(this).find('.plug-slider-item').length+1));  //po 1 nacitani stranky  
    });

    $clickerSlider.each(function(){
        $(this).attr("slide",slide);
    });

    window.setInterval(function(){   
        $clickerSlider.each(function(){
            $slider = $(this);
            $element = $(this).find(".plug-slider-container");
            $el = $(this).find(".plug-slider-item");
            slide = parseInt($(this).attr("slide"));
            maxSlide = parseInt($el.length-1);
            mLeft();
            aTransform = slide*(-parseInt($(this).find(".plug-slider-item").css("width"))); 
            $(this).find(".plug-slider-container").css("-webkit-transform","translate3d("+aTransform+"px, 0px, 0px)");
            $(this).find(".plug-slider-container").css("-moz-transform","translate3d("+aTransform+"px, 0px, 0px)");                
            $(this).find(".plug-slider-container").css("-ms-transform","translate3d("+aTransform+"px, 0px, 0px)");   
            $(this).find(".plug-slider-container").css("transform","translate3d("+aTransform+"px, 0px, 0px)"); 
            $(this).find(".plug-slider-container").css("-webkit-transition","1s");
            $(this).find(".plug-slider-container").css("-moz-transition","1s");
            $(this).find(".plug-slider-container").css("-ms-transition","1s"); 
            $(this).find(".plug-slider-container").css("transition","1s");
        });
    }, 7000);
});