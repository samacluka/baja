$('#exampleModalCenter').on('show.bs.modal', function (event) {
  if (window.innerWidth < 800) {
    return event.preventDefault();
  } else {
    var card_img = $(event.relatedTarget).find('img');
    var modal_img = $("#modal_img");

    modal_img.attr('src', card_img.attr('src'));

    $('#exampleModalCenter').modal('show');
  }
});
