# Weather APP

Aplicação web para consulta de condições climáticas em tempo real de cidades brasileiras, construída com JavaScript puro (Vanilla JS) e integração com a API do OpenWeatherMap.

## Sobre o projeto

O Weather APP permite ao usuário buscar uma cidade e visualizar temperatura atual, temperatura máxima e mínima, umidade, cobertura de nuvens, velocidade do vento e a condição climática representada por ícone. Além disso, a aplicação busca automaticamente o clima de até quatro cidades próximas à localização pesquisada, exibindo-as em cards na parte inferior da tela.

A interface segue um layout de estados exclusivos: tela de boas-vindas (estado inicial), tela de resultado (após busca bem-sucedida) e tela de cidade não encontrada (quando a busca não retorna resultados), controlados por uma única função central que garante que apenas um estado fique visível por vez.

## Como funciona

1. O usuário digita o nome de uma cidade no campo de busca localizado na barra lateral.
2. Ao submeter o formulário (via clique no botão ou tecla Enter), o valor é validado por uma expressão regular que rejeita entradas vazias ou contendo números.
3. Caso a validação falhe, a tela de erro é exibida e a busca é interrompida.
4. Caso a validação passe, é feita uma requisição à API do OpenWeatherMap (endpoint `/data/2.5/weather`) para obter os dados climáticos da cidade, com resposta em português e unidades métricas.
5. Se a API retornar código 404, a tela de "cidade não encontrada" é exibida.
6. Se a busca for bem-sucedida, os dados são renderizados na tela: temperatura, temperaturas máxima e mínima, umidade, nuvens, vento e ícone de condição climática (mapeado dinamicamente a partir do código retornado pela API).
7. Com as coordenadas (latitude e longitude) da cidade encontrada, uma segunda requisição é feita ao endpoint `/data/2.5/find` para buscar cidades próximas, que são renderizadas dinamicamente como cards, excluindo a cidade pesquisada da lista.
8. A troca de telas só ocorre depois que todos os dados (incluindo as cidades próximas) já foram processados, evitando exibição de conteúdo desatualizado durante o carregamento.

## Stacks utilizadas

- HTML5
- CSS3 (efeito de vidro fosco via `backdrop-filter`, gradientes e sombras customizadas)
- JavaScript (ES6+, Vanilla JS, sem frameworks)
- Bootstrap 5.3.8 (grid e componentes de layout)
- Bootstrap Icons 1.13.1 (ícones de interface e condições climáticas)
- OpenWeatherMap API (dados climáticos e busca de cidades próximas)
- Fetch API (requisições assíncronas com async/await)

## Estrutura do projeto

```
.
├── index.html
├── app.js
├── css/
│   └── style.css
└── img/
    ├── 404 Error-bro.png
    └── Weather-amico.png
```

## Como executar

O projeto não possui dependências de build nem gerenciador de pacotes. Basta abrir o arquivo `index.html` diretamente no navegador ou servir a pasta com qualquer servidor estático (por exemplo, a extensão Live Server do VS Code).

Para funcionamento completo, é necessária uma chave de API válida do OpenWeatherMap, configurada na constante `CHAVE` no arquivo `app.js`.

