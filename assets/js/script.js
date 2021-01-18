var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var uvURL = "https://api.openweathermap.org/data/2.5/onecall?"
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="
var iconURL = "http://openweathermap.org/img/wn/";
var lat = "";
var lon = "";
var key = "&appid=e33b491956ba81d6d31a5624164e5e9b";

//create array of next 5 days in UNIX GMT Standard
var forecastDays = [];
for (var i = 0; i < 5; i++) {
  var tomorrow = luxon.DateTime.local().plus({days: i + 1});
  var tomorrow2 = tomorrow.set({hour: 10, minute: 00, seconds: 00});
  var epoch = Math.floor(tomorrow2.ts / 1000);
  forecastDays.push(epoch);
}


function findWeather(city) {

  //display city and current day
  var today = luxon.DateTime.local();
  $(".currentCity").text(city + " (" + today.toLocaleString() + ")");

  //API call for current weather
  $.ajax({
    url: weatherURL + city + key,
    method: "GET"
  }).then(function(response) {
    lat = "lat=" + response.coord.lat;
    lon = "&lon=" + response.coord.lon;
    var icon = response.weather[0].icon;
    $("#currentIcon").attr("src", iconURL + icon + "@2x.png");
    $("#temp").text(fromKelvin(response.main.temp));
    $("#humidity").text(response.main.humidity + "%");
    $("#wind").text(response.wind.speed + " mph");
  
    //API call for UV index
    $.ajax({
      url: uvURL + lat + lon + key,
      method: "GET"
    }).then(function(responseUV) {
      var uv = parseFloat(responseUV.current.uvi);
      var uvEl = $("#uv");
      if (uv < 3) {
        uvEl.css("background-color", "green");
        uvEl.css("color", "white");
      } else if (uv < 6) {
        uvEl.css("background-color", "yellow");
        uvEl.css("color", "black");
      } else {
        uvEl.css("background-color", "red");
        uvEl.css("color", "white");
      }
      uvEl.text(uv);
    })
  
    //API call for 5 day forecast
    $.ajax({
      url: forecastURL + city + key,
      method: "GET"
    }).then(function(responseForecast) {
      responseForecast.list.forEach(function(item, i) {
        forecastDays.forEach(function(day, j) {
          if (item.dt === day) {
            var dayString = luxon.DateTime.fromSeconds(day);
            $("#day" + (j + 1)).text(dayString.toLocaleString());
            $("#weather" + (j + 1)).attr("src", iconURL + item.weather[0].icon + ".png");
            $("#temp" + (j + 1)).text("Temp: " + fromKelvin(item.main.temp));
            $("#humidity" + (j + 1)).text("Humidity: " + item.main.humidity + "%");
          }
        })
      })
    })
  })
}


function store(city) {
localStorage.setItem("Last City", city);
}


function fromKelvin (temp) {
  var x = (temp - 273.15) * (9 / 5) + 32
  var y = x.toFixed() + "\u00B0F";
  return y;
}


function addRecent(city) {
  var newEl = $("<tr><td>" + city  + "</td></tr>")
  $("table").append(newEl);
}


function init() {
  if (localStorage.getItem("Last City")) {
    var city = localStorage.getItem("Last City");
    findWeather(city);
    addRecent(city);
  }
}

//event listeners
$("form").on("submit", function(event) {
  event.preventDefault();
  var city = $("#search").val().trim();
  findWeather(city);
  addRecent(city);
  store(city);
  $("#search").val("");
})

$("table").click(function(event) {
  var city = event.target.textContent;
  findWeather(city);
});

//initialize
init();








