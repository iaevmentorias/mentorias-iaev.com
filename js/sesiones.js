document.addEventListener("DOMContentLoaded", () => {
    const selectMonth = document.getElementById("select-month");
    const inputYear = document.getElementById("input-year");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");
    const calendarDays = document.getElementById("calendar-days");

    // Elementos del Modal
    const modal = document.getElementById("event-modal");
    const modalClose = document.getElementById("modal-close");
    const modalDateText = document.getElementById("modal-date-text");
    const eventText = document.getElementById("event-text");
    const eventForm = document.getElementById("event-form");
    const btnDelete = document.getElementById("btn-delete");

    let currentDate = new Date();
    let selectedDateKey = null;

    // Objeto local para guardar eventos (Persistencia en localStorage)
    let events = JSON.parse(localStorage.getItem("iaev_calendar_events")) || {};

    function saveEvents() {
        localStorage.setItem("iaev_calendar_events", JSON.stringify(events));
    }

    function renderCalendar() {
        const month = parseInt(selectMonth.value);
        const year = parseInt(inputYear.value);

        calendarDays.innerHTML = "";

        // Obtener primer día de la semana del mes y total de días
        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        // Rellenar celdas vacías del mes anterior
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.classList.add("calendar-cell", "empty");
            calendarDays.appendChild(emptyCell);
        }

        // Renderizar los días del mes
        const today = new Date();
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement("div");
            dayCell.classList.add("calendar-cell");

            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Comprobar si es el día de hoy
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            
            let dayNumberHTML = `<span class="day-num ${isToday ? 'day-today' : ''}">${day}</span>`;
            
            // Verificar si hay evento/aviso guardado en esa fecha
            let eventHTML = "";
            if (events[dateKey]) {
                eventHTML = `<div class="event-tag" title="${events[dateKey]}">⚠️ ${events[dateKey]}</div>`;
            }

            dayCell.innerHTML = dayNumberHTML + eventHTML;

            // Al hacer clic en un día, abrir modal para editar/añadir
            dayCell.addEventListener("click", () => {
                openModal(dateKey, day, month, year);
            });

            calendarDays.appendChild(dayCell);
        }
    }

    function openModal(dateKey, day, month, year) {
        selectedDateKey = dateKey;
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        
        modalDateText.textContent = `Fecha: ${day} de ${monthNames[month]} de ${year}`;
        eventText.value = events[dateKey] || "";
        
        btnDelete.style.display = events[dateKey] ? "block" : "none";
        modal.style.display = "flex";
    }

    function closeModal() {
        modal.style.display = "none";
        selectedDateKey = null;
    }

    // Eventos de los botones de control
    selectMonth.addEventListener("change", renderCalendar);
    inputYear.addEventListener("change", renderCalendar);

    btnPrev.addEventListener("click", () => {
        let month = parseInt(selectMonth.value) - 1;
        let year = parseInt(inputYear.value);
        if (month < 0) {
            month = 11;
            year--;
        }
        selectMonth.value = month;
        inputYear.value = year;
        renderCalendar();
    });

    btnNext.addEventListener("click", () => {
        let month = parseInt(selectMonth.value) + 1;
        let year = parseInt(inputYear.value);
        if (month > 11) {
            month = 0;
            year++;
        }
        selectMonth.value = month;
        inputYear.value = year;
        renderCalendar();
    });

    // Guardar evento
    eventForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (selectedDateKey && eventText.value.trim() !== "") {
            events[selectedDateKey] = eventText.value.trim();
            saveEvents();
            renderCalendar();
            closeModal();
        }
    });

    // Eliminar evento
    btnDelete.addEventListener("click", () => {
        if (selectedDateKey && events[selectedDateKey]) {
            delete events[selectedDateKey];
            saveEvents();
            renderCalendar();
            closeModal();
        }
    });

    modalClose.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Inicializar con la fecha actual
    selectMonth.value = currentDate.getMonth();
    inputYear.value = currentDate.getFullYear();
    renderCalendar();
});