const students = [];

        document.getElementById('studentForm').addEventListener('submit', function (event) {
            event.preventDefault();
            addStudent();
        });

        function addStudent() {
            const lastName = document.getElementById('lastName').value.trim();
            const firstName = document.getElementById('firstName').value.trim();
            const middleName = document.getElementById('middleName').value.trim();
            const birthDate = new Date(document.getElementById('birthDate').value);
            const startYear = parseInt(document.getElementById('startYear').value);
            const faculty = document.getElementById('faculty').value.trim();
            const errorMessages = validateStudent(firstName, lastName, middleName, birthDate, startYear, faculty);

            if (errorMessages.length > 0) {
                document.getElementById('errorMessages').innerText = errorMessages.join('\n');
                return;
            } else {
                document.getElementById('errorMessages').innerText = '';
            }

            const student = {
                firstName,
                lastName,
                middleName,
                birthDate,
                startYear,
                faculty,
            };

            students.push(student);
            clearForm();
            renderTable();
        }

        function validateStudent(lastName, firstName, middleName, birthDate, startYear, faculty) {
            const errors = [];
            const currentDate = new Date();
            const startYearCurrent = new Date().getFullYear();

            if (!lastName || !firstName || !middleName || !faculty) {
                errors.push('Все поля обязательны для заполнения.');
            }

            if (birthDate < new Date('1900-01-01') || birthDate > currentDate) {
                errors.push('Дата рождения должна быть в диапазоне с 01.01.1900 до текущей даты.');
            }

            if (startYear < 2000 || startYear > startYearCurrent) {
                errors.push('Год начала обучения должен быть в диапазоне с 2000 до текущего года.');
            }

            return errors;
        }

        function clearForm() {
            document.getElementById('studentForm').reset();
        }

        function renderTable() {
            const tbody = document.getElementById('studentsTable').querySelector('tbody');
            tbody.innerHTML = '';

            const filteredStudents = filterStudents(students);

            filteredStudents.forEach(student => {
                const age = new Date().getFullYear() - student.birthDate.getFullYear();
                const endYear = student.startYear + 4;
                const currentYear = new Date().getFullYear();
                const course = currentYear >= endYear ? 'закончил' : `${currentYear - student.startYear} курс`;

                const row = `
                    <tr>
                        <td>${student.lastName} ${student.firstName} ${student.middleName}</td>
                        <td>${student.faculty}</td>
                        <td>${student.birthDate.toLocaleDateString('ru-RU')} (${age} лет)</td>
                        <td>${student.startYear}-${endYear} (${course})</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }

        function filterStudents(students) {
            const searchName = document.getElementById('searchName').value.trim().toLowerCase();
            const searchFaculty = document.getElementById('searchFaculty').value.trim().toLowerCase();
            const searchStartYear = parseInt(document.getElementById('searchStartYear').value);
            const searchEndYear = parseInt(document.getElementById('searchEndYear').value);

            return students.filter(student => {
                const fullName = `${student.lastName} ${student.firstName} ${student.middleName}`.toLowerCase();
                const matchesName = fullName.includes(searchName);
                const matchesFaculty = student.faculty.toLowerCase().includes(searchFaculty);
                const matchesStartYear = isNaN(searchStartYear) || student.startYear === searchStartYear;
                const matchesEndYear = isNaN(searchEndYear) || (student.startYear + 4) === searchEndYear;

                return matchesName && matchesFaculty && matchesStartYear && matchesEndYear;
            });
        }

        document.getElementById('searchName').addEventListener('input', renderTable);
        document.getElementById('searchFaculty').addEventListener('input', renderTable);
        document.getElementById('searchStartYear').addEventListener('input', renderTable);
        document.getElementById('searchEndYear').addEventListener('input', renderTable);

        let sortedField = 'fullName';
        let sortOrder = 'asc';

        function sortTable(field) {
            if (sortedField === field) {
                sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                sortedField = field;
                sortOrder = 'asc';
            }

            const sortedStudents = [...students].sort((a, b) => {
                let comparison = 0;
                if (field === 'fullName') {
                    comparison = `${a.lastName} ${a.firstName} ${a.middleName}`.localeCompare(`${b.lastName} ${b.firstName} ${b.middleName}`);
                } else if (field === 'faculty') {
                    comparison = a.faculty.localeCompare(b.faculty);
                } else if (field === 'birthDate') {
                    comparison = a.birthDate - b.birthDate;
                } else if (field === 'startYear') {
                    comparison = a.startYear - b.startYear;
                }

                return sortOrder === 'asc' ? comparison : -comparison;
            });

            renderSortedTable(sortedStudents);
        }

        function renderSortedTable(sortedStudents) {
            const tbody = document.getElementById('studentsTable').querySelector('tbody');
            tbody.innerHTML = '';

            sortedStudents.forEach(student => {
                const age = new Date().getFullYear() - student.birthDate.getFullYear();
                const endYear = student.startYear + 4;
                const currentYear = new Date().getFullYear();
                const course = currentYear >= endYear ? 'закончил' : `${currentYear - student.startYear} курс`;

                const row = `
                    <tr>
                        <td>${student.lastName} ${student.firstName} ${student.middleName}</td>
                        <td>${student.faculty}</td>
                        <td>${student.birthDate.toLocaleDateString('ru-RU')} (${age} лет)</td>
                        <td>${student.startYear}-${endYear} (${course})</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }