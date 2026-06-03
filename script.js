// Инициализируем Телеграм WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Открываем приложение сразу на весь экран телефона

// ПОЛУЧАЕМ ЮЗЕРНЕЙМ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ ИЗ ТЕЛЕГРАМА
const currentUsername = tg.initDataUnsafe?.user?.username || "no_username";

// ========================================================
// НАСТРОЙКА: Сюда вставь актуальную ссылку из ngrok!
// ОБЯЗАТЕЛЬНО оставь в конце слэш /
// ========================================================
const BACKEND_URL = "https://ТВОЙ_АДРЕС_ИЗ_NGROK.ngrok-free.app/"; 

// Функция для переключения между экранами
function openScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// Переменная для хранения таймера обновления логов
let updateIntervalId = null;

// ФУНКЦИЯ, КОТОРАЯ СРАБАТЫВАЕТ ПРИ НАЖАТИИ НА ФИГУРУ «ЧАТЫ»
async function tryOpenChats() {
    try {
        // Отправляем запрос на твой локальный Python-сервер
        const response = await fetch(`${BACKEND_URL}api/chat_users?username=${currentUsername}`);
        const data = await response.json();

        // Если подписки нет — перекидывает на экран оплаты с тарифами (0.5 TON, 1 TON, 3 TON)
        if (data.error === "no_sub") {
            openScreen('pay-menu'); 
        } else if (data.users) {
            // Если ты уже выдал ему доступ через /prem — пускает в чат
            openScreen('parser-screen');
            renderUsers(data.users); // Показываем свежих продавцов

            // Включаем авто-обновление логов каждые 4 секунды
            if (updateIntervalId) clearInterval(updateIntervalId);
            updateIntervalId = setInterval(fetchLiveLogs, 4000);
        }
    } catch (error) {
        console.error("Ошибка подключения:", error);
        alert("Ошибка сервера. Убедись, что Python и ngrok запущены!");
    }
}

// ФУНКЦИЯ ДЛЯ ПОСТОЯННОГО ОБНОВЛЕНИЯ ЛОГОВ ВНУТРИ ЧАТА
async function fetchLiveLogs() {
    const parserScreen = document.getElementById('parser-screen');
    if (!parserScreen || !parserScreen.classList.contains('active')) {
        if (updateIntervalId) {
            clearInterval(updateIntervalId);
            updateIntervalId = null;
        }
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}api/chat_users?username=${currentUsername}`);
        const data = await response.json();
        if (data.users) {
            renderUsers(data.users);
        }
    } catch (error) {
        console.error("Ошибка обновления:", error);
    }
}

// ФУНКЦИЯ ОТРИСОВКИ ПРОДАВЦОВ (КНОПКА КУПИТЬ / НАПИСАТЬ)
function renderUsers(usersList) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    if (!usersList || usersList.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#666; margin-top:20px;">Ожидание свежих логов с маркета...</p>';
        return;
    }

    let htmlContent = "";
    usersList.forEach(user => {
        htmlContent += `
            <div class="user-msg-card">
                <div class="msg-user-info">👤 Продавец: @${user.username}</div>
                <div class="msg-gift-details">🎁 Выставил: <span>${user.gift}</span></div>
                <div class="msg-gift-details">💰 Цена: <span>${user.price}</span></div>
                <div class="msg-meta">${user.time}</div>
                <a class="btn-message-target" href="https://t.me/${user.username}" target="_blank">🛒 Купить</a>
            </div>
        `;
    });

    container.innerHTML = htmlContent;
}
