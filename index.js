const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')

const token = '1053636667:AAHGYtul03UXQhJvRXZiK_SmK4BDnahbOpU';

const bot = new TelegramApi(token, {polling: true});
const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Зараз я загадую цифру від 0 до 9, а Ви спробуєте її вгадати');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Вгадуйте!', gameOptions);
}


const start = () => {
    
    bot.setMyCommands([
        {command: '/start', description: 'Привітання'},
        {command: '/info', description: 'Дані про користувача'},
        {command: '/game', description: 'Гра - вгадай число'}
    
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp')
            return bot.sendMessage(chatId, 'Вітаю в телеграм каналі Юних Техніків');
        }
    
        if(text === '/info') {
            return bot.sendMessage(chatId, `Вас звати ${msg.from.first_name} ${msg.from.last_name}`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я Вас не розумію. Спробуйте ще раз!');
    
    });

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]){
            return bot.sendMessage(chatId, `Вітаю, Ви відгадали цифру ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Нажаль Ви не відгадали, бот загадав цифру ${chats[chatId]}`, againOptions);
        }
    });

}

start();