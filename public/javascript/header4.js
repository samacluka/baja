try {
    var path = decodeURIComponent(window.location.pathname.match(/^\/[a-zA-Z0-9]{1,}\//g)[0].replace(/\/$/, ""));
} catch (e) {
    var path = decodeURIComponent(window.location.pathname.replace(/\/$/, ""));
}

$(".nav-link").each(function () {
    var href = $(this).attr('href');

    if (path === href){
        $(this).closest('li').addClass('active');
    }

    if(path === ""){
      $('#home-li').addClass('active'); // Added in case on home
    }
});
