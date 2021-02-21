const createBoard = (rows, columns) => {
    return Array(rows).fill(0).map( (_, row) => {
        return Array(columns).fill(0).map( (_,column) => {
            return {
                row,
                column,
                opened: false,
                flagged: false,
                mined: false,
                exploded: false,
                nearMines: 0
            }
        })
    })
}

const sprideMines = (board, minesAmount) => {
    const rows = board.length
    const columns = board[0].length
    let minesPlanted = 0

    while (minesPlanted < minesAmount) {
        const rowSel = parseInt(Math.random() * rows, 10)
        const colSel = parseInt(Math.random() * columns, 10)
        
        if( !board[rowSel][colSel].mined){
            board[rowSel][colSel].mined = true
            minesPlanted++
        }
    }
}

const createMinedBoard = (rows, columns, minesAmount) => {
    const board = createBoard(rows, columns)
    sprideMines(board, minesAmount)
    return board
}

const cloneBoard = board => {
    return board.map(row => {
        return row.map(field => {
            return { ...field }
        })
    })
}

const getNeighbors = (board, row, column) => {
    const neighbors = []
    const rows = [row - 1, row, row + 1]
    const columns = [column - 1, column, column + 1]
    rows.forEach(r => {
        columns.forEach(c => {
            const diferent = r !== row || c !== column
            const validRow = r >= 0 && r < board.length
            const validColumn = c >= 0 && c < board[0].length
            if (diferent && validRow && validColumn) {
                neighbors.push(board[r][c])
            }
        })
    })
    return neighbors
}

const safeNeighborhood = (board, row, column) => {
    const safe = (result, neighbors) => result && !neighbors.mined
    return getNeighbors(board, row, column).reduce(safe, true)
}

const openField = (board, row, column) => {
    const field = board[row][column]
    if (!field.opened) {
        field.opened = true
        field.flagged = false
        if (field.mined) {
            field.exploded = true
        } else if (safeNeighborhood(board, row, column)) {
            getNeighbors(board, row, column)
                .forEach(n => openField(board, n.row, n.column))
        } else {
            const neighbors = getNeighbors(board, row, column)
            field.nearMines = neighbors.filter(n => n.mined).length
        }
    }
}

const field = board => [].concat(...board)

const hadExploded = board => field(board).filter(n => n.exploded).length > 0

const pendding = field => (field.mined && !field.flagged) || (!field.mined && !field.opened)

const wonGame = board => field(board).filter(pendding).length ===0

const showMines = board => field(board).filter(a => a.mined).forEach(b => b.opened = true)

const invertFlag = (board,row,column) => {
    const field = board[row][column]
    field.flagged = !field.flagged
}

const flagsUsed = (board) => field(board).filter(fields => fields.flagged).length

export { 
    createMinedBoard,
    cloneBoard,
    openField,
    hadExploded,
    wonGame,
    showMines,
    invertFlag,
    flagsUsed
}















