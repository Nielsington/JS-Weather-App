//TODO: Remove 5day forecast on new search
//TODO: Add dates to 5 day forecast



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


const input = document.querySelector('input');

inputCity.addEventListener('keyup', function(e){

    if (e.key === 'Enter') {
        let city = input.value;
        let lon, lat;

        weatherContainer.style.display = '';
        inputContainer.style.marginTop = '2rem';
        footer.style.transform = "translateY(120%)";
        

        //Get lon, lat, country and display them
        fetch('http://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=1&appid=' + keyGeo)
        .then(response => response.json())
        .then(data => {
            lon = data[0].lon;
            lat = data[0].lat;
        
            cityParagraph.innerHTML = data[0].name + ', '+ data[0].state + ', ' + data[0].country;  
            lonlatParagraph.innerHTML = '<b>GPS coordinates:</b><br><br>   ' + lon + ', ' + lat ;

            // Get all the other info and display them
            fetch('http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=metric&appid=' + keyForecast)
            .then(response => response.json())
            .then(data => {
                degreeParagraph.innerHTML = '<b>' + Math.round(data.list[0].main.temp) + '°C </b>';
                windParagraph.innerHTML = '<b>Wind speed:</b><br><br>  ' + data.list[0].wind.speed + ' meter/sec';
                description.innerHTML = data.list[0].weather[0].description + ', captain.';

                //Weather icon
                weatherIcon.src = 'http://openweathermap.org/img/wn/'+ data.list[0].weather[0].icon + '@2x.png'
                console.log(data);

                // Create forecast
                // Calculate time (1 day = (7x3hours), 5 days = (35x3hours))
                let forecastDates = [];
                for (let i = 0; i<36; i++){
                    let dt = data.list[i].dt;
                    let date = new Date(dt*1000);
                    let hour = date.getUTCHours();
                    let minute = date.getUTCMinutes();
                    

                    if (hour === 0 && minute === 0){
                        forecastDates.push(i);
                    }

                }
                console.log(forecastDates);

                // Add cards for 5 days
                for (let forecastDate of forecastDates){
                    const forecastCard = document.createElement('div');
                    forecastCard.classList.add('forecastCard');
                    forecast.appendChild(forecastCard);

                    const weatherIcon = document.createElement('img');
                    weatherIcon.src = 'http://openweathermap.org/img/wn/'+ data.list[forecastDate].weather[0].icon + '@2x.png';
                    forecastCard.appendChild(weatherIcon);

                    const cityParagraph = document.createElement('h1');
                    forecastCard.appendChild(cityParagraph);

                    const forecastInfoContainer = document.createElement('div');
                    forecastCard.appendChild(forecastInfoContainer);

                    const degreeParagraph = document.createElement('p');
                    forecastInfoContainer.appendChild(degreeParagraph)

                    const description = document.createElement('p');
                    forecastInfoContainer.appendChild(description);

                    const forecastCoord = document.createElement('div');
                    forecastInfoContainer.appendChild(forecastCoord);

                    const windParagraph = document.createElement('p');
                    forecastCoord.appendChild(windParagraph);

                    const lonlatParagraph = document.createElement('p');
                    forecastCoord.appendChild(lonlatParagraph);
                    
                    cityParagraph.innerHTML = data.city.name + ', ' + data.city.country + '<br><br>';
                    degreeParagraph.innerHTML = '<b>' + Math.round(data.list[forecastDate].main.temp) + '°C </b><br><br>';
                    description.innerHTML = data.list[forecastDate].weather[0].description + ', captain.<br><br>';
                    windParagraph.innerHTML = '<b>Wind speed:</b><br><br>  ' + data.list[forecastDate].wind.speed + ' meter/sec<br><br>';
                    lonlatParagraph.innerHTML = '<b>GPS coordinates:</b><br><br>   ' + data.city.coord.lon + ', ' + data.city.coord.lat ;
                    lonlatParagraph.style.marginBottom = '2rem';
                }
            });
        });
    }
});

//Add copyright

let copyright = document.querySelector("footer");

copyright.innerHTML = "&copy; 2023 - "+new Date().getFullYear()+" The Weather App - All Rights Reserved.";
copyright.innerHTML += "<br/>Last Updated : "+document.lastModified;