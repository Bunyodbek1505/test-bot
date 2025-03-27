const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");

const bot = new Telegraf("7818674851:AAGPo8K2nnx_4KGxJeFFASIqtBr_iRDfvjU");

const URL =
  "mongodb+srv://mongodb:bunyod@cluster0.utyt8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  firstName: String,
  lastName: String,
  userName: String,
  createAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
bot.start(async (ctx) => {
//   console.log(ctx.from);
  const { id, first_name, last_name, username } = ctx.from;

  let user = await User.findOne({ telegramId: id });

  if (!user) {
    // new user
    user = new User({
      telegramId: id,
      firstName: first_name || "",
      lastName: last_name || "",
      userName: username || "",
    });

    await user.save();
    ctx.reply(`Welcome, ${first_name}!`);
  } else {
    ctx.reply(`Welcome back, ${first_name}!`);
  }
});

async function sendMessageAllUsers(message) {
  try {
    const users = await User.find();
    for (const user of users) {
      await bot.telegram.sendMessage(user.telegramId, message);
    }
  } catch (error) {
    console.log(error);
  }
}

bot.command("send", async (ctx) => {
  // const message = ctx.update.message.text.split(" ").slice(1).join(" ");
  const adminId = 5062564022;
  const message = "Hammaga Salom";
  await sendMessageAllUsers(message);
  ctx.reply("Message sent to all users!");
});

bot.launch();
