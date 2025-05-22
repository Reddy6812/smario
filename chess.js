window.onload = function() {
    const canvas = document.getElementById('chessCanvas');
    const ctx = canvas.getContext('2d');
    const size = 80; // 8x8 board, 640px
    const lightColor = '#EEE';
    const darkColor = '#999';
    let board = [];
    let currentTurn = 'w';
    let selected = null;
    let selectedMoves = [];
    const infoDiv = document.getElementById('info');

    const PIECES = {
        'wr':'♖','wn':'♘','wb':'♗','wq':'♕','wk':'♔','wp':'♙',
        'br':'♜','bn':'♞','bb':'♝','bq':'♛','bk':'♚','bp':'♟'
    };

    // Generate legal moves for a piece (no en passant, no castling, no check detection)
    function getMoves(piece, r, c, board) {
        const moves = [];
        const color = piece[0];
        const type = piece[1];
        const opp = color === 'w' ? 'b' : 'w';
        function inBoard(x,y){return x>=0&&x<8&&y>=0&&y<8;}
        if (type === 'p') {
            const dir = (color==='w' ? -1:1);
            const nr = r + dir;
            // forward
            if (inBoard(nr,c) && !board[nr][c]) moves.push({r:nr,c:c});
            // double
            const startRow = color==='w'?6:1;
            if (r===startRow && !board[nr][c] && inBoard(nr+dir,c) && !board[nr+dir][c]) moves.push({r:nr+dir,c:c});
            // captures
            [c-1,c+1].forEach(nc=>{ if(inBoard(nr,nc)&&board[nr][nc]&&board[nr][nc][0]===opp) moves.push({r:nr,c:nc}); });
        } else if (type === 'n') {
            [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]].forEach(off=>{
                const nr=r+off[0], nc=c+off[1];
                if (inBoard(nr,nc) && (!board[nr][nc]||board[nr][nc][0]===opp)) moves.push({r:nr,c:nc});
            });
        } else if (type === 'k') {
            [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(off=>{
                const nr=r+off[0],nc=c+off[1];
                if (inBoard(nr,nc) && (!board[nr][nc]||board[nr][nc][0]===opp)) moves.push({r:nr,c:nc});
            });
        } else {
            let dirs = [];
            if (type==='r'||type==='q') dirs.push([1,0],[-1,0],[0,1],[0,-1]);
            if (type==='b'||type==='q') dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
            dirs.forEach(d=>{
                let nr=r+d[0], nc=c+d[1];
                while (inBoard(nr,nc)) {
                    if (!board[nr][nc]) { moves.push({r:nr,c:nc}); }
                    else { if (board[nr][nc][0]===opp) moves.push({r:nr,c:nc}); break; }
                    nr+=d[0]; nc+=d[1];
                }
            });
        }
        return moves;
    }

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
        // highlight possible moves
        if (selectedMoves.length) {
            ctx.fillStyle = 'rgba(0,255,0,0.3)';
            selectedMoves.forEach(m=>ctx.fillRect(m.c*size, m.r*size, size, size));
        }
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
                selectedMoves = getMoves(board[r][c], r, c, board);
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
            selectedMoves = [];
            selected = null;
        }
        draw();
    });

    initBoard();
    draw();
}; 