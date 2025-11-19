/*--------------HOmeScreen1 Category Slider------------------*/
$(".homescreen-second-wrapper-slider, .homescreen-fifth-wrapper-slider").slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  swipeToSlide: true,
  infinite:true,
  variableWidth: true,
  autoplaySpeed: 2000,
  dots: false,
  arrows:false
});
/*--------------HOmeScreen1 Seller Slider------------------*/
$(".homescreen-fourth-wrapper-slider").slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  swipeToSlide: true,
  infinite:true,
  variableWidth: true,
  autoplaySpeed: 2000,
  dots: false,
  arrows:false
});
/*--------------HOmeScreen1 Seller Slider------------------*/
$(".homescreen-sixth-wrapper-slider").slick({
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: true,
  swipeToSlide: true,
  infinite:true,
  autoplaySpeed: 2000,
  dots: false,
  arrows:false
});
/*-------------------------------------  Sticky Header-------------------------------------*/
$(window).scroll(function(){
  if ($(window).scrollTop() >= 20) {
    $('#top-header ,#top-navbar').addClass('fixed');
  }
  else {
    $('#top-header ,#top-navbar').removeClass('fixed');
  }
});
/*-------------------------------------  Currency AND language Checkbox-------------------------------------*/
var $radioButtons = $('#language-screen input[type="radio"],#currency-page input[type="radio"');
$radioButtons.click(function() {
  $radioButtons.each(function() {
    $(this).parent().toggleClass('language-sel', this.checked);
  });
});
/*------------------------------------- Read More Text-------------------------------------*/
$('.moreless-button').click(function() {
  $('.moretext').toggleClass('d-inline');

  if ($('.moreless-button').text() == "Read less") {
    $(this).text("Read more")
  } else {
    $(this).text("Read less")
  }
});
/*------------------------------------- Increment Decrement-------------------------------------*/
$('.add').on('click', function () {
  if ($(this).prev().val() < 100) {
    $(this).prev().val(+$(this).prev().val() + 1);
  }
});
$('.sub').on('click', function () {
  if ($(this).next().val() > 1) {
    if ($(this).next().val() > 1) $(this).next().val(+$(this).next().val() - 1);
  }
});
/*------------------------------------- Show Hide Password -------------------------------------*/
$("#eye ,#eye1").click(function() {
  $(this).toggleClass("fa-eye fa-eye-slash");
  input = $(this).parent().find("input");
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
});
/*------------------------------------- Onboarding Screen -------------------------------------*/
$(".skip_btn_1").click(function(){

  $("#first").removeClass("active");
  $(".first_slide").removeClass("active");  

  $("#second").addClass("active");
  $(".second_slide").addClass("active");

});

$(".skip_btn_2").click(function(){
 $("#second").removeClass("active");
 $(".second_slide").removeClass("active");

 $("#third").addClass("active");
 $(".third_slide").addClass("active");
});
/*------------------------------------- Favourite Hide Show -------------------------------------*/
$('.item-bookmark').on('click',function(){
  $(this).toggleClass('active');
}); 

/*------------------------------------- Preloader -------------------------------------*/

$(window).on("load" , function () {
  $('.circle').fadeOut();
  $('.loader-mask').delay(350).fadeOut('slow');
});

$(window).on("load" , function () {
  $('.loader-mask1').delay(2000).fadeOut(3000);

});
/*-------------------------------------Anchore Tag Link Added-------------------------------------*/
$(".cloth-redirect, .best-seller-redirect").wrap('<a href="single-cloths.html"></a>');
$(".shoes-redirect").wrap('<a href="single-shoes.html"></a>');
$(".electronic-redirect").wrap('<a href="single-electronics.html"></a>');
$(".offer-1, .homepage1-tab-details-wrapper").wrap('<a href="clothes-screen.html"></a>');
$(".offer-2, .offer-4").wrap('<a href="electronic-screen.html"></a>');
$(".offer-3").wrap('<a href="shoes-screen.html"></a>');
/*-------------------------------------OTP Section-------------------------------------*/
if(jQuery('#otp').length > 0)
  $('.digit-group').find('input').each(function() {
    $(this).attr('maxlength', 1);
    $(this).on('keyup', function(e) {
      var thisVal = $(this).val();
      var parent = $($(this).parent());

      if(e.keyCode === 8 || e.keyCode === 37) {
        var prev = parent.find('input#' + $(this).data('previous'));

        if(prev.length) {
          $(prev).select();
        }
      } else {
        var next = parent.find('input#' + $(this).data('next'));

        if(!$.isNumeric(thisVal))
        {
          $(this).val('');
          return false;
        }

        if(next.length) {
          $(next).select();
        } else {
          if(parent.data('autosubmit')) {
            parent.submit();
          }
        }
      }
    });
  });
/*-------------------------------------Wallet Screen-------------------------------------*/
$(".payment-mode .check-select-mode input[type='radio']").change(function(){
  var item=$(this);    
  if(item.is(":checked"))
  {
    window.location.href= item.data("target")
  }    
});
/*-------------------------------------Tab Bar Js-------------------------------------*/
const navigationOptions = [
{
  name: 'home',
  color: '#5B37B7'
},
{
  name: 'search',
  color: '#C9379D'
},
{
  name: 'cart(0)',
  color: '#E6A919'
},
{
  name: 'wishlist',
  color: '#1892A6'
},
{
  name: 'account',
  color: '#E6A919'
}
];

const links = document.querySelectorAll('nav a');
function handleClick(e) {
  e.preventDefault();
  links.forEach(link => {
    if (link.classList.contains('active')) {
      link.classList.remove('active');
    }
  });
  this.classList.add('active');
}
/*-------------------------------------Faq Section-------------------------------------*/
$('.nested-accordion').find('.comment').slideUp();
$('.nested-accordion').find('h3').click(function(){
  $(this).next('.comment').slideToggle(100);
  $(this).toggleClass('selected');
});

/*-------------------------------------Friend Section-------------------------------------*/
$(document).ready(function() {
  $(".friend-select input").click(function() {
    var content = $(this);
    if (content.is(":checked")) {
      $(this).parent().addClass("active");
      $(this).parent().siblings().children(".custom-radio-sel-friend").addClass("active");
    }
    else {
      $(this).parent().siblings().children(".custom-radio-sel-friend").removeClass("active");
      $(this).parent().removeClass("active");
    }
    if ($(this).parent().hasClass('active')) { 

      $(this).parent().children(".custom-radio-sel-friend").text("Invite");
    } else {
      $(this).parent().children(".custom-radio-sel-friend").text("Invited")
    }
  });
});

/*-------------------------------------Mode Changes-------------------------------------*/
jQuery('.theme-change').on('click',function(){
  jQuery('.site-content').toggleClass('theme-dark'); 
  if(jQuery('.site-content').hasClass('theme-dark')){ 
   
    location.replace("../zoop-dark/onboarding-screen.html")
  }else{ 
      location.replace("../main-file/onboarding-screen.html")
  }
});

/*-------------------------------------Anchore Tag Link Added-------------------------------------*/
$(".redirect-clothes").wrap('<a href="clothes-screen.html"></a>');
$(".redirect-electronic").wrap('<a href="electronic-screen.html"></a>');
$(".redirect-shoes").wrap('<a href="shoes-screen.html"></a>');






