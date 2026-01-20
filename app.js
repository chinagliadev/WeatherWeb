const KEY = "efefc9a32020a169b360e01a3002905e";

const divWeatherInfo = document.querySelector('.weather-info')
const weatherWelcome = document.querySelector('#weather-welcome')
const notFound = document.querySelector('#not-found')


async function getWeatherData(city) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},BR&units=metric&lang=pt_br&appid=${KEY}`;
    const response = await fetch(weatherUrl);
    const dados = await response.json();
    return dados;
}

const regex = /^[^\d]+$/;

function validateCity(valor) {
    return regex.test(valor);
}

function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function setWeatherIcon(iconCode, element) {
    element.className = 'bi';
    const isNight = iconCode.endsWith('n');

    if (iconCode.startsWith('01')) element.classList.add(isNight ? 'bi-moon' : 'bi-sun');
    else if (iconCode.startsWith('02')) element.classList.add(isNight ? 'bi-cloud-moon' : 'bi-cloud-sun');
    else if (iconCode.startsWith('03') || iconCode.startsWith('04')) element.classList.add('bi-cloud');
    else if (iconCode.startsWith('09')) element.classList.add('bi-cloud-drizzle');
    else if (iconCode.startsWith('10')) element.classList.add('bi-cloud-rain');
    else if (iconCode.startsWith('11')) element.classList.add('bi-cloud-lightning');
    else if (iconCode.startsWith('13')) element.classList.add('bi-snow');
    else if (iconCode.startsWith('50')) element.classList.add('bi-cloud-fog');
}

const btnSearch = document.querySelector('#btnSearch')
const inputSearch = document.querySelector('#inputSearch')
const messageErro = document.querySelector('#message-error')

const tempWeather = document.querySelector('#temp-weather')
const weatherDesc = document.querySelector('#weather-desc')
const cityWeather = document.querySelector('#city-weather')
const dateWeather = document.querySelector('#dataOfWeather')

const tempMaxEl = document.querySelector('#temp-max');
const tempMinEl = document.querySelector('#temp-min');
const humidityEl = document.querySelector('#humidity');
const cloudsEl = document.querySelector('#clouds');
const iconEl = document.querySelector('#weather-icon');

const windEl = document.querySelector('#wind-weather');

const sectionEl = document.querySelector('#section-weather');



function updateDateWeather() {
    const date = new Date()
    const hour = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    const dayOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'][date.getDay()]
    const day = date.getDate()
    const month = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][date.getMonth()]
    const year = date.getFullYear()

    dateWeather.innerText = `${dayOfWeek}, ${day} de ${month} de ${year} - ${hour}:${minutes}`
}

updateDateWeather()
setInterval(updateDateWeather, 60000)

btnSearch.addEventListener('click', async (event) => {
    event.preventDefault();

    const valueInput = inputSearch.value.trim();
    if (valueInput === '' || !validateCity(valueInput)) {
        messageErro.classList.remove('d-none');
        sectionEl.classList.add('d-none')
        divWeatherInfo.classList.add('d-none')
        weatherWelcome.classList.remove('d-none')
        return;
    }

    messageErro.classList.add('d-none');
    sectionEl.classList.remove('d-none')
    divWeatherInfo.classList.remove('d-none')
    weatherWelcome.classList.add('d-none')

    const dados = await getWeatherData(valueInput);

    if (Number(dados.cod) === 404) {
        notFound.classList.remove('d-none')
        sectionEl.classList.add('d-none')
        divWeatherInfo.classList.add('d-none')

        inputSearch.value = ''
    } else {

        notFound.classList.add('d-none')
        divWeatherInfo.classList.remove('d-none')
        sectionEl.classList.remove('d-none')

        const temperature = dados.main.temp;
        const tempMaxWeather = dados.main.temp_max;
        const tempMinWeather = dados.main.temp_min;
        const windSpeed = (dados.wind.speed * 3.6).toFixed(1);
        const humidity = dados.main.humidity;
        const clouds = dados.clouds.all;
        const descriptionWeather = dados.weather[0].description;
        const iconCode = dados.weather[0].icon;
        const lon = dados.coord.lon;
        const lat = dados.coord.lat;
        const name = dados.name;

        cityWeather.innerHTML = name;
        tempWeather.innerText = `${temperature.toFixed(0)}°C`;
        tempMinEl.innerText = `${tempMinWeather.toFixed(1)}°C`;
        tempMaxEl.innerText = `${tempMaxWeather.toFixed(1)}°C`;
        windEl.innerText = `${windSpeed} km/h`;
        humidityEl.innerText = `${humidity}%`;
        cloudsEl.innerText = `${clouds}%`;
        weatherDesc.innerText = capitalizeFirstLetter(descriptionWeather);
        setWeatherIcon(iconCode, iconEl);

        changeBackground(capitalizeFirstLetter(descriptionWeather))

        inputSearch.value = '';

        const nearbyResponse = await fetch(`https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=10&units=metric&lang=pt_br&appid=${KEY}`);
        const nearbyData = await nearbyResponse.json();

        const nearbyCities = nearbyData.list
            .filter(c => c.name !== name)
            .slice(0, 4);


        const nearbyContainer = document.querySelector('#nearby-cities-row');
        nearbyContainer.innerHTML = '';

        const fragment = document.createDocumentFragment();

        nearbyCities.forEach(cidade => {
            const col = document.createElement('div');
            col.classList.add('col-12', 'col-sm-6', 'col-md-3');

            const card = document.createElement('div');
            card.classList.add('card-weather', 'cityNext');

            card.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <h2 class="temp-title-card">${cidade.main.temp.toFixed(0)}°C</h2>
            <i class="bi weather-icon-card"></i>
        </div>
        <div class="card-body-weather">
            <h4 class="card-city">${cidade.name}</h4>
            <span>${cidade.sys?.country || 'BR'}</span>
            <p class="weather-desc-card">${capitalizeFirstLetter(cidade.weather[0].description)}</p>
        </div>
        <div class="card-footer-weather mt-2 d-flex justify-content-between">
            <span>${cidade.main.humidity}%</span>
            <span>${(cidade.wind.speed * 3.6).toFixed(1)} km/h</span>
        </div>
    `;

            const iconElCard = card.querySelector('.weather-icon-card');
            setWeatherIcon(cidade.weather[0].icon, iconElCard);

            col.appendChild(card);
            fragment.appendChild(col);
        });

        nearbyContainer.appendChild(fragment);

    }



});


const mainEl = document.getElementById('main-weather');

function changeBackground(situacion) {

    console.log(situacion)

    let bgUrl = "";

    switch (situacion) {
        case "Ceu limpo":
            bgUrl = "../img/img-ensolarado.jpg";
            break;
        case "Nublado":
            bgUrl = "../img/img-nublado.jpg";
            break;
        case "Chuva":
            bgUrl = "../img/img-chuvoso.jpg";
            break;
        case "Nuvens dispersas":
            bgUrl = "../img/img-nuvens-dispersas.jpg";
            break;
        case "Algumas nuvens":
            bgUrl = "../img/img-nuvens-dispersas.jpg";
            break;
        default:
            bgUrl = "../img/img-ensolarado.jpg";
    }

    mainEl.style.backgroundImage = `url('${bgUrl}')`;
    mainEl.style.backgroundSize = "cover";
    mainEl.style.backgroundPosition = "center";
}