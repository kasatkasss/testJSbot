require('dotenv').config();
const {Bot, GrammyError, HttpError, Keyboard, InlineKeyboard} = require('grammy');

const {hydrate} = require('@grammyjs/hydrate');

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

// bot.command('start', async (ctx) => {
//     await ctx.reply('Привет, я - бот', {
//         reply_parameters: {message_id: ctx.msg.message_id}
//     })
// })

bot.command('start', async (ctx) => {
    await ctx.react('👀')
    await ctx.reply('Привет, я \\- бот\\. Не смотри: ||ну емае||', {
        parse_mode: 'MarkdownV2'
    })
})

let evaPaidLessons = 4;
let giorgiPaidLessons = 3;
let irakliPaidLessons = 1;

// if(evaPaidLessons <=4){
//     bot.api.sendMessage(962297208, 'Необходимо оплатить');
// }
const menuKeyboard = new InlineKeyboard().text('Список учеников', 'studentsList').row().text('Посещаемость(для учителей)', 'visitOrNot').row().text('Добавить уроки', 'addLessons')
const studenPaidLessonsKeyboard = new InlineKeyboard().text('Эва', 'evaInfo').text('Иракли', 'irakliInfo').text('Гиорги', 'giorgiInfo')
const studentsAttendanceKeyboard = new InlineKeyboard().text('Эва', 'evaPaidLessons').text('Иракли', 'irakliPaidLessons').text('Гиорги', 'giorgiPaidLessons')
const daNetKeyboard = new InlineKeyboard().text('✅', '+').text('❌', '-').text('Назад', 'back')
const addLessonsKeyboard = new InlineKeyboard().text('Эва', 'evaAdd').text('Иракли', 'irakliAdd').text('Гиорги', 'giorgiAdd')

bot.command('menu', async (ctx) => {
    await ctx.reply('Выберите действие', {
        reply_markup: menuKeyboard,
    })

})

bot.callbackQuery('studentsList', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.callbackQuery.message.editText('Список учеников', {
        reply_markup: studenPaidLessonsKeyboard
    })
    
})

bot.callbackQuery('evaInfo', async (ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.reply(`Оплаченных уроков : ${evaPaidLessons}`)
})

bot.callbackQuery('giorgiInfo', async (ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.reply(`Giorgi's paid lessons: ${giorgiPaidLessons}`)
})

bot.callbackQuery('irakliInfo', async (ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.reply(`Irakli's paid lessons: ${irakliPaidLessons}`)
})


bot.callbackQuery('visitOrNot', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.callbackQuery.message.editText('Список учеников', {
        reply_markup: studentsAttendanceKeyboard
    })
    
})

bot.callbackQuery('evaPaidLessons', async (ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.callbackQuery.message.editText('Урок состоялся?', {
        reply_markup: daNetKeyboard
    })
})

bot.callbackQuery('+', async (ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.reply(`Eva's paid lessons: ${evaPaidLessons-1}`, {
        parse_mode: 'MarkdownV2'
    })
})

bot.callbackQuery('-', async (ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.reply(`Eva's paid lessons: ${evaPaidLessons}`, {
        parse_mode: 'MarkdownV2'
    })
})

bot.callbackQuery('back', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.callbackQuery.message.editText('Список студентов', {
        reply_markup: studentsAttendanceKeyboard,
    })
})

bot.callbackQuery('addLessons', async (ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.reply('Список учеников', {
        reply_markup: addLessonsKeyboard
    })
})

bot.callbackQuery('evaAdd', async (ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.callbackQuery.message.editText('Введите количество уроков, которое хотите добавить: ')
})


bot.command('mood', async (ctx) => {
    // const moodKeyboard = new Keyboard().text('Отлично').row().text('Норм').row().text('bad').resized()  //можно .oneTime()

    const moodLabels = ['Отлично', 'Норм', 'bad']
    const rows = moodLabels.map((label) => {
        return[
            Keyboard.text(label)
        ]
    })
    const moodKeyboard2 = Keyboard.from(rows).resized().oneTime( )
    await ctx.reply('How is your mood today', {
        reply_markup: moodKeyboard2
    })
})

