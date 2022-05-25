
const init = () => {


    //cargaCiudades();

    $("#modalIngresarCodigoUnico").on('hidden.bs.modal', function () {

        //Limpiamos campos de modal y ocultamos alerta de modal
        document.querySelector("#codigoUnicoUsuario").value = "";
        document.querySelector("#idUsuarioRedimirPremio").value = "";
        document.querySelector("#alertCodigoUsuario").classList.add('d-none');
    });


    /*const formBuscar = document.querySelector("#frm_buscar_usuario");

    formBuscar.addEventListener('submit', event => {
        event.preventDefault();

        let cedula = document.querySelector("#cedula").value;
        let ciudad = document.querySelector("#selectCiudad").value;
        let tienda = document.querySelector("#selectTienda").value;

        let alertaBusquedaUsuario = document.querySelector("#alertBusquedaUsuario");
        let alertUsuarioRedimido = document.querySelector("#alertUsuarioRedimido");

        alertUsuarioRedimido.classList.add('d-none');


        if(cedula == "" || ciudad == 0 || tienda == 0){
            alertaBusquedaUsuario.innerHTML = 'Para realizar la búsqueda debe diligenciar todos los campos';
            alertaBusquedaUsuario.classList.remove('d-none');
            return;
        }else{
            document.querySelector("#alertBusquedaUsuario").classList.add('d-none');
        }

        const datos = {
            cedula,
            ciudad,
            tienda
        }

        //realizamos el fetch
         fetch('buscar_usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(jsonRespuesta => {

            let tablaUsuarioEncontrado = document.getElementById('tablaBusquedaUsuario');

            //Limpiamos el body de la tabla
            tablaUsuarioEncontrado.innerHTML = "";

            if(jsonRespuesta.usuarioEncontrado.length == 0){
                alertaBusquedaUsuario.innerHTML = 'No se ha encontrado el usuario que intenta buscar';
                alertaBusquedaUsuario.classList.remove('d-none');
                tablaUsuarioEncontrado.classList.add('d-none');
                return;
            }else{

                alertaBusquedaUsuario.classList.add('d-none');
                tablaUsuarioEncontrado.classList.remove('d-none');

                //seteamos los valores en la tabla
                for(let usuario in jsonRespuesta.usuarioEncontrado){

                    //document.querySelector('#idUsuarioEncontrado').value = jsonRespuesta.usuarioEncontrado[usuario].userID;

                    let row = tablaUsuarioEncontrado.insertRow();
                    let cell1_cedula = row.insertCell(0);
                    let cell2_num_factura = row.insertCell(1);
                    let cell3_ciudad = row.insertCell(2);
                    let cell4_tienda = row.insertCell(3);
                    let cell5_premio = row.insertCell(4);
                    let cell6_accion = row.insertCell(5);

                    cell1_cedula.innerHTML = jsonRespuesta.usuarioEncontrado[usuario].cedula;
                    cell2_num_factura.innerHTML = jsonRespuesta.usuarioEncontrado[usuario].num_factura;
                    cell3_ciudad.innerHTML = jsonRespuesta.usuarioEncontrado[usuario].ciudad;
                    cell4_tienda.innerHTML = jsonRespuesta.usuarioEncontrado[usuario].tienda;
                    cell5_premio.innerHTML = jsonRespuesta.usuarioEncontrado[usuario].userID;
                    
                    if(!jsonRespuesta.usuarioEncontrado[usuario].estado_redimido){
                        cell6_accion.innerHTML = `
                        <button class="btn btn-danger btn-sm"
                         onclick="mostrarModalRedimirPremio('${jsonRespuesta.usuarioEncontrado[usuario].userID}'); return false;" 
                        id="${jsonRespuesta.usuarioEncontrado[usuario].userID}">Redimir</button>`;
                    }else{
                        cell6_accion.innerHTML = '<button class="btn btn-success btn-sm" onclick="return false;">Redimido</button>';
                    }
                }
            }
        })
        .catch(function(err) {
            console.log(err);
        });
    })*/
}
init();



const mostrarModalRedimirPremio = (id) => {
    document.querySelector("#idUsuarioRedimirPremio").value = id;
    //Mostramos modal para pedri codigo unico de usuario
    $("#modalIngresarCodigoUnico").modal("show");
}


function actualizaDatosFinalizaJuego(datos) {

    fetch('actualizardatosFinJuego',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(datos)
    })
    .then((response) => {
        //console.log(response)

        if(response.ok) {
            return true;
        }else{
            return false;
        }
    })
    .catch(function(err) {
        console.log(err);
    });
    
} 


const controlaModalesTutorialEcuador = (numModal) => {
    
    switch(numModal){
        case 1: 
            $('#modalTutorialEcuador_1').modal('hide');
            $('#modalTutorialEcuador_3').modal('hide');
            $('#modalTutorialEcuador_2').modal('show');
            break;
           
        case 2:
            $('#modalTutorialEcuador_1').modal('hide');
            $('#modalTutorialEcuador_2').modal('hide');
            $('#modalTutorialEcuador_3').modal('show');
            break;
    }
}


