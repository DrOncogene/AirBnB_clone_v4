$(function () {
  const inputs = $(".amenities li input");
  if (inputs.length) {
    inputs.on("change", function () {
      let selectedAmenities = [];
      let amenityIds = [];
      for (const selected of $(".amenities input:checked")) {
        selectedAmenities.push(selected.dataset.name);
        amenityIds.push(selected.dataset.id);
      }
      $(".amenities h4").html(selectedAmenities.join(', '));
    });
    }

    $.get("http://127.0.0.1:5001/api/v1/status/", function (data, status) {
      if (data.status === "OK") {
      console.log(data.status, status);
      $("#api_status").addClass("available");
      } else {
        $("#api_status").removeClass("available");
      }
    });
});
