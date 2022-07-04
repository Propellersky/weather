const apiKey = "163b112f5e1715475aa49fab6aaf7b4c";
let bg = document.querySelector(".bg")
let cityName = document.querySelector(".city");
let degrees = document.querySelector(".degrees")
let wind = document.querySelector(".wind")
let humidity = document.querySelector(".humidity")
let pressure = document.querySelector(".pressure")
let icon = document.querySelector(".icon")
let feelsLike = document.querySelector(".feels-like")
let day = document.querySelectorAll(".day")
let weatherIcon = document.querySelectorAll(".weather-icon")
let weatherDescription = document.querySelectorAll(".weather-description")
let tempDay = document.querySelectorAll(".temp-day")
let tempNight = document.querySelectorAll(".temp-night")
let factHour = document.querySelectorAll(".fact-hour")
let sunriseDay = document.querySelector(".sunrise-day")
let sunsetDay = document.querySelector(".sunset-day")
let uvi = document.querySelector(".uvi")
let pressureDay = document.querySelector(".pressure-day")
let forecastOfTheSelectedDayWidget = document.querySelector(".forecast-of-the-selected-day-widget")
let weekDay = document.querySelector(".week-day")
let humidityDay = document.querySelector(".humidity-day")
let dayOfTheWeek = document.querySelectorAll(".day-of-the-week")

let fMounthEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
let daysArrEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let fMounthRu = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
let daysArrRu = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

let one = document.querySelectorAll(".one")


function createWeatherApp() {

  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;

    function dataRequest() {
      fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&lang=ru&appid=${apiKey}`
        )
        .then((response) => {
          return response.json();
        })
        .then((data) => {

          /*-------------------------------current forecast --------------------------------------------*/
          createForecastForCurrentDay(data);

          /*-------------------------------hourly forecast --------------------------------------------*/
          hourlyForecastForCurrentDay(data)

          /*-------------------------------weekly forecast---------------------------------------------*/
          createWeeklyWeatherForecast(data)

        });
    }

    function getWeekDay(date) {
      return daysArrRu[date.getDay()];
    }

    function getMonthDay(date) {
      return fMounthRu[date.getMonth()];
    }


    function createForecastForCurrentDay(data) {
      cityName.innerHTML = data["timezone"].split("/")[1]
      icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data["current"]["weather"][0]["icon"]}@4x.png">`
      degrees.innerHTML = Math.floor(data['current']['temp']) + "&deg" + " " + data["current"]['weather'][0]['description'] + '<br>'
      wind.append(" " + Math.floor(data['current']['wind_speed']) + " м.с")
      degrees.innerHTML += "ощущается как " + Math.floor(data['current']["feels_like"]) + "&deg";
      humidity.append(" " + data['current']['humidity'] + "%")
      pressure.append(" " + Math.floor(data['current']['pressure'] / 1.333) + " мм.рт.ст")
      feelsLike.innerHTML = "ощущается как " + Math.floor(data['current']["feels_like"]) + "&deg"
    }


    function hourlyForecastForCurrentDay(data) {
      for (let k = 0; k < factHour.length; k++) {
        let hours = new Date(data["hourly"][k]['dt'] * 1000)
        factHour[k].innerHTML = hours.getHours() + " :" + " 00" + "<br>" + `<img src="http://openweathermap.org/img/wn/${data["hourly"][k]["weather"][0]["icon"]}@2x.png">` + "<br> " + Math.floor(data["hourly"][k]["temp"]) + "&deg";
      }
    }


    function createWeeklyWeatherForecast(data) {
      for (let i = 0; i < day.length; i++) {

        one[i].style.height += data["daily"][i]["pop"] * 100 + "px" //graphLine test probability of precipitation
        console.log(data["daily"][i]["pop"] * 100)

        let dailyForecast = new Date(data['daily'][i]['dt'] * 1000);
        day[i].innerHTML = getWeekDay(dailyForecast) + "<br>" + dailyForecast.getDate() + " " + getMonthDay(dailyForecast)
        tempDay[i].innerHTML = "день " + Math.floor(data['daily'][i]['temp']['day']) + "&deg"
        tempNight[i].innerHTML = "ночь " + Math.floor(data['daily'][i]['temp']['night']) + "&deg"
        weatherIcon[i].innerHTML = `<img src="http://openweathermap.org/img/wn/${data['daily'][i]["weather"][0]["icon"]}@2x.png">`
        weatherDescription[i].innerHTML = data['daily'][i]['weather'][0]['description']
        dayOfTheWeek[i].onclick = () => {
          triggerAdditionalDataShow(data, i, dailyForecast)
        }
      }
    }

    function triggerAdditionalDataShow(data, i, dailyForecast) {

      let dateWeekSunrise = new Date(data["daily"][i]["sunrise"] * 1000)
      let dateWeekSunset = new Date(data["daily"][i]["sunset"] * 1000)

      let sunriseHour = dateWeekSunrise.getHours()
      let sunriseMinute = dateWeekSunrise.getMinutes()
      let sunsetHour = dateWeekSunset.getHours()
      let sunsetMinute = dateWeekSunset.getMinutes()


      weekDay.innerHTML = day[i].firstChild.textContent + "<br>" + dailyForecast.getDate() + " " + getMonthDay(dailyForecast)

      sunriseDay.innerHTML = sunriseHour + " : " + sunriseMinute

      if (sunriseMinute.toString().length === 1) {
        sunriseDay.innerHTML = sunriseHour + " : " + "0" + sunriseMinute;
      }
      if (sunsetMinute.toString().length === 1) {
        sunsetDay.innerHTML = sunsetHour + " : " + "0" + sunsetMinute;
      } else {
        sunsetDay.innerHTML = sunsetHour + " : " + sunsetMinute;
      }
      pressureDay.innerHTML = "Атмосферное давление " + Math.floor(data["daily"][i]["pressure"] / 1.333) + " мм.рт.ст"
      document.querySelector(".wind-speed").innerHTML = "Скорость ветра " + Math.floor(data["daily"][i]["wind_speed"]) + " м.с"
      humidityDay.innerHTML = "Влажность " + data["daily"][i]["humidity"] + "%"
      forecastOfTheSelectedDayWidget.classList.add("hidden")


      if (data["daily"][i]["uvi"] < 3) {
        uvi.innerHTML = "индекс УФ " + data["daily"][i]["uvi"] + " Низкий"
      } else if (data["daily"][i]["uvi"] >= 3 && data["daily"][i]["uvi"] < 6) {
        uvi.innerHTML = "индекс УФ " + data["daily"][i]["uvi"] + " Умеренный"
      } else if (data["daily"][i]["uvi"] >= 6 && data["daily"][i]["uvi"] < 8) {
        uvi.innerHTML = "индекс УФ " + data["daily"][i]["uvi"] + " Высокий "
      } else if (data["daily"][i]["uvi"] >= 8 && data["daily"][i]["uvi"] < 10) {
        uvi.innerHTML = "индекс УФ " + data["daily"][i]["uvi"] + " Очень высокий "
      } else {
        uvi.innerHTML = "индекс УФ " + data["daily"][i]["uvi"] + " Чрезмерный"
      }

    }

    dataRequest();
  });

  // body.onclick = () => {
  //   setTimeout(() => weatherDetailsOfTheSelectedDay.classList.remove("hidden"), 100);
  // }
}
createWeatherApp();


