document.addEventListener("DOMContentLoaded", function () {
    // Obtener los platillos desde el servidor
    fetch('http://localhost:4000/api/platillos')
        .then(response => response.json())
        .then(platillos => {
            const containertarjetas1 = document.getElementById('containertarjetas1');
            const containertarjetas2 = document.getElementById('containertarjetas2');
            containertarjetas1.innerHTML = '';
            containertarjetas2.innerHTML = '';

            platillos.forEach(platillo => {
                const tarjetaHTML = `
                    <div class="tarjeta" id_platillo="${platillo.id}" data-nombre="${platillo.nombre_platillo}" data-descripcion="${platillo.descripcion}" data-foto="${platillo.foto}" data-precio="${platillo.precio}" style="margin: 0.5em; background: url(${platillo.foto}) center; background-size: cover;">
                        <div class="textoTarjeta">
                            <h3 style="font-family: cooperFive;">${platillo.nombre_platillo}</h3>
                            <p>${platillo.descripcion}
                                <div class="espacio">
                                    <div class="precio">
                                        <span>$${platillo.precio}</span>
                                    </div>
                                    <button class="botonCompra text1">Pedir Ahora</button>
                                </div>
                            </p>
                        </div>
                    </div>
                `;

                if (containertarjetas1.children.length < 4) {
                    containertarjetas1.innerHTML += tarjetaHTML;
                } else {
                    containertarjetas2.innerHTML += tarjetaHTML;
                }
            });

            // Añadir evento a los botones "Pedir Ahora"
            const botonesCompra = document.getElementsByClassName('botonCompra');
            for (let i = 0; i < botonesCompra.length; i++) {
                botonesCompra[i].addEventListener('click', function () {
                    const platillo = botonesCompra[i].closest('.tarjeta'); // Obtener el contenedor de la tarjeta
                    const nombre = platillo.getAttribute('data-nombre');
                    const descripcion = platillo.getAttribute('data-descripcion');
                    const foto = platillo.getAttribute('data-foto');
                    const precio = parseFloat(platillo.getAttribute('data-precio'));
                    
                    let cantidad = 1; // Por defecto, la cantidad inicial es 1
                    let total = precio * cantidad;

                    const modalContenidoPlatillo = document.getElementById('modalContenidoPlatillo');
                    const modalAnuncioContenidoPlatillo = document.getElementById('modalAnuncioContenidoPlatillo');
                    

                    // Limpia el modal y lo rellena con la información del platillo
                    modalAnuncioContenidoPlatillo.innerHTML = `
                        <form style="width: 100%; height: 100%; display: block;">
                            <div id="foto" style="background-image: url(${foto}); background-position: center; background-size: cover; height: 200px; width: 100%; border-radius: 10px"></div>
                            <div>
                                <h3 id="nombre" style="font-family: cooperFive; color: black; font-size: 2em;">${nombre}</h3>
                            </div>
                            <div>
                                <p style="font-family: cooperFive; color: black;">${descripcion}
                                    <div>
                                        <textarea id="inputDetalles" style="font-size: 1rem; font-family: cooperFive; width: 100%; border-radius: 10px; resize: none;"></textarea>
                                    </div>
                                    <div class="espacio">
                                        <div style="font-size: 1rem; font-family: cooperFive;">
                                            <span id="precio" style="font-family: cooperFive; color: black;">$${precio}</span>
                                        </div>
                                        <div style="font-family: cooperFive; color: black;">
                                            Total: <span id="total">$${total}</span>, 
                                            Cantidad: 
                                            <div class="spinner" style="align-items: end;">
                                                <button id="decrementar" class="btn-decrement buttonSpinner">-</button>
                                                <input id="cantidad" class="number-input" type="number" value="1" min="1" max="100" />
                                                <button id="incrementar" class="btn-increment buttonSpinner">+</button>
                                            </div>
                                        </div>
                                    </div>
                                </p>
                            </div>
                            <div style="justify-content: end;">
                                <button id="botonCompraDirecta" class="modalsincuentabotoncerrar" style="margin-bottom: 1em;">Pedir Ahora</button>
                                <button id="botonAgregarCarrito" class="modalsincuentabotoncerrar" style="margin-bottom: 1em;">Agregar al Carrito</button>
                                <button id="modalContenidoPlatilloCerrar" class="modalsincuentabotoncerrar">Cerrar</button>
                            </div>
                        </form>
                    `;

                    modalContenidoPlatillo.style.display = "flex"; // Mostrar el modal
                    const modalContenidoPlatilloCerrar = document.getElementById("modalContenidoPlatilloCerrar");
                    const modalCarga = document.getElementById("modalCarga");
                    
                    
                    modalContenidoPlatilloCerrar.addEventListener("click", function (e) {
                        e.preventDefault();
                        modalContenidoPlatillo.style.display = "none";
                    });

                    window.addEventListener("click", function(event) {
                        if (event.target == document.getElementById("modalContenidoPlatillo")) {
                            document.getElementById("modalContenidoPlatillo").style.display = "none";
                        }
                    });

                    const btnDecrementar = document.getElementById('decrementar');
                    const btnIncrementar = document.getElementById('incrementar');
                    const cantidadInput = document.getElementById('cantidad');

                    function actualizarCantidad() {
                        cantidadInput.value = cantidad;
                        let total = precio * cantidad;
                        document.getElementById('total').textContent = total.toFixed(2);
                    }

                    btnDecrementar.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (cantidad > 1) {
                            cantidad--;
                            actualizarCantidad();
                        } else {
                            return;
                        }
                    });

                    btnIncrementar.addEventListener('click', (e) => {
                        e.preventDefault();
                        cantidad++;
                        actualizarCantidad();
                    });

                    const modalCompraCompletadaConExito = document.getElementById('modalCompraCompletadaConExito');
                    const modalCompraCompletadaConExitocerrar = document.getElementById('modalCompraCompletadaConExitocerrar');

                    modalCompraCompletadaConExitocerrar.addEventListener("click", function () {
                        modalCompraCompletadaConExito.style.display = "none";
                    });
    
                    window.addEventListener("click", function(event) {
                        if (event.target == document.getElementById("modalCompraCompletadaConExito")) {
                            document.getElementById("modalCompraCompletadaConExito").style.display = "none";
                        }
                    });

                    const modalCompraNoCompletada = document.getElementById('modalCompraNoCompletada');
                    const modalCompraNoCompletadacerrar = document.getElementById('modalCompraNoCompletadacerrar');
                
                    modalCompraNoCompletadacerrar.addEventListener("click", function () {
                        modalCompraNoCompletada.style.display = "none";
                    });
                
                    window.addEventListener("click", function(event) {
                        if (event.target == document.getElementById("modalCompraNoCompletada")) {
                            document.getElementById("modalCompraNoCompletada").style.display = "none";
                        }
                    });

                    const modalAgregadoCarritoCompletado = document.getElementById('modalAgregadoCarritoCompletado');
                    const modalAgregadoCarritoCompletadocerrar = document.getElementById('modalAgregadoCarritoCompletadocerrar');

                    modalAgregadoCarritoCompletadocerrar.addEventListener("click", function () {
                        modalAgregadoCarritoCompletado.style.display = "none";
                    });
    
                    window.addEventListener("click", function(event) {
                        if (event.target == document.getElementById("modalAgregadoCarritoCompletado")) {
                            document.getElementById("modalAgregadoCarritoCompletado").style.display = "none";
                        }
                    });

                    const modalAgregadoCarritoNoCompletado = document.getElementById('modalAgregadoCarritoNoCompletado');
                    const modalAgregadoCarritoNoCompletadocerrar = document.getElementById('modalAgregadoCarritoNoCompletadocerrar');

                    modalAgregadoCarritoNoCompletadocerrar.addEventListener("click", function () {
                        modalAgregadoCarritoNoCompletado.style.display = "none";
                    });
    
                    window.addEventListener("click", function(event) {
                        if (event.target == document.getElementById("modalAgregadoCarritoNoCompletado")) {
                            document.getElementById("modalAgregadoCarritoNoCompletado").style.display = "none";
                        }
                    });

                    const botonCompraDirecta = document.getElementById("botonCompraDirecta");
                    botonCompraDirecta.addEventListener("click", function (e) {
                        e.preventDefault();
                        botonCompraDirecta.disabled = true;

                        fetch('http://localhost:4000/api/usuario')
                            .then(response => response.json())
                            .then(usuarioData => {
                                const id_usuario = usuarioData.id_usuario;
                                const cantidad = parseInt(cantidadInput.value) || 1;
                                const detalles = document.getElementById("inputDetalles").value;

                                const pedirload = {
                                    id_usuario: id_usuario,
                                    id_platillo: platillo.getAttribute('id_platillo'),
                                    cantidad: cantidad,
                                    precio: precio,
                                    detalles: detalles,
                                    total: (precio * cantidad).toFixed(2),
                                };

                                return fetch('http://localhost:4000/api/pedir', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(pedirload),
                                });
                            })
                            .then(response => response.json())
                            .then(data => {
                                // Deshabilitar el botón de compra directa para evitar múltiples clics
                                botonCompraDirecta.disabled = false;
                                
                                // Verifica si el pedido fue exitoso o no
                                if (data.success) {
                                    // Si la respuesta es exitosa, muestra el modal correspondiente
                                    // alert('¡Pedido realizado con éxito!');
                                    modalContenidoPlatillo.style.display = "none";
                                    modalCarga.style.display = "flex";
                                    
                                    // Oculta el modal de carga y muestra el de éxito después de 1 segundo
                                    setTimeout(() => {
                                        modalCarga.style.display = "none";
                                        modalCompraCompletadaConExito.style.display = "flex";
                                    }, 1000);
                                } else {
                                    // Si la respuesta no es exitosa, muestra el mensaje de error
                                    // alert('Error: ' + data.message);
                                    modalContenidoPlatillo.style.display = "none";
                                    modalCarga.style.display = "flex";
                                    
                                    // Después de 1 segundo, oculta el modal de carga y muestra el de error
                                    setTimeout(() => {
                                        modalCarga.style.display = "none";
                                        modalCompraNoCompletada.style.display = "flex";
                                    }, 1000);
                                }
                            })
                            .catch(error => {
                                // Si ocurre un error en la promesa
                                botonCompraDirecta.disabled = false;
                                alert('Error al procesar el pedido.');
                                console.error(error);
                                
                                // Manejo de errores, oculta el modal de contenido y muestra el de carga
                                modalContenidoPlatillo.style.display = "none";
                                modalCarga.style.display = "flex";
                                
                                // Después de 1 segundo, oculta el modal de carga y muestra el de error
                                setTimeout(() => {
                                    modalCarga.style.display = "none";
                                    modalCompraNoCompletada.style.display = "flex";
                                }, 1000);
                            });
                            
                    });

                    actualizarCantidad();


                    const botonAgregarCarrito = document.getElementById("botonAgregarCarrito");
                    botonAgregarCarrito.addEventListener("click", function (e) {
                        e.preventDefault();
                        botonAgregarCarrito.disabled = true;

                        fetch('http://localhost:4000/api/usuario')
                            .then(response => response.json())
                            .then(usuarioData => {
                                const id_usuario = usuarioData.id_usuario;
                                const cantidad = parseInt(cantidadInput.value) || 1;
                                const detalles = document.getElementById("inputDetalles").value;

                                const carritoload = {
                                    id_usuario: id_usuario,
                                    id_platillo: platillo.getAttribute('id_platillo'),
                                    cantidad: cantidad,
                                    precio: precio,
                                    detalles: detalles,
                                    total: (precio * cantidad).toFixed(2),
                                };

                                return fetch('http://localhost:4000/api/guardarCarrito', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(carritoload),
                                });
                            })
                            .then(response => response.json())
                            .then(data => {
                                botonAgregarCarrito.disabled = false;
                                // Verifica si el pedido fue exitoso o no
                                if (data.success) {
                                    // Si la respuesta es exitosa, muestra el modal correspondiente
                                    // alert('¡Pedido realizado con éxito!');
                                    modalContenidoPlatillo.style.display = "none";
                                    modalCarga.style.display = "flex";
                                    
                                    // Oculta el modal de carga y muestra el de éxito después de 1 segundo
                                    setTimeout(() => {
                                        modalCarga.style.display = "none";
                                        modalAgregadoCarritoCompletado.style.display = "flex";
                                    }, 1000);
                                } else {
                                    // Si la respuesta no es exitosa, muestra el mensaje de error
                                    modalContenidoPlatillo.style.display = "none";
                                    modalCarga.style.display = "flex";
                                    // Después de 1 segundo, oculta el modal de carga y muestra el de error
                                    setTimeout(() => {
                                        modalCarga.style.display = "none";
                                        modalAgregadoCarritoNoCompletado.style.display = "flex";
                                    }, 1000);
                                }
                            })
                            .catch(error => {
                                
                                botonAgregarCarrito.disabled = false;
                                alert('Error al procesar el pedido.');
                                console.error(error);
                                
                                modalCarga.style.display = "flex";
                                
                                setTimeout(() => {
                                    modalCarga.style.display = "none";
                                    modalAgregadoCarritoNoCompletado.style.display = "flex";
                                }, 1000);
                            });
                    });
                });
            }
        });
});
