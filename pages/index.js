// --------------------------EVENTOS DE index.html--------------------------


document.addEventListener("DOMContentLoaded", function () {


    // --------------------------DECLARACIÓN DE VARIABLES--------------------------


    const modalCarga = document.getElementById("modalCarga");
    const modalRegistro = document.getElementById("modalRegistro");
    const modal2registroCompletado = document.getElementById("modal2registroCompletado");
    const modal2registroNoCompletado = document.getElementById("modal2registroNoCompletado");
    const modal2inicioCompletado = document.getElementById("modal2inicioCompletado");
    const modal2inicioNoCompletado = document.getElementById("modal2inicioNoCompletado");


    // --------------------------POP-UPS DE REGISTRO--------------------------


    // Abrir PopUp de Registro
    document.getElementById("inicioderegistro").addEventListener("click", function() {
        modalRegistro.style.display = "flex";
    });

    // Cerrar PopUp de Registro si se clickea el boton de cerrar
    document.getElementById("botonValidarRegistrocerrar").addEventListener("click", function() {
        modalRegistro.style.display = "none";
    });

    // Cerrar PopUp de Registro si se clickea fuera
    window.addEventListener("click", function(event) {
        if (event.target == document.getElementById("modalRegistro")) {
            document.getElementById("modalRegistro").style.display = "none";
        }
    });

    // Cerrar PopUp de Registro Completado si se clickea el boton de cerrar
    document.getElementById("modal2registroCompletadocerrar").addEventListener("click", function() {
        modal2registroCompletado.style.display = "none";
    });

    // Cerrar PopUp de Registro Completado si se clickea fuera
    window.addEventListener("click", function(event) {
        if (event.target == document.getElementById("modal2registroCompletado")) {
            document.getElementById("modal2registroCompletado").style.display = "none";
        }
    });

    // Cerrar PopUp de Registro No Completado si se clickea el boton de cerrar
    document.getElementById("modal2registroNoCompletadocerrar").addEventListener("click", function() {
        modal2registroNoCompletado.style.display = "none";
    });

    // Cerrar PopUp de Registro No Completado si se clickea fuera
    window.addEventListener("click", function(event) {
        if (event.target == document.getElementById("modal2registroNoCompletado")) {
            document.getElementById("modal2registroNoCompletado").style.display = "none";
        }
    });


    // --------------------------POP-UPS DE INICIO DE SESION--------------------------


    // Cerrar PopUp de Inicio de Sesion Completado si se clickea el boton de cerrar
    // y redirigirte a la pagina de pedir
    document.getElementById("modal2inicioCompletadocerrar").addEventListener("click", function() {
        modal2inicioCompletado.style.display = "none";
        window.location.href = 'pedir.html';  // Redirige a otra página  // O la URL que desees para la página de inicio
    })

    // Cerrar PopUp de Inicio de Sesion Completado si se clickea fuera
    // y redirigirte a la pagina de pedir
    document.getElementById("modal2inicioCompletado").addEventListener("click", function() {
        modal2inicioCompletado.style.display = "none";
        window.location.href = 'pedir.html';  // Redirige a otra página  // O la URL que desees para la página de inicio
    })

    // Cerrar PopUp de Inicio de Sesion No Completado si se clickea el boton de cerrar
    document.getElementById("modal2inicioNoCompletadocerrar").addEventListener("click", function() {
        modal2inicioNoCompletado.style.display = "none";
    })

    // Cerrar PopUp de Inicio de Sesion No Completado si se clickea fuera
    document.getElementById("modal2inicioNoCompletado").addEventListener("click", function() {
        modal2inicioNoCompletado.style.display = "none";
    })


    // --------------------------OBTENER DATOS INGRESADOS EN EL REGISTRO--------------------------


    document.getElementById('registro_form').addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

        // Obtener los valores de los campos del formulario
        const nombre = document.getElementById('input_regis_nombre').value;
        const paterno = document.getElementById('input_regis_paterno').value;
        const materno = document.getElementById('input_regis_materno').value;
        const telefono = document.getElementById('input_regis_telefono').value;
        const correo = document.getElementById('input_regis_correo').value;
        const contraseña = document.getElementById('input_regis_contraseña').value;

        console.log('Formulario enviado:', { nombre, paterno, materno, telefono, correo, contraseña });

        // Validación de los datos (puedes agregar más validaciones si lo necesitas)
        if (!nombre || !paterno || !materno || !telefono || !correo || !contraseña) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        // Crear el objeto con los datos a enviar
        const data = {
            nombre: nombre,
            paterno: paterno,
            materno: materno,
            telefono: telefono,
            correo: correo,
            contraseña: contraseña,
        };

        // Enviar los datos al servidor con fetch
        fetch('/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Los datos del formulario convertidos a JSON
        })
        .then(response => response.text())
        .then(data => {
            // Limpiar los campos del formulario después de enviar
            document.getElementById("modalRegistro").style.display = "none";
            modalCarga.style.display = "flex";
            setTimeout(function() {
                // Oculta el modal de carga
                modalCarga.style.display = "none";
                modal2registroCompletado.style.display = "flex";
            }, 500);
            document.getElementById('registro_form').reset();
        })
        .catch(error => {
            alert('Error: ' + error.message); // Mostrar cualquier error que ocurra
            document.getElementById("modalRegistro").style.display = "none";
            modalCarga.style.display = "flex";
            setTimeout(function() {
                // Oculta el modal de carga
                modalCarga.style.display = "none";
                modal2registroNoCompletado.style.display = "flex";
            }, 500);
        });

        const modalbotoncerrar = document.getElementById("modalsincuentabotoncerrar");
        modalbotoncerrar.addEventListener("click", function() {
            document.getElementById("modal").style.display = "none";
        });
    });


    // --------------------------OBTENER DATOS INGRESADOS EN EL LOGIN--------------------------


    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío tradicional del formulario

        // Obtener los valores de los campos del formulario
        const correo = document.getElementById('input_login_correo').value;
        const contraseña = document.getElementById('input_login_contraseña').value;

        console.log('Formulario de login enviado:', { correo, contraseña });

        // Validación simple
        if (!correo || !contraseña) {
            alert('Por favor, ingresa ambos campos.');
            return;
        }

        // Crear el objeto con los datos a enviar
        const data = {
            correo: correo,
            contraseña: contraseña
        };

        // Enviar los datos al servidor con fetch
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Los datos del formulario convertidos a JSON
        })
        .then(response => response.text())
        .then(data => {
            //alert('Respuesta del servidor: ' + data);  // Mostrar la respuesta del servidor
            
            // Redirigir a la página principal si el inicio de sesión es exitoso
            if (data === 'Inicio de sesión exitoso') {
                modalCarga.style.display = "flex";
                setTimeout(function() {
                    // Oculta el modal de carga
                    modalCarga.style.display = "none";
                    modal2inicioCompletado.style.display = "flex";
                }, 500);
            } else {
                modalCarga.style.display = "flex";
                setTimeout(function() {
                    // Oculta el modal de carga
                    modalCarga.style.display = "none";
                    modal2inicioNoCompletado.style.display = "flex";
                }, 500);
            }
        })
        .catch(error => {
            alert('Error: ' + error.message); // Mostrar cualquier error que ocurra
        });
    });


    // --------------------------EVENTOS GENERALES--------------------------


    document.getElementById('container12').addEventListener('mouseover', function(event) {
        container12.style.transform = "scale(1.05)";
    })

    document.getElementById('container12').addEventListener('mouseout', function(event) {
        container12.style.transform = "scale(1)";
    })

    document.getElementById('container21').addEventListener('mouseover', function(event) {
        container21.style.transform = "scale(1.05)";
    })

    document.getElementById('container21').addEventListener('mouseout', function(event) {
        container21.style.transform = "scale(1)";
    })

    document.getElementById('container22').addEventListener('mouseover', function(event) {
        container22.style.transform = "scale(1.05)";
    })

    document.getElementById('container22').addEventListener('mouseout', function(event) {
        container22.style.transform = "scale(1)";
    })
})