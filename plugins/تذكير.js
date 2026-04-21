import fetch from 'node-fetch';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';

const REMINDERS_FOLDER = './database';
const REMINDERS_FILE = `${REMINDERS_FOLDER}/reminders.json`;

let handler = async (m, { conn, text }) => {
    if (!text) {
        return conn.reply(
            m.chat,
            `❌ يرجى كتابة الأمر بالشكل التالي:\n\n.تذكير 201104213887 الباقة السعر الأيام\n\nمثال:\n.تذكير 201104213887 الباقةالذهبية 100 30`,
            m
        );
    }

    const args = text.trim().split(/\s+/);
    if (args.length < 4) {
        return conn.reply(
            m.chat,
            `❌ البيانات غير كاملة.\n\nاكتب بالشكل التالي:\n.تذكير 201104213887 الباقة السعر الأيام\n\nمثال:\n.تذكير 201104213887 الباقةالذهبية 100 30`,
            m
        );
    }

    const [userNumber, packageName, price, days] = args;

    if (!/^[\d+]{7,15}$/.test(userNumber)) {
        return conn.reply(
            m.chat,
            `❌ الرقم غير صالح. يرجى إدخال رقم صحيح.\n\nمثال:\n.تذكير 201104213887 الباقةالذهبية 100 30`,
            m
        );
    }

    const reminderData = {
        userNumber,
        packageName,
        price,
        days: parseInt(days),
        startDate: new Date(),
    };

    conn.reply(
        `${userNumber}@s.whatsapp.net`,
        generateReminderMessage(reminderData),
        null
    );

    conn.reply(
        m.chat,
        `✅ تم بدء التذكير للمستخدم ${userNumber} بالباقه ${packageName} كل دقيقة لمدة ${days} يوم.`,
        m
    );

    saveReminder(reminderData);
    startAutomaticReminder(conn, reminderData);
};

handler.command = /^تذكير$/i;
handler.help = ['تذكير <رقم> <الباقة> <السعر> <الأيام>'];
handler.tags = ['reminder'];
handler.owner = true;
export default handler;

function generateReminderMessage(subscription) {
    const currentDate = new Date();
    const endDate = new Date(subscription.startDate);
    endDate.setDate(endDate.getDate() + subscription.days);

    const timeDifference = endDate - currentDate;

    if (timeDifference > 0) {
        const remainingMinutes = Math.floor(timeDifference / (1000 * 60));
        const remainingHours = Math.floor(remainingMinutes / 60);
        const remainingDays = Math.floor(remainingHours / 24);

        return `🚀 *تذكير بالاشتراك 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 HOST💀* 🔔

📞 *رقم المستخدم:* ${subscription.userNumber}
📦 *الباقة:* ${subscription.packageName}
💵 *السعر:* ${subscription.price}$
⏳ *الوقت المتبقي:* ${remainingDays} يوم - ${remainingHours % 24} ساعة - ${remainingMinutes % 60} دقيقة

📌 *يرجى التجديد قبل انتهاء الاشتراك!*`;
    } else {
        return `⚠️ *انتهى اشتراكك في ${subscription.packageName}. يرجى التجديد!*`;
    }
}

function startAutomaticReminder(conn, subscription) {
    const interval = setInterval(() => {
        const currentDate = new Date();
        const endDate = new Date(subscription.startDate);
        endDate.setDate(endDate.getDate() + subscription.days);

        const lastReminderTime = getLastReminderTime(subscription.userNumber);

        if (currentDate >= endDate) {
            clearInterval(interval);
            conn.reply(
                `${subscription.userNumber}@s.whatsapp.net`,
                `⚠️ *انتهى اشتراكك في ${subscription.packageName}. يرجى التجديد!*`,
                null
            );
            removeReminder(subscription);
        } else if (currentDate >= lastReminderTime) {
            conn.reply(
                `${subscription.userNumber}@s.whatsapp.net`,
                generateReminderMessage(subscription),
                null
            );
            logReminderMessage(subscription, generateReminderMessage(subscription));
        }
    }, 60 * 1000); // كل دقيقة
}

function saveReminder(subscription) {
    const userFolder = ensureUserFolder(subscription.userNumber);
    const reminderFile = `${userFolder}/reminder.json`;
    writeFileSync(reminderFile, JSON.stringify(subscription, null, 2));
}

function logReminderMessage(subscription, message) {
    const userFolder = ensureUserFolder(subscription.userNumber);
    const messagesFile = `${userFolder}/messages.json`;

    let messages = [];
    if (existsSync(messagesFile)) {
        messages = JSON.parse(readFileSync(messagesFile));
    }

    messages.push({
        timestamp: new Date().toISOString(),
        message: message,
    });

    writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
}

function ensureUserFolder(userNumber) {
    const userFolder = `${REMINDERS_FOLDER}/${userNumber}`;
    if (!existsSync(userFolder)) {
        mkdirSync(userFolder, { recursive: true });
    }
    return userFolder;
}

function getLastReminderTime(userNumber) {
    const userFolder = `${REMINDERS_FOLDER}/${userNumber}`;
    const messagesFile = `${userFolder}/messages.json`;
    if (existsSync(messagesFile)) {
        const messages = JSON.parse(readFileSync(messagesFile));
        if (messages.length > 0) {
            return new Date(messages[messages.length - 1].timestamp);
        }
    }
    return new Date();
}

function removeReminder(subscription) {
    const userFolder = `${REMINDERS_FOLDER}/${subscription.userNumber}`;
    const reminderFile = `${userFolder}/reminder.json`;
    if (existsSync(reminderFile)) {
        unlinkSync(reminderFile);
    }
}