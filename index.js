const URL = "   https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json"

function getRequest(url) {
    let promise = new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = function () {
            if (req.status == 200) {
                resolve(req.response)
            }
            else {
                reject(req.statusText)
            }
        }
        req.send();
    })
    return promise;
}


const carroCompras = {numeroProductos: 0}
let categorias = []
let indexCategoriaSeleccionada = 0;

getRequest(URL).then(response => {

    response = JSON.parse(response);
    categorias = response;
    console.log(response)
    links_categorias();
    productos();
    botones_productos()
})

function links_categorias() {
    let nodoCategorias = document.getElementById("categorias");
    for (const categoria of categorias) {
        let nombreCategoria = document.createElement("span");
        nombreCategoria.appendChild(document.createTextNode(categoria.name));
        nodoCategorias.appendChild(nombreCategoria)
    }
}

function productos() {
    let productos = categorias[indexCategoriaSeleccionada].products

    console.log(productos);
    let nodoProductos = document.getElementById("productos")
    nodoProductos.innerHTML = '';
    for (const producto of productos) {
        let div = document.createElement("div");
        div.setAttribute("class", "card");
        div.setAttribute("style", "width: 18rem;");
        div.innerHTML = `  
        <img class="card-img-top" src="${producto.image}")>
            <div class="card-body">
                <h5 class="card-title">${producto.name}</h5>
                <p class="card-text">${producto.description}</p>
                <button type="button" class="btn btn-primary aniadir-carro">Añadir al carro</button>
             </div>`
        nodoProductos.appendChild(div);

    }
}

function botones_productos() {
    let botones = document.getElementsByClassName("aniadir-carro")

    for (const boton of botones) {
        boton.addEventListener("click", handler_boton_productos);
    }
}

function handler_boton_productos(){
    carroCompras.numeroProductos += 1;
    let nodoCarrito = document.getElementById('items-number')
    nodoCarrito.innerHTML = `${carroCompras.numeroProductos} items`;

}

