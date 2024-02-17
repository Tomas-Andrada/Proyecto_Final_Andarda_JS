const listaCarrito = document.getElementById('listaCarrito');
const totalP = document.getElementById('total');

let modoOscuro = localStorage.getItem('modoOscuro') === 'true';
if (modoOscuro) {
    document.body.classList.add('dark-mode');
} else {
    document.body.classList.remove('dark-mode');
}
const mostrarCarrito = () => {
    let carrito = [];
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    
    listaCarrito.innerHTML = '';
    let total = 0;
    const carritoSinDuplicados = [];
    carrito.forEach(item => {
        const indice = carritoSinDuplicados.findIndex(p => p.id === item.id);
        if (indice === -1) {
            carritoSinDuplicados.push({...item});
        } else {
            carritoSinDuplicados[indice].cantidad += item.cantidad;
        }
    });
    const eliminarDelCarrito = (id) => {
        let carrito = [];
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
            carrito = carrito.filter(item => item.id !== id);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarCarrito(); 
        }
    };

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

mostrarCarrito();

const botonPagar = document.getElementById('botonPagar');
botonPagar.addEventListener('click', function () {
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const metodoPagoInput = document.getElementById('metodoPago');
    const numeroTarjetaInput = document.getElementById('numeroTarjeta');

    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;
    const metodoPago = metodoPagoInput.value;
    const numeroTarjeta = numeroTarjetaInput.value;

    if (nombre && apellido && metodoPago && numeroTarjeta) {
        let formaPago = metodoPago.toLowerCase(); // Aquí obtienes directamente el valor del método de pago
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
        
        if (porcentaje === 0) {
            formaPago = "Otro método no reconocido";
        }
        
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
        
        Swal.fire({
            title: `¡Felicitaciones ${nombre} ${apellido}!`,
            text: 'Tu compra ha sido realizada con éxito.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });

        vaciarCarrito();

        // Restablecer los valores del formulario
        nombreInput.value = '';
        apellidoInput.value = '';
        metodoPagoInput.value = '';
        numeroTarjetaInput.value = '';
    } else {
        Swal.fire({
            title: "Error",
            text: "Por favor completa todos los campos del formulario.",
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
});
const volverTiendaButton = document.getElementById('volverTienda');
volverTiendaButton.addEventListener('click', function () {
    window.location.href = 'productos.html';
});

function calcularDescuento(precioTotal, porcentaje) {
    return (precioTotal * porcentaje) / 100;
}
function vaciarCarrito() {
    localStorage.removeItem('carrito'); 
    mostrarCarrito(); 
}