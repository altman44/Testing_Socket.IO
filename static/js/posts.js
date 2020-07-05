socket.emit('join room')

socket.on('joined', (data) => {
    console.log('new join')
    console.log(data)
})