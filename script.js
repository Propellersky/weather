const apiKey = "163b112f5e1715475aa49fab6aaf7b4c";
let widgetTime = document.querySelector(".widgetTime")
let container = document.querySelector(".container")
let cityName = document.querySelector(".city");
// let icon = document.querySelector(".icon");
let degrres = document.querySelector(".degrres")
let wind = document.querySelector(".wind")
let humidity = document.querySelector(".humidity")
let pressure = document.querySelector(".pressure")
let air_quality = document.querySelector(".air_quality")
let icon = document.querySelector(".icon")
let feelsLike = document.querySelector(".feels_like")
let day = document.querySelectorAll(".day")
let dayIcon = document.querySelectorAll(".dayIcon")
let descriptionDays = document.querySelectorAll(".descriptionDays")
let temp = document.querySelectorAll(".temp")
let tempNight = document.querySelectorAll(".tempNight")
let hourInner = document.querySelectorAll(".time")
let sunriseDay = document.querySelector(".sunriseDay")
let sunsetDay = document.querySelector(".sunsetDay")
let uvi = document.querySelector(".uvi")
let pressureDay = document.querySelector(".pressureDay")
let two = document.querySelector(".two")
let weekDay = document.querySelector(".weekDay")
let humidityDay = document.querySelector(".humidityDay")
let days = document.querySelectorAll(".days")
let bg = document.querySelector(".bg")
let daysArr = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
let fMounth = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]

// Todo variable names never in russian, only latin

let img = {
  "ясно": "url('https://images.pexels.com/photos/759606/pexels-photo-759606.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
  "пасмурно": "url('https://rostof.ru/sites/default/files/styles/main_1200x610/public/field/image/article/sky-2399449_1920.jpg?itok=cXI4WnYs')",
  "небольшой дождь": "url('https://images.wallpaperscraft.ru/image/single/steklo_kapli_mokryj_203733_1920x1080.jpg')",
  "туман": "url('https://99px.ru/sstorage/56/2013/06/image_562306130318146034241.jpg')",
  "небольшая облачность": "url('https://torange.biz/photo/24/IMAGE/sky-small-clouds-partly-cloudy-24213.jpg')",
  "дождь": "url('https://gold-maste.ucoz.com/_ph/35/206318098.jpg?1616505421')",
  "облачно с прояснениями": "url('https://i.err.ee/resize?type=optimize&height=1080&url=https%3A%2F%2Fs.err.ee%2Fphoto%2Fcrop%2F2020%2F02%2F23%2F751271h7deb.jpg')",
  "переменная облачность": "url('http://fullhdwallpapers.ru/image/nature/15243/sirenevye-oblaka.jpg')"
}

