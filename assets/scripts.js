$(document).ready(function() {
    let socket = io.connect('http://localhost:3000');
    let ready = false;

    $('#submit').submit(function(e) {
        e.preventDefault();
        $('#nick').fadeOut();
        $('#chat').fadeIn();
        let name = $('#nickname').val();
        let time = new Date();
        $('#name').html(name);
        $('#time').html(`First login: ${time.getHours()}:${time.getMinutes()}`);

        ready = true;
        socket.emit('join', name);
    });

    $('#textarea').keypress(function(e) {
        if(e.which == 13) {
            let text = $('#textarea').val();
            $('#textarea').val('');
            let time = new Date();
            $('.chat').append(`<li class="self"><div class="msg"><span>${$('#nickname').val()}</span><p>${text}</p><time>${time.getHours()}:${time.getMinutes()}</time></div></li>`);

            socket.emit('send', text);
            document.getElementById('bottom').scrollIntoView();
        }
    });

    socket.on('update', function(msg) {
        if(ready) {
            $('.chat').append(`<li class="info">${msg}</li>`);
        }
    });

    socket.on('chat', function(client, msg) {
        if(ready) {
            let time = new Date();
            $('.chat').append(`<li class="field"><div class="msg"><span>${client}</span><p>${msg}</p><time>${time.getHours()}:${time.getMinutes()}</time></div></li>`);
        }
    });
});