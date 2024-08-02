const express = require('express');
const connectDB = require('./config/config');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddlewares');
const messageRoutes = require('./routes/messageRoutes');
const path = require('path');
const { log } = require('console');
const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);


// app.listen returns the instance of http createServer
const server = app.listen(PORT, () => {
    console.log(`Sever is running on ${PORT}`);
})


//---------------Deployment--------------------//

const __dirname1 = path.resolve(__dirname, '..');


// console.log(__dirname1); // Should print the path to the parent directory of `backend` and `frontend`
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React frontend build directory
    app.use(express.static(path.join(__dirname1, 'frontend', 'build')));

    // Serve the React frontend for any other route
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'));
    });
} else {
    // In development mode, just provide an API running message
    app.get('/', (req, res) => {
        res.send('API is running successfully');
    });
}

//---------------Deployment--------------------//
app.use(notFound);
app.use(errorHandler);


// here a new socket.io server instance is created and is attached to our http server with some config like cors and pingTimeout

// io contains instance of socket.io server
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: `http://localhost:3000`,
    }
})

// on is used to attach event listeners
// connection is an event listener which gets triggered when a sockeet is connected to io
io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on("setup", (userData) => {
        // console.log(userData._id);
        socket.join(userData._id);
        socket.emit("connected");
    })
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        // console.log(newMessageRecieved);
        var chat = newMessageRecieved.chat;
        // console.log(chat);

        if (!chat.users) return console.log("chat.users not defined");


        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            console.log(user);

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    // socket.off("setup", () => {
    //     console.log("USER DISCONNECTED");
    //     socket.leave(userData._id);
    // });
});
