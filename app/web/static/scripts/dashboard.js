document.addEventListener('DOMContentLoaded', () => {
    const serviceButtons = document.querySelectorAll('.service-select-button');

    serviceButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            // Remove 'selected' class from all buttons
            serviceButtons.forEach(btn => btn.classList.remove('selected'));

            // Add 'selected' class to the clicked button
            event.target.classList.add('selected');
            
            const service = event.target.getAttribute('data-service');

            try {
                // Fetch tables for the selected service
                const response = await fetch(`/dashboard/tables?service=${service}`);
                const tables = await response.json();

                const serviceHeader = document.querySelector('.service-data-header');
                const serviceContent = document.querySelector('.service-data-content');

                if (response.ok && tables.length > 0) {
                    // Clear previous header and content
                    serviceHeader.innerHTML = '';
                    serviceContent.innerHTML = '<p class="flash-message">Выберите таблицу, чтобы увидеть данные.</p>';

                    // Render buttons for tables
                    tables.forEach(table => {
                        const tableButton = document.createElement('button');
                        tableButton.className = 'table-select-button';
                        tableButton.textContent = table.name;
                        tableButton.dataset.table = table.name;

                        // Attach event listener to fetch table data
                        tableButton.addEventListener('click', async (event) => {
                            const tableButtons = document.querySelectorAll('.table-select-button');
                            tableButtons.forEach(btn => btn.classList.remove('selected'));
                            event.target.classList.add('selected');

                            await fetchTableData(service, table.name)
                        });

                        serviceHeader.appendChild(tableButton);
                    });
                } else {
                    serviceHeader.innerHTML = '<p class="flash-message error">Нет доступных таблиц для данного сервиса.</p>';
                    serviceContent.innerHTML = '';
                }
            } catch (error) {
                console.error('Error fetching tables:', error);
                const serviceHeader = document.querySelector('.service-data-header');
                serviceHeader.innerHTML = '<p class="flash-message error">Произошла ошибка. Пожалуйста, попробуйте еще раз.</p>';
            };
        });
    });
});

async function fetchTableData(service, table) {
    try {
        const response = await fetch(`/dashboard/table?service=${service}&table=${table}`);
        const data = await response.json();

        const serviceData = document.querySelector('.service-data-content');
        serviceData.innerHTML = '';

        columnOrder = [];

        if (service === 'services' && table === 'users') {
            columnOrder = [
                'telegram_id',
                'services_name',
                'services_role',
                'rate',
                'experience',
                'services_registration_date'
            ]
        };

        if (response.ok && data.length > 0) {
            const tableElement = document.createElement('table');
            tableElement.className = 'data-table';

            const headerRow = document.createElement('tr');
            headerRow.className = 'data-table-header';
            columnOrder.forEach(column => {
                const th = document.createElement('th');
                th.textContent = column;
                headerRow.appendChild(th);
            })
            tableElement.appendChild(headerRow);

            data.forEach(row => {
                const tableRow = document.createElement('tr');
                tableRow.className = 'data-table-row';
                columnOrder.forEach(column => {
                    const td = document.createElement('td');
                    td.textContent = row[column] || '';
                    tableRow.appendChild(td);
                })
            tableElement.appendChild(tableRow);
        });

            serviceData.appendChild(tableElement);
        } else {
            serviceData.innerHTML = '<p class="flash-message error">Нет данных для данной таблицы.</p>';
        }
    } catch (error) {
        console.error('Error fetching table data:', error);
        const serviceData = document.querySelector('.service-data-content');
        serviceData.innerHTML = '<p class="flash-message error">Произошла ошибка. Пожалуйста, попробуйте еще раз.</p>';
    };
};