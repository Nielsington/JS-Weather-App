const inputCity = document.querySelector('input');
const keyGeo = 'secret';
const keyForecast = 'secret';
const weatherIcon = document.querySelector('img');
const weatherContainer = document.querySelector('.weather-container');
const inputContainer = document.querySelector('.input-container');
const infoContainer = document.querySelector('.info-container');
const gpsWindContainer = document.querySelector ('.gps-wind-container');
const cityParagraph = document.querySelector('h1');
const degreeParagraph = infoContainer.firstElementChild;
const windParagraph = gpsWindContainer.firstElementChild;
const lonlatParagraph = document.querySelector('.lonlat');
const description = document.querySelector('.description');
const forecast = document.querySelector('.forecast-container');
const footer = document.querySelector('footer');
const input = document.querySelector('input');
const date = weatherContainer.lastElementChild.previousElementSibling.previousElementSibling;
let lon, lat;

weatherContainer.style.display = 'none';

inputCity.addEventListener('focus', function(){
        this.value = '';
        this.style.color = 'black';
});

inputCity.addEventListener('blur', function(){
    if(this.value == ''){
        this.style.color = 'rgb(171, 171, 171)';
        this.value = 'Enter your city ツ';
    }
});

inputCity.addEventListener('keyup', function(e){

    if (e.key === 'Enter') {
        forecast.innerHTML = '';
        let city = input.value;
        weatherContainer.style.display = '';
        inputContainer.style.marginTop = '2rem';
        footer.style.position = 'static';

        //Get lon, lat, country and display them
        fetch('http://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=1&appid=' + keyGeo)
        .then(response => response.json())
        .then(data1 => {
            lon = data1[0].lon;
            lat = data1[0].lat;
            
            if(data1[0].state === undefined){
                cityParagraph.innerHTML = data1[0].name + ', ' + data1[0].country + '<br><br>';
            } else{
                cityParagraph.innerHTML = data1[0].name + ', '+ data1[0].state + ', ' + data1[0].country; 
            }

            date.innerHTML = new Date().toLocaleDateString('en-'+ data1[0].country, {
                weekday: "short",
                day: "2-digit",
                month: "long",
                year: "numeric"
            });

            lonlatParagraph.innerHTML = '<b>GPS coordinates:</b><br><br>   ' + lon + ', ' + lat ;

            // Get all the other info and display them
            return fetch('http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=metric&appid=' + keyForecast)
            .then(response => response.json())
            .then(data2 => {
                degreeParagraph.innerHTML = '<b>' + Math.round(data2.list[0].main.temp) + '°C </b>';
                windParagraph.innerHTML = '<b>Wind speed:</b><br><br>  ' + data2.list[0].wind.speed + ' meter/sec';
                description.innerHTML = data2.list[0].weather[0].description + ', captain.';

                //Weather icon
                weatherIcon.src = 'http://openweathermap.org/img/wn/'+ data2.list[0].weather[0].icon + '@2x.png'

                // Create forecast
                // Calculate time (1 day = ((8-1)x3hours), 5 days = (35x3hours))
                let forecastDates = [];
                for (let i = 0; i<36; i++){
                    let dt = data2.list[i].dt;
                    let date = new Date(dt*1000);
                    let hour = date.getUTCHours();
                    let minute = date.getUTCMinutes();
                    

                    if (hour === 0 && minute === 0){
                        forecastDates.push(i);
                    }

                }

                // Add cards for 5 days
                for (let forecastDate of forecastDates){
                    const forecastCard = document.createElement('div');
                    forecastCard.classList.add('forecastCard');
                    forecast.appendChild(forecastCard);

                    const weatherIcon = document.createElement('img');
                    weatherIcon.src = 'http://openweathermap.org/img/wn/'+ data2.list[forecastDate].weather[0].icon + '@2x.png';
                    forecastCard.appendChild(weatherIcon);

                    const cityParagraph = document.createElement('h1');
                    forecastCard.appendChild(cityParagraph);

                    const date = document.createElement('p');
                    forecastCard.appendChild(date);

                    const forecastInfoContainer = document.createElement('div');
                    forecastCard.appendChild(forecastInfoContainer);

                    const degreeParagraph = document.createElement('p');
                    forecastInfoContainer.appendChild(degreeParagraph)

                    const description = document.createElement('p');
                    description.classList.add('description');
                    forecastInfoContainer.appendChild(description);

                    const forecastCoord = document.createElement('div');
                    forecastInfoContainer.appendChild(forecastCoord);

                    const windParagraph = document.createElement('p');
                    forecastCoord.appendChild(windParagraph);

                    const lonlatParagraph = document.createElement('p');
                    forecastCoord.appendChild(lonlatParagraph);
                    
                    //TODO:
                    if(data1[0].state === undefined){
                        cityParagraph.innerHTML = data1[0].name + ', ' + data1[0].country + '<br><br>';
                    } else{
                        cityParagraph.innerHTML = data1[0].name + ', '+ data1[0].state + ', ' + data1[0].country + '<br><br>';
                    }

                    let transformDate = new Date(data2.list[forecastDate].dt*1000);
                    
                    const getDate = transformDate.toLocaleDateString('en-'+ data2.city.country, {
                        weekday: "short",
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    });
                    date.innerHTML = getDate + '<br><br>';

                    degreeParagraph.innerHTML = '<b>' + Math.round(data2.list[forecastDate].main.temp) + '°C </b><br><br>';
                    description.innerHTML = data2.list[forecastDate].weather[0].description + ', captain.<br><br>';
                    windParagraph.innerHTML = '<b>Wind speed:</b><br><br>  ' + data2.list[forecastDate].wind.speed + ' meter/sec<br><br>';
                    lonlatParagraph.innerHTML = '<b>GPS coordinates:</b><br><br>   ' + data2.city.coord.lon + ', ' + data2.city.coord.lat ;
                    lonlatParagraph.style.marginBottom = '2rem';
                }
            });
        });
        let unsplashAPI = "https://api.unsplash.com/search/photos/?client_id=8uQObWzQ5xcpl0fCOyaL6DV1JAEyMNsZi6pYShPrOFw&query=" + city;
        fetch(unsplashAPI)
        .then(response => response.json())
        .then(photo => {
            let picture = photo.results[0].urls.full;
            document.body.style.background = `url(${picture})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundRepeat = 'no-repeat';
        });
    }
});

//Add copyright
let copyright = document.querySelector("footer");
copyright.innerHTML = "&copy; 2023 - "+new Date().getFullYear()+" The Weather App - All Rights Reserved.";
copyright.innerHTML += "<br/>Last Updated : "+document.lastModified;