var local = {
    vendedoras: ['Ada', 'Grace', 'Hedy', 'Sheryl'],
    ventas: [
        // tener en cuenta que Date guarda los meses del 0 (enero) al 11 (diciembre)
        { id: 1, fecha: new Date(2019, 1, 4), nombreVendedora: 'Grace', sucursal: 'Centro', componentes: ['Monitor GPRS 3000', 'Motherboard ASUS 1500'] },
        { id: 2, fecha: new Date(2019, 0, 1), nombreVendedora: 'Ada', sucursal: 'Centro', componentes: ['Monitor GPRS 3000', 'Motherboard ASUS 1500'] },
        { id: 3, fecha: new Date(2019, 0, 2), nombreVendedora: 'Grace', sucursal: 'Caballito', componentes: ['Monitor ASC 543', 'Motherboard MZI'] },
        { id: 4, fecha: new Date(2019, 0, 10), nombreVendedora: 'Ada', sucursal: 'Centro', componentes: ['Monitor ASC 543', 'Motherboard ASUS 1200'] },
        { id: 5, fecha: new Date(2019, 0, 12), nombreVendedora: 'Grace', sucursal: 'Caballito', componentes: ['Monitor GPRS 3000', 'Motherboard ASUS 1200'] }
    ],
    precios: [
        { componente: 'Monitor GPRS 3000', precio: 200 },
        { componente: 'Motherboard ASUS 1500', precio: 120 },
        { componente: 'Monitor ASC 543', precio: 250 },
        { componente: 'Motherboard ASUS 1200', precio: 100 },
        { componente: 'Motherboard MZI', precio: 30 },
        { componente: 'HDD Toyiva', precio: 90 },
        { componente: 'HDD Wezter Dishital', precio: 75 },
        { componente: 'RAM Quinston', precio: 110 },
        { componente: 'RAM Quinston Fury', precio: 230 }
    ],
    sucursales: ['Centro', 'Caballito']
};
// función que recibe un objeto que representa una venta, y retorna un string con el HTML

let idCard = local.ventas.length > 0 ? local.ventas[local.ventas.length - 1].id : 0;
const crearVentaHTML = venta => {
    return `
 <li class="venta" id="card - ${venta.id}">
      <div class="fecha">${venta.fecha.getDate()}/${venta.fecha.getMonth() + 1}/${venta.fecha.getFullYear()}</div>
     <div class="vendedora">${venta.nombreVendedora}</div>
     <div class="sucursal">${venta.sucursal}</div>
     <div class="componentes">${venta.componentes}</div>
     <div>${precioMaquina(venta.componentes)}</div>
     <div id="trash-icon" class="ventas-delete" onclick="showModalEliminar(${venta.id})"><i class="fas fa-trash"  "></i></div>
    </li>
 `;
};

const obtenerPrecioDelComponente = nombreComponente => {
    return local.precios.find(p => p.componente === nombreComponente).precio;
};
const precioMaquina = componentes => {
    return componentes.reduce((total, c) => total + obtenerPrecioDelComponente(c), 0);
};
const cantidadVentasComponente = componente => {
    return local.ventas.reduce((acc, v) => acc.concat(v.componentes), []).reduce((total, c) => (c === componente ? ++total : total), 0);
};

const vendedoraDelMes = (mes, anio) => {
    let maxImporte = 0;
    let maxNombreVendedora = '';
    // recorrer listado de vendedoras
    for (let i = 0; i < local.vendedoras.length; i++) {
        const vendedora = local.vendedoras[i];
        let totalVendido = 0;
        // ver cuanto vendió cada una
        // filtro las ventas por vendedora
        const ventasFiltradas = local.ventas.filter(venta => {
            return venta.nombreVendedora === vendedora && venta.fecha.getFullYear() === anio && venta.fecha.getMonth() + 1 === mes;
        });
        for (let j = 0; j < ventasFiltradas.length; j++) {
            const venta = ventasFiltradas[j];
            const importe = precioMaquina(venta.componentes);
            totalVendido += importe;
        }

        if (totalVendido > maxImporte) {
            maxImporte = totalVendido;
            maxNombreVendedora = vendedora;
        }
    }
    return maxNombreVendedora;
};
document.querySelector('.vendedora-mes').innerHTML += `Vendedora que mas ingreso genero: <strong> ${vendedoraDelMes()} </strong>`;
const ventasMes = (mes, anio) => {
    let total = 0;

    local.ventas.forEach(venta => {
        // checkear si la venta es del mes y anio que llegan por param
        if (venta.fecha.getFullYear() === anio && venta.fecha.getMonth() + 1 === mes) {
            total += precioMaquina(venta.componentes);
        }
    });

    return total;
};

const ventasVendedora = nombre => {
    let total = 0;

    local.ventas.forEach(venta => {
        if (venta.nombreVendedora === nombre) {
            total += precioMaquina(venta.componentes);
        }
    });

    return total;
};
const ventasSucursal = sucursal => {
    let totalSucursal = 0;
    local.ventas.forEach(venta => {
        if (venta.sucursal === sucursal) {
            totalSucursal += precioMaquina(venta.componentes);
        }
    });
    return parseInt(totalSucursal);
};
console.log(ventasSucursal('Centro'));

const componenteMasVendido = () => {
    document.querySelector('.producto-estrella-contenedor').innerHTML = '';
    let maxVentas = 0;
    let nombreComponente = '';
    local.precios.forEach(componentes => {
        const cadaComponente = cantidadVentasComponente(componentes.componente);
        if (cadaComponente > maxVentas) {
            maxVentas = cadaComponente;
            nombreComponente = componentes.componente;
        }
    });
    let componenteMasVendidoHTML = `
    <div class="producto-estrella">Producto estrella:  <strong>${nombreComponente} </strong></div>
    `;

    document.querySelector('.producto-estrella-contenedor').innerHTML += componenteMasVendidoHTML;
};
componenteMasVendido();
const huboVentas = (mes, anio) => {
    let ventasFecha;
    local.ventas.forEach(venta => {
        if (venta.fecha.getFullYear() === anio && venta.fecha.getMonth() + 1 === mes) {
            ventasFecha = true;
        } else {
            ventasFecha = false;
        }
    });
    return ventasFecha;
};

const sucursalDelMes = (mes, anio) => {
    let maxImporte = 0;
    let maxNombreSucursal = '';
    // recorrer listado de vendedoras
    local.ventas.forEach(venta => {
        const sucursal = venta.sucursal;
        let totalVendido = 0;

        const ventasFiltradas = local.ventas.filter(venta => {
            return venta.sucursal === sucursal && venta.fecha.getFullYear() === anio && venta.fecha.getMonth() + 1 === mes;
        });
        ventasFiltradas.forEach(ventaF => {
            const venta = ventaF;
            const importe = precioMaquina(venta.componentes);
            totalVendido += importe;
        });

        if (totalVendido > maxImporte) {
            maxImporte = totalVendido;
            maxNombreSucursal = sucursal;
        }
    });

    return maxNombreSucursal;
};
const showModal = modal => {
    document.querySelector('#modal-nueva-venta').classList.add('active');
};
const closeModal = modal => {
    document.querySelector('#modal-nueva-venta').classList.remove('active');
};
document.querySelector('.btn-ventas-header').onclick = showModal;
document.querySelector('.modal-header-close').onclick = closeModal;
document.querySelector('.modal-footer-cancelar').onclick = closeModal;

const agregarNuevaVenta = () => {
    let valueVendedora = document.querySelector('#vendedora').value;
    let valueSucursal = document.querySelector('#sucursal').value;
    let valueComponentes = Array.from(document.querySelector('#componente').selectedOptions).map(option => option.value);
    let fechaVenta = new Date();
    let totalPrecio = parseInt(precioMaquina(valueComponentes));

    const nuevaVenta = {
        id: ++idCard,
        fecha: fechaVenta,
        nombreVendedora: valueVendedora,
        sucursal: valueSucursal,
        componentes: valueComponentes
    };
    local.ventas.push(nuevaVenta);

    const nuevaVentaHTML = `
    <li class="venta" id="card - ${nuevaVenta.id}">
     <div class="fecha">${fechaVenta.getDate()}/${fechaVenta.getMonth() + 1}/${fechaVenta.getFullYear()}</div>
     <div class="vendedora">${valueVendedora}</div>
     <div class="sucursal">${valueSucursal}</div>
     <div class="componentes">${valueComponentes}</div>
     <div class="total">${totalPrecio}</div> 
     <div id="trash-icon" class="ventas-delete" onclick="showModalEliminar(${nuevaVenta.id})"><i class="fas fa-trash"  "></i></div>
 </li>
    `;
    document.getElementById('ventas').innerHTML += nuevaVentaHTML;

    closeModal();
    document.querySelector('#vendedora').value = '';
    document.querySelector('#sucursal').value = '';
    document.querySelector('#componente').value = '';

    ventasSucursalHTML();
    componenteMasVendido();
};

document.querySelector('.modal-footer-submit').onclick = agregarNuevaVenta;
let idEliminar;
const showModalEliminar = id => {
    document.querySelector('#modal-eliminar').classList.add('active');
    idEliminar = id;
};
const closeModalEliminar = modal => {
    document.querySelector('#modal-eliminar').classList.remove('active');
};

document.querySelector('#modal-footer-cancelar-eliminar').onclick = closeModalEliminar;
document.querySelector('.modal-header-close-eliminar').onclick = closeModalEliminar;

const eliminarVenta = id => {
    local.ventas.forEach((venta, i) => {
        if (idEliminar === venta.id) {
            local.ventas.splice(i, 1);
            document.getElementById(`card - ${idEliminar}`).remove();
        }
    });
    closeModalEliminar();
    ventasSucursalHTML();
    componenteMasVendido();
};
document.querySelector('.modal-footer-eliminar').onclick = eliminarVenta;

const ventasSucursalHTML = sucursal => {
    document.getElementById('sucursales-ventas').innerHTML = '';
    local.sucursales.forEach(sucursal => {
        const sucursalesHTML = `
        <li class="sucursal-total">
        <div class="sucursal">${sucursal}</div>
        <div class="ventasSucursal">${ventasSucursal(sucursal)}</div>
        </li>
         `;
        const ulSucursal = document.getElementById('sucursales-ventas');
        ulSucursal.innerHTML += sucursalesHTML;
    });
};

ventasSucursalHTML();
const ventasHTML = local.ventas.map(crearVentaHTML);
const ul = document.getElementById('ventas');
ul.innerHTML = ventasHTML.join('');
