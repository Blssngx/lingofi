require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const passwordResetRoutes = require("./routes/passwordReset");
const walletKeyRoutes = require("./routes/walletKey");
const sendGasRoutes = require("./routes/getGas");
const sendTokenRoutes = require("./routes/getTokenReward");
const claimGasRoutes = require("./routes/getGasReward");
const claimTokenRoutes = require("./routes/claimTokenReward");
const checkIfRewardClaimed = require("./routes/rewarded");
const createString = require("./routes/string");
const getString = require("./routes/getString");
const getStringInfo = require("./routes/getStringInfo");

// database connection
connection();

// List of allowed origins
const allowedOrigins = ['https://chat.lingofi.com'];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// middlewares
app.use(express.json());
app.use(cors(corsOptions));

// routes
app.get('/', (req, res) => res.send('Welcome to the Lingofi API!'));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordResetRoutes);
app.use("/api/walletKey", walletKeyRoutes);
app.use("/api/gas", sendGasRoutes);
app.use("/api/token", sendTokenRoutes);
app.use("/api/claimGas", claimGasRoutes);
app.use("/api/claimToken", claimTokenRoutes);
app.use("/api/rewarded", checkIfRewardClaimed);
app.use("/api/string", createString);
app.use("/api/getString", getString);
app.use("/api/getStringInfo", getStringInfo);
app.use("/api/users", require("./routes/usersList"));

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
