$(function () {
  let stateIds = [];
  let cityIds = [];
  let amenityIds = [];
  let locations = {
    states: [],
    cities: []
  };

  const amenityInputs = $(".amenities li input");
  if (amenityInputs.length) {
    amenityInputs.on("change", function () {
      let selectedAmenities = [];
      amenityIds = [];
      for (const selected of $(".amenities input:checked")) {
        selectedAmenities.push(selected.dataset.name);
        amenityIds.push(selected.dataset.id);
      }
      $(".amenities h4").text(selectedAmenities.join(', '));
    });
  }
  const stateInputs = $(".state_inputs");
  if (stateInputs.length) {
    stateInputs.on('change', function () {
      let states = [];
      stateIds = [];
      for (const state of $(".state_inputs:checked")) {
        states.push(state.dataset.name);
        stateIds.push(state.dataset.id);
      }
      locations.states = states;
      const all_loc = Array.prototype.concat(locations.states, locations.cities);
      const locString = `${all_loc.join(', ')}`;
      $('.locations h4').text(locString);
    });
  }
  const cityInputs = $(".city_inputs");
  if (cityInputs.length) {
    cityInputs.on('change', function () {
      let cities = [];
      cityIds = [];
      for (const city of $(".city_inputs:checked")) {
        cities.push(city.dataset.name);
        cityIds.push(city.dataset.id);
      }
      locations.cities = cities;
      const all_loc = Array.prototype.concat(locations.states, locations.cities);
      const locString = `${all_loc.join(', ')}`;
      $('.locations h4').text(locString);
    });
  }

  $.get("http://127.0.0.1:5001/api/v1/status/", function (data, status) {
    if (status ==="success" && data.status === "OK") {
    $("#api_status").addClass("available");
    } else {
      $("#api_status").removeClass("available");
    }
  });

  $.ajax({
    url: "http://127.0.0.1:5001/api/v1/places_search/",
    type: "post",
    data: "{}",
    headers: {
      "Content-Type": "application/json"
    },
    success: function (data) {
      const places = data;
      const placeSection = $(".places");
      for (const place of places) {
        console.log(place)
        const article = $("<article></article>");
        const title = $('<div class="title_box"></div>');
        const titleH2 = $("<h2></h2>").text(place.name);
        const price = $('<div class="price_by_night"></div>').text("$" + place.price_by_night);
        title.append(titleH2, price);

        const info = $('<div class="information"></div>');
        const max_guest = $('<div class="max_guest"></div>');
        max_guest.text(`${place.max_guest} Guest${place.max_guest > 1 ? "s" : ""}`);
        const rooms = $('<div class="number_rooms"></div>');
        rooms.text(`${place.number_rooms} Bedroom${place.number_rooms > 1 ? "s" : ""}`);
        const baths = $('<div class="number_bathrooms"></div>');
        baths.text(`${place.number_bathrooms} Bathroom${place.number_bathrooms > 1 ? "s" : ""}`);
        info.append(max_guest, rooms, baths);

        const desc = $('<div class="description"></div>')
        desc.html(place.description)

        article.append(title, info, desc);
        placeSection.append(article);
      }
    }
  });

  $('.filters button').click(function () {
    $.ajax({
      url: "http://127.0.0.1:5001/api/v1/places_search/",
      type: "post",
      data: JSON.stringify({
        "states": stateIds,
        "cities": cityIds,
        "amenities": amenityIds
      }),
      headers: {
        "Content-Type": "application/json"
      },
      success: function (data) {
        const places = data;
        const placeSection = $(".places");
        if (Object.keys(places).length < 1) {
          placeSection.html('<h1 class="no_match">No match found</h1>');
          return;
        }
        placeSection.empty();
        for (const place of places) {
          const article = $("<article></article>");
          const title = $('<div class="title_box"></div>');
          const titleH2 = $("<h2></h2>").text(place.name);
          const price = $('<div class="price_by_night"></div>').text("$" + place.price_by_night);
          title.append(titleH2, price);

          const info = $('<div class="information"></div>');
          const max_guest = $('<div class="max_guest"></div>');
          max_guest.text(`${place.max_guest} Guest${place.max_guest > 1 ? "s" : ""}`);
          const rooms = $('<div class="number_rooms"></div>');
          rooms.text(`${place.number_rooms} Bedroom${place.number_rooms > 1 ? "s" : ""}`);
          const baths = $('<div class="number_bathrooms"></div>');
          baths.text(`${place.number_bathrooms} Bathroom${place.number_bathrooms > 1 ? "s" : ""}`);
          info.append(max_guest, rooms, baths);

          const desc = $('<div class="description"></div>')
          desc.html(place.description)

          article.append(title, info, desc);
          placeSection.append(article);
        }
      }
    });
  });
});
