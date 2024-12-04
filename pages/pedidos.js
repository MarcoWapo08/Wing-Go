// Realizar la solicitud directamente al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    fetch('/api/mostrarPedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Error al cargar pedidos');
            });
        }
        return response.json();
    })
    .then(data => {
        const pedidos = data.pedidos;
        const containerPedidos = document.getElementById('containerpedidos');
        // Verificar si los pedidos están vacíos
        if (!pedidos || pedidos.length === 0) {
            containerPedidos.innerHTML = '<p style="font-family: cooperFive; color: white;">No tienes Pedidos Pendientes.</p>';
            return;
        }

        containerPedidos.innerHTML = ''; // Limpiar contenido anterior

        // Crear y añadir cada pedido al contenedor
        pedidos.forEach(pedido => {
            console.log(pedido.foto);  // Verifica que la URL de la imagen sea válida

            const pedidoHTML = `
            <div class="containerpedido">
                <div class="containerpedidopedidos">
                    <div style="display: flex; height: 20%; justify-content: center;">
                        <div class="nombrePedido" style="font-family: cooperFive; color: black; font-size: 2em; text-align: left">${pedido.nombre_platillo}</div>
                    </div>
                    <div style="display: flex; width: 100%; height: 80%; margin-top: 5px; padding-bottom: 5px;">
                        <div class="fotoPedido" style="background-image: url('${pedido.foto}'); width: 20%;"></div>
                        <div style="display: block; width: 60%; height: 100%; padding-left: 5px;">
                            <div style="display: flex;">
                                <div class="containercosaspedido1" style="width: 40%; text-align: left; font-family: cooperFive; color: black; height: 100%;">
                                    <div>Descripción:</div>
                                    <div class="descripcionPedido">${pedido.descripcion}</div>
                                </div>
                                <div style="width: 60%; text-align: left; font-family: cooperFive; color: black; margin-left: 5px;">
                                    <div class="containercosaspedido2" style="display: flex; justify-content: space-between;">
                                        <div>Fecha de Orden:</div>
                                        <div style="text-align: right;">${new Date(pedido.fecha_orden).toLocaleString()}</div>
                                    </div>
                                    <div class="containercosaspedido2" style="margin-top: 5px; display: flex; justify-content: space-between;">
                                        <div>Precio:</div>
                                        <div style="text-align: right;">$${pedido.precio_individual}</div>
                                    </div>
                                    <div class="containercosaspedido2" style="margin-top: 5px; display: flex; justify-content: space-between;">
                                        <div>Cantidad:</div>
                                        <div style="text-align: right;">${pedido.cantidad}</div>
                                    </div>
                                    <div class="containercosaspedido2" style="margin-top: 5px; display: flex; justify-content: space-between;">
                                        <div>Total:</div>
                                        <div style="text-align: right;">$${pedido.total}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="containercosaspedido3" style="margin-top: 5px;">
                                <div class="detallesPedido" style="text-align: left; color: black; font-size: 1rem; font-family: cooperFive; width: 100%; border-radius: 10px;">
                                    Detalles:
                                    ${pedido.detalles || 'Sin detalles'}
                                </div>
                            </div>
                        </div>
                        <div style="display: block; justify-content: space-between; margin-left: 5px; font-family: cooperFive; color: black; width: 20%; height: 100%;">
                            <div>
                                <p>Estado: </p>
                                <p style="color: white">${pedido.estado}</p>
                            </div>
                            <button class="botonCancelarPedido" data-id="${pedido.orden_id}">Cancelar Pedido</button>
                        </div>
                    </div>
                </div>
            </div>`;

            // Añadir el pedido al contenedor
            containerPedidos.innerHTML += pedidoHTML;
        });

        
        // Agregar eventos para cancelar pedidos
        document.querySelectorAll('.botonCancelarPedido')?.forEach(button => {
            button.addEventListener('click', botonCancelarPedido);
        });
    })
    .catch(error => {
        console.error(error.message);
        const containerPedidos = document.getElementById('containerpedidos');
        containerPedidos.innerHTML = `<p style="font-family: cooperFive; color: white;">Error al cargar los Pedidos. Intenta nuevamente.</p>`;
    });


});

function botonCancelarPedido(event) {
    const ordenId = event.target.getAttribute('data-id'); // Obtener el ID del pedido del botón
    const pedidoElemento = event.target.closest('.containerpedido'); // Contenedor del pedido

    const modalCarga = document.getElementById('modalCarga');
    const modalPedidoEliminadoExito = document.getElementById('modalPedidoEliminadoExito');
    const modalPedidoEliminadoExitocerrar = document.getElementById('modalPedidoEliminadoExitocerrar');

    modalPedidoEliminadoExitocerrar.addEventListener("click", function () {
        modalPedidoEliminadoExito.style.display = "none";
    });
    
    window.addEventListener("click", function(event) {
        if (event.target == document.getElementById("modalPedidoEliminadoExito")) {
            document.getElementById("modalPedidoEliminadoExito").style.display = "none";
        }
    });

    const modalPedidoEliminadoSinExito = document.getElementById('modalPedidoEliminadoSinExito');
    const modalPedidoEliminadoSinExitocerrar = document.getElementById('modalPedidoEliminadoSinExitocerrar');

    modalPedidoEliminadoSinExitocerrar.addEventListener("click", function () {
        modalPedidoEliminadoSinExito.style.display = "none";
    });
    
    window.addEventListener("click", function(event) {
        if (event.target == document.getElementById("modalPedidoEliminadoSinExito")) {
            document.getElementById("modalPedidoEliminadoSinExito").style.display = "none";
        }
    });

    fetch('/api/pedidos/cancelar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ orden_id: ordenId }), // Enviar el ID del pedido
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Error al cancelar el pedido');
                });
            }
            return response.json();
        })
        .then(data => {
            // Actualizar el DOM para reflejar el cambio
            if (pedidoElemento) {
                modalCarga.style.display = "flex";
                // Oculta el modal de carga y muestra el de éxito después de 1 segundo
                setTimeout(() => {
                    modalCarga.style.display = "none";
                    modalPedidoEliminadoExito.style.display = "flex";
                    // Cambiar el estado a "Cancelado" en lugar de eliminar el elemento
                    const estadoElemento = pedidoElemento.querySelector('p:nth-child(2)');
                    estadoElemento.textContent = 'Cancelado';
                    estadoElemento.style.color = 'red';

                    // Deshabilitar el botón de cancelar
                    const botonCancelar = pedidoElemento.querySelector('.botonCancelarPedido');
                    botonCancelar.disabled = true;
                    botonCancelar.textContent = 'Pedido Cancelado';
                }, 500);
            }
        })
        .catch(error => {
            console.error('Error al cancelar el pedido:', error.message);
            modalCarga.style.display = "flex";
            // Oculta el modal de carga y muestra el de éxito
            setTimeout(() => {
                modalCarga.style.display = "none";
                modalPedidoEliminadoSinExito.style.display = "flex";
            }, 500);
        });
}

