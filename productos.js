const productosDiv = document.querySelector('.productos');
const irAlCarritoButton = document.getElementById('btnCarrito');
const inputBusqueda = document.getElementById('campoBusqueda');
const botonFiltrar = document.querySelectorAll('.filtro-categoria');
const botonModoOscuro = document.getElementById('modoOscuro');
let carrito = [];
const body = document.body;
const mostrarLoading = () => { 
    document.getElementById('loader-wrapper').style.display = 'block';
};

const ocultarLoading = () => { 
    setTimeout(() => {
        document.getElementById('loader-wrapper').style.display = 'none';
    }, 500); 
};
ocultarLoading();
// Variables para almacenar productos y categorías
let listaProductos = [];
let listaCategorias = [];

// Función para cargar los productos desde el JSON
const cargarProductos = async () => {
    try {
        const response = await fetch('productos.json');
        const data = await response.json();   
        
        listaProductos = data.productos;
        listaCategorias = data.categoria; 
    } catch (error) {
        Swal.fire({
            title: "Upss tenemos un problema",
            text: 'Ocurrió un error en el servidor. Por favor intenta más tarde',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
};
cargarProductos();
// Función para mostrar productos en la página
const mostrarProductos = (productos) => {
    productosDiv.innerHTML = '';
    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');
        productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <p>${producto.nombre} - Precio: $${producto.precio.toFixed(2)}</p>
            <input type="number" id="cantidad-${producto.id}" min="1" value="0">
            <button class="agregar" data-id="${producto.id}">Agregar al Carrito</button>
        `;
        productosDiv.appendChild(productoDiv);
    });

    // Después de mostrar los productos, agregar los listeners a los botones de agregar al carrito
    agregarListenersAgregar();
};

const agregarListenersAgregar = () => {
    const agregarBotones = document.querySelectorAll('.agregar');
    agregarBotones.forEach(boton => {
        boton.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            const cantidadInput = document.getElementById(`cantidad-${id}`);
            let cantidad = parseInt(cantidadInput.value);
            if (isNaN(cantidad) || cantidad < 1) {
                cantidad = 0;
            }
            const producto = listaProductos.find(item => item.id === id);
            
            const productoExistenteIndex = carrito.findIndex(item => item.id === id);
            if (productoExistenteIndex !== -1) {
                carrito[productoExistenteIndex].cantidad += cantidad;
            } else {
                carrito.push({...producto, cantidad});
            }
            
            guardarCarrito();
            actualizarCantidadCarrito();
            cantidadInput.value = 0;
        });
    });
};

const actualizarCantidadCarrito = () => {
    let cantidadTotal = 0;
    carrito.forEach(item => {
        cantidadTotal += item.cantidad;
    });
    const cantidadCarritoSpan = document.getElementById('cantidadCarrito');
    cantidadCarritoSpan.textContent = cantidadTotal;
};

const guardarCarrito = () => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
};

const cargarCarrito = () => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCantidadCarrito(); 
    }
};
cargarCarrito();
// Función para filtrar productos por categoría
const filtrarPorCategoria = (categoria) => {
    mostrarLoading();
    const productosFiltrados = listaProductos.filter(producto => {
        const categoriaProducto = listaCategorias.find(cat => cat.id_categoria === producto.id_categoria);
        return categoriaProducto.name === categoria;
    });
    ocultarLoading();
    mostrarProductos(productosFiltrados); // Mostrar los productos filtrados
};
// Función para buscar productos por nombre
const buscarProductos = (termino) => {
    mostrarLoading();
    const productosFiltrados = listaProductos.filter(producto => 
        producto.nombre.toLowerCase().includes(termino.toLowerCase())
    );
    ocultarLoading();
    mostrarProductos(productosFiltrados);
};
// Función para cambiar entre modo oscuro y modo claro
let modoOscuro = localStorage.getItem('modoOscuro') === 'true';
const toggleModoOscuro = () => {
    modoOscuro = !modoOscuro;
    if (modoOscuro) {
        document.body.classList.add('dark-mode');
        botonModoOscuro.textContent = 'Modo Claro';
    } else {
        document.body.classList.remove('dark-mode');
        botonModoOscuro.textContent = 'Modo Oscuro';
    }
    localStorage.setItem('modoOscuro', modoOscuro);
};
botonModoOscuro.addEventListener('click', toggleModoOscuro);
if (modoOscuro) {
    document.body.classList.add('dark-mode');
    botonModoOscuro.textContent = 'Modo Claro';
}
irAlCarritoButton.addEventListener('click', function () {
    window.location.href = 'carrito.html';
});
// Evento para cambiar el modo oscuro
botonModoOscuro.addEventListener('click', toggleModoOscuro);
botonFiltrar.forEach(boton => {
    boton.addEventListener('click', () => {
        const categoriaSeleccionada = boton.textContent;
        filtrarPorCategoria(categoriaSeleccionada);
    });
});
inputBusqueda.addEventListener('input', () => {
    const terminoBusqueda = inputBusqueda.value.trim();
    buscarProductos(terminoBusqueda);
});


