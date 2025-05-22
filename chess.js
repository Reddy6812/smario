window.onload = function() {
    const canvas = document.getElementById('chessCanvas');
    const ctx = canvas.getContext('2d');
    const size = 80; // 8x8 board, 640px
    const lightColor = '#EEE';
    const darkColor = '#999';
    let board = [];
    let currentTurn = 'w';
    let selected = null;
    const infoDiv = document.getElementById('info');

    const PIECES = {
        'wr':'♖','wn':'♘','wb':'♗','wq':'♕','wk':'♔','wp':'♙',
        'br':'♜','bn':'♞','bb':'♝','bq':'♛','bk':'♚','bp':'♟'
    };

    function initBoard() {
        const init = [
            ['br','bn','bb','bq','bk','bb','bn','br'],
            ['bp','bp','bp','bp','bp','bp','bp','bp'],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            ['wp','wp','wp','wp','wp','wp','wp','wp'],
            ['wr','wn','wb','wq','wk','wb','wn','wr']
        ];
        board = init.map(r => r.slice());
    }

    function draw() {
        // Board
        for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
            const x=c*size, y=r*size;
            ctx.fillStyle = (r+c)%2===0 ? lightColor : darkColor;
            ctx.fillRect(x,y,size,size);
            // highlight
            if (selected && selected.r===r && selected.c===c) {
                ctx.strokeStyle = 'yellow'; ctx.lineWidth = 4;
                ctx.strokeRect(x+2,y+2,size-4,size-4);
            }
            const p = board[r][c];
            if (p) {
                ctx.fillStyle = p[0]==='w'?'white':'black';
                ctx.font = '48px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(PIECES[p], x+size/2, y+size/2);
            }
        }
    }

    canvas.addEventListener('click', e => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const c = Math.floor(x/size);
        const r = Math.floor(y/size);
        const p = board[r][c];
        if (!selected) {
            if (p && p[0]===currentTurn) {
                selected = {r,c};
            }
        } else {
            const from = selected;
            const piece = board[from.r][from.c];
            // disallow capturing own
            if (!board[r][c] || board[r][c][0]!==currentTurn) {
                board[r][c] = piece;
                board[from.r][from.c] = null;
                currentTurn = currentTurn==='w'?'b':'w';
                infoDiv.textContent = 'Turn: ' + (currentTurn==='w'?'White':'Black');
            }
            selected = null;
        }
        draw();
    });

    initBoard();
    draw();
}; 