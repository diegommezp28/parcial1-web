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

let nodoCarroCompras = document.getElementById("logo");
nodoCarroCompras.addEventListener('click', handler_carro_compras)

const carroCompras = { numeroProductos: 0, productos: {} }
let categorias = []
let indexCategoriaSeleccionada = 0;

getRequest(URL).then(response => {

    response = JSON.parse(response);
    categorias = response;
    links_categorias();
    productos();
})

function links_categorias() {
    let nodoCategorias = document.getElementById("categorias");
    let cont = 0
    for (const categoria of categorias) {
        let nombreCategoria = document.createElement("span");
        nombreCategoria.setAttribute("id", `categoria-${cont}`)
        nombreCategoria.appendChild(document.createTextNode(categoria.name));
        nombreCategoria.addEventListener("click", handler_categorias)

        nodoCategorias.appendChild(nombreCategoria)
        cont += 1;
    }
}

function productos() {
    let nodoNombre = document.getElementById('nombre_categoria');
    nodoNombre.innerHTML = `<h2 class="font-weight-bold">${categorias[indexCategoriaSeleccionada].name}</h2>`
    let productos = categorias[indexCategoriaSeleccionada].products

    let nodoProductos = document.getElementById("productos")
    nodoProductos.innerHTML = '';
    let cont = 0;
    for (const producto of productos) {
        let div = document.createElement("div");
        div.setAttribute("class", "card");
        div.setAttribute("style", "width: 23%;");
        div.innerHTML = `  
        <img class="card-img-top" src="${producto.image}")>
            <div class="card-body">
                <h5 class="card-title font-weight-bold">${producto.name}</h5>
                <p class="card-text">${producto.description}</p>
                <p class="font-weight-bold">$${producto.price}</p>
                <button id='${indexCategoriaSeleccionada}-${cont}' type="button" class="btn btn-primary aniadir-carro bg-dark">
                    Añadir al carro
                </button>
             </div>`
        nodoProductos.appendChild(div);
        cont += 1;
    }
    botones_productos();
}

function botones_productos() {
    let botones = document.getElementsByClassName("aniadir-carro")

    for (const boton of botones) {
        boton.addEventListener("click", handler_boton_productos);
    }
}

function handler_boton_productos() {
    const id = this.getAttribute('id');
    carroCompras.productos[id] = carroCompras.productos[id] ? carroCompras.productos[id] + 1 : 1;
    carroCompras.numeroProductos += 1;

    let nodoCarrito = document.getElementById('items-number')
    nodoCarrito.innerHTML = `${carroCompras.numeroProductos} items`;

}

function handler_categorias() {
    const nodo_actual = this
    const id = nodo_actual.getAttribute('id');
    const index = Number(id.split('-')[1])

    indexCategoriaSeleccionada = index;
    productos();

}

function handler_carro_compras() {
    let nodoNombre = document.getElementById('nombre_categoria');
    nodoNombre.innerHTML = `<h2 class="font-weight-bold">Order Detail</h2>`

    let nodoProductos = document.getElementById("productos")
    nodoProductos.innerHTML = '';

    let htmlTabla = ` 
    <table class="table table-striped ">
        <thead>
            <tr>
                <th scope="col">Item</th>
                <th scope="col">Qty</th>
                <th scope="col">Description</th>
                <th scope="col">Unit price</th>
                <th scope="col">Amount</th>
            </tr>
        </thead>
    <tbody>
    {{replace}}
    </tbody>
  </table>`;

    let bodyTabla = ''
    let cont = 0;
    let total = 0;

    for (const productoId of Object.keys(carroCompras.productos)) {
        cont += 1;
        const qty = carroCompras.productos[productoId];
        const producto = getProduct(productoId);
        const price = producto.price
        const amount = price * qty;
        const description = producto.name
        bodyTabla += `
      <tr>
        <th scope="row">${cont}</th>
        <td>${qty}</td>
        <td>${description}</td>
        <td>${price}</td>
        <td>${amount}</td>
      </tr>
      `
        total += amount;
    }

    htmlTabla += `
    <div class='w-100 position-relative'> 
        <p class="font-weight-bold m-3 float-left">Total:$${total.toPrecision(5)} </p>
        <button id='boton-confirmar'  type="button" class="btn btn-primary confirmar float-right m-3">Confirm Order</button>
        <button id='boton-cancelar' type="button" class="btn btn-danger cancel float-right m-3" 
                data-toggle="modal" data-target="#modal"> Cancel
        </button>

        <div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Cancel the order</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure about cancelling the order?</p>
                    </div>
                    <div class="modal-footer">
                        <button id="confirmar-cancelacion" type="button" class="btn btn-danger" data-dismiss="modal">
                            Yes, I want to cancel de order
                        </button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal">No, I want to continue adding products</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `
    htmlTabla = htmlTabla.replace('{{replace}}', bodyTabla);
    nodoProductos.innerHTML = htmlTabla

    let botonConfirmar = document.getElementById('boton-confirmar');
    let botonConfirmarCancelacion = document.getElementById('confirmar-cancelacion')


    botonConfirmar.addEventListener('click', confirmar);
    botonConfirmarCancelacion.addEventListener('click', cancelar);


}

function confirmar() {

    let cont = 0;
    const confirmacion = [];

    for (const productoId of Object.keys(carroCompras.productos)) {
        cont += 1;
        const qty = carroCompras.productos[productoId];
        const producto = getProduct(productoId);
        const price = producto.price
        const description = producto.name

        const item = {item: cont, quantity: qty, description: description, unitPrice: price};
        confirmacion.push(item);
    }
    carroCompras.numeroProductos = 0;
    carroCompras.productos = {};

    console.log(confirmacion);

}

function cancelar(){
    carroCompras.numeroProductos = 0
    carroCompras.productos = {}
    let nodoCarrito = document.getElementById('items-number')
    nodoCarrito.innerHTML = `0 items`;
    productos();

}

function getProduct(id) {
    const [categoria, producto] = id.split('-');
    return categorias[categoria].products[producto];
}

