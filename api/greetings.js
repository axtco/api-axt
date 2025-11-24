const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors());

// --- DATA: 100+ Messages ---
const greetings = [
    // AXT & Flight Themes
    "Good Morning, AXT Pilot! ✈️",
    "Systems online. Ready for greatness. 🚀",
    "Welcome back to the cockpit. 🛫",
    "Altitude looks good. Keep climbing! 📈",
    "AXT Control to Pilot: You are cleared for takeoff. 🎙️",
    "The sky is not the limit, it's just the view. 🌌",
    "Full throttle today! 🔥",
    "Navigation set to 'Success'. 🧭",
    "Wheels up! Let's code. 🛞",
    "Turbulence is just a bumpy road to a smooth landing. ☁️",

    // Coding & Dev Humor
    "Hello! Remember to drink water while you code. 💧",
    "Greetings! Today is a perfect day to debug. 🐛",
    "Error 404: Bad mood not found. Have a great day! 😄",
    "Loading success... 100% Complete. ✅",
    "Code is poetry. Write a masterpiece. ✍️",
    "Every bug is just an undocumented feature. 😉",
    "Keep calm and git push. 🐙",
    "May your code compile on the first try! 🍀",
    "It works on my machine! 🤷‍♂️",
    "Eat. Sleep. Code. Repeat. 🔄",
    "Comments are for the weak. (Just kidding, document your code!) 📝",
    "Beware of the infinite loop... ♾️",
    "Semicolons save lives. ;",
    "You are the CSS to my HTML. 🎨",
    "Ctrl+C, Ctrl+V is a legitimate skill. 📋",
    "99 little bugs in the code, 99 little bugs... 🐛",
    "Real programmers count from 0. 0️⃣",
    "Coffee: A developer's fuel. ☕",
    "A clean commit history is a thing of beauty. ✨",
    "Warning: Developer at work. Do not disturb. 🚧",
    
    // Motivation & Grind
    "Focus. Build. Deploy. You got this! 🔥",
    "Stay curious, keep learning! 📚",
    "Believe in yourself and your code! ✨",
    "Innovation starts with a single line of code. 💡",
    "Small progress is still progress. 🐢",
    "Don't wish for it, work for it. 🔨",
    "Your potential is endless. 🌟",
    "Make today so awesome yesterday gets jealous. 😎",
    "Dream big, code bigger. 💭",
    "Consistency is key. 🗝️",
    "Hard work beats talent when talent doesn't work hard. 💪",
    "The best time to start was yesterday. The next best time is now. ⏳",
    "Success is a journey, not a destination. 🗺️",
    "Turn your 'cant's' into 'cans'. 🥫",
    "Don't stop until you're proud. 🏆",
    "Great things never came from comfort zones. ⛰️",
    "Wake up with determination. Go to bed with satisfaction. 🛏️",
    "You are stronger than you think. 🏋️‍♂️",
    "Mistakes are proof that you are trying. ❌",
    "Be the energy you want to attract. 🧲",

    // Wisdom & Philosophy
    "The best way to predict the future is to create it. 🔮",
    "Simplicity is the ultimate sophistication. 🧘",
    "Knowledge is power. 🧠",
    "Time is money. Spend it wisely. 💰",
    "Quality over quantity. Always. 💎",
    "Patience is a virtue, especially in async functions. ⏳",
    "Learn from yesterday, live for today, hope for tomorrow. 🌅",
    "Happiness depends upon ourselves. 😊",
    "Be the change you wish to see in the world. 🌍",
    "In the middle of difficulty lies opportunity. 🚪",
    "The only true wisdom is in knowing you know nothing. 🦉",
    "Do what you love, love what you do. ❤️",
    "Action speaks louder than words. 📢",
    "Trust the process. ⚙️",
    "Everything happens for a reason. 🌈",

    // Friendly & Casual
    "Hey there! Hope you have a fantastic day! 👋",
    "Sending you positive vibes! 〰️",
    "You look great today! (I can't see you, but I assume). 🕶️",
    "High five! ✋",
    "Let's make some magic happen. 🪄",
    "Don't forget to stretch! 🙆‍♂️",
    "Take a deep breath. You're doing fine. 🌬️",
    "Smile! It confuses people. 😁",
    "What's cooking, good looking? 🍳",
    "Have a spectacular day! 🎇",
    "You are awesome! Keep being you. 🦄",
    "Life is short. Eat the cake. 🍰",
    "Be kind to yourself today. 🌸",
    "Spread kindness like confetti. 🎉",
    "Today is a fresh start. 🌱",

    // Short & Punchy
    "Let's go! 🚀",
    "Keep going. ➡️",
    "Never settle. ⚓",
    "Be bold. 🦁",
    "Create value. 💎",
    "Ship it. 📦",
    "Level up. 🆙",
    "Game on. 🎮",
    "Stay sharp. 🔪",
    "Think different. 🍎",
    "Just do it. ✔️",
    "Carpe Diem. 📅",
    "Focus. 🎯",
    "Breathe. 🧘‍♀️",
    "Win. 🏅"
];

app.get('/api/greetings', (req, res) => {
    // Pick a random message
    const randomMessage = greetings[Math.floor(Math.random() * greetings.length)];
    
    res.json({
        status: "success",
        message: randomMessage,
        count: greetings.length,
        timestamp: new Date().toISOString()
    });
});

// Export the app for Vercel
module.exports = app;
