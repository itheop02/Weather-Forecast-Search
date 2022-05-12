var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})

var address, region, temp, city;
var form = document.getElementById("form");
address = document.getElementById("addr");
region = document.getElementById("reg");
city = document.getElementById("city");

function showAll(event) {

    document.querySelectorAll(".results").forEach(x => x.style.visibility = "hidden");
    document.querySelectorAll(".results").forEach(x => x.style.visibility = "visible");
    document.querySelectorAll(".share").forEach(x => x.style.visibility = "hidden");
    document.querySelectorAll(".share").forEach(x => x.style.visibility = "visible");
}

const apikey = "d0274ee3a0131b9ce26403b74236e583";

function searchButton(event) {

    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        form.classList.remove('needs-validation');
    }
    else {
        event.preventDefault();
        let lat;
        let lon;
        console.log(address.value);
        var xhr = new XMLHttpRequest();
        // Setup our listener to process completed requests
        xhr.onreadystatechange = function () {
            // Only run if the request is complete
            if (xhr.readyState !== 4) return;
            // Process our return data
            if (xhr.status >= 200 && xhr.status < 300) {
                phpPost();
                document.querySelectorAll(".results").forEach(x => x.style.visibility = "hidden");
		
                var rightNow = document.getElementById("home-tab");
                rightNow.classList.add('active');
                var rightNowContent = document.getElementById("now");
                rightNowContent.classList.add('show');
                rightNowContent.classList.add('active');

                var twentyFour_ = document.getElementById("profile-tab");
                twentyFour_.classList.remove('active');

                var twentyFourContent = document.getElementById("next24");
                twentyFourContent.classList.remove('show');
                twentyFourContent.classList.remove('active');

                let oldMap = document.getElementById("map");
                oldMap.innerText = "";
                // What to do when the request is successful
                console.log(JSON.parse(xhr.responseText));
                let res = JSON.parse(xhr.responseText);
                if (isEmpty(res)) {
                    alert("No result for that location.");
                    return;
                }
                lat = res["0"]["lat"];
                lon = res["0"]["lon"];
                console.log(res["0"]["lat"] + " " + res["0"]["lon"]);

                var map = new ol.Map({ // a map object is created
                    target: 'map', // the id of the div in html to contain the map
                    layers: [ // list of layers available in the map
                        new ol.layer.Tile({ // first and only layer is the OpenStreetMap tiled layer
                            source: new ol.source.OSM()
                        })
                    ],
                    view: new ol.View({ // view allows to specify center, resolution, rotation of the map
                        center: ol.proj.fromLonLat([lon, lat]), // center of the map
                        zoom: 5 // zoom level (0 = zoomed out)
                    })
                });

                layer_temp = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=' + apikey,
                    })
                });
                map.addLayer(layer_temp);

                layer_temp = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=' + apikey,
                    })
                });
                map.addLayer(layer_temp);

                openWeatherMap(lat, lon);
                showAll(event);
                weatherForecast(lat, lon);
            } else {
                // What to do when the request has failed
                console.log('error', xhr);
            }
        };
        xhr.open('GET', 'https://nominatim.openstreetmap.org/search?q=' + address.value + ',' + region.value + ',' + city.value + '&format=json');
        xhr.send();
    }

}
function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function openWeatherMap(lat, lon) {
    let descr; //description
    let icon; //icon
    let temp; //temperature
    let pressure; //preassure
    let hum; //humidity
    let temp_min; //minimum temp
    let temp_max; //maximume temp
    let speed; // speed
    let all; // clouds all
    let country; //country
    let sunrise; //sunrise
    let sunset; //sunset
    let name;//name

    var xhr_openWeather = new XMLHttpRequest();
    xhr_openWeather.onreadystatechange = function () {
        // Only run if the request is complete
        if (xhr_openWeather.readyState !== 4) return;
        // Process our return data
        if (xhr_openWeather.status >= 200 && xhr_openWeather.status < 300) {

            // What to do when the request is successful
            console.log(JSON.parse(xhr_openWeather.responseText));
            let result = JSON.parse(xhr_openWeather.responseText);
            console.log(result);
            let CF = celciusFarenheit();
            let metric = CorF(CF);
            let PR = pressFunc(CF);
            let wind = speedFunc(CF);
            //console.log(CF);
            descr = result["weather"]['0']["description"];
            icon = result["weather"]['0']["icon"];
            temp = result["main"]["temp"] + " °" + metric;
            pressure = result["main"]["pressure"] + " " + PR;
            hum = result["main"]["humidity"] + " %";
            temp_min = result["main"]["temp_min"] + " °" + metric + " ";
            temp_max = result["main"]["temp_max"] + " °" + metric;
            speed = result["wind"]["speed"] + " " + wind;
            all = result["clouds"]["all"] + " %";
            country = result["sys"]["country"];
            sunrise = result["sys"]["sunrise"];
            sunset = result["sys"]["sunset"];
            name = result["name"];


            var date_Sunrise = new Date(sunrise * 1000);
            if (date_Sunrise.getHours() <= 9) {
                sunrise = "0" + date_Sunrise.getHours() + ":" + date_Sunrise.getMinutes();
            }
            else {
                sunrise = date_Sunrise.getHours() + ":" + date_Sunrise.getMinutes();
            }

            var date_Sunset = new Date(sunset * 1000);
            if (date_Sunset.getHours() <= 9) {
                sunset = "0" + date_Sunset.getHours() + ":" + date_Sunset.getMinutes();
            }
            else {
                sunset = date_Sunset.getHours() + ":" + date_Sunset.getMinutes();
            }
            console.log("" + descr + " " + icon + " " + temp + " " + pressure + " " + hum + " " + temp_min + " " + temp_max + " " + speed + " " + all + " " + country + " " + sunrise + " " + sunset + " ");
            const array = [descr, name, temp_min, temp_max, temp, icon, pressure, hum, speed, all, country, sunrise, sunset];
            printRightNow(array);
        } else {
            // What to do when the request has failed
            console.log('error', xhr_openWeather);
        }
    };
    let celciusFarenheit_var = celciusFarenheit();
    xhr_openWeather.open('GET', 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=' + celciusFarenheit_var + '&APPID=' + apikey);

    xhr_openWeather.send();
}
function weatherForecast(lat, lon) {
    let hour_24; // all list info
    let dt; // dt
    let temperature; //temperature - temp 
    let press; //preassure 
    let hum_24; //humidity
    let main; // main
    let descri;
    let icon_24; //icon
    let cloud; // clouds all
    let wind_speed; //wind speed
    let name_24;//name 24 hours


    var xhr_forecast = new XMLHttpRequest();
    xhr_forecast.onreadystatechange = function () {
        // Only run if the request is complete
        if (xhr_forecast.readyState !== 4) return;
        // Process our return data
        if (xhr_forecast.status >= 200 && xhr_forecast.status < 300) {

            // What to do when the request is successful
            console.log(JSON.parse(xhr_forecast.responseText));
            let result = JSON.parse(xhr_forecast.responseText);
            console.log(result);
            let CF = celciusFarenheit();
            let metric = CorF(CF);
            let PR = pressFunc(CF);
            let wind = speedFunc(CF);

            for (i = document.getElementById('twentyFour').rows.length - 1; i > 0; i--)
                document.getElementById('twentyFour').deleteRow(i);

            var table = document.getElementById("twentyFour").getElementsByTagName('tbody')[0];

            const arrayModal = [];
            for (let i = 0; i < 9; i++) {
                var row = table.insertRow();
                hour_24 = result['list'][i];
                dt = hour_24['dt'];
                temperature = hour_24['main']['temp'] + " °" + metric;
                press = hour_24['main']['pressure'] + " " + PR;
                hum_24 = hour_24['main']['humidity'] + " %";
                main = hour_24['weather'][0]['main'];
                descri = hour_24['weather'][0]['description'];
                icon_24 = hour_24['weather'][0]['icon'];
                cloud = hour_24['clouds']['all'] + " %";
                wind_speed = hour_24['wind']['speed'] + " " + wind;
                name_24 = result['city']['name'];

                let mainThing_ = " " + main + "(" + descri + ")";

                arrayModal.push(dt);
                arrayModal.push(hum_24);
                arrayModal.push(press);
                arrayModal.push(mainThing_);
                arrayModal.push(icon_24);
                arrayModal.push(wind_speed);
                arrayModal.push(name_24);


                for (j = 0; j < 5; j++) {
                    var cell = row.insertCell(j);
                    cell.classList.add('center');
                    switch (j) {
                        case 0:
                            let textHours, textMinutes, text;
                            textHours = new Date(dt * 1000);
                            textMinutes = new Date(dt * 1000);

                            if (textHours.getHours() <= 9) {
                                textHours = "0" + textHours.getHours();
                            }
                            else {
                                textHours = textHours.getHours();
                            }

                            if (textMinutes.getMinutes() <= 9) {
                                textMinutes = "0" + textMinutes.getMinutes();
                            }
                            else {
                                textMinutes = textMinutes.getMinutes();
                            }
                            text = textHours + ":" + textMinutes;

                            cell.textContent = check(text, dt);
                            break;

                        case 1:
                            let summary = document.createElement('img');
                            summary.src = 'https://openweathermap.org/img/w/' + icon_24 + '.png';
                            summary.classList.add('img_');
                            //cell.textContent=check(summary,icon_24);
                            cell.appendChild(summary);
                            break;

                        case 2:
                            cell.textContent = check(temperature, temperature);
                            break;

                        case 3:
                            cell.textContent = check(cloud, cloud);
                            break;

                        case 4:
                            let view_btn = document.createElement('button');
                            view_btn.type = 'button';
                            view_btn.id = 'kati';
                            view_btn.classList.add('btn');
                            view_btn.classList.add('btn-success');
                            view_btn.setAttribute("data-bs-toggle", 'modal');
                            view_btn.setAttribute("data-bs-target", '#modalmou');
                            view_btn.textContent = "View";

                            cell.appendChild(view_btn);
                            break;
                    }
                }


            }
            console.log(arrayModal);
            var allButtons = document.querySelectorAll("#kati");

            allButtons.forEach(function (view_btn, index) {

                view_btn.addEventListener('click', function () {
                    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                    let date = new Date(arrayModal[(index * 7)] * 1000);

                    let imer = document.querySelector("#imerominia");
                    imer.innerText = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() + ' ' + generateTimeH(date) + ':' + generateTimeM(date);
                    const humidity = document.querySelector("#humidityId");
                    humidity.innerText = arrayModal[(index * 7) + 1];

                    const pressure_ = document.querySelector("#pressId");
                    pressure_.innerText = arrayModal[(index * 7) + 2];

                    const main_ = document.getElementById("mainThing");
                    main_.textContent = arrayModal[(index * 7) + 3];

                    const imagina = document.querySelector("#image").src = 'https://openweathermap.org/img/w/' + arrayModal[(index * 7) + 4] + '.png';

                    const weather = document.querySelector("#windId");
                    weather.innerText = arrayModal[(index * 7) + 5];

                    const naming = document.querySelector("#nameThing");
                    naming.innerText = arrayModal[(index * 7) + 6];

                });
            });

        } else {
            // What to do when the request has failed
            console.log('error', xhr_forecast);
        }
    };
    let celciusFarenheit_var = celciusFarenheit();
    xhr_forecast.open('GET', 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=' + celciusFarenheit_var + '&APPID=' + apikey);

    xhr_forecast.send();
}


function generateTimeH(date) {
    var result;
    if (date.getHours() <= 9) {
        result = "0" + date.getHours();
    }
    else {
        result = date.getHours();
    }
    return result;
}

function generateTimeM(date) {
    var result;
    if (date.getMinutes() <= 9) {
        result = "0" + date.getMinutes();
    }
    else {
        result = date.getMinutes();
    }
    return result;
}
function check(msg, var_) {
    var undef;
    if (var_ === undef) {
        return 'N.A.';
    } else {
        return msg;
    }
}
function printRightNow(array) {
    const detail = document.querySelector("#disrc");
    detail.innerText = array[0] + " in " + array[1];

    const minimum = document.querySelector("#minimum");
    minimum.innerText = array[2];

    const maximum = document.querySelector("#maximum");
    maximum.innerText = array[3];

    const temperature = document.querySelector("#tempr");
    temperature.innerText = array[4];

    const img = document.querySelector("#iconImg");
    img.setAttribute('src', 'https://openweathermap.org/img/w/' + array[5] + '.png');

    const pressure = document.querySelector("#preassure");
    pressure.innerText = array[6];

    const humidity = document.querySelector("#hum");
    humidity.innerText = array[7];

    const speed = document.querySelector("#speed");
    speed.innerText = array[8];

    const all = document.querySelector("#all");
    all.innerText = array[9];

    const sunrise = document.querySelector("#sunrise");
    sunrise.innerText = array[11];

    const sunset = document.querySelector("#sunset");
    sunset.innerText = array[12];
    console.log(array[12]);


}
function remove() {

    document.querySelectorAll(".results").forEach(x => x.style.visibility = "hidden");

}

function CorF(metric) {
    let CorF;
    if (metric === "metric") {
        CorF = 'C';
    }

    else {
        CorF = 'F';
    }

    return CorF;
}

function pressFunc(metric) {
    let pressure;
    if (metric === "metric") {
        pressure = 'hPa';
    }

    else {
        pressure = 'Mb';
    }

    return pressure;
}


function speedFunc(metric) {
    let windSpeed;
    if (metric === "metric") {
        windSpeed = 'meters / sec';
    }
    else {
        windSpeed = 'miles / hour';
    }
    return windSpeed;
}

function celciusFarenheit() {
    let cf = '';
    if (document.querySelector('#celcius').checked === true)
        cf = 'metric';
    else if (document.querySelector('#farenheit').checked === true)
        cf = 'imperial';
    return cf;
}

//bonus
// //  onclone: (cloned) => convertAllImagesToBase64(this._proxyURL, cloned),allowTaint: true ,crossorigin : "anonymous", 
// this._postmessageChannel.send(`get.screenshot:${canvas.toDataURL('image/png')}`);
function downloadimage() {
    //var container = document.getElementById("image-wrap"); //specific element on page
    var container = document.getElementById("takeScreen");; // full page 
    html2canvas(container, {
        proxy: this._proxyURL,
        allowTaint: true,
        foreignObjectRendering: true
    }).then(function (canvas) {

        var link = document.createElement("a");
        document.body.appendChild(link);
        link.download = "image.jpg";
        link.href = canvas.toDataURL();
        link.target = '_blank';
        link.click();

    });
}

//endBonus
function phpGET() {
    // Set up our HTTP request
    var xhr = new XMLHttpRequest();
    // Setup our listener to process completed requests
    xhr.onreadystatechange = function () {
        // Only run if the request is complete
        if (xhr.readyState !== 4) return;
        // Process our return data
        if (xhr.status >= 200 && xhr.status < 300) {
            let result = JSON.parse(xhr.responseText);
            console.log(result);
            //logsTable
            let logsBody = document.getElementById('logsBody');
            logsBody.innerText = "";

            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            for (let i = 0; i < 5; i++) {
                var row = logsBody.insertRow();
                var date = new Date(result[i][2] * 1000);
                var cell = row.insertCell();
                cell.textContent = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() + ' ' + generateTimeH(date) + ':' + generateTimeM(date);
                cell.classList.add('center');
                for (let j = 3; j <= 5; j++) {
                    var cell = row.insertCell();
                    cell.classList.add('center');
                    logi = result[i][j];
                    cell.textContent = logi;
                }
            }

        } else {
            console.log('error', xhr);
        }
    };
    xhr.open('GET', 'weatherPHP.php?userid=itheop02');
    xhr.send();
}

function phpPost() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log(xhr.responseText);
        } else {
            console.log('error', xhr);
        }
    };
    xhr.open('POST', 'weatherPHP.php');
    xhr.setRequestHeader("Content-Type", "application/json");
    const data = {};
    data.username = 'itheop02';
    data.address = address.value;
    data.region = region.value;
    data.city = city.value;
    xhr.send(JSON.stringify(data));
}

const logs_ = document.getElementById('logs');
logs_.addEventListener('click', phpGET);
form.addEventListener("submit", searchButton);


$(document).ready(function () {
    $("ul.navbar-nav > li").click(function (e) {
        $("ul.navbar-nav > li").removeClass("active");
        $(this).addClass("active");
    });
});