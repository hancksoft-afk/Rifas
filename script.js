// =======================================
// ELEMENTOS DEL DOM
// =======================================

const modal =
document.getElementById("modal");

const openModalButton =
document.getElementById("openModalButton");

const closeModalButton =
document.getElementById("closeModal");

const iframe =
document.getElementById("iframe");

const otpDisplay =
document.getElementById("otpDisplay");


// =======================================
// PRELOADER
// =======================================

window.addEventListener('load', () => {

    const preloader =
    document.getElementById('preloader');

    setTimeout(() => {

        preloader.classList.add('hidden');

    }, 1800);

});


// =======================================
// TEMPORIZADOR
// =======================================

const countdown = () => {

    const launchDate =
    new Date("October 22, 2027 00:00:00").getTime();

    const now =
    new Date().getTime();

    const timeLeft =
    launchDate - now;


    // FINALIZAR
    if(timeLeft < 0){

        clearInterval(timer);

        document.querySelector(".countdown").style.display = "none";

        disableButton();

        return;

    }


    // CALCULOS
    const days =
    Math.floor(timeLeft / (1000 * 60 * 60 * 24));

    const hours =
    Math.floor((timeLeft % (1000 * 60 * 60 * 24))
    / (1000 * 60 * 60));

    const minutes =
    Math.floor((timeLeft % (1000 * 60 * 60))
    / (1000 * 60));

    const seconds =
    Math.floor((timeLeft % (1000 * 60))
    / 1000);


    // MOSTRAR
    document.getElementById("days").innerText =

    days < 10
    ? "0" + days
    : days;


    document.getElementById("hours").innerText =

    hours < 10
    ? "0" + hours
    : hours;


    document.getElementById("minutes").innerText =

    minutes < 10
    ? "0" + minutes
    : minutes;


    document.getElementById("seconds").innerText =

    seconds < 10
    ? "0" + seconds
    : seconds;

};


// =======================================
// DESHABILITAR BOTON
// =======================================

const disableButton = () => {

    if(openModalButton){

        openModalButton.disabled = true;

        openModalButton.innerText =
        "Registro cerrado";

        openModalButton.classList.add("disabled");


        // MENSAJE
        document.getElementById("message").style.display = "block";


        // ALERTA
        Swal.fire({

            icon: "error",

            title: "¡Inscripciones cerradas!",

            text: "El tiempo de inscripción ha finalizado.",

            confirmButtonText: "Entendido",

            background: "#111",

            color: "#fff",

            confirmButtonColor: "#03e2ff"

        });

    }

};


// =======================================
// ABRIR MODAL
// =======================================

openModalButton.addEventListener("click", () => {

    if(!openModalButton.disabled){

        modal.style.display = "flex";

        iframe.src = "about.html";

    }

});


// =======================================
// CERRAR MODAL
// =======================================

closeModalButton.addEventListener("click", () => {

    modal.style.display = "none";

    iframe.src = "";

});


// =======================================
// CERRAR AFUERA
// =======================================

window.addEventListener("click", (event) => {

    if(event.target === modal){

        modal.style.display = "none";

        iframe.src = "";

    }

});


// =======================================
// ANIMACION TITULO
// =======================================

anime.timeline({

    loop: true

})

.add({

    targets: '.ml5 .line',

    opacity: [0.5,1],

    scaleX: [0,1],

    easing: "easeInOutExpo",

    duration: 700

})

.add({

    targets: '.ml5 .line',

    duration: 600,

    easing: "easeOutExpo",

    translateY: (el, i) => (-0.625 + 0.625*2*i) + "em"

})

.add({

    targets: '.ml5 .ampersand',

    opacity: [0,1],

    scaleY: [0.5,1],

    easing: "easeOutExpo",

    duration: 600,

    offset: '-=600'

})

.add({

    targets: '.ml5 .letters-left',

    opacity: [0,1],

    translateX: ["0.5em",0],

    easing: "easeOutExpo",

    duration: 600,

    offset: '-=300'

})

.add({

    targets: '.ml5 .letters-right',

    opacity: [0,1],

    translateX: ["-0.5em",0],

    easing: "easeOutExpo",

    duration: 600,

    offset: '-=600'

})

.add({

    targets: '.ml5',

    opacity: 0,

    duration: 1000,

    easing: "easeOutExpo",

    delay: 1000

});


// =======================================
// CONFETTI FELICIDADES
// =======================================

const confettiSettings = {

    target: 'confetti-canvas',

    max: 120,

    size: 1.5,

    animate: true,

    props: ['circle', 'square', 'triangle', 'line'],

    colors: [

        [255,255,255],

        [3,226,255],

        [0,37,200]

    ],

    clock: 25,

    rotate: true,

    width: window.innerWidth,

    height: window.innerHeight,

    start_from_edge: true,

    respawn: true

};


const confetti =
new ConfettiGenerator(confettiSettings);

confetti.render();


// =======================================
// INICIAR
// =======================================

countdown();

const timer =
setInterval(countdown, 1000);
