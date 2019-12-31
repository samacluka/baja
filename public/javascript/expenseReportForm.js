var num_rows = 1;

$(document).ready(function(){
  // Plus icon
  $(".fa-plus").click(function(){
    $('tr:last-of-type').clone().appendTo("#expenseReportFormTable"); // Duplicate last row

    if($("select[name*=category]").last().find(':selected').val() != ""){            // If anything but -- Same as Above -- is selected
      $("select[name*=category]").last().find(':selected').removeAttr('selected');  // Deselect current selection
    }

    if($("select[name*=subteam]").last().find(':selected').val() != ""){             // If anything but -- Same as Above -- is selected
      $("select[name*=subteam]").last().find(':selected').removeAttr('selected');   // Deselect current selection
    }

    if(num_rows == 1){
      $("input[name*=itemName]").last().val('');
      $("select[name*=category]").last().append('<option value="" selected>-- Same as above --</option>'); // Add same as above option
      $("select[name*=subteam]").last().append('<option value="" selected>-- Same as above --</option>'); // Add same as above option
      $("input[name*=itemPrice]").last().val('');
      $("input[name*=quantity]").last().val('');

      $('tr:last-of-type').append('<td><div class="trashIcon"><i class="fa fa-trash"></i></div></td>'); // Append trash icon to new rows
    }

    // Apply functionality to newly created elements
    // Had to use inline callback function --> would not work otherwise
    $("input[name*=itemPrice],input[name*=quantity]").on("input", function(){
      var tax = 0;
      var shipping = 0;
      var subtotal = 0;
      var total = 0;

      var price = 0; // tmp price
      var quant = 0; // tmp quantity

      tax = $("#tax").val() * 1.0; // Multiply by 1 to put into float format
      shipping = $("#shipping").val() * 1.0;

      $("input[name*=itemPrice]").each(function(itemIndex){
        price = ($(this).val() * 1.0);
        $("input[name*=quantity]").each(function(quantIndex){
          quant = ($(this).val() * 1.0);
          if(itemIndex == quantIndex){
            subtotal += price * quant;
          }
        });
      });

      total = subtotal + tax + shipping;

      $("#subtotal").val(subtotal);
      $("#total").val(total);
    });

    // Give trash icon functionality
    $(".fa-trash").click(function(event){
        $(this).closest("tr").remove();
        num_rows = $('#expenseReportFormTable tr').length - 1 ; // Subtract 1 because of header row
        event.stopPropagation(); // Avoid bubbling
    });

    num_rows = $('#expenseReportFormTable tr').length - 1; // Subtract 1 because of header row
  });

  // Apply functionality to stock elements
  // Had to use inline callback function --> would not work otherwise
  $("input[name!='subtotal'][name!='total']").on("input", function(){
    var tax = 0;
    var shipping = 0;
    var subtotal = 0;
    var total = 0;

    var price = 0; // tmp price
    var quant = 0; // tmp quantity

    tax = $("#tax").val() * 1.0; // Multiply by 1 to put into float format
    shipping = $("#shipping").val() * 1.0;

    $("input[name*=itemPrice]").each(function(itemIndex){
      price = ($(this).val() * 1.0);
      $("input[name*=quantity]").each(function(quantIndex){
        quant = ($(this).val() * 1.0);
        if(itemIndex == quantIndex){
          subtotal += price * quant;
        }
      });
    });

    total = subtotal + tax + shipping;

    $("#subtotal").val(subtotal);
    $("#total").val(total);
  });

});
