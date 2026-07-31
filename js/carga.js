const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const selectedFileInfo = document.getElementById('selectedFileInfo');
const btnSubir = document.getElementById('btnSubir');
const btnExportar = document.getElementById('btnExportar');
const previewContainer = document.getElementById('previewContainer');
const previewTable = document.getElementById('previewTable');

let archivoSeleccionado = null;

// Abrir el selector de archivos al hacer clic en el dropzone
dropzone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    manejarArchivo(e.target.files[0]);
  }
});

// Eventos de arrastrar y soltar
['dragenter', 'dragover'].forEach(eventName => {
  dropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.add('dragover');
  });
});

['dragleave', 'drop'].forEach(eventName => {
  dropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.remove('dragover');
  });
});

dropzone.addEventListener('drop', (e) => {
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    manejarArchivo(files[0]);
  }
});

function manejarArchivo(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  if (extension !== 'xlsx' && extension !== 'xls') {
    alert('Por favor selecciona un archivo de Excel válido (.xlsx o .xls)');
    return;
  }

  archivoSeleccionado = file;
  selectedFileInfo.innerHTML = `<i class="bi bi-file-earmark-excel"></i> ${file.name}`;
  btnSubir.disabled = false;
}

// Leer el archivo Excel al hacer clic en Subir
btnSubir.addEventListener('click', () => {
  if (!archivoSeleccionado) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const datosJSON = XLSX.utils.sheet_to_json(worksheet);

    console.log("Datos importados exitosamente:", datosJSON);
    renderizarTablaPreview(datosJSON);
  };

  reader.readAsArrayBuffer(archivoSeleccionado);
});

function renderizarTablaPreview(datos) {
  const thead = previewTable.querySelector('thead');
  const tbody = previewTable.querySelector('tbody');

  thead.innerHTML = '';
  tbody.innerHTML = '';

  if (datos.length === 0) {
    alert('El archivo no contiene filas con datos.');
    previewContainer.style.display = 'none';
    return;
  }

  const columnas = Object.keys(datos[0]);
  let trHead = '<tr>';
  columnas.forEach(col => trHead += `<th>${col}</th>`);
  trHead += '</tr>';
  thead.innerHTML = trHead;

  datos.forEach(fila => {
    let trBody = '<tr>';
    columnas.forEach(col => trBody += `<td>${fila[col] ?? ''}</td>`);
    trBody += '</tr>';
    tbody.innerHTML += trBody;
  });

  previewContainer.style.display = 'block';
}

// Exportar archivo Excel de ejemplo
btnExportar.addEventListener('click', () => {
  const datosEstudiantes = [
    { ID: 1, Matricula: "EST-2024-001", Nombre: "Juan Pérez", Estatus: "Activo" },
    { ID: 2, Matricula: "EST-2024-002", Nombre: "María Gómez", Estatus: "Activo" },
    { ID: 3, Matricula: "EST-2024-003", Nombre: "Carlos López", Estatus: "Pendiente" },
    { ID: 4, Matricula: "EST-2024-004", Nombre: "Ana Rodríguez", Estatus: "Activo" }
  ];

  const worksheet = XLSX.utils.json_to_sheet(datosEstudiantes);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");

  XLSX.writeFile(workbook, "Listado_Estudiantes.xlsx");
});