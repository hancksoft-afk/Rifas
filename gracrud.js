// ===========================================
// CRUD RIFA BOYACÁ PREMIUM
// ===========================================

document.addEventListener('DOMContentLoaded', () => {

  // =========================================
  // ELEMENTOS HTML
  // =========================================

  const tabla =
    document.getElementById('tabla-datos');

  const totalRegistros =
    document.getElementById('totalRegistros');

  const totalOcupados =
    document.getElementById('totalOcupados');

  const totalDisponibles =
    document.getElementById('totalDisponibles');

  const totalDinero =
    document.getElementById('totalDinero');

  // =========================================
  // GOOGLE APPS SCRIPT
  // =========================================

  const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbyKyuwDznW3Adh2fI7FsrRks3nlAkxqVsPru3HsNYcOgM_gzJ7YU0FCtpYBoObnsuIvPA/exec";

  // =========================================
  // CARGAR DATOS
  // =========================================

  async function cargarDatos() {

    try {

      const response =
        await fetch(SHEET_URL);

      const datos =
        await response.json();

      // limpiar tabla
      tabla.innerHTML = '';

      // totales
      let ocupados = 0;

      let dinero = 0;

      // =====================================
      // RECORRER DATOS
      // =====================================

      datos.reverse().forEach(data => {

        // ===================================
        // FECHA BONITA
        // ===================================

        let fechaFormateada = '';

        if (data.FechaRegistro) {

          const fecha =
            new Date(data.FechaRegistro);

          fechaFormateada =

            fecha.toLocaleDateString(
              'es-CO'
            );

        }

        // ===================================
        // NUMEROS LIMPIOS
        // ===================================

        const numerosLimpios =

          String(
            data.NúmerosSeleccionados || ''
          )

            .replace(/"/g, '')

            .split(',')

            .map(num =>

              String(num)
              .trim()
              .padStart(3, '0')

            )

            .join(', ');

        // ===================================
        // CONTAR OCUPADOS
        // ===================================

        ocupados +=

          numerosLimpios
          .split(',')
          .length;

        // ===================================
        // SUMAR DINERO
        // ===================================

        dinero +=
          Number(data.Total || 0);

        // ===================================
        // CREAR FILA
        // ===================================

        const fila =
          document.createElement('tr');

        fila.innerHTML = `

          <td>${data.Hora || ''}</td>

          <td>${fechaFormateada}</td>

          <td>${data.Nombres || ''}</td>

          <td>${data.Apellido || ''}</td>

          <td>${data.Ciudad || ''}</td>

          <td>${data.País || ''}</td>

          <td>${data.Responsable || ''}</td>

          <td>${data.CelularResponsable || ''}</td>

          <td>${data.Premio || ''}</td>

          <td>${numerosLimpios}</td>

          <td>${data.Referencia || ''}</td>

          <td>

            $${Number(data.Total || 0)
              .toLocaleString('es-CO')}

          </td>

          <td>

            <button class="btn-factura">
              🧾
            </button>

          </td>

          <td>

            <button class="btn-aprobado">
              ✅
            </button>

          </td>

          <td>

            <button class="btn-eliminar">
              🗑️
            </button>

          </td>

        `;

        // ===================================
        // INSERTAR ARRIBA
        // ===================================

        tabla.prepend(fila);

        // ===================================
        // BOTON FACTURA
        // ===================================

        fila.querySelector('.btn-factura')

        .addEventListener('click', () => {

          Swal.fire({

            background:'transparent',

            width:'480px',

            confirmButtonColor:'#0025c8',

            confirmButtonText:'Cerrar',

            html:`

            <div class="ticket-success">

              <div class="ticket-body">

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

                    ${data.Nombres}
                    ${data.Apellido}

                  </div>

                </div>

                <!-- GRID -->

                <div class="ticket-grid">

                  <div class="ticket-card">

                    <div class="ticket-label">
                    Hora
                    </div>

                    <div class="ticket-value">
                    ${data.Hora}
                    </div>

                  </div>

                  <div class="ticket-card">

                    <div class="ticket-label">
                    Fecha
                    </div>

                    <div class="ticket-value">
                    ${fechaFormateada}
                    </div>

                  </div>

                  <div class="ticket-card">

                    <div class="ticket-label">
                    Total
                    </div>

                    <div class="ticket-value">

                    $${Number(data.Total || 0)
                    .toLocaleString('es-CO')}

                    </div>

                  </div>

                  <div class="ticket-card">

                    <div class="ticket-label">
                    Ciudad
                    </div>

                    <div class="ticket-value">
                    ${data.Ciudad}
                    </div>

                  </div>

                  <div class="ticket-card">

                    <div class="ticket-label">
                    País
                    </div>

                    <div class="ticket-value">
                    ${data.País}
                    </div>

                  </div>

                  <div class="ticket-card">

                    <div class="ticket-label">
                    Premio
                    </div>

                    <div class="ticket-value">
                    ${data.Premio}
                    </div>

                  </div>

                  <div class="ticket-card">

                    <div class="ticket-label">
                    Responsable
                    </div>

                    <div class="ticket-value">
                    ${data.Responsable}
                    </div>

                  </div>

                  <div class="ticket-card">

                    <div class="ticket-label">
                    Celular
                    </div>

                    <div class="ticket-value">
                    ${data.CelularResponsable}
                    </div>

                  </div>

                  <div class="ticket-card">

                    <div class="ticket-label">
                    Números
                    </div>

                    <div class="ticket-value">
                    ${numerosLimpios}
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

                <p class="thanks-text">

                  ❤️ Gracias por participar

                </p>

              </div>

              <!-- TEAR -->

              <div class="ticket-tear">

                <div class="barcode"></div>

                ${data.Referencia}

              </div>

            </div>

            `

          });

        });

        // ===================================
        // BOTON ELIMINAR
        // ===================================

        fila.querySelector('.btn-eliminar')

        .addEventListener('click', () => {

          Swal.fire({

            title:'¿Eliminar registro?',

            text:'No se puede deshacer.',

            icon:'warning',

            showCancelButton:true,

            confirmButtonColor:'#d33',

            cancelButtonColor:'#3085d6',

            confirmButtonText:'Eliminar',

            cancelButtonText:'Cancelar'

          })

          .then(result => {

            if(result.isConfirmed){

              fila.remove();

              Swal.fire({

                icon:'success',

                title:'Registro eliminado'

              });

            }

          });

        });

      });

      // =====================================
      // ACTUALIZAR CARDS
      // =====================================

      totalRegistros.innerText =
        datos.length;

      totalOcupados.innerText =
        ocupados;

      totalDisponibles.innerText =
        1000 - ocupados;

      totalDinero.innerText =

        `$${dinero.toLocaleString('es-CO')}`;

    }

    catch(error){

      console.error(error);

    }

  }

  // =========================================
  // INICIAR
  // =========================================

  cargarDatos();

  // =========================================
  // AUTO ACTUALIZAR
  // =========================================

  setInterval(() => {

    cargarDatos();

  }, 2000);

});