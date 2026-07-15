const CHAVE = "efefc9a32020a169b360e01a3002905e";

const divInfoClima = document.querySelector('.weather-info')
const boasVindasClima = document.querySelector('#weather-welcome')
const naoEncontrado = document.querySelector('#not-found')

async function obterDadosClima(cidade) {
    const urlClima = `https://api.openweathermap.org/data/2.5/weather?q=${cidade},BR&units=metric&lang=pt_br&appid=${CHAVE}`;
    const resposta = await fetch(urlClima);
    const dados = await resposta.json();
    return dados;
}

const regex = /^[^\d]+$/;

function validarCidade(valor) {
    return regex.test(valor);
}

function capitalizarPrimeiraLetra(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function definirIconeClima(codigoIcone, elemento) {
    elemento.className = 'bi';
    const ehNoite = codigoIcone.endsWith('n');

    if (codigoIcone.startsWith('01')) elemento.classList.add(ehNoite ? 'bi-moon' : 'bi-sun');
    else if (codigoIcone.startsWith('02')) elemento.classList.add(ehNoite ? 'bi-cloud-moon' : 'bi-cloud-sun');
    else if (codigoIcone.startsWith('03') || codigoIcone.startsWith('04')) elemento.classList.add('bi-cloud');
    else if (codigoIcone.startsWith('09')) elemento.classList.add('bi-cloud-drizzle');
    else if (codigoIcone.startsWith('10')) elemento.classList.add('bi-cloud-rain');
    else if (codigoIcone.startsWith('11')) elemento.classList.add('bi-cloud-lightning');
    else if (codigoIcone.startsWith('13')) elemento.classList.add('bi-snow');
    else if (codigoIcone.startsWith('50')) elemento.classList.add('bi-cloud-fog');
}

const btnBuscar = document.querySelector('#btnSearch')
const formBusca = document.querySelector('form')
const inputBusca = document.querySelector('#inputSearch')
const mensagemErro = document.querySelector('#message-error')

const tempClima = document.querySelector('#temp-weather')
const descClima = document.querySelector('#weather-desc')
const cidadeClima = document.querySelector('#city-weather')
const dataClima = document.querySelector('#dataOfWeather')

const tempMaxEl = document.querySelector('#temp-max');
const tempMinEl = document.querySelector('#temp-min');
const umidadeEl = document.querySelector('#humidity');
const nuvensEl = document.querySelector('#clouds');
const iconeEl = document.querySelector('#weather-icon');

const ventoEl = document.querySelector('#wind-weather');

const sectionEl = document.querySelector('#section-weather');

function atualizarDataClima() {
    const data = new Date()
    const hora = String(data.getHours()).padStart(2, '0')
    const minutos = String(data.getMinutes()).padStart(2, '0')

    const diaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'][data.getDay()]
    const dia = data.getDate()
    const mes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][data.getMonth()]
    const ano = data.getFullYear()

    dataClima.innerText = `${diaSemana}, ${dia} de ${mes} de ${ano} - ${hora}:${minutos}`
}

atualizarDataClima()
setInterval(atualizarDataClima, 60000)

function mostrarApenas(visao) {
    boasVindasClima.classList.add('d-none');
    mensagemErro.classList.add('d-none');
    naoEncontrado.classList.add('d-none');
    sectionEl.classList.add('d-none');
    divInfoClima.classList.add('d-none');

    if (visao === 'boasVindas') boasVindasClima.classList.remove('d-none');
    if (visao === 'erro') mensagemErro.classList.remove('d-none');
    if (visao === 'naoEncontrado') naoEncontrado.classList.remove('d-none');
    if (visao === 'resultado') {
        sectionEl.classList.remove('d-none');
        divInfoClima.classList.remove('d-none');
    }
}

formBusca.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const valorInput = inputBusca.value.trim();
    if (valorInput === '' || !validarCidade(valorInput)) {
        mostrarApenas('erro');
        return;
    }

    mensagemErro.classList.add('d-none');

    const dados = await obterDadosClima(valorInput);

    if (Number(dados.cod) === 404) {
        mostrarApenas('naoEncontrado');
        inputBusca.value = ''
    } else {
        const temperatura = dados.main.temp;
        const tempMaxClima = dados.main.temp_max;
        const tempMinClima = dados.main.temp_min;
        const velocidadeVento = (dados.wind.speed * 3.6).toFixed(1);
        const umidade = dados.main.humidity;
        const nuvens = dados.clouds.all;
        const descricaoClima = dados.weather[0].description;
        const codigoIcone = dados.weather[0].icon;
        const lon = dados.coord.lon;
        const lat = dados.coord.lat;
        const nome = dados.name;

        cidadeClima.innerHTML = nome;
        tempClima.innerText = `${temperatura.toFixed(0)}°C`;
        tempMinEl.innerText = `${tempMinClima.toFixed(1)}°C`;
        tempMaxEl.innerText = `${tempMaxClima.toFixed(1)}°C`;
        ventoEl.innerText = `${velocidadeVento} km/h`;
        umidadeEl.innerText = `${umidade}%`;
        nuvensEl.innerText = `${nuvens}%`;
        descClima.innerText = capitalizarPrimeiraLetra(descricaoClima);
        definirIconeClima(codigoIcone, iconeEl);

        inputBusca.value = '';

        const respostaProximas = await fetch(`https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=10&units=metric&lang=pt_br&appid=${CHAVE}`);
        const dadosProximas = await respostaProximas.json();

        const cidadesProximas = dadosProximas.list
            .filter(c => c.name !== nome)
            .slice(0, 4);

        const containerProximas = document.querySelector('#nearby-cities-row');
        containerProximas.innerHTML = '';

        const fragmento = document.createDocumentFragment();

        cidadesProximas.forEach(cidade => {
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
            <p class="weather-desc-card">${capitalizarPrimeiraLetra(cidade.weather[0].description)}</p>
        </div>
        <div class="card-footer-weather mt-2 d-flex justify-content-between">
            <span>${cidade.main.humidity}%</span>
            <span>${(cidade.wind.speed * 3.6).toFixed(1)} km/h</span>
        </div>
    `;

            const iconeElCard = card.querySelector('.weather-icon-card');
            definirIconeClima(cidade.weather[0].icon, iconeElCard);

            col.appendChild(card);
            fragmento.appendChild(col);
        });

        containerProximas.appendChild(fragmento);

        mostrarApenas('resultado');
    }
});