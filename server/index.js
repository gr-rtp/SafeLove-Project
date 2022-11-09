const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
require("dotenv").config();
const dbPool = require('./dbShae/dbShae');
const messagingRouter = require("./routes/messagingRouter");
const covidRouter= require("./routes/covidRouter");
const emailRouter = require("./routes/emailRouter")
const userRouter = require("./routes/userRouter");
const signupSignInRouter = require("./routes/signupSigninRouter");
const matchingRouter = require("./routes/matchingRouter");
const server = require('http').createServer(app);
const io = require('socket.io')(server, { transports: ["websocket", "polling"] , cors: {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
}, 
allowEIO3: true
});

const PORT = process.env.PORT || 3001;

app.use(cors());

app.use((req,res,next) => {
  req.pool = dbPool;
  next();
});

app.use(require('sanitize').middleware);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));

app.use('/messaging', messagingRouter);
app.use('/covid', covidRouter);
app.use('/user', userRouter);
app.use('/', emailRouter);

app.use('/auth', signupSignInRouter);
app.use('/dashboard', matchingRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});


io.on("connection", async (socket) => {
 

  const userID = socket.handshake.query.id;
  const query = `SELECT match_id FROM match WHERE person_1 = $1 
                 UNION 
                 SELECT match_id FROM match WHERE person_2 = $1;`;

  const { rows } = await dbPool.query(query, [userID])
  
  console.log(`user ID is ${userID}`);
  

  const matches = rows.map((element) => {
    return String(element.match_id);
  })



  await socket.join(matches);


  socket.on('disconnect', function(){
    console.log('A client has disconnected from the server');
  });

  socket.on("send_message", async (data) => {
 
    const insertQuery = `INSERT INTO message (match_id, sender, message, date_message) 
                         VALUES ($1, $2, $3, NOW())`;
    await dbPool.query(insertQuery, [data.messageData.convoID, data.messageData.sender, data.messageData.message]);
    socket.to(String(data.messageData.convoID)).emit("receive_message", data)
  })
});


server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
