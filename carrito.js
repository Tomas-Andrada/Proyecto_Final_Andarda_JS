const listaCarrito = document.getElementById('listaCarrito');
const totalP = document.getElementById('total');
const botonPagar = document.getElementById('botonPagar');

let modoOscuro = localStorage.getItem('modoOscuro') === 'true';
if (modoOscuro) {
    document.body.classList.add('dark-mode');
} else {
    document.body.classList.remove('dark-mode');
}
// Función para mostrar el carrito de compras
const mostrarCarrito = () => {
    let carrito = [];
    // Obtener el carrito guardado en el almacenamiento local
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    
    // Limpiar el contenido del contenedor de carrito
    listaCarrito.innerHTML = '';
    let total = 0;
    const carritoSinDuplicados = [];
    carrito.forEach(item => {
        // Verificar y eliminar duplicados en el carrito
        const indice = carritoSinDuplicados.findIndex(p => p.id === item.id);
        if (indice === -1) {
            carritoSinDuplicados.push({...item});
        } else {
            carritoSinDuplicados[indice].cantidad += item.cantidad;
        }
    });
    
    // Mostrar los elementos del carrito en la página
    carritoSinDuplicados.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nombre} - Cantidad: ${item.cantidad} - Precio total: $${(item.precio * item.cantidad).toFixed(2)}`;
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', () => {
            eliminarDelCarrito(item.id);
        });
        li.appendChild(botonEliminar);
        listaCarrito.appendChild(li);
        total += item.precio * item.cantidad; 
    });
    totalP.textContent = `Total: $${total.toFixed(2)}`;

    return total;
};

// Función para eliminar un producto del carrito
const eliminarDelCarrito = (id) => {
    let carrito = [];
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        carrito = carrito.filter(item => item.id !== id);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        // Mostrar el carrito actualizado después de eliminar un producto
        mostrarCarrito(); 
    }
};

// Función para realizar el pago
botonPagar.addEventListener('click', function () {
    // Obtener los valores del formulario de pago
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const metodoPagoInput = document.getElementById('metodoPago');
    const numeroTarjetaInput = document.getElementById('numeroTarjeta');

    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;
    const metodoPago = metodoPagoInput.value;
    const numeroTarjeta = numeroTarjetaInput.value;

    // Validar que todos los campos del formulario estén completos
    if (nombre && apellido && metodoPago && numeroTarjeta && totalP>0) {
        // Calcular el porcentaje de descuento según el método de pago
        let formaPago = metodoPago.toLowerCase();
        let porcentaje = 0;
        
        switch (formaPago) {
            case "debito":
            case "credito":
                porcentaje = 10;
                break;
            case "transferencia":
                porcentaje = 20;
                break;
            default:
                porcentaje = 0;
        }
        
        // Calcular el descuento y el precio final
        let precioTotal = mostrarCarrito();
        let descuento = calcularDescuento(precioTotal, porcentaje);
        let precioFinal = precioTotal - descuento;
        const infoCompra = document.getElementById('infoCompra');
        infoCompra.style.display = 'block';
        infoCompra.innerHTML = `
            <h3>Detalles de la Compra</h3>
            <p>Forma de Pago: ${formaPago}</p>
            <p>Porcentaje de Descuento Aplicado: ${porcentaje}%</p>
            <p>Monto del Descuento: $${descuento.toFixed(2)}</p>
            <p>Precio Final: $${precioFinal.toFixed(2)}</p>
        `;
        
        // Mensaje de éxito al usuario
        Swal.fire({
            title: `¡Felicitaciones ${nombre} ${apellido}!`,
            text: 'Tu compra ha sido realizada con éxito.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });

        // Vaciar el carrito después de realizar la compra
        vaciarCarrito();

        // Restablecer los valores del formulario de pago
        nombreInput.value = '';
        apellidoInput.value = '';
        metodoPagoInput.value = '';
        numeroTarjetaInput.value = '';
    
    } else {
        // Mensaje de error si no se completan todos los campos del formulario
        Swal.fire({
            title: "Error",
            text: "Por favor completa todos los campos del formulario.",
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
});

// Evento para volver a la tienda
const volverTiendaButton = document.getElementById('volverTienda');
volverTiendaButton.addEventListener('click', function () {
    window.location.href = 'productos.html';
});

// Función para calcular el descuento
function calcularDescuento(precioTotal, porcentaje) {
    return (precioTotal * porcentaje) / 100;
}

// Función para vaciar el carrito
function vaciarCarrito() {
    localStorage.removeItem('carrito'); 
    mostrarCarrito(); 
}
mostrarCarrito();