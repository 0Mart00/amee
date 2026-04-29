const socket = io(); // Kapcsolódás a LAN szerverhez

function hostGame() {
    // Amikor megnyomod a Startot, szólsz a szervernek
    socket.emit('start-game');
}

socket.on('game-started', () => {
    console.log("A szerver elindította a meccset mindenkinél!");
    document.getElementById('menu-container').style.display = 'none';
    initGameWorld();
});
