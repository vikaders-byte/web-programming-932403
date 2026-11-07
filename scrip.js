/*var arWeekHours=[5, 21, 17, 10, 2, 26];

//Работа prompt и alert
var nam=prompt("Как вас зовут?", "Имя");
if (nam !== null) {
    alert("Приветствую, " + nam + "!");
}
else{
    alert("Представьтесь в следующий раз :)");
}

//Цикл с маленьким числом часов
var counOfLowHours = 0;
for (var i=0; i<arWeekHours.length; i++){
    if (arWeekHours[i]<=5) counOfLowHours++;
}
procOfLowHours = counOfLowHours/arWeekHours.length*100;

//Функция суммирования
function sumHour(hours) {
    var res=0;
    for (var index = 0; index < hours.length; index++) {
        res = res + hours[index];
    }
    return res;
}

//Функция фильтрации
function filtWeeks(hours) {
    var count = 0;
    for (var i=0; i< hours.length; i++){
        if (hours[i]>15) count++;
    }
    return count;
}

//Поиск максимума
function maxHour(hours){
    var maxh=hours[0];
    for (var i=1; i< hours.length; i++){
        if (hours[i]>maxh) maxh=hours[i];
    }
    return maxh;
}

alert("Всего отработано " + sumHour(arWeekHours) + " часов, в " + filtWeeks(arWeekHours)+ " неделях нагрузка была высокой.");

//Вывод в консоль
console.log("Процент недель с малым участием: "+procOfLowHours + ". Количество таких недель: " +counOfLowHours);

//Дополнительное задание
if (sumHour(arWeekHours) > 50) {
    console.log("Вы настоящий герой общества!");
}
*/

// Предлагаемые акции -----
var defaultActions = [
    
    {
        name: "Собрание клуба",
        date: "2026-10-10",
        description: "Еженедельное собрание клуба настольных игр.",
        role: "организатор",
        participated: false
    },
    {
        name: "Помощь в приюте",
        date: "2026-09-17",
        description: "Привоз корма в приют, уход за животными.",
        role: "волонтер",
        participated: false
    },
    {
        name: "Субботник",
        date: "2026-10-03",
        description: "Уборка территории дома от листвы и мусора.",
        role: "участник",
        participated: false
    }
];

// ----- Ключи localStorage -----
var STORAGE_KEY_ACTIONS       = 'volunteer_actions';
var STORAGE_KEY_THEME         = 'volunteer_theme';
var STORAGE_KEY_ACTIONS_VIS   = 'volunteer_actions_visible';

// Запуск всех процессов
document.addEventListener('DOMContentLoaded', function () {
    try {
        restoreTheme();              // 1. Восстановить тему
        restoreActions();            // 2. Восстановить акции
        restoreActionsVisibility();  // 3. Восстановить видимость секции
        attachEventListeners();      // 4. Навесить обработчики
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        showError('Ошибка при загрузке: ' + error.message);
    }
});

// Переключение темы
function restoreTheme() {
    var saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'dark') {
        document.body.classList.add('dark-theme');
        updateThemeButton(true);
    }
}

function toggleTheme() {
    try {
        var body = document.querySelector('body');
        if (!body) throw new Error('Элемент <body> не найден');

        body.classList.toggle('dark-theme');
        var isDark = body.classList.contains('dark-theme');

        localStorage.setItem(STORAGE_KEY_THEME, isDark ? 'dark' : 'light');
        updateThemeButton(isDark);
    } catch (error) {
        console.error('Ошибка переключения темы:', error);
        showError('Не удалось переключить тему: ' + error.message);
    }
}

function updateThemeButton(isDark) {
    var btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.textContent = isDark ? 'Светлая тема' : 'Тёмная тема';
    }
}

// Работа с акциями (добавление, удаление, участие)
function restoreActions() {
    var saved = localStorage.getItem(STORAGE_KEY_ACTIONS);
    var actions;
    if (saved) {
        try {
            actions = JSON.parse(saved);
        } catch (e) {
            console.error('Ошибка парсинга акций:', e);
            actions = defaultActions.slice();
        }
    } else {
        actions = defaultActions.slice();
    }

    renderActions(actions);
}

function renderActions(actions) {
    var list = document.getElementById('actions-list');
    if (!list) {
        console.error('Контейнер акций не найден');
        return;
    }

    list.innerHTML = ''; // очистка

    actions.forEach(function (action, index) {
        var card = createActionCard(action, index);
        list.appendChild(card);
    });
}

function createActionCard(action, index) {
    var card = document.createElement('div');
    card.className = 'action-card';
    card.setAttribute('data-index', index);
    card.setAttribute('data-name', action.name);

    // Заголовок
    var title = document.createElement('h3');
    title.className = 'art_m_text';
    title.textContent = action.name;

    // Дата через <time>
    var timeEl = document.createElement('time');
    timeEl.setAttribute('datetime', action.date);
    timeEl.textContent = formatDate(action.date);

    // Роль
    var role = document.createElement('p');
    role.textContent = 'Роль: ' + action.role;

    // Описание
    var desc = document.createElement('p');
    desc.textContent = action.description;

    // Кнопка "Участвовал"
    var partBtn = document.createElement('button');
    partBtn.type = 'button';
    partBtn.className = 'card-btn' + (action.participated ? ' participated' : '');
    partBtn.textContent = action.participated ? '✓ Участвовал' : 'Участвовал';
    partBtn.addEventListener('click', function () {
        toggleParticipated(index);
    });

    // Кнопка "Удалить"
    var delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'card-btn delete-btn';
    delBtn.textContent = '🗑 Удалить';
    delBtn.addEventListener('click', function () {
        deleteAction(index);
    });

    card.appendChild(title);
    card.appendChild(timeEl);
    card.appendChild(role);
    card.appendChild(desc);
    card.appendChild(partBtn);
    card.appendChild(delBtn);

    return card;
}

