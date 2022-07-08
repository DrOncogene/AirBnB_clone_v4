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

  renderPlaces({});

  $('.filters button').click(function () {
    const postData = {
      states: stateIds,
      cities: cityIds,
      amenities: amenityIds
    };

    renderPlaces(postData);
  });
});

function renderPlaces(data) {
  $.ajax({
    url: "http://127.0.0.1:5001/api/v1/places_search/",
    type: "post",
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    },
    success: function (data) {
      const places = data;
      console.log(places)
      const placeSection = $(".places > div");
      if (places.length < 1) {
        placeSection.html('<h1 class="no_match">No match found</h1>');
        return;
      }
      placeSection.empty();
      for (const place of places) {
        const article = $("<article></article>");

        const header = $('<div class="place_header"></div>');
        const name = $("<h2></h2>").text(place.name);
        const price = $('<div class="price_by_night"></div>').text("$" + place.price_by_night);
        header.append(name, price);

        const info = $('<div class="information"></div>');
        const max_guest = $('<div class="max_guest"><i class="icon guest"></i></div>');
        max_guest.append(`${place.max_guest} Guest${place.max_guest > 1 ? "s" : ""}`);
        const rooms = $('<div class="number_rooms"><i class="icon bed"></i></div>');
        rooms.append(`${place.number_rooms} Bedroom${place.number_rooms > 1 ? "s" : ""}`);
        const baths = $('<div class="number_bathrooms"><i class="icon bath"></i></div>');
        baths.append(`${place.number_bathrooms} Bathroom${place.number_bathrooms > 1 ? "s" : ""}`);
        info.append(max_guest, rooms, baths);

        const desc = $('<div class="description"></div>');
        desc.html(place.description);

        const reviews = $('<div class="reviews"></div>');
        const reviewsH2 = $('<h2>Reviews</h2>');
        const reviewsBtn = $('<span class="reviews_btn">show</span>');
        const reviewList = $('<ul></ul>');
        reviewsH2.append(reviewsBtn);
        reviewsBtn.click(function () {
          if (reviewsBtn.text() === 'show') {
            reviewsBtn.text('hide');
            $.get(`http://127.0.0.1:5001/api/v1/places/${place.id}/reviews`, (data, status) => {
              if (status === 'success' && data.length) {
                for (const review of data) {
                  const reviewLi = $('<li></li>');
                  let reviewHead;
                  $.get(`http://127.0.0.1:5001/api/v1/users/${review.user_id}`, (data, status) => {
                    if (!(status === 'success' && data)) return;
                    reviewHead = $('<h3></h3>');
                    const date = new Date(Date.parse(data.created_at));
                    const dateString = `${date.getDate()}${datePrefix(date.getDate())} \
                                        ${date.toLocaleDateString('default', {month: 'long'})} ${date.getFullYear()}`;
                    reviewHead.text(`From ${data.first_name} ${data.last_name} the ${dateString}`);
                    reviewLi.append(reviewHead, $('<p></p>').html(review.text));
                });
                  reviewList.append(reviewLi);
                }
              }
            });
          } else {
            reviewsBtn.text('show');
            reviewList.empty();
          }
        });

        reviews.append(reviewsH2, reviewList);
        article.append(header, info, desc, reviews);
        placeSection.append(article);
      }
    }
  });
}

function datePrefix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}
