$(document).ready(function(){

    var  $plugSlider = $('.plug-slider'),
        $plugPrev = $plugSlider.find('.plug-slider-prev'),
        $plugNext = $plugSlider.find('.plug-slider-next'),
        $plugButton = $plugSlider.find('.plug-slider-button'),
        indexSlider = 0,
        indexButtons = 0,
        zoznamSliderov = [];

    $plugSlider.each(function() {
         $(this).attr('id', indexSlider);
         if($(this).attr('slide') == undefined){
            $(this).attr('slide','1');
         }
         zoznamSliderov[indexSlider] = new Slider($(this));
         zoznamSliderov[indexSlider].initButtons();
         indexButtons = 0;
         indexSlider++;
    });

    function Slider(slider){
        this.$slider = slider,
        this.$container = slider.find(".plug-slider-container"),   //container pre polozky
        this.$item = slider.find(".plug-slider-item"),     //polozky
        this.$button = slider.find('.plug-slider-button'),
        this.slide = parseInt(this.$slider.attr("slide")-1),    //aktialne zobrazeny slide cislovany od 0
        this.maxSlide = parseInt(this.$item.length-1),     //pocet slidov-1, lebo pocitame od 0
        this.slideWidth = parseInt(slider.width()),     //sirka jedneho slidu
        this.distance,

        this.clicking = false,   //true ak drzim slider   
        this.mXclick = 0,    //aktualna x-ova pozicia kliknutia na obrazovke
        this.aTransform = 0; //finalna hodnota transformu po pusteni mysi(posunuti slidera) 

        this.setSlide = setSlide;
        this.initButtons = initButtons;
        this.updateScroll = updateScroll;
        this.redrawSlide = redrawSlide;
        this.calculateDistance = calculateDistance;
        this.nextSlide = nextSlide;
        this.prevSlide = prevSlide;
        this.actionMouseDown = actionMouseDown;
        this.actionMouseMove = actionMouseMove;
        this.actionMouseUp = actionMouseUp;
        this.actionResize = actionResize;
    }
        
    function initButtons(){
        this.$button.each(function(index) {
            $(this).attr("id", index);
        });
        indexButtons++;
    }

    function actionResize(){
        this.slideWidth = parseInt(this.$slider.width());
        this.$item.css("width",this.slideWidth)
        this.$container.css("width",this.$item.length*this.slideWidth);
        this.redrawSlide(false);
    }

    function updateScroll(e){
        $(window).scrollTop($(window).scrollTop() + (clickY - e.pageY));
    }
        
    function redrawSlide(animate){
        if (animate) {
            this.$container.css("-webkit-transition","1s");
            this.$container.css("-moz-transition","1s");
            this.$container.css("-ms-transition","1s"); 
            this.$container.css("transition","1s"); 
        }else{
            this.$container.css("-webkit-transition","0s");
            this.$container.css("-moz-transition","0s");
            this.$container.css("-ms-transition","0s"); 
            this.$container.css("transition","0s"); 
        };
            this.aTransform = this.slide*(-this.slideWidth);   //hodnota transformu pre zobrazenie slidu v premenej slide
            this.$container.css("-webkit-transform","translate3d("+this.aTransform+"px, 0px, 0px)");
            this.$container.css("-moz-transform","translate3d("+this.aTransform+"px, 0px, 0px)");                
            this.$container.css("-ms-transform","translate3d("+this.aTransform+"px, 0px, 0px)");   
            this.$container.css("transform","translate3d("+this.aTransform+"px, 0px, 0px)"); 
            
    }

    function calculateDistance(mouseXclick, mouseX) {
        return mouseX-mouseXclick;
    }
    
    function nextSlide(){   //hyberm sa zo sliderom(mysou) dolava
        if( this.slide != this.maxSlide ){
                this.slide += 1;     //nasledujuci slide
        }else{
            this.slide = 0;    //prvy slide
        }
    }
    
    function prevSlide(){  //hyberm sa zo sliderom(mysou) doprava
        if( this.slide != 0 ){
                this.slide -= 1;     //predchadzajuci slide
        }else{
            this.slide = this.maxSlide;   //posledny slide
        }
    }

    function setSlide(position){
        if ( position >= 0 && position <= this.maxSlide+1) {
            this.slide = position;
        };
    }
    
    function actionMouseDown(pageXmove){  //stlacim slider
        this.distance = 0;
        this.mXclick = pageXmove;        //
        if ( this.$container.css("-ms-transform") == null  ) {  //ie
            if ( this.$container.css("transform") != null ) {   //firefox, chrome
                this.aTransform = parseInt( this.$container.css("transform").split(',')[4] );
            }
            if ( this.$container.css("-webkit-transform") != null ) {   //safari
                this.aTransform = parseInt( this.$container.css("-webkit-transform").split(',')[4] );
            }
        }
        this.clicking = true;    
        this.$container.css("-webkit-transition","0s");
        this.$container.css("-moz-transition","0s");
        this.$container.css("-ms-transition","0s"); 
        this.$container.css("transition","0s"); 
    }
    
    function actionMouseMove(pageXmove){  //hybem so sliderom
        var transform,  //hodnota od laveho kraja na aku sa ma transformovat pri pohybe sliderom 
            rLimit = this.maxSlide*this.slideWidth; //pravy limit hodnoty transform
            lLimit = 0; //lavy limit hodnoty transform
            this.distance = this.calculateDistance( this.mXclick, pageXmove );
        if( this.clicking == true ){     //je kliknute
            transform = this.aTransform+this.distance;   //priebezna hodnota pre efekt posuvania 
            if(transform > lLimit){     //posuvam za lavy okraj kde nic nieje
                transform = lLimit;     //dalej za tento okraj neposuniem
            }
            if(transform < -rLimit){    //posuvam za pravy okraj kde nic nieje
                transform = -rLimit;    //dalej za tento okraj neposuniem
            }
            this.$container.css("-webkit-transform","translate3d("+transform+"px, 0px, 0px)");
            this.$container.css("-moz-transform","translate3d("+transform+"px, 0px, 0px)");                
            this.$container.css("-ms-transform","translate3d("+transform+"px, 0px, 0px)");   
            this.$container.css("transform","translate3d("+transform+"px, 0px, 0px)");  
        }
        
    }
    
    function actionMouseUp(){     //pustim slider
        if(this.clicking == true){
            if(-this.distance > this.slideWidth/5){ //posuvanie slideru mysou vlavo o 1/5tinu?
                this.nextSlide();    //posuniem sa o slide dolava
            }
            if(this.distance > this.slideWidth/5){ //posuvanie slideru mysou vpravo o 1/5tinu?
                this.prevSlide();   //posuniem sa o slide doprava
            }
        }
        this.redrawSlide(true);
        this.clicking = false;
    }



    
    //---------ACTION LISTENERS
    $plugSlider.mousedown(function( event ) {    //stlacim mys na slideri   
        zoznamSliderov[$(this).attr("id")].actionMouseDown(event.pageX); 
    });  
    $plugSlider.mousemove(function( event ) {    //hybem sa po slideri
        zoznamSliderov[$(this).attr("id")].actionMouseMove(event.pageX); 
    });
    $(document).mouseup(function( event ) {    //pustim mys hocikde na obrazovke
        $.each(zoznamSliderov, function(index, val) {
            val.actionMouseUp(event.pageX);
        });  
    }); 
    $plugPrev.bind( "click", function() {
        zoznamSliderov[$(this).closest('.plug-slider').attr("id")].prevSlide();
        zoznamSliderov[$(this).closest('.plug-slider').attr("id")].redrawSlide(true);
    });
    $plugNext.bind( "click", function() {
        zoznamSliderov[$(this).closest('.plug-slider').attr("id")].nextSlide();
        zoznamSliderov[$(this).closest('.plug-slider').attr("id")].redrawSlide(true);
    });
    $plugButton.bind( "click", function() {
        zoznamSliderov[$(this).closest('.plug-slider').attr("id")].setSlide(parseInt($(this).attr("id")));
        zoznamSliderov[$(this).closest('.plug-slider').attr("id")].redrawSlide(true);
    });



    //MOBILE ACTION LISTENERS
    $plugSlider.on('touchstart click', function (event) {    //stlacim na slider
        try {
            var touch = event.originalEvent.touches[0];
            zoznamSliderov[$(this).attr("id")].actionMouseDown(touch.pageX);
        }
        catch(err){}
    });
    $plugSlider.on('touchend', function (event) {        //pustim slider
        try {
            var touch = event.originalEvent.touches[0];
            zoznamSliderov[$(this).attr("id")].actionMouseUp(); 
        }
        catch(err){}
    });
    $plugSlider.on('touchmove', function (event) {       //hybem sa po slideri
        try {
            var touch = event.originalEvent.touches[0];
            zoznamSliderov[$(this).attr("id")].actionMouseMove(touch.pageX); 
            this.updateScroll(touch.pageY);
            return false;
        }
        catch(err){}
    });
    
    
    


//   --------------------------------------RESPONSIVE
    $('.plug-slider-item img').on('dragstart', function( event ) { event.preventDefault(); });

    $( window ).resize(function() {
        $.each(zoznamSliderov, function(index, val) {
             val.actionResize();
        });
    });

    //pri prvom nacitani
    $.each(zoznamSliderov, function(index, val) {
             val.actionResize();
    });

    // window.setInterval(function(){   
    //     $plugSlider.each(function(){
    //         $slider = $(this);
    //         $container = $(this).find(".plug-slider-container");
    //         this.$item = $(this).find(".plug-slider-item");
    //         slide = parseInt($(this).attr("slide"));
    //         maxSlide = parseInt(this.$item.length-1);
    //         nextSlide();
    //         aTransform = slide*(-parseInt($(this).find(".plug-slider-item").css("width"))); 
    //         $(this).find(".plug-slider-container").css("-webkit-transform","translate3d("+aTransform+"px, 0px, 0px)");
    //         $(this).find(".plug-slider-container").css("-moz-transform","translate3d("+aTransform+"px, 0px, 0px)");                
    //         $(this).find(".plug-slider-container").css("-ms-transform","translate3d("+aTransform+"px, 0px, 0px)");   
    //         $(this).find(".plug-slider-container").css("transform","translate3d("+aTransform+"px, 0px, 0px)"); 
    //         $(this).find(".plug-slider-container").css("-webkit-transition","1s");
    //         $(this).find(".plug-slider-container").css("-moz-transition","1s");
    //         $(this).find(".plug-slider-container").css("-ms-transition","1s"); 
    //         $(this).find(".plug-slider-container").css("transition","1s");
    //     });
    // }, 7000);
});