/*------------------------------------- Home Screen Popup-------------------------------------*/
$(window).on('load', function () {
    setTimeout(function () {
      $('#offcanvas').offcanvas('show');
    }, 2500);
  });

jQuery('.pwa-backdrop, .pwa-close, .pwa-btn').on('click',function(){
  jQuery('.pwa-offcanvas').slideUp(500, function() {
    jQuery(this).removeClass('show');
  });
  setTimeout(function(){
    jQuery('.pwa-backdrop').removeClass('show');
  }, 500);
  setCookie(PwaKey, true);
});