// change names of the functions
function f1() {

  console.log(img["ясно"]);

  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;


    function myFunc() {
      fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&lang=ru&appid=${apiKey}`
        )
        .then((response) => {
          return response.json();
        })
        .then((data) => {

          /*-------------------------------------------------*/
          // rename arr variable so it explains what it contains
          let arr = []
          data['daily'].forEach(element => {
            arr.push(element)
          });

          /*--------------месяц дней недельного прогноза-------------------------------------*/

          let date = new Date();
          let dateMounth = date.getMonth();
          /*-------------------------------------------------------------*/
          // Todo create separate functions to build the app's segments
          /*-----------------------------погода текушего дня----------------------------------------------------------------- */

          createWeatherForCurrentDay(data);
          /*---------------------------------------------------------------------------------------------- */

          for (let i = 0; i < day.length; i++) {
            let date = new Date(arr[i]['dt'] * 1000);

            /*-------------------------------почасовой прогноз--------------------------------------------*/
            let hours = []

            data["hourly"].forEach(elem => {
              let h = new Date(elem['dt'] * 1000);
              hours.push(h.getHours())
            })

            for (let k = 0; k < hourInner.length; k++) {
              hourInner[k].innerHTML = hours[k] + " :" + " 00" + "<br>" + `<img src="http://openweathermap.org/img/wn/${data["hourly"][k]["weather"][0]["icon"]}@2x.png">` + "<br> " + Math.floor(data["hourly"][k]["temp"]) + "&deg";
            }
            // console.log(data['hourly'])

            /*----------------------------------прогноз недели-----------------------------------------------------*/

            weeklyWeatherForecast(date, dateMounth, arr, i);
            // console.log(date)


            /*--------------------------------подробности погоды выбраного дня------------------------------------------------------- */



            days[i].addEventListener("touchstart", f2)

            // todo delete unnecessary code
            function f2() {

            }

            days[i].onclick = () => {
              triggerAdditionalDataShow(data, date, dateMounth, day, i);
            }

            bg.onclick = () => {
              setTimeout(() => two.classList.remove("hidden"), 100);
            }
          }

          /*--------------------------------стили background img...----------------------------------------------------------  */

          for (let key in img) {
            if (data["current"]['weather'][0]['description'] == key) {
              bg.style.backgroundImage = img[key]
            }
          } ///стили background img....

          /*-------------------------------------------------------------------------------------------------*/



        });
    }

    function getWeekDay(date) {
      return daysArr[date.getDay()];
    }

    function createWeatherForCurrentDay(data){
      cityName.innerHTML = data["timezone"].split("/")[1]
      degrres.innerHTML = Math.floor(data['current']['temp']) + "&deg" + " " + data["current"]['weather'][0]['description'] + '<br>' //вывод города по latitude and longtime timezone + температура
      degrres.innerHTML += "ощущается как " + Math.floor(data['current']["feels_like"]) + "&deg";
      wind.append(" " + Math.floor(data['current']['wind_speed']) + " м.с") //скорость ветра
      humidity.append(" " + data['current']['humidity'] + "%") //влажность
      pressure.append(" " + Math.floor(data['current']['pressure'] / 1.333) + " мм.рт.ст")
      feelsLike.innerHTML = "ощущается как " + Math.floor(data['current']["feels_like"]) + "&deg"

      icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data["current"]["weather"][0]["icon"]}@4x.png">`
    };

    function weeklyWeatherForecast(date, dateMounth, arr, i) {
      day[i].innerHTML = getWeekDay(date) + "<br>" + date.getDate() + " " + fMounth[dateMounth] ///получили дни недели с API    
      temp[i].innerHTML = "день " + Math.floor(arr[i]['temp']['day']) + "&deg"
      tempNight[i].innerHTML = "ночь " + Math.floor(arr[i]['temp']['night']) + "&deg"
      dayIcon[i].innerHTML = `<img src="http://openweathermap.org/img/wn/${arr[i]["weather"][0]["icon"]}@2x.png">`
      descriptionDays[i].innerHTML = arr[i]['weather'][0]['description']
    }

    function triggerAdditionalDataShow(data, date, dateMounth, day, i) {
      console.log(data);
      console.log(i);

        let dateWeekSunrise = new Date(data["daily"][i]["sunrise"] * 1000)
        let dateWeekSunset = new Date(data["daily"][i]["sunset"] * 1000)
        let sunriseHour = dateWeekSunrise.getHours()
        let sunriseMinute = dateWeekSunrise.getMinutes()
        let sunsetHour = dateWeekSunset.getHours()
        let sunsetMinute = dateWeekSunset.getMinutes()
        sunriseDay.innerHTML = sunriseHour + " : " + sunriseMinute

        sunsetDay.innerHTML = sunsetHour + " : " + sunsetMinute
        // console.log(data["daily"][i]["sunrise"])
        pressureDay.innerHTML = "Атмосферное давление " + Math.floor(data["daily"][i]["pressure"] / 1.333) + " мм.рт.ст"
        document.querySelector(".wind_speed").innerHTML = "Скорость ветра " + Math.floor(data["daily"][i]["wind_speed"]) + " м.с"
        weekDay.innerHTML = day[i].firstChild.textContent + "<br>" + date.getDate() + " " + fMounth[dateMounth]
        humidityDay.innerHTML = "Влажность " + data["daily"][i]["humidity"] + "%"
        two.classList.add("hidden")


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
      
    };

    myFunc();
  });
}
f1();