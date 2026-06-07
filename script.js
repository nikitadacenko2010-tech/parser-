const displayedGifts = new Set();
const SERVER_URL = 'https://your-server-address.com/get-gifts'; // Ваш API

async function fetchLiveUpdates() {
    try {
        const res = await fetch(SERVER_URL);
        const allGifts = await res.json();
        
        const feed = document.getElementById('feedContainer');
        
        allGifts.forEach(gift => {
            const giftKey = `${gift.seller_username}_${gift.number}`;
            
            if (!displayedGifts.has(giftKey)) {
                displayedGifts.add(giftKey);
                
                const post = document.createElement('div');
                post.className = 'post-card';
                post.innerHTML = `
                    <div class="channel-name">@${gift.seller_username}</div>
                    <div class="gift-title">🎁 ${gift.gift_name}</div>
                    <div class="gift-meta">№ ${gift.number}</div>
                    <div class="gift-price">⭐ ${gift.price} Stars</div>
                    <button class="seller-btn" onclick="window.Telegram.WebApp.openLink('https://t.me/${gift.seller_username}')">
                        👤 ПЕРЕЙТИ К ПРОДАВЦУ
                    </button>
                `;
                feed.prepend(post);
            }
        });
    } catch (err) {
        console.error("Ошибка обновления:", err);
    }
}

// Запуск с интервалом 10 секунд
setInterval(fetchLiveUpdates, 10000);
fetchLiveUpdates();
