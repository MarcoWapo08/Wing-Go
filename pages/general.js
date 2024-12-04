// Funcionalidad del encabezado de todas la paginas
document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);

    document.getElementById('botonNavLogo').addEventListener('click', function(event) {
        window.location.href = 'index.html';  // Redirige a otra página  // O la URL que desees para la página de inicio
    })

    document.getElementById('botonNavInicio').addEventListener('click', function(event) {
        window.location.href = 'index.html';
    })

    document.getElementById('botonNavMenu').addEventListener('click', function(event) {
        window.location.href = 'menu.html';
    })

    document.getElementById('botonNavPedir').addEventListener('click', function(event) {
        window.location.href = 'index.html?botonNavPedir=true';
    })

    if (params.get('botonNavPedir') === 'true') {
            const container12 = document.getElementById('container12');
            container12.style.transform = "scale(1)";
            setTimeout(function() {
                container12.style.transform = "scale(1.05)";
                setTimeout(function() {
                    container12.style.transform = "scale(1)";
                }, 2000);
            }, 1300);
        }

    document.getElementById('botonNavUbicacion').addEventListener('click', function(event) {
        window.location.href = 'ubicacion.html';
    })

    document.getElementById('botonNavTelefono').addEventListener('click', function(event) {
        window.location.href = 'index.html?botonNavTelefono=true';
    })
    
    if (params.get('botonNavTelefono') === 'true') {
        window.location.hash = '#container21'
        const container21 = document.getElementById('container21');
        container21.style.transform = "scale(1)";
        setTimeout(function() {
            container21.style.transform = "scale(1.05)";
            setTimeout(function() {
                container21.style.transform = "scale(1)";
            }, 2000);
        }, 1300);
    }

    document.getElementById('botonNavHorario').addEventListener('click', function(event) {
        window.location.href = 'index.html?botonNavHorario=true';
    })
    
    if (params.get('botonNavHorario') === 'true') {
        window.location.hash = '#container22'
        const container22 = document.getElementById('container22');
        container22.style.transform = "scale(1)";
        setTimeout(function() {
            container22.style.transform = "scale(1.05)";
            setTimeout(function() {
                container22.style.transform = "scale(1)";
            }, 2000);
        }, 1300);
    }

    document.getElementById('botonNavCarrito').addEventListener('click', function(event) {
        window.location.href = 'carrito.html';
    })

    document.getElementById('botonNavFB').addEventListener('click', function(event) {
        window.open('https://www.facebook.com/WingGoMexicali?locale=es_LA', "_blank");
    })

    obtenerCantidadCarrito();

    setInterval(obtenerCantidadCarrito, 500);
})
// Función para obtener la cantidad del carrito desde la API
function obtenerCantidadCarrito() {
    fetch('/api/carrito/cantidad')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la cantidad del carrito');
            }
            return response.json(); // Convertimos la respuesta en JSON
        })
        .then(data => {
            const cantidad = data.cantidad || 0; // Asignamos 0 si la cantidad es undefined o null

            // Asegúrate de que los elementos existen antes de intentar actualizarlos
            const cantidadElemento = document.querySelector('.quantity');
            const botonCarrito = document.querySelector('#botonNavCarrito');

            if (cantidadElemento && botonCarrito) {
                // Actualiza el número en el botón del carrito
                cantidadElemento.textContent = cantidad;

                // Actualiza el atributo 'data-quantity' del botón con la nueva cantidad
                botonCarrito.setAttribute('data-quantity', cantidad);
            } else {
                console.error('No se encontraron los elementos para actualizar.');
            }
        })
        .catch(error => {
            console.error('Error al obtener la cantidad del carrito:', error);
        });
}