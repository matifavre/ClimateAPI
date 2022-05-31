const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

// load es similar a DOMcontent loaded pero carga en window
window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima)
})

function buscarClima(e){
    e.preventDefault();

    //validar formulario
    const ciudad = document.querySelector('#ciudad').value; //.value para obtener el valor del usuario
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === ''){
    mostrarError('Ambos campos son obligatorios')
    
    return;
    }

    //Consultar API
    consultarAPI(ciudad,pais);
}

function mostrarError(mensaje){
    //validar para evitar acumulacion de mensajes
    const alerta = document.querySelector('.bg-red-100');
    if(!alerta){
    //cear alerta 
    const alerta = document.createElement('div');
    alerta.classList.add('bg-red-100', 'border-red-500','text-red-700','px-4','py-3','rounded','max-w-md','mx-auto','mt-6','text-center');
    alerta.innerHTML = `
        <strong class ='font-bold'>Error!</strong>
        <span class ='block'>${mensaje}</span>
    `;
    container.appendChild(alerta);
    
    setTimeout(()=>{
        alerta.remove()
        },5000);
    }
}

function consultarAPI(ciudad,pais){
    
    const appId = 'f5495f17a533ca74aea6742d2a3e1033';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
    // Mostrar Spinner de carga antes del fetch
    Spinner();
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML(); // Limpiar HTML previo
            if(datos.cod === '404'){
                mostrarError('Ciudad no encontrada')
                return;
            }
            // Imprime la respuesta en el HTML
            mostrarClima(datos);
        })
}
function mostrarClima(datos){
    // destructuring de un objeto dentro de otro objeto
    const {name,main:{temp, temp_max,temp_min}} = datos;

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);
    
    const nombreCiudad = document.createElement('p')
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl')

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl')
    
    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML =`Max: ${max}&#8451;`;
    actual.classList.add('text-xl')

    const tempMinima = document.createElement('p')
    tempMinima.innerHTML =`Min: ${min}&#8451;`;
    actual.classList.add('text-xl')

    const resultadoDiv = document.createElement('div')
    resultadoDiv.classList.add('text-center','text-white');
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);
}
//pasa de Kelvin a Centigrado
const kelvinACentigrados = grados => parseInt(grados - 273.15);

function limpiarHTML(){
    while (resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}
function Spinner(){
    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
    <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    </div>`;
    resultado.appendChild(divSpinner);

}