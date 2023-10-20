'use strict'

const modalClose = () => {
    clearFieldsEvento();
    document.getElementById('myModal2').classList.remove('show');
    document.getElementById('myModal2').style.display = 'none';
    document.querySelector('.modal-backdrop').remove();
};

const openModal = () => {
    document.getElementById('myModal2').classList.add('show');
    document.getElementById('myModal2').style.display = 'block';

    document.body.classList.add('modal-open');
    const modalBackdrop = document.createElement('div');
    modalBackdrop.classList.add('modal-backdrop', 'show');
    document.body.appendChild(modalBackdrop);
};

const getLocStorage = () => JSON.parse(localStorage.getItem('db_evento')) ?? [];
const setLocStorage = (dbEvento) => localStorage.setItem('db_evento', JSON.stringify(dbEvento));

const createEvento = (objeto) => {
    const dbEvento = getLocStorage();
    dbEvento.push(objeto);
    setLocStorage(dbEvento);
};

const readEvento = () => getLocStorage();

const updateEvento = (index, objeto) => {
    const dbEvento = readEvento();
    dbEvento[index] = objeto;
    setLocStorage(dbEvento);
};

const deleteEvento = (index) => {
    const dbEvento = readEvento();
    dbEvento.splice(index, 1);
    setLocStorage(dbEvento);
};

const isValidFieldsEvento = () => {
    return document.getElementById('formEvento').reportValidity();
};

const clearFieldsEvento = () => {
    const fields = document.querySelectorAll('.form-control');
    fields.forEach(field => {
        field.value = '';
    });
};

const saveEvento = () => {
    if (isValidFieldsEvento()) {
        const evento = {
            servidor: document.getElementById('servidor').options[document.getElementById('servidor').selectedIndex].text,
            evento: document.getElementById('evento').value,
            data: document.getElementById('data').value,
            inicio: document.getElementById('inicio').value,
            fim: document.getElementById('fim').value
        };

        const index = document.getElementById('evento').getAttribute('data-index');

        //const index = document.getElementById('evento').dataset.index;

        if(index === 'novo'){
            createEvento(evento);
            updateTableEvento();
            modalClose();
            location.reload();
        } else {
          updateEvento(index, evento);
          updateTableEvento();
          modalClose();
          location.reload();
        }
    }
};

//console.log(servidor);


const createRowEvento = (evento, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML =  `
        <td>${evento.servidor}</td>
        <td>${evento.evento}</td>
        <td>${evento.data}</td>
        <td>${evento.inicio}</td>
        <td>${evento.fim}</td>
        <td>
            <button class="btn btn-primary" style="background-color: #526D82; border: none;" id="editEvento-${index}">
            <i class="fa-regular fa-pen-to-square"></i>
            </button>
        </td>
        <td>
            <button class="btn btn-danger" id="deleteEvento-${index}">
            <i class="fa-solid fa-trash-can"></i>
            </button>
        </td>`;

    document.querySelector('#tbEvento>tbody').appendChild(newRow);
};

const clearTableEvento = () => {
    const rows = document.querySelectorAll('#tbEvento>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
};

const preencherCamposEvento = (evento) => {
    document.getElementById('servidor').value = evento.text;
    document.getElementById('evento').value = evento.evento;
    document.getElementById('data').value = evento.data;
    document.getElementById('inicio').value = evento.inicio;
    document.getElementById('fim').value = evento.fim;
    document.getElementById('evento').dataset.index = evento.index;
};

const updateTableEvento = () => {
    const dbEvento = readEvento();
    clearTableEvento();
    dbEvento.forEach((evento, index) => {
        createRowEvento(evento, index);
        const editButton = document.getElementById(`editEvento-${index}`);
        editButton.addEventListener('click', () => editEvento(index));
    });
};

const editEvento = (index) => {
    const evento = readEvento()[index];
    evento.index = index;
    preencherCamposEvento(evento);
    openModal();
};

const editDeleteEvento = (event) => {
    if (event.target.tagName === 'BUTTON') {
        const buttonId = event.target.id;
        const [action, index] = buttonId.split('-');
        if (action == 'editEvento') {
            editEvento(index);
        } else if (action == 'deleteEvento') {
            const evento = readEvento()[index];
            const response = confirm(`Deseja excluir o Evento de ${evento.nome}?`);
            if (response) {
                deleteEvento(index);
                updateTableEvento();
            }
        }
    }
};


updateTableEvento();

document.getElementById('salvar2').addEventListener('click', saveEvento);

document.querySelector('#tbEvento>tbody').addEventListener('click', editDeleteEvento);


document.getElementById('cancelar2').addEventListener('click', modalClose);