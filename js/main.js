let producto = []

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        producto = data;
        cargarProductos(producto)
    })


const conetedorProducto = document.querySelector('#contenedor-productos')
const botonesCategoria = document.querySelectorAll(".boton-categoria")
const tituloPrincipal = document.querySelector("#titulo-principal")
let botonesAgregar = document.querySelectorAll(".producto-agregar")
const numerito = document.querySelector("#numerito")

function cargarProductos(productoElegidos) {

    conetedorProducto.innerHTML = "";

    productoElegidos.forEach(producto => {

        const div = document.createElement("div")
        div.classList.add("producto");
        //en vez de estar agregando cada uno en el html lo hacemos aqui y lo hacemos mas rapido
        div.innerHTML = `
        <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `

        conetedorProducto.append(div);
    }) 
    actualizarBotonesAgregar();
}

 

botonesCategoria.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategoria.forEach(boton => boton.classList.remove("active"))
        e.currentTarget.classList.add("active")

        if(e.currentTarget.id != "todos") {
            const productoCategoria = producto.find(producto => producto.categoria.id === e.currentTarget.id)
            tituloPrincipal.innerText = productoCategoria.categoria.nombre
            const productosBoton = producto.filter(producto => producto.categoria.id === e.currentTarget.id)
            cargarProductos(productosBoton)

        } else {
            tituloPrincipal.innerText = "Todos los productos"
            cargarProductos(producto)
        }
    })
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar")

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    })
}
    let productosEnCarrito;

    let productosEnCarritoLS = localStorage.getItem("productos-en-carrito")
   
        if(productosEnCarritoLS){
            productosEnCarrito = JSON.parse(productosEnCarritoLS);
            actualizarNumerito();
        }else {
            productosEnCarrito = [];
    }

function agregarAlCarrito(e) {
    Toastify({
        text: "Producto Agregado",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();
    const idBoton = e.currentTarget.id;
    const productoAgregado = producto.find(producto => producto.id === idBoton)

    if(productosEnCarrito.some(producto => producto.id === idBoton)){
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton)
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }
    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)
    numerito.innerText = nuevoNumerito
}