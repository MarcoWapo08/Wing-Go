// Realizar la solicitud al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    fetch('/api/mostrarHistoriales', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',

    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Error al cargar el historial');
            });
        }
        return response.json(); // Obtener los datos del historial
    })
    .then(data => {
        const historial = data.historial;

        // Verificar si hay pedidos en el historial
        if (!historial || historial.length === 0) {
            const containerHistoriales = document.getElementById('containerhistoriales');
            containerHistoriales.innerHTML = '<p style="font-family: cooperFive; color: white;">No hay Pedidos en el Historial.</p>';
            return;
        }

        // Seleccionar el contenedor de historial
        const containerHistoriales = document.getElementById('containerhistoriales');
        containerHistoriales.innerHTML = ''; // Limpiar contenido anterior

        // Crear y añadir cada pedido al historial
        historial.forEach(historial => {
            const historialHTML = `
            <div class="containerhistorial">
                <div class="containerhistorialpedidos">
                    <div style="display: flex; height: 20%; justify-content: center;">
                        <div class="nombrHistorial" style="font-family: cooperFive; color: black; font-size: 2em; text-align: left">${historial.nombre_platillo}</div>
                    </div>
                    <div style="display: flex; width: 100%; height: 80%; margin-top: 5px; padding-bottom: 5px;">
                        <div class="fotoHistorial" style="background-image: url('${historial.foto}'); width: 20%;"></div>
                        <div style="display: block; width: 60%; height: 100%; padding-left: 5px;">
                            <div style="display: flex;">
                                <div class="containercosashistorial1" style="width: 40%; text-align: left; font-family: cooperFive; color: black; height: 100%;">
                                    <div>Descripción:</div>
                                    <div class="descripcionhistorial">${historial.descripcion}</div>
                                </div>
                                <div style="width: 60%; text-align: left; font-family: cooperFive; color: black; margin-left: 5px;">
                                    <div class="containercosashistorial2" style="display: flex; justify-content: space-between;">
                                        <div>Fecha de Orden:</div>
                                        <div style="text-align: right;">${new Date(historial.fecha_orden).toLocaleString()}</div>
                                    </div>
                                    <div class="containercosashistorial2" style="margin-top: 5px; display: flex; justify-content: space-between;">
                                        <div>Fecha de Actualización:</div>
                                        <div style="text-align: right;">${new Date(historial.fecha_completado || historial.fecha_cancelado || '').toLocaleString() || 'No disponible'}</div>
                                    </div>
                                    <div class="containercosashistorial2" style="margin-top: 5px; display: flex; justify-content: space-between;">
                                        <div>Precio:</div>
                                        <div style="text-align: right;">$${historial.precio_individual}</div>
                                    </div>
                                    <div class="containercosashistorial2" style="margin-top: 5px; display: flex; justify-content: space-between;">
                                        <div>Cantidad:</div>
                                        <div style="text-align: right;">${historial.cantidad}</div>
                                    </div>
                                    <div class="containercosashistorial2" style="margin-top: 5px; display: flex; justify-content: space-between;">
                                        <div>Total:</div>
                                        <div style="text-align: right;">$${historial.total}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="containercosashistorial3" style="margin-top: 5px;">
                                <div class="detalleshistorial" style="text-align: left; color: black; font-size: 1rem; font-family: cooperFive; width: 100%; border-radius: 10px;">
                                    Detalles:
                                    ${historial.detalles || 'Sin detalles'}
                                </div>
                            </div>
                        </div>
                        <div style="display: block; justify-content: space-between; margin-left: 5px; font-family: cooperFive; color: black; width: 20%; height: 100%;">
                            <div>
                                <p>Estado: </p>
                                <p style="color: white">${historial.estado}</p>
                            </div>
                            <button class="botonEliminarHistorial" data-id="${historial.id_orden}">Eliminar del Historial</button>
                        </div>
                    </div>
                </div>
            </div>`;
            containerHistoriales.innerHTML += historialHTML;
        });
        // Agregar eventos para eliminar carritos
        document.querySelectorAll('.botonEliminarHistorial')?.forEach(button => {
            button.addEventListener('click', botonEliminarHistorial);
        });
    })
    .catch(error => {
        console.error('Error al cargar el historial:', error.message);
        const containerHistoriales = document.getElementById('containerhistoriales');
        containerHistoriales.innerHTML = `<p style="font-family: cooperFive; color: white;>Error al cargar el historial. Intenta nuevamente.</p>`;
    });

    function botonEliminarHistorial(event) {
        const id_orden = event.target.getAttribute('data-id'); // Obtener el ID del carrito del botón
        const ordenElemento = event.target.closest('.containerhistorial'); // Contenedor del carrito

        const modalCarga = document.getElementById('modalCarga');
        const modalHistorialEliminadoExito = document.getElementById('modalHistorialEliminadoExito');
        const modalHistorialEliminadoExitocerrar = document.getElementById('modalHistorialEliminadoExitocerrar');

        modalHistorialEliminadoExitocerrar.addEventListener("click", function () {
            modalHistorialEliminadoExito.style.display = "none";
        });
        
        window.addEventListener("click", function(event) {
            if (event.target == document.getElementById("modalHistorialEliminadoExito")) {
                document.getElementById("modalHistorialEliminadoExito").style.display = "none";
            }
        });

        const modalHistorialEliminadoSinExito = document.getElementById('modalHistorialEliminadoSinExito');
        const modalHistorialEliminadoSinExitocerrar = document.getElementById('modalHistorialEliminadoSinExitocerrar');

        modalHistorialEliminadoSinExitocerrar.addEventListener("click", function () {
            modalHistorialEliminadoSinExito.style.display = "none";
        });
        
        window.addEventListener("click", function(event) {
            if (event.target == document.getElementById("modalHistorialEliminadoSinExito")) {
                document.getElementById("modalHistorialEliminadoSinExito").style.display = "none";
            }
        });

        fetch('/api/historialPedidosBorrar', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ id_orden: id_orden }), // Enviar el ID del carrito
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'Error al eliminar del historial');
                    });
                }
                return response.json();
            })
            .then(data => {
                // Actualizar el DOM para reflejar el cambio
                if (ordenElemento) {
                    modalCarga.style.display = "flex";
                    // Oculta el modal de carga y muestra el de éxito después de 1 segundo
                    setTimeout(() => {
                        modalCarga.style.display = "none";
                        modalHistorialEliminadoExito.style.display = "flex";
                        ordenElemento.remove(); // Eliminar el carrito del DOM
                    }, 500);
                }
            })
            .catch(error => {
                console.error('Error al eliminar el pedido del historial:', error.message);
                modalCarga.style.display = "flex";
                // Oculta el modal de carga y muestra el de éxito después de 1 segundo
                setTimeout(() => {
                    modalCarga.style.display = "none";
                    modalHistorialEliminadoSinExito.style.display = "flex";
                }, 500);
            });
    }
});
