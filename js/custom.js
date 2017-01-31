
//own slider
$(document).ready(function(){
(function autoSlider(){
$('.slider .Active').each(function(){
if (!$(this).is(':last-child')) {
  $(this).delay(2000).fadeOut(1000, function(){
    $(this).removeClass('Active').next().addClass('Active').fadeIn();
    autoSlider();
  });
}
else{
  $(this).delay(2000).fadeOut(1000,function(){
    $(this).removeClass('Active');
    $('.slider div').eq(0).addClass('Active').fadeIn();
    autoSlider();
  });
}
});
}());
//trigger
$('#container').mixItUp();
//popup message
$(".new").on('click',function(){
  $(".new-message").fadeIn('slow');
});
//search
$(".search-butn").click(function(){
 $(".search-option").toggle();
});
});

//slider

    (function($){
        $(window).on("load",function(){
            $(".content").mCustomScrollbar();
        });
    })(jQuery);


   /* Owl Carousel
    -----------------------------------------------*/
  $(document).ready(function() {
    $("#owl-work").owlCarousel({
      autoPlay: 3000,
      items : 3,
      itemsDesktop : [1199,3],
      itemsDesktopSmall : [979,3],
    });
 /* Hide mobile menu after clicking on a link
    -----------------------------------------------*/
    $('.navbar-collapse a').click(function(){
        $(".navbar-collapse").collapse('hide');
    });
  });

  $(document).ready(function(){
/*Active links
 -----------------------------------------------*/
    $('.list-navbar li').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
    });
    

/*click on button to scroll
 -----------------------------------------------*/
 var scrollButton=$("#scroll-top")
 $(window).scroll(function(){
    console.log($(this).scrollTop());
  if ($(this).scrollTop() >=250) {
    scrollButton.show();
  }
  else{
   scrollButton.hide();
  }

   });
    scrollButton.click(function(){
      $("html, body").animate({ scrollTop : 0},1000);
    });
  });



 
