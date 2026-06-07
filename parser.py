from telethon import TelegramClient, events
from flask import Flask, jsonify

app = Flask(__name__)
client = TelegramClient("session", 34095919, "6bca0d39ca281aee774f1161232d00b1")

# Хранилище последних лотов
latest_gifts = []

@client.on(events.NewMessage(chats=('username_канала_с_лотами')))
async def handler(event):
    # Логика парсинга текста сообщения
    # Например: gift = parse_message(event.raw_text)
    # latest_gifts.insert(0, gift)
    # Ограничиваем список, чтобы не перегружать память
    if len(latest_gifts) > 50: latest_gifts.pop()

@app.route('/get-gifts', methods=['GET'])
def get_gifts():
    return jsonify(latest_gifts)

# Запуск обоих процессов (API и клиента)
if __name__ == '__main__':
    import threading
    threading.Thread(target=lambda: client.start() and client.run_until_disconnected(), daemon=True).start()
    app.run(host='0.0.0.0', port=5000)