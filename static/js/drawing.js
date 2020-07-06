socket.emit('join room')

socket.on('joined', (data) => {
    console.log('new join')
    console.log(data)
    loadUsers(data.users)
})

function loadUsers(users) {
    const alertDiv = document.querySelector('.alert')
    const alertText = document.querySelector('.alert-text')
    let divUser;
    let userUsername;

    if (users.length) {
        alert.setAttribute('class', 'alert alert-inactive')
        alertText.innerHTML = ''
        const usersDiv = document.querySelector('#div-users')
        users.forEach(user => {
            divUser = document.createElement('div')
            userUsername = document.createElement('p')

            divUser.setAttribute('class', 'div_user')
            userUsername.setAttribute('class', 'p_username')
            userUsername.innerHTML = user.username
            usersDiv.appendChild(divUser)
        });
    } else {
        alert.setAttribute('class', 'alert alert-danger')
        alertText.innerHTML = 'Waiting for users...'
    }
}