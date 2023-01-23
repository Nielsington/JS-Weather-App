const input = document.querySelector('input');
const submit = document.querySelector('button');

submit.addEventListener('click', function(){
    let country = input.value;
    let longtitude;
    fetch('http://api.openweathermap.org/geo/1.0/direct?q='+country+'&limit=1&appid=secret')
    .then(response => response.json())
    .then(data => {
    longtitude = data.lon;
    console.log(longtitude);
    });
})


// fetch("http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=secret")
// .then(response => response.json())
// .then(data => {
//     console.log(data);
// });

