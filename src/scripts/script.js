class View {
    constructor() {
        this.buttonAdd = document.getElementById('addCity');
        this.container = document.getElementById('container');
        this.wrapper = document.getElementById('wrapper');
        }
    makeCityBlock(response, imageurl, id) {
        const div = document.createElement('div');
        const enterDiv = document.createElement('div');
        enterDiv.className = 'enter__div';
        const deleteButton = document.createElement('button');
        deleteButton.id = 'delete';
        deleteButton.innerHTML = "DELETE CITY";
        const edit = document.createElement('button')
        edit.id = 'edit';
        edit.innerHTML = 'EDIT CITY';
        div.classList.add('city');
        div.setAttribute('id', id);
        this.container.append(div);
        const p = document.createElement('p');
        const temp = document.createElement('p');
        temp.innerHTML = Math.floor(response.main.temp - 273.15) + '&deg C';
        const img = document.createElement('img');
        img.setAttribute('src', imageurl)
        const span = document.createElement('span');
        p.innerHTML = response.name;
        div.append(p, img, temp, enterDiv);
        enterDiv.append(deleteButton, edit);
    }   
    removeCityBlock(id) {
        let cityBlock = document.getElementById(id);
        cityBlock.remove();
    } 
    editPressed(id) {
            const block = document.getElementById(id);
            const input = document.createElement('input');
            const button = document.createElement('button');
            button.innerHTML = 'SAVE';
            button.id = 'save'
            block.querySelector('p').classList.toggle('hidden');
            block.prepend(input, button);

    }
    moneyRate(response) {
        const currencyUSDUAH = document.createElement('p');
        const numbersUSDUAH = document.createElement('p');
        currencyUSDUAH.innerHTML = `${response[0].ccy} / ${response[0].base_ccy}`;
        numbersUSDUAH.innerHTML = `${Number(response[0].buy).toPrecision(4)} / ${Number(response[0].sale).toPrecision(4)}`
        const currencyEURUAH = document.createElement('p');
        currencyEURUAH.innerHTML = `${response[1]}`
        this.wrapper.lastElementChild.append(currencyUSDUAH, numbersUSDUAH);

    }
    pictureGeoWidget(weather) {
        const weatherWidget = document.getElementById('wrapper').firstElementChild;
        const city = document.createElement('h3');
        const tempreture = document.createElement('p');
        city.innerHTML = weather.name;
        tempreture.innerHTML = Math.floor(weather.main.temp - 273.15) + '&deg C';
        weatherWidget.append(city, tempreture)
    }
    clierCarenci() {
        const block = document.getElementById('wrapper').lastElementChild;
        block.innerHTML = '';
    }
}
class Model {
    constructor(view) {
        this.view = view;
    }
    addNewCity(cityname) {
        let apiKey = "14e4636d12aa76d46bf7bef58bb56add";
        let url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=" + apiKey;
        let promise = fetch(url);
        promise
        .then(response => {
            if (response.ok && response.status === 200) {
                
                return response.json();
            } else {
                return Promise.reject(response.status);
            }
        })
        .then(response => 
            {console.log(response);
                this.addCityDb(response);
                
            })
        .catch(err => console.log(err))
    
    }
    editCity = (cityname, id) => {
        let apiKey = "14e4636d12aa76d46bf7bef58bb56add";
        let url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=" + apiKey;
        let promise = fetch(url);
        promise
        .then(response => {
            if (response.ok && response.status === 200) {
                
                return response.json();
            } else {
                return Promise.reject(response.status);
            }
        })
        .then(response => {
            document.getElementById(id).remove();
            this.editOnServ(id, cityname);
            let imageurl = `http://openweathermap.org/img/wn/${response['weather'][0].icon}@2x.png`;
            this.view.makeCityBlock(response, imageurl, id);
                
        })
        .catch(err => console.log(err))

    }
    editOnServ(id, cityname) {
        let city = {
            name : cityname
        }
        let promise = fetch('http://localhost:3333/' + id, {
            method: "PUT",
            headers: {
                'Content-type':'application/json;charset=utf-8'
            },
            body: JSON.stringify(city)
        })
        .then(response => {
            if (response.ok && response.status === 200) {
                return response.text()
            } else {
                return Promise.reject(response.status);     
            }
        })
        .then(response => console.log(response))
        .catch(err => console.log(err));        
    }
    initCityWeather(cityname, id) {
        let apiKey = "14e4636d12aa76d46bf7bef58bb56add";
        let url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=" + apiKey;
        let promise = fetch(url);
        promise
        .then(response => {
            if (response.ok && response.status === 200) {
                
                return response.json();
            } else {
                return Promise.reject(response.status);
            }
        })
        .then(response => {
            let imageurl = `http://openweathermap.org/img/wn/${response['weather'][0].icon}@2x.png`;
            this.view.makeCityBlock(response, imageurl, id);
                
        })
        .catch(err => console.log(err))
    
    }
    addCityDb(weather) {
        let city = {
            name: weather.name
        }
        let promise = fetch('http://localhost:3333/add', {
            method: "POST",
            headers: {
                "Content-type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(city)
        })
        promise.then(response => {
            if (response.ok && response.status === 200) {
                return response.json();
                              
            } else {
                Promise.reject(response.status)
            }
        })
        .then(id => {
            let imageurl = `http://openweathermap.org/img/wn/${weather['weather'][0].icon}@2x.png`
            this.view.makeCityBlock(weather, imageurl, id);
        })
        .catch(error => console.log(error))
    }
    initCities () {
    let promise = fetch('http://localhost:3333/cities/');
    promise
    .then(response => {
        if (response.ok && response.status === 200) {
                    return response.json();
                                  
                } else {
                    Promise.reject(response.status)
                }
    })
    .then(response => response.forEach(item => {
             this.initCityWeather(item.name, item._id);
         }))
    .catch(err => console.log(err))
    }
    deleteCity(id) {
        let promise = fetch('http://localhost:3333/' + id, {
            method: 'DELETE'
        })
        promise
        .then(response => {
            if (response.ok && response.status === 200) {
                return response.text();
                              
            } else {
                Promise.reject(response.status)
            }
        })
        .then(res => this.view.removeCityBlock(id))
        .catch(err => console.log(err))
    
    }
    getToPrivatBank = () => {
        this.view.clierCarenci()
        let promise = fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
        
        promise
        .then(response => {
            if (response.ok && response.status === 200) {
                
                return response.json();
            } else {
                return Promise.reject(response.status);
            }
        })
        .then(response => {
            this.view.moneyRate(response);
        })
        .catch(err => console.log(err))
    }
    initGeoWidget = () => {
        let success = (position) => {
            const lat  = position.coords.latitude;
            const lon = position.coords.longitude;
            let promise = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=14e4636d12aa76d46bf7bef58bb56add`);
            promise
                .then((res => {
                    if (res.ok && res.status === 200) {
                        return res.json();
                    } else {
                        return Promise.reject(res.status);
                    }}))
                .then(res => this.view.pictureGeoWidget(res))
                .catch(err => console.log(err))
        }

        let error = () => {
            
        }

        if(!navigator.geolocation) {
           // this.view.geoWidgetWait('Geolocation is not supported by your browser');
        } else {
            // this.view.geoWidgetWait('Locating…');
            navigator.geolocation.getCurrentPosition(success, error);
        }

    }
}
class Controller {
    constructor (model) {
        this.model = model;
    }
    watchClicks() {
        this.model.view.wrapper.addEventListener('click', (event) => {
            if (event.target.id === "exchangeButton"){
                this.model.getToPrivatBank();
                setInterval(this.model.getToPrivatBank, 3600000)
            } else if (event.target.id === "giv__weather") {
                this.model.initGeoWidget()
            }
        })
        this.model.view.container.addEventListener('click', (event) => {
            if (event.target.id === "addCity") {
                this.model.addNewCity(event.target.previousElementSibling.value)
                
            } else if (event.target.id === "delete") {
                this.model.deleteCity(event.target.parentNode.parentNode.id);
            } else if (event.target.id === "edit") {
               this.model.view.editPressed(event.target.parentNode.parentNode.id)
                // this.model.editCity(event.target.parentNode.parentNode.id);
            } else if (event.target.id === "save") {
                this.model.editCity(event.target.previousSibling.value, event.target.parentNode.id)
            }
        })
    }
}
let view = new View();
let model = new Model(view);
let controller = new Controller(model);
controller.watchClicks();
controller.model.initCities();

// document.getElementById('container').addEventListener('click', (event) => {
//     console.log(event.target.id);
// })