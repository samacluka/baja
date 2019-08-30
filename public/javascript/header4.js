$(function () {
    setNavigation();
});

function setNavigation() {
    var path = window.location.pathname;
    path = path.replace(/\/$/, "");
    path = decodeURIComponent(path);

    $(".nav-link").each(function () {
        var href = $(this).attr('href');

        console.log(path);
        if (path === href){
            $(this).closest('li').addClass('active');
        }

        if(path === ""){
          $('.home-icon').addClass('active'); // Added in case on home
        }
    });
}
