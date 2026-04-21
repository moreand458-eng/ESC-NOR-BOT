conn.ev.on('messages.upsert', async (update) => {
    const msg = update.messages[0];
    if (!msg.message || msg.key.remoteJid !== 'status@broadcast') return;

    const me = await conn.decodeJid(conn.user.id);

    const emojis = [
      '😂', '🤣', '😍', '😎', '🔥', '❤️', '💀', '👻', '🤡', '🙈',
      '😅', '🤔', '👍', '👀', '✨', '💯', '🥲', '🫣', '🙃', '😴',
      '🤯', '🤨', '😳', '😈', '🥵', '🥶', '😇', '🫡', '😭', '🫥',
      '👽', '😬', '🤖', '💫', '🎃', '👑', '😐', '🤓', '😤', '😌',
      '🙄', '🥱', '👊', '🤝', '🙏', '😻', '💔', '🎉', '🌚', '🌝',
      '🌟', '🧠', '🦾', '🧸', '🐸', '🦄', '🐺', '🕊️', '📿', '🥷'
    ];

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    await conn.sendMessage(msg.key.remoteJid, {
        react: {
            text: randomEmoji,
            key: msg.key
        }
    }, {
        statusJidList: [msg.key.participant, me]
    });
});