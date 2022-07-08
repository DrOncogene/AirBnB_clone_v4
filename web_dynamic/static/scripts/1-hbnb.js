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
});
