var newRow = `
<tr>
  <td>
    <div class="form-group item-name-input m-1"><input class="form-control" type="text" name="itemName[]" placeholder="Item Name"></div>
  </td>
  <td>
    <div class="form-group category-select m-1">
      <select class="form-control" name="category[]" placeholder="Cateogry">
        <option value="" selected>-- Same as above --</option>
        <option value="Material">Material</option><option value="Hardware">Hardware</option>
        <option value="Component">Component</option><option value="Machining">Machining</option>
        <option value="Tooling">Tooling</option><option value="Carbon">Carbon</option>
        <option value="Sponsorship">Sponsorship</option>
        <option value="Transportation">Transportation</option>
        <option value="Competition Registration">Competition Registration</option>
        <option value="Shop Supplies">Shop Supplies</option>
        <option value="Service">Service</option>
        <option value="Team Bonding">Team Bonding</option>
        <option value="Fuel for Baja">Fuel for Baja</option>
        <option value="Fuel for Transportation">Fuel for Transportation</option>
        <option value="Driver Equipment">Driver Equipment</option>
        <option value="Safety Equipment">Safety Equipment</option>
        <option value="Other">Other</option>
        <option value="Outreach and Sponsorship">Outreach and Sponsorship</option>
        <option value="Software">Software</option>
        <option value="Research Project">Research Projects</option>
        <option value="Apparel">Apparel</option>
      </select>
    </div>
  </td>
  <td>
    <div class="form-group subteam-select m-1">
      <select class="form-control" name="subteam[]" placeholder="Subteam">
        <option value="" selected>-- Same as above --</option>
        <option value="Business/Sales">Business/Sales</option>
        <option value="Chassis">Chassis</option>
        <option value="Controls">Controls</option>
        <option value="DAQ">DAQ</option>
        <option value="Drivetrain">Drivetrain</option>
        <option value="Ergonomics">Ergonomics</option>
        <option value="General Team Items - NOT MATERIAL">General Team Items - NOT MATERIAL</option>
        <option value="Suspension">Suspension</option>
        <option value="2016">2016</option>
        <option value="2017">2017</option>
        <option value="2018">2018</option>
      </select>
    </div>
  </td>
  <td>
    <div class="form-group item-price-input m-1">
      <input class="form-control" type="number" name="itemPrice[]" placeholder="Item Price">
    </div>
  </td>
  <td>
    <div class="form-group item-quantity-input m-1">
      <input class="form-control" type="number" step="1" name="quantity[]" placeholder="Quantity" value="1">
    </div>
  </td>
  <td>
    <div class="trashIcon">
      <i class="fa fa-trash"></i>
    </div>
  </td>
</tr>
`

newRow.replace(/[\t]|[\n]|[\r]|[\f]|[\v]/g, "");


$(document).ready(function(){
  // Plus icon
  $(".fa-plus").click(function(){
    $("#expenseReportFormTable").append(newRow);

    // Apply functionality to newly created elements
    // Had to use inline callback function --> would not work otherwise
    $("input[name='itemPrice[]']").on("input", function(){
      var tax = 0;
      var shipping = 0;
      var subtotal = 0;
      var total = 0;

      var price = 0; // tmp price
      var quant = 0; // tmp quantity

      tax = $("#tax").val() * 1.0; // Multiply by 1 to put into float format
      shipping = $("#shipping").val() * 1.0;

      $("input[name='itemPrice[]']").each(function(itemIndex){
        price = ($(this).val() * 1.0);
        $("input[name='quantity[]']").each(function(quantIndex){
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

    $(".fa-trash").click(function(event){
        $(this).closest("tr").remove();
        event.stopPropagation(); // Avoid bubbling
    });
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

    $("input[name='itemPrice[]']").each(function(itemIndex){
      price = ($(this).val() * 1.0);
      $("input[name='quantity[]']").each(function(quantIndex){
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