function formatDate(dateStr) {
    var months = ['января','февраля','марта','апреля','мая','июня',
                  'июля','августа','сентября','октября','ноября','декабря'];
    var d = new Date(dateStr);
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

function addAction() {
    try {
        var name = prompt('Введите название акции:');
        if (name === null) return;
        if (!name.trim()) throw new Error('Название не может быть пустым');

        var date = prompt('Введите дату (формат ГГГГ-ММ-ДД, например 2026-11-15):');
        if (date === null) return;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
            throw new Error('Неверный формат даты. Используйте ГГГГ-ММ-ДД');
        }

        var role = prompt('Ваша роль (участник/организатор/волонтёр):', 'участник');
        if (role === null) return;
        role = role.trim() || 'участник';

        var desc = prompt('Описание акции:');
        if (desc === null) return;
        if (!desc.trim()) throw new Error('Описание не может быть пустым');

        var actions = getActions();
        actions.push({
            name: name.trim(),
            date: date.trim(),
            role: role,
            description: desc.trim(),
            participated: false
        });

        saveActions(actions);
        renderActions(actions);
        console.log('Акция добавлена:', name);
    } catch (error) {
        console.error('Ошибка добавления:', error);
        showError('Ошибка: ' + error.message);
    }
}

function toggleParticipated(index) {
    try {
        var actions = getActions();
        if (index < 0 || index >= actions.length) {
            throw new Error('Неверный индекс акции');
        }
        actions[index].participated = !actions[index].participated;
        saveActions(actions);
        renderActions(actions);
    } catch (error) {
        console.error('Ошибка участия:', error);
        showError('Ошибка: ' + error.message);
    }
}

function deleteAction(index) {
    try {
        if (!confirm('Удалить эту акцию?')) return;

        var actions = getActions();
        if (index < 0 || index >= actions.length) {
            throw new Error('Неверный индекс акции');
        }

        var removed = actions.splice(index, 1)[0];
        saveActions(actions);
        renderActions(actions);
        console.log('🗑 Акция удалена:', removed.name);
    } catch (error) {
        console.error('Ошибка удаления:', error);
        showError('Ошибка: ' + error.message);
    }
}

function getActions() {
    var saved = localStorage.getItem(STORAGE_KEY_ACTIONS);
    if (saved) {
        try { return JSON.parse(saved); } catch (e) { return defaultActions.slice(); }
    }
    return defaultActions.slice();
}

function saveActions(actions) {
    localStorage.setItem(STORAGE_KEY_ACTIONS, JSON.stringify(actions));
}

// Скрытие и показ акций
function restoreActionsVisibility() {
    var saved = localStorage.getItem(STORAGE_KEY_ACTIONS_VIS);
    var section = document.getElementById('actions-list');
    var btn = document.getElementById('toggle-actions-btn');
    if (!section || !btn) return;

    if (saved === 'false') {
        section.classList.add('hidden');
        btn.textContent = 'Показать акции';
    }
}

function toggleActionsVisibility() {
    try {
        var section = document.getElementById('actions-list');
        var btn = document.getElementById('toggle-actions-btn');

        if (!section) throw new Error('Секция акций не найдена');
        if (!btn)     throw new Error('Кнопка переключения не найдена');

        section.classList.toggle('hidden');
        var isVisible = !section.classList.contains('hidden');

        btn.textContent = isVisible ? 'Скрыть акции' : 'Показать акции';
        localStorage.setItem(STORAGE_KEY_ACTIONS_VIS, isVisible);
    } catch (error) {
        console.error('Ошибка видимости:', error);
        showError('Ошибка: ' + error.message);
    }
}

// Обработка событий
function attachEventListeners() {
    // getElementById
    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // querySelector
    var addBtn = document.querySelector('#add-action-btn');
    if (addBtn) addBtn.addEventListener('click', addAction);

    // querySelectorAll (демонстрация — берём первый элемент коллекции)
    var toggleBtns = document.querySelectorAll('#toggle-actions-btn');
    if (toggleBtns.length > 0) {
        toggleBtns[0].addEventListener('click', toggleActionsVisibility);
    }

    // Форма обратной связи
    var form = document.getElementById('feedback-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            try {
                var nameInp    = document.getElementById('name-input');
                var emailInp   = document.getElementById('email-input');
                var messageInp = document.getElementById('message-input');

                if (!nameInp || !emailInp || !messageInp) {
                    throw new Error('Поля формы не найдены');
                }
                if (!nameInp.value.trim() || !emailInp.value.trim() || !messageInp.value.trim()) {
                    throw new Error('Заполните все поля');
                }

                alert('Спасибо, ' + nameInp.value + '! Сообщение отправлено.');
                form.reset();
            } catch (error) {
                console.error('Ошибка формы:', error);
                showError('Ошибка: ' + error.message);
            }
        });
    }
}

// Показ сообщений об ошибке
function showError(message) {
    var main = document.querySelector('main');
    if (!main) return;

    var div = document.createElement('div');
    div.className = 'error-message';
    div.setAttribute('role', 'alert');
    div.textContent = '⚠ ' + message;

    main.insertBefore(div, main.firstChild);

    setTimeout(function () {
        if (div.parentNode) div.parentNode.removeChild(div);
    }, 5000);
}