bot.hears('bad', async (ctx) => {
    await ctx.reply('очень жаль', {
        reply_markup: {remove_keyboard: true}
    })
})

bot.command('inline_keyboard', async (ctx) => {
    // const inlineKeyboard = new InlineKeyboard().text('1', 'button-1').row().text('2', 'button-2').row().text('3', 'button-3')
    const inlineKeyboard2 = new InlineKeyboard().url('Ссылка на видео', 'https://www.youtube.com/watch?v=q-AFR0D7Vuw')
    await ctx.reply('Please choose a button', {
        reply_markup: inlineKeyboard2
    })
})

// bot.callbackQuery(['button-1', 'button-2', 'button-3'], async (ctx) => {   //  /button-[1-3]
//     await ctx.answerCallbackQuery('you choose button 1-2-3')
//     await ctx.reply('you choose button 1-2-3')
// })

// bot.on('callback_query:data', async (ctx) => {
//     await ctx.answerCallbackQuery()
//     await ctx.reply(`You choose: ${ctx.callbackQuery.data}`)
// })

bot.command('share', async (ctx) => {
    const shareKeyboard = new Keyboard().requestContact('Ваш контакт').requestLocation('Локация')
    .placeholder('Please share your data').resized()
        await ctx.reply('Поделитесь данными', {
            reply_markup: shareKeyboard
        })
})

bot.on(':contact', async (ctx) => {
    await ctx.reply('Спасибо за контакт', {
        reply_markup: {remove_keyboard: true}
    })
})
// bot.on('msg').filter((ctx) => {
//     return ctx.from.id === 1398354352                // реагирует на сообщения любого типа(медиа и т.д.)
// }, async (ctx) => {
//     await ctx.reply('это я')
// })

// bot.on('message:voice', async (ctx) => {
//     await ctx.reply('я получил голосовое сообщение')
// })

// bot.on(':photo').on('::hashtag', async (ctx) => {
//     await ctx.reply('media+hashtag')
// })

// bot.on('message:photo', async (ctx) => {
//     await ctx.reply('я получил картинку')
// })

// bot.on('message:entities:url', async (ctx) => {                 //bot.on('::url') - сокращение    bot.on([':media', '::url']) - это как ИЛИ
//     await ctx.reply('я получил ссылку')
// })

// bot.on('message', async (ctx) => {
//     await ctx.reply('Надо подумать...')
// })


// bot.hears('ID', async (ctx) => {
//     await ctx.reply(`Your id: ${ctx.from.id}`);                     //как узнать свой айди
// })








bot.api.setMyCommands([
    {
        command: 'start',
        description: 'запускает бота',
    },
    {
        command: 'hello',
        description: 'получить приветствие',
    },
    {
        command: 'cat',
        description: 'попробуй',
    },
    {
        command : 'getvideo',
        description: 'получаем видео Волка',
    },
    {
        command : 'share',
        description: 'поделитесь данными',
    },
    {
        command : 'mood',
        description: 'нажми bad',
    },
    {
        command : 'inline_keyboard',
        description: 'Инлайн клавиатура',
    },
    {
        command: 'menu',
        description: 'Получить меню',
    },
])

bot.command(['say_Hello', 'hello', 'hi'], async (ctx) => {
    await ctx.reply('*He*_llo_\\!', {
        parse_mode: 'MarkdownV2'
    })
})

bot.command('getvideo', async (ctx) => {
    await ctx.reply('Свежее видео Волка: [link](https://www.youtube.com/watch?v=nTTY0J_k6A0)', {
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: false
    })
})

bot.command('cat', async (ctx) => {
    await ctx.reply('ты мой *шшшшшшладкий* кот', {
        parse_mode: 'MarkdownV2'
    })
})


bot.hears('ping', async (ctx) => {              //пробелы не имеют значения, также можно массив слов передавать
    await ctx.reply('я здесь')
})

bot.hears(/попа/, async (ctx) => {              //если такое слово есть - отреагирует
    await ctx.reply('даааааа')
})

function calculatePaidLessons(string) {
    if(string === "+"){
        evaPaidLessons = evaPaidLessons-1;
    }
}



bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;

    if(e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    }
    else if( e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    }
    else{
        console.error("Unknown error:", e);
    }
})

bot.start();