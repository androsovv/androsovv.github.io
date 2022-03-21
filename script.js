 import {favoriteTowns, UI, month} from './view.js';

 function hideBoxLeftContent() {                                 // скрытие контента табов now, details, forecast
    UI.TABS_CONTENT.forEach(item => {     
       item.style.display = 'none';
    });
    UI.TABS_BTN.forEach(item => {
       item.classList.remove('active');
    });
 }

 function showBoxLeftContent(i) {                               //ф-ция показа контента табов
    UI.TABS_CONTENT[i].style.display = 'block';
    UI.TABS_BTN[i].classList.add('active');
 }


 hideBoxLeftContent();
 showBoxLeftContent(0);


 UI.TABS_PARENT.addEventListener('click', event => {                     // переключение табов через делегирование
    const target = event.target;

    if (target.classList.contains('box__left__options__item')) {
       UI.TABS_BTN.forEach((item, i) => {
          if (target == item) {
             hideBoxLeftContent();
             showBoxLeftContent(i);
          }
       });
    }

 });

 UI.SEARCH_BTN.addEventListener('click', event => {                      // показ погоды по кнопке поиска
    event.preventDefault();
    UI.FORECAST_PARENT.innerHTML = '';
    forecast(UI.SEARCH_TOWN.value);
    const serverUrl = 'https://api.openweathermap.org/data/2.5/weather',
       cityName = UI.SEARCH_TOWN.value,
       apiKey = 'f660a2fb1e4bad108d6160b7f58c555f',
       url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;

    let weatherResponse = fetch(url);
    getWheather(weatherResponse);
   
 });

 UI.ADD_FAVORITE.addEventListener('click', event => {                    //добавляем любимый город
    event.preventDefault();
    let townName = document.querySelector('.town__name').textContent;

    if (favoriteTowns.length === 0) {
       addFavoriteTown();
    } else {
       if (favoriteTowns.includes(townName)) {
          return;
       } else {
          addFavoriteTown();
       }
    }
 });

 function convertTemperature(temp) {
    return Math.round(temp - 273.15);
 }

 function addFavoriteTown() {
    let townName = document.querySelector('.town__name').textContent;
    const newFavoriteTown = document.createElement('div');
    newFavoriteTown.classList = 'box__right__towns__item';
    newFavoriteTown.innerHTML = `<div class="box__right__towns__item__name">${townName}</div>
   <img src="srs/icons/remove-icon.svg" alt="" class="delete">`;
    UI.TOWNS_PARENT.append(newFavoriteTown);
    favoriteTowns.push(newFavoriteTown.firstChild.textContent);
    deleteFavoriteTown();
    showFavoriteTownInfo();
 }

 function deleteFavoriteTown() {
    const deleteBtn = document.querySelectorAll('.delete');
    deleteBtn.forEach((item, index) => {
       item.addEventListener('click', event => {
          event.preventDefault();
          favoriteTowns.splice(index, 1);
          item.parentElement.remove();
       });
    });
 }

 function showFavoriteTownInfo() {                               //функция показа погоды по уже добавленному любимому городу
    const showInfo = document.querySelectorAll('.box__right__towns__item__name');
    showInfo.forEach(item => {
       item.addEventListener('click', event => {
          event.preventDefault();
          console.log(item.textContent);


          const serverUrl = 'https://api.openweathermap.org/data/2.5/weather',
             cityName = item.textContent,
             apiKey = 'f660a2fb1e4bad108d6160b7f58c555f',
             url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;
          let weatherResponse = fetch(url);
          forecast(item.textContent);
          getWheather(weatherResponse); 

       });
    });
 }

 function forecast(nameValue) {
    UI.FORECAST_PARENT.innerHTML = '';
    const serverUrl = 'https://api.openweathermap.org/data/2.5/forecast',
       cityName = nameValue,
       apiKey = 'f660a2fb1e4bad108d6160b7f58c555f',
       url = `${serverUrl}?q=${cityName}&appid=${apiKey}&cnt=12`;

    let forecastResponse = fetch(url);

    forecastResponse.then(getForecast => getForecast.json())
       .then(forecast => {
          console.log(forecast);
          console.log(forecast.list[3]);
          for (let i = 0; i < forecast.list.length; i++) {
             let div = document.createElement('div'),
                date = new Date(forecast.list[i].dt * 1000);
             div.classList = 'wheather__block';
             div.innerHTML = ` <div class="wheather__block__left">
                           <div class="wheather__block__left__date">
                           ${date.getUTCDate() + " " + month[date.getMonth()]}</div>
                           <div class="wheather__block__left__temperature temperature">Temperature: 
                           ${convertTemperature(forecast.list[i].main.temp)}°</div>
                           <div class="wheather__block__left__feels feels">Feels like: 
                           ${convertTemperature(forecast.list[i].main.feels_like)}°</div>
                        </div>
                        <div class="wheather__block__right">
                           <div class="wheather__block__right__time">
                           ${forecast.list[i].dt_txt.slice(11, 16)}
                           </div>
                           <div class="wheather__block__right__weather">
                           ${forecast.list[i].weather[0].main}
                           </div>
                           <img src="https://openweathermap.org/img/wn/${forecast.list[i].weather[0].icon}.png" class="wheather__block__right__img">
                        </div>`;
             UI.FORECAST_PARENT.append(div);
          }
       });

 }

 function getWheather(response) {
   response.then(getWheather => getWheather.json())
   .then(result => {
      const sunrise = new Date(result.sys.sunrise * 1000),
         sunset = new Date(result.sys.sunset * 1000);
      console.log(result, result.sys.sunrise);
      UI.SEARCH_TOWN.value = '';
      UI.MAIN_ICON.style.background = `url(https://openweathermap.org/img/wn/${result.weather[0].icon}.png) center center/cover no-repeat`;
      UI.MAIN_ICON.style.backgroundSize = '80%';
      UI.TEMPERATURE_NOW.textContent = convertTemperature(result.main.temp) + '°';
      UI.TOWN_NAME.forEach(item => {
         item.textContent = result.name;
      });
      UI.TEMPERATURE_DETAILS.textContent = 'Temperature: ' + convertTemperature(result.main.temp) + '°';
      UI.FEELS_LIKE_DETAILS.textContent = 'Feels like: ' + convertTemperature(result.main.feels_like) + '°';
      UI.WHEATHER_DETAILS.textContent = 'Wheather: ' + (result.weather[0].main);
      UI.SUNRISE_DETAILS.textContent = 'Sunrise: ' + (sunrise.getHours()) + ':' + (sunrise.getMinutes());
      UI.SUNSET_DETAILS.textContent = 'Sunset: ' + (sunset.getHours()) + ':' + (sunset.getMinutes());
   })


   .catch(error => alert(error));
 }