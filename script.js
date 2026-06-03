// Инициализируем Телеграм WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Открываем приложение сразу на весь экран телефона

// Функция для переключения между главным меню и меню оплаты
function openScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Функция, которая срабатывает при нажатии на "Я оплатил"
function verifyPayment() {
    const usernameInput = document.getElementById('username-input').value.trim();
    
    if(!usernameInput) {
        alert('Пожалуйста, введите ваш Username!');
        return;
    }
    
    // Отправляем текст боту в чат. Бот перехватит это событие.
    tg.sendData(JSON.stringify({
        action: "check_payment", 
        username: usernameInput
    }));
    
    // Закрываем Web App окно
    tg.close();
}