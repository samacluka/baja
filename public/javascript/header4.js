var path = decodeURIComponent(window.location.pathname.replace(/\/$/, ""))

$(".nav-link").each(function () {
    var href = $(this).attr('href');

    if (path === href){
        $(this).closest('li').addClass('active');
    }

    if(path === ""){
      $('.home-icon').addClass('active'); // Added in case on home
    }
});
