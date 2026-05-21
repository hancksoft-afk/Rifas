// ===============================
// ELEMENTOS HTML
// ===============================

const numbersContainer =
    document.getElementById('numbersContainer');

const selectionOption =
    document.getElementById('selectionOption');

const registerBtn =
    document.getElementById('registerBtn');

const modal =
    document.getElementById('modal');

const modalForm =
    document.getElementById('modalForm');


// ===============================
// MODAL 2
// ===============================

const paymentModal =
    document.getElementById('paymentModal');

const paymentForm =
    document.getElementById('paymentForm');

const referenciaInput =
    document.getElementById('referencia');

const closePaymentModal =
    document.getElementById('closePaymentModal');


// ===============================
// GOOGLE APPS SCRIPT
// ===============================

const SHEET_URL =
    "https://script.google.com/macros/s/AKfycbyKyuwDznW3Adh2fI7FsrRks3nlAkxqVsPru3HsNYcOgM_gzJ7YU0FCtpYBoObnsuIvPA/exec";


// ===============================
// VARIABLES
// ===============================

let numerosOcupados = [];

let timerInterval;


// ===============================
// TEMPORIZADOR 5 MINUTOS
// ===============================

function iniciarTemporizador(minutos = 5) {

    clearInterval(timerInterval);

    let tiempo = minutos * 60;

    const timer =
    document.getElementById('paymentTimer');


    timerInterval = setInterval(() => {

        const minutes =
        Math.floor(tiempo / 60);

        const seconds =
        tiempo % 60;


        timer.textContent =

        `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;


        tiempo--;


        // =======================================
        // TIEMPO TERMINADO
        // =======================================

        if(tiempo < 0){

            clearInterval(timerInterval);

            paymentModal.style.display = 'none';


            Swal.fire({

                icon:'warning',

                title:'Tiempo agotado',

                text:'El tiempo para realizar el pago ha finalizado.',

                confirmButtonText:'OK',

                confirmButtonColor:'#0025c8',

                allowOutsideClick:false

            }).then(() => {

                // volver a cargar about.html
                window.location.href = 'about.html';

            });

        }

    },1000);

}


// ===============================
// CARGAR NUMEROS OCUPADOS
// ===============================

async function cargarNumerosOcupados() {

    try {

        const response =
            await fetch(SHEET_URL);

        const data =
            await response.json();


        numerosOcupados = data

            .map(item => {

                // convertir texto
                const numeros =
                    String(item.NúmerosSeleccionados || '');

                // dividir
                return numeros.split(',');

            })

            .flat()

            .map(num => {

                return String(num)
                    .replace(/"/g, '')
                    .trim()
                    .padStart(3, '0');

            });



    }

    catch (error) {

        console.error(error);

    }

}


// ===============================
// GENERAR NUMEROS
// ===============================

async function generarNumeros() {

    await cargarNumerosOcupados();

    numbersContainer.innerHTML = '';

    const fragment =
        document.createDocumentFragment();


    for (let i = 0; i < 1000; i++) {

        const numberDiv =
            document.createElement('div');

        numberDiv.classList.add('number');

        const number =
            i.toString().padStart(3, '0');

        numberDiv.textContent = number;


        // OCUPADO
        if (numerosOcupados.includes(number)) {

            numberDiv.classList.add('occupied');

        }


        // CLICK
        numberDiv.addEventListener('click', () => {

            // ocupado
            if (numberDiv.classList.contains('occupied')) {

                Swal.fire(

                    'Número ocupado',

                    `El número ${number} ya está ocupado.`,

                    'error'

                );

            }

            // seleccionar
            else {

                toggleSelection(numberDiv);

            }

        });

        fragment.appendChild(numberDiv);

    }

    numbersContainer.appendChild(fragment);

}


// ===============================
// SELECCIONAR
// ===============================

function toggleSelection(element) {

    const selectedNumbers =
        document.querySelectorAll('.number.selected');

    const maxNumbers =
        parseInt(selectionOption.value);


    // validar opcion
    if (!maxNumbers) {

        Swal.fire(

            'Selecciona opción',

            'Debes elegir una opción primero.',

            'warning'

        );

        return;

    }


    // quitar
    if (element.classList.contains('selected')) {

        element.classList.remove('selected');

    }

    // agregar
    else if (selectedNumbers.length < maxNumbers) {

        element.classList.add('selected');

    }

    // limite
    else {

        Swal.fire(

            'Límite alcanzado',

            `Solo puedes seleccionar ${maxNumbers} número(s).`,

            'warning'

        );

    }


    // activar boton
    registerBtn.disabled =
        document.querySelectorAll('.number.selected').length === 0;

}


// ===============================
// ABRIR MODAL 1
// ===============================

registerBtn.addEventListener('click', () => {

    const selectedNumbers =

        [...document.querySelectorAll('.number.selected')]

            .map(el =>
                el.textContent.padStart(3, '0')
            );


    // numeros
    document.getElementById('modalSelectedNumbers').innerHTML =

        `
    <strong>Números seleccionados:</strong><br>
    ${selectedNumbers.join(', ')}
    `;


    // total
    document.getElementById('modalTotalValue').innerHTML =

        `
    <strong>Total a pagar:</strong><br>
    $${(selectedNumbers.length * 5000).toLocaleString('es-CO')}
    `;


    modal.style.display = 'flex';

});


// ===============================
// MODAL 1 -> MODAL 2
// ===============================

modalForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const selectedNumbers =

        [...document.querySelectorAll('.number.selected')]

            .map(el =>
                el.textContent.padStart(3, '0')
            );


    const total =
        selectedNumbers.length * 5000;


    // total modal 2
    document.getElementById('paymentTotalValue').innerHTML =

        `
    <strong>Total a pagar:</strong><br>
    $${total.toLocaleString('es-CO')}
    `;


    modal.style.display = 'none';

    paymentModal.style.display = 'flex';


    // iniciar tiempo
    iniciarTemporizador(5);

});


// ===============================
// CERRAR MODAL 2
// ===============================

closePaymentModal.addEventListener('click', () => {

    paymentModal.style.display = 'none';

    clearInterval(timerInterval);

});

// =======================================
// ENVIAR FORMULARIO COMPLETO
// =======================================

paymentForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    // =======================================
    // REFERENCIA
    // =======================================

    const referencia =
        referenciaInput.value.trim();
    // =======================================
    // VALIDAR REFERENCIA
    // =======================================

    const regex =
        /^[A-Z][0-9]{7,11}$/;

    if (!regex.test(referencia)) {

        // cerrar modal detrás
        paymentModal.style.display = 'none';

        // mostrar error
        Swal.fire({

            icon: 'error',

            title: 'Referencia inválida',

            html: `

        Debe iniciar con
        <b>1 letra mayúscula</b>

        <br><br>

        y contener entre
        <b>8 y 12 caracteres</b>.

        <br><br>

        <div style="
        background:#f4f7ff;
        border:1px solid #dbe5ff;
        border-radius:12px;
        padding:12px;
        text-align:left;
        font-size:13px;
        ">

            <b style="color:#28a745;">
            ✅ Correctos
            </b>

            <br>

            M1872671<br>
            A9182726<br>
            Z123456789

            <br><br>

            <b style="color:#dc3545;">
            ❌ Incorrectos
            </b>

            <br>

            MC129272<br>
            1231231<br>
            @1282182<br>
            _291273C

        </div>

        `,

            confirmButtonColor: '#0025c8'

        }).then(() => {

            // volver abrir modal
            paymentModal.style.display = 'flex';

        });

        return;

    }

    // =======================================
    // NUMEROS SELECCIONADOS
    // =======================================

    const selectedNumbers =

        [...document.querySelectorAll('.number.selected')]

            .map(el =>

                String(el.textContent)
                    .trim()
                    .padStart(3, '0')

            );

    // =======================================
    // VALIDAR NUMEROS
    // =======================================

    if (selectedNumbers.length === 0) {

        Swal.fire({

            icon: 'warning',

            title: 'Sin números',

            text: 'Debes seleccionar mínimo un número.'

        });

        return;

    }

    // =======================================
    // TOTAL
    // =======================================

    const total =
        selectedNumbers.length * 5000;

    // =======================================
    // FECHA Y HORA
    // =======================================

    const now =
        new Date();

    const fechaRegistro =
        now.toLocaleDateString('es-CO');

    const hora =
        now.toLocaleTimeString('es-CO');

    // =======================================
    // FORM DATA
    // =======================================

    const formData = {

        Hora:
            hora,

        FechaRegistro:
            fechaRegistro,

        Nombres:
            document.getElementById('Nombres').value,

        Apellido:
            document.getElementById('Apellido').value,

        Ciudad:
            document.getElementById('Ciudad').value,

        País:
            document.getElementById('País').value,

        Responsable:
            document.getElementById('Nombre_de_responsable').value,

        CelularResponsable:
            document.getElementById('Celular_de_responsable').value,

        Premio:
            document.getElementById('Premio').value,

        // IMPORTANTE
        NúmerosSeleccionados:
            selectedNumbers
                .map(num =>
                    `"${String(num).padStart(3, '0')}"`
                )
                .join(','),

        Referencia:
            referencia,

        Total:
            total

    };

    // =======================================
    // LOADER
    // =======================================

    const successLoader =
        document.getElementById('successLoader');

    try {

        // =======================================
        // MOSTRAR LOADER
        // =======================================

        successLoader.style.display = 'flex';

        paymentForm.style.display = 'none';

        // =======================================
        // GUARDAR GOOGLE SHEETS
        // =======================================

        await fetch(SHEET_URL, {

            method: 'POST',

            mode: 'no-cors',

            headers: {
                'Content-Type': 'application/json'
            },

            body:
                JSON.stringify(formData)

        });

        // =======================================
        // ESPERAR LOADER
        // =======================================

        await new Promise(resolve =>

            setTimeout(resolve, 2500)

        );

        // =======================================
        // DETENER TIMER
        // =======================================

        clearInterval(timerInterval);

        // =======================================
        // OCULTAR MODAL
        // =======================================

        paymentModal.style.display = 'none';

        // =======================================
        // OCULTAR LOADER
        // =======================================

        successLoader.style.display = 'none';

        paymentForm.style.display = 'block';

        // =======================================
        // GUARDAR NUMEROS OCUPADOS
        // =======================================

        numerosOcupados.push(...selectedNumbers);

        // =======================================
        // BLOQUEAR NUMEROS
        // =======================================

        selectedNumbers.forEach(num => {

            const numero =
                String(num).padStart(3, '0');

            const numberDiv =

                [...document.querySelectorAll('.number')]

                    .find(el =>

                        el.textContent
                            .trim()
                            .padStart(3, '0') === numero

                    );

            if (numberDiv) {

                numberDiv.classList.remove('selected');

                numberDiv.classList.add('occupied');

            }

        });

        // =======================================
        // CONFETTI
        // =======================================

        confetti({

            particleCount: 250,

            spread: 180,

            origin: { y: 0.6 }

        });

        // =======================================
        // SWEETALERT TICKET
        // =======================================

        Swal.fire({

            background: 'transparent',

            showConfirmButton: true,

            confirmButtonText: 'Cerrar',

            confirmButtonColor: '#0025c8',

            width: '450px',

            html: `

            <div class="ticket-success">

                <div class="ticket-body">

                    <!-- TITULO -->

                    <h2 class="ticket-fly">

                        RIFA

                        <span>🎟️</span>

                        BOYACÁ

                    </h2>

                    <!-- PARTICIPANTE -->

                    <div class="participant-box">

                        <span class="ticket-label">
                        Participante
                        </span>

                        <div class="participant-name">

                            ${formData.Nombres}
                            ${formData.Apellido}

                        </div>

                    </div>

                    <!-- GRID -->

                    <div class="ticket-grid">

                        <div class="ticket-card">

                            <div class="ticket-label">
                            Hora
                            </div>

                            <div class="ticket-value">
                            ${formData.Hora}
                            </div>

                        </div>

                        <div class="ticket-card">

                            <div class="ticket-label">
                            Fecha
                            </div>

                            <div class="ticket-value">
                            ${formData.FechaRegistro}
                            </div>

                        </div>

                        <div class="ticket-card">

                            <div class="ticket-label">
                            Total
                            </div>

                            <div class="ticket-value">

                            $${Number(formData.Total)
                    .toLocaleString('es-CO')}

                            </div>

                        </div>

                        <div class="ticket-card">

                            <div class="ticket-label">
                            Ciudad
                            </div>

                            <div class="ticket-value">
                            ${formData.Ciudad}
                            </div>

                        </div>

                        <div class="ticket-card">

                            <div class="ticket-label">
                            País
                            </div>

                            <div class="ticket-value">
                            ${formData["País"]}
                            </div>

                        </div>

                        <div class="ticket-card">

                            <div class="ticket-label">
                            Premio
                            </div>

                            <div class="ticket-value">
                            ${formData.Premio}
                            </div>

                        </div>

                        <div class="ticket-card">

                            <div class="ticket-label">
                            Responsable
                            </div>

                            <div class="ticket-value">
                            ${formData.Responsable}
                            </div>

                        </div>

                        <div class="ticket-card">

                            <div class="ticket-label">
                            Celular
                            </div>

                            <div class="ticket-value">
                            ${formData.CelularResponsable}
                            </div>

                        </div>

                        <div class="ticket-card">

                            <div class="ticket-label">
                            Números
                            </div>

                            <div class="ticket-value">
                            ${selectedNumbers.join(', ')}
                            </div>

                        </div>

                    </div>

                    <!-- RESULTADOS -->

                    <div class="result-box">

                        <b>
                        RESULTADOS FINALES
                        </b>

                        <p>

                        5 Abril 2025

                        <br>

                        Cifras y Series

                        </p>

                    </div>

                    <!-- THANKS -->

                    <p class="thanks-text">

                    ❤️ Gracias por participar

                    </p>

                </div>

                <!-- TEAR -->

                <div class="ticket-tear">

                    <div class="barcode"></div>

                    ${formData.Referencia}

                </div>

            </div>

            `

        });

        // =======================================
        // RESET
        // =======================================

        modalForm.reset();

        paymentForm.reset();

        registerBtn.disabled = true;

    }

    catch (error) {

        console.error(error);

        successLoader.style.display = 'none';

        paymentForm.style.display = 'block';

        Swal.fire({

            icon: 'error',

            title: 'Error',

            text: 'No se pudieron guardar los datos.'

        });

    }

});
// ===============================
// INICIAR
// ===============================

generarNumeros();