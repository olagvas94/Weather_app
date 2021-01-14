class View {
    constructor() {
        this.buttonAdd = document.getElementById('addCity');
        this.container = document.getElementById('container');
        }
    makeCityBlock(response, imageurl, id) {
        const div = document.createElement('div');
        div.classList.add('city');
        div.setAttribute('id', id);
        this.container.append(div);
        const p = document.createElement('p');
        const img = document.createElement('img');
        img.setAttribute('src', imageurl)
        const span = document.createElement('span');
        p.innerHTML = response.name;
        div.append(p, img);
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
}
class Controller {
    constructor (model) {
        this.model = model;
    }
    watchClicks() {
        this.model.view.container.addEventListener('click', (event) => {
            if (event.target.id === "addCity") {
                this.model.addNewCity(event.target.previousElementSibling.value)
                
            }
        })
    }
}
let view = new View();
let model = new Model(view);
let controller = new Controller(model);
controller.watchClicks();

// document.getElementById('container').addEventListener('click', (event) => {
//     console.log(event.target.id);
// })