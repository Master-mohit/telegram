const io = require( "socket.io" )();
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    console.log( "A user connected" );

    socket.on("sony", function(chacha){
      console.log("chacha")

      socket.broadcast.emit("max", chacha)
    })
});
// end of socket.io logic

module.exports = socketapi;