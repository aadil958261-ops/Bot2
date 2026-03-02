const moment = require('moment-timezone');

module.exports.config = {
    name: 'autosend',
    version: '10.02',
    hasPermission: 3,
    credits: '**Kashif Raza**',
    description: 'Automatically send Islamic messages, Quran verses, and prayer reminders!',
    commandCategory: 'Admin',
    usages: '[]',
    cooldowns: 3,
    images: [],
};

const islamicMessages = [
    // Fajr Prayer Time - 4:52 AM
    {
        timer: '04:52:00',
        message: ['🕌 **Fajr Prayer Time** 🕌\n\nاَللّٰهُمَّ بَارِكْ لَنَا فِيْمَا رَزَقْتَنَا\n"O Allah, bless us in what You have provided us"\n\n⏰ Time for Fajr prayer has begun\n🤲 May Allah accept your prayers\n\n**By Attaullah**']
    },
    // Sunrise - 6:10 AM  
    {
        timer: '06:10:00',
        message: ['🌅 **Good Morning** 🌅\n\nاَلْحَمْدُ لِلّٰهِ الَّذِيْ أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُوْرُ\n"All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection"\n\n🌸 Start your day with Allah\'s blessings\n🤲 May this morning bring you peace and joy\n\n**By Attaullah**']
    },
    // Morning Quran Verse - 7:00 AM
    {
        timer: '07:00:00',
        message: ['📖 **Morning Quran Verse** 📖\n\nوَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا\n"And whoever fears Allah - He will make for him a way out"\n\n📍 Surah At-Talaq (65:2)\n🌟 Allah always provides a solution for those who fear Him\n\n**By Attaullah**']
    },
    // Morning Greeting - 8:00 AM
    {
        timer: '08:00:00',
        message: ['🌸 **Assalamu Alaikum** 🌸\n\nMay Allah bless your morning with His infinite mercy and grace\n\n🤲 Remember Allah in the morning and evening\n💫 Let your day be filled with good deeds\n🌺 Start with Bismillah and end with Alhamdulillah\n\n**By Attaullah**']
    },
    // Mid-Morning - 9:00 AM
    {
        timer: '09:00:00',
        message: ['📿 **Morning Dhikr** 📿\n\nسُبْحَانَ اللهِ وَبِحَمْدِهِ\n"Glory is to Allah and praise is to Him"\n\n✨ Say this 100 times for countless rewards\n🌟 Let your tongue be moist with Allah\'s remembrance\n\n**By Attaullah**']
    },
    // Dhuhr Prayer - 12:20 PM
    {
        timer: '12:20:00',
        message: ['🕌 **Dhuhr Prayer Time** 🕌\n\nرَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ\n"Our Lord, give us good in this world and good in the next world, and save us from the punishment of the Fire"\n\n⏰ Time for Dhuhr prayer\n🤲 May Allah accept your prayers\n\n**By Attaullah**']
    },
    // Afternoon Greeting - 1:00 PM
    {
        timer: '13:00:00',
        message: ['☀️ **Good Afternoon** ☀️\n\nMay Allah bless your afternoon with peace and productivity\n\n🌟 Remember to make dua during blessed times\n💫 Keep your heart connected to Allah\n🤲 Every moment is a gift from Allah\n\n**By Attaullah**']
    },
    // Afternoon Quran - 2:00 PM
    {
        timer: '14:00:00',
        message: ['📖 **Afternoon Quran Verse** 📖\n\nوَاذْكُر رَّبَّكَ كَثِيرًا وَسَبِّحْ بِالْعَشِيِّ وَالْإِبْكَارِ\n"And remember your Lord much and exalt [Him with praise] in the evening and the morning"\n\n📍 Surah Al-Imran (3:41)\n🤲 Constant remembrance brings peace to the heart\n\n**By Attaullah**']
    },
    // Asr Prayer - 4:46 PM
    {
        timer: '16:46:00',
        message: ['🕌 **Asr Prayer Time** 🕌\n\nاللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ\n"O Allah, help me to remember You, to thank You, and to worship You in the best manner"\n\n⏰ Time for Asr prayer\n🌅 The blessed afternoon prayer\n\n**By Attaullah**']
    },
    // Evening Greeting - 6:00 PM
    {
        timer: '18:00:00',
        message: ['🌆 **Good Evening** 🌆\n\nMay Allah bless your evening with tranquility and reflection\n\n🌙 As the sun sets, remember Allah\'s countless blessings\n✨ Let your evening be filled with gratitude\n🤲 Prepare your heart for Maghrib prayer\n\n**By Attaullah**']
    },
    // Maghrib Prayer - 6:30 PM
    {
        timer: '18:30:00',
        message: ['🕌 **Maghrib Prayer Time** 🕌\n\nاللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ\n"O Allah, bless us in what You have provided us and protect us from the punishment of the Fire"\n\n🌅 Time for Maghrib prayer\n🤲 Break your fast if you\'re fasting\n\n**By Attaullah**']
    },
    // Evening Quran - 7:00 PM
    {
        timer: '19:00:00',
        message: ['📖 **Evening Quran Verse** 📖\n\nوَهُوَ الَّذِي يُنَزِّلُ الْغَيْثَ مِن بَعْدِ مَا قَنَطُوا وَيَنشُرُ رَحْمَتَهُ\n"And it is He who sends down the rain after they had despaired and spreads His mercy"\n\n📍 Surah Ash-Shura (42:28)\n💫 Allah\'s mercy comes when we need it most\n\n**By Attaullah**']
    },
    // Isha Prayer - 7:48 PM
    {
        timer: '19:48:00',
        message: ['🕌 **Isha Prayer Time** 🕌\n\nاللَّهُمَّ أَجِرْنِي مِنَ النَّارِ\n"O Allah, protect me from the Fire"\n\n🌙 Time for Isha prayer - the night prayer\n✨ End your day in worship and gratitude\n\n**By Attaullah**']
    },
    // Night Greeting - 9:00 PM
    {
        timer: '21:00:00',
        message: ['🌙 **Good Night** 🌙\n\nMay Allah grant you peaceful sleep and blessed dreams\n\n🤲 Remember to recite Ayat-ul-Kursi before sleep\n✨ Ask Allah for forgiveness before you rest\n💫 May angels guard you through the night\n\n**By Attaullah**']
    },
    // Night Dhikr - 10:00 PM
    {
        timer: '22:00:00',
        message: ['🌃 **Night Dhikr** 🌃\n\nأَسْتَغْفِرُ اللهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ\n"I seek forgiveness from Allah, none has the right to be worshipped except Him, the Ever Living, the Sustainer of all existence, and I repent to Him"\n\n🤲 Perfect for night-time istighfar\n\n**By Attaullah**']
    },
    // Late Night - 11:00 PM
    {
        timer: '23:00:00',
        message: ['🌌 **Night Reflection** 🌌\n\nاللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي\n"O Allah, You are forgiving and You love forgiveness, so forgive me"\n\n🌙 End your day seeking Allah\'s forgiveness\n💫 Prepare your soul for tomorrow\n\n**By Attaullah**']
    },
    // Midnight - 12:00 AM
    {
        timer: '00:00:00',
        message: ['🌃 **Midnight Blessing** 🌃\n\nاللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ\n"O Allah, You are my Lord, none has the right to be worshipped except You"\n\n🌙 A new day begins with Allah\'s name\n🤲 May this night bring you closer to Allah\n\n**By Attaullah**']
    }
];

module.exports.onLoad = o => setInterval(async () => {
    const r = a => a[Math.floor(Math.random() * a.length)];
    const currentTime = moment().tz('Asia/Karachi').format('HH:mm:ss');

    if (á = islamicMessages.find(i => i.timer === currentTime)) {
        const gio = moment().tz('Asia/Karachi').format('HH:mm:ss || DD/MM/YYYY');

        var msg = r(á.message);

        msg = {
            body: `⚝──⭒─⭑─⭒──⚝\n${msg}\n⚝──⭒─⭑─⭒──⚝`,
        };

        global.data.allThreadID.forEach(i => o.api.sendMessage(msg, i));
    }
}, 1000);

module.exports.run = () => {};
