var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var uvURL = "https://api.openweathermap.org/data/2.5/onecall?"
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="
// var city = "";
var lat = "lat=";
var lon = "&lon=";
var key = "&appid=e33b491956ba81d6d31a5624164e5e9b";

//create array of next 5 days in UNIX GMT Standard
var forecastDays = [];
for (var i = 0; i < 5; i++) {
  var tomorrow = luxon.DateTime.local().plus({days: i + 1});
  var tomorrow2 = tomorrow.set({hour: 13, minute: 00, seconds: 00});
  var epoch = Math.floor(tomorrow2.ts / 1000);
  forecastDays.push(epoch);
}

function findWeather(city) {
  console.log(lat);
  $.ajax({
    url: weatherURL + city + key,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    lat += response.coord.lat;
    lon += response.coord.lon;
    $("#temp").text(response.main.temp);
    $("#humidity").text(response.main.humidity + "%");
    $("#wind").text(response.wind.speed + " mph");
  
    console.log(lat);
    $.ajax({
      url: uvURL + lat + lon + key,
      method: "GET"
    }).then(function(responseUV) {
      $("#uv").text(responseUV.current.uvi);
    })
  
    $.ajax({
      url: forecastURL + city + key,
      method: "GET"
    }).then(function(responseForecast) {
      console.log(responseForecast);
      responseForecast.list.forEach(function(item, i) {
        forecastDays.forEach(function(day, j) {
          if (item.dt === day) {
            var dayString = luxon.DateTime.fromSeconds(day);
            $("#day" + (j + 1)).text(dayString.toLocaleString());
            $("#weather" + (j + 1)).text(item.weather[0].main);
            $("#temp" + (j + 1)).text("Temp: " + item.main.temp);
            $("#humidity" + (j + 1)).text("Humidity: " + item.main.humidity + "%");
          }
        })
      })
    
    })
  
  })
}
function test(city) {
  console.log("yes");
}
function addRecent(city) {
  var newEl = $("<tr><td><p class='recent'>" + city  + "</p></td></tr>")
  $("table").append(newEl);
}

$("form").on("submit", function(event) {
  event.preventDefault();
  var city = $("#search").val().trim();
  findWeather(city);
  addRecent(city);
  $("#search").val("");
})

$(".recent").click(function () {
  console.log('test');
});







