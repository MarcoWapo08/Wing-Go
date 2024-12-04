window.addEventListener('DOMContentLoaded', () => {
    fetch('/api/mostrarCarritos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Error al cargar carritos');
                });
            }
            return response.json(); // Obtener los datos de los carritos
        })
        .then(data => {
            const carritos = data.carritos;
            const containerCarritos = document.getElementById('containercarritos');
            
            // Verificar si los carritos están vacíos
            if (!carritos || carritos.length === 0) {
                containerCarritos.innerHTML = '<p style="font-family: cooperFive; color: white;">No hay Contenido en el Carrito.</p>';
                return;
            }

            containerCarritos.innerHTML = ''; // Limpiar contenido anterior si hay carritos

            // Crear y añadir cada carrito al contenedor
            carritos.forEach(carrito => {
                const carritoHTML = `
                <div class="containercarrito">
                    <div class="containercarritopedidos">
                        <div style="display: flex; height: 20%; justify-content: center;">
                            <div class="nombreCarrito" style="font-family: cooperFive; color: black; font-size: 2em; text-align: left">${carrito.nombre_platillo}</div>
                        </div>
                        <div style="display: flex; width: 100%; height: 80%; margin-top: 5px; padding-bottom: 5px;">
                            <div class="fotoCarrito" style="background-image: url('${carrito.foto}'); width: 20%;"></div>
                            <div style="display: block; width: 60%; height: 100%; padding-left: 5px;">
                                <div style="display: flex;">
                                    <div class="containercosascarrito1" style="width: 40%; text-align: left; font-family: cooperFive; color: black; height: 100%;">
                                        <div>Descripción:</div>
                                        <div class="descripcionCarrito">${carrito.descripcion}</div>
                                    </div>
                                    <div style="width: 60%; text-align: left; font-family: cooperFive; color: black; margin-left: 5px;">
                                        <div class="containercosascarrito2" style="display: flex; justify-content: space-between;">
                                            <div>Fecha de Agregado:</div>
                                            <div style="text-align: right;">${new Date(carrito.fecha_agregado).toLocaleString()}</div>
                                        </div>
                                        <div class="containercosascarrito2" style="margin-top: 5px; display: flex; justify-content: space-between;">
                                            <div>Precio:</div>
                                            <div style="text-align: right;">$${carrito.precio_individual}</div>
                                        </div>
                                        <div class="containercosascarrito2" style="margin-top: 5px; display: flex; justify-content: space-between;">
                                            <div>Cantidad:</div>
                                            <div style="text-align: right;">${carrito.cantidad}</div>
                                        </div>
                                        <div class="containercosascarrito2" style="margin-top: 5px; display: flex; justify-content: space-between;">
                                            <div>Total:</div>
                                            <div style="text-align: right;">$${carrito.total}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="containercosascarrito3" style="margin-top: 5px;">
                                    <div class="detallesCarrito" style="text-align: left; color: black; font-size: 1rem; font-family: cooperFive; width: 100%; border-radius: 10px;">
                                        Detalles:
                                        ${carrito.detalles || 'Sin detalles'}
                                    </div>
                                </div>
                            </div>
                            <div style="display: block; justify-content: space-between; margin-left: 5px; font-family: cooperFive; color: black; width: 20%; height: 100%;">
                                <button class="botonCancelarCarrito" data-id="${carrito.carrito_id}">Eliminar del Carrito</button>
                            </div>
                        </div>
                    </div>
                </div>`;

                containerCarritos.innerHTML += carritoHTML;
            });
            document.querySelectorAll('.botonMoverPedidos').forEach(button => {
                button.addEventListener('click', botonMoverPedidos);
            });

            // Agregar eventos para eliminar carritos
            document.querySelectorAll('.botonCancelarCarrito')?.forEach(button => {
                button.addEventListener('click', botonCancelarCarrito);
            });
        })
        .catch(error => {
            console.error('Error al cargar el historial:', error.message);
            const containerCarritos = document.getElementById('containercarritos');
            containerCarritos.innerHTML = `<p style="font-family: cooperFive; color: white;">Error al cargar el Carrito. Intenta nuevamente.</p>`;
        });
});


function botonCancelarCarrito(event) {
    const carritoId = event.target.getAttribute('data-id'); // Obtener el ID del carrito del botón
    const carritoElemento = event.target.closest('.containercarrito'); // Contenedor del carrito

    const modalCarga = document.getElementById('modalCarga');
    const modalEliminadoCarritoExito = document.getElementById('modalEliminadoCarritoExito');
    const modalEliminadoCarritoExitocerrar = document.getElementById('modalEliminadoCarritoExitocerrar');

    modalEliminadoCarritoExitocerrar.addEventListener("click", function () {
        modalEliminadoCarritoExito.style.display = "none";
    });
    
    window.addEventListener("click", function(event) {
        if (event.target == document.getElementById("modalEliminadoCarritoExito")) {
            document.getElementById("modalEliminadoCarritoExito").style.display = "none";
        }
    });

    const modalEliminadoCarritoSinExito = document.getElementById('modalEliminadoCarritoSinExito');
    const modalEliminadoCarritoSinExitocerrar = document.getElementById('modalEliminadoCarritoSinExitocerrar');

    modalEliminadoCarritoSinExitocerrar.addEventListener("click", function () {
        modalEliminadoCarritoSinExito.style.display = "none";
    });
    
    window.addEventListener("click", function(event) {
        if (event.target == document.getElementById("modalEliminadoCarritoSinExito")) {
            document.getElementById("modalEliminadoCarritoSinExito").style.display = "none";
        }
    });

    fetch('/api/carrito/eliminar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ carrito_id: carritoId }), // Enviar el ID del carrito
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Error al eliminar el carrito');
                });
            }
            return response.json();
        })
        .then(data => {
            // Actualizar el DOM para reflejar el cambio
            
            if (carritoElemento) {
                modalCarga.style.display = "flex";
                // Oculta el modal de carga y muestra el de éxito después de 1 segundo
                setTimeout(() => {
                    modalCarga.style.display = "none";
                    modalEliminadoCarritoExito.style.display = "flex";
                    carritoElemento.remove(); // Eliminar el carrito del DOM
                }, 500);
                
            }
        })
        .catch(error => {
            console.error('Error al eliminar el carrito:', error.message);
            modalCarga.style.display = "flex";
            
            setTimeout(() => {
                modalCarga.style.display = "none";
                modalEliminadoCarritoSinExito.style.display = "flex";
            }, 500);
        });
}