const controlaModalesTutorial = (numModal) => {
    
    switch(numModal){
        case 1: 
            $('#modalTutorial_1').modal('hide');
            $('#modalTutorial_3').modal('hide');
            $('#modalTutorial_2').modal('show');
            break;
           
        case 2:
            $('#modalTutorial_1').modal('hide');
            $('#modalTutorial_2').modal('hide');
            $('#modalTutorial_3').modal('show');
            break;
    }
}

/*const cargaCiudadesFetch = () => {

    let ciudades = new Array();

    let selectCiudades = document.querySelector('#selectCiudad');

    selectCiudades.innerHTML = "";

    fetch("../../stores/stores.json")

    .then(response => response.json())
    .then(json => {
        for(let registro in json){
            if(!ciudades.includes(json[registro].ciudad)){
                ciudades.push(json[registro].ciudad)
            }
        }
        ciudades = ciudades.sort();

        //Cargamos las ciudades en el Select
        selectCiudades.innerHTML = "<option value='0' select disable>Ciudad</option>";
        let htmlSelect = selectCiudades.innerHTML;

        for(let ciudad in ciudades){
            htmlSelect += `<option value='${ciudades[ciudad]}'>${ciudades[ciudad]}</option>`
        }
        
        selectCiudades.innerHTML = htmlSelect;
    });
}


const cargarTiendasFetch = () => {
     //Tomamos el valor de la ciudad
     let valorCiudad = document.querySelector('#selectCiudad').value;

     if(valorCiudad != "0") {
         document.querySelector('#selectTienda').disabled = false;
     }else{
         document.querySelector('#selectTienda').disabled = true;
         return;
     }
 
     let tiendasPorCiudad = new Array();
     let selectTiendas = document.querySelector('#selectTienda');

    fetch("../../stores/stores.json")
     .then(response => response.json())
     .then(json => {
         for(let registro in json){
             if(json[registro].ciudad === valorCiudad){
                 tiendasPorCiudad.push(json[registro].nombre_cliente);
             }
         }
         tiendasPorCiudad = tiendasPorCiudad.sort();

         //Cargamos las tiendas en el Select
         selectTiendas.innerHTML = "<option value='0' select disable>Tienda</option>";
         let htmlSelect = selectTiendas.innerHTML;

         for(let tienda in tiendasPorCiudad){
             htmlSelect += `<option value='${tiendasPorCiudad[tienda]}'>${tiendasPorCiudad[tienda]}</option>`
         }
         
         selectTiendas.innerHTML = htmlSelect;
     });
}


const validaCodigoUsuario = async () => {

    let idUsuarioRedimirPremio = document.querySelector("#idUsuarioRedimirPremio").value;
    let codigoUnicoUsuario = document.querySelector("#codigoUnicoUsuario").value;

    //limpiamos las cadenas de texto
    idUsuarioRedimirPremio = idUsuarioRedimirPremio.trim();
    codigoUnicoUsuario = codigoUnicoUsuario.trim();

    let alertCodigoUsuario = document.querySelector("#alertCodigoUsuario");

    if(codigoUnicoUsuario === ""){
        alertCodigoUsuario.innerHTML = "Debe ingresar el código único de usuario";
        alertCodigoUsuario.classList.remove('d-none');
        return;
    }
    
    alertCodigoUsuario.classList.remove('d-none');

    const datos = {
        idUsuarioRedimirPremio,
        codigoUnicoUsuario,
    }

    await fetch('valida_codigo_usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(jsonRespuesta => {
        //Si existe algun error de respuesta lo pintanmos en la alerta
        if(!jsonRespuesta.ok){
            alertCodigoUsuario.innerHTML = jsonRespuesta.msg;
            return;
        }
        
        //Redimimos el premio
        redimirPremioFetch(idUsuarioRedimirPremio, jsonRespuesta.usuarioExiste)

    })
    .catch(function(err) {
        console.log(err);
    });
}
      

const redimirPremioFetch = (id, usuarioExiste) => {
    fetch('redimir/'+id,{
        method: 'POST',
        body: id
    })
    .then((response) => {
        console.log(response)


        if(response.ok) {

            //limpiamos campos del modal de redimir
            document.querySelector('#codigoUnicoUsuario').value = "";
            document.querySelector('#idUsuarioRedimirPremio').value = "";
            
             //Cerramos modal 
            $("#modalIngresarCodigoUnico").modal("hide");

            //Mostramos alerta de success
            let alertSuccess = document.querySelector('#alertUsuarioRedimido');
            alertSuccess.innerHTML = `Bono de factura ${usuarioExiste.num_factura} para la tienda ${usuarioExiste.tienda} de la ciudad de ${usuarioExiste.ciudad} redimido correctamente`;
            alertSuccess.classList.remove('d-none');

            let btn = document.getElementById(id);
            btn.classList.remove('btn-danger');
            btn.classList.add('btn-success');
            btn.innerHTML = 'Redimido';
            btn.removeAttribute("onclick");
        } 
    })
    .catch(function(err) {
        console.log(err);
    });
}*/






