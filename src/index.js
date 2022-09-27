import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    const classNames = `square ${props.winner}`;
    return (
        <button className={classNames} onClick={props.onClick}>{props.value}</button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        const { squares, winner } = this.props;
        return <Square value={squares[i]}
            onClick={() => this.props.onClick(i)} winner={winner && winner.includes(i) ? 'winner' : ''} />
    };

    renderBoard() {
        const rowsWidth = Array(Math.sqrt(this.props.squares.length)).fill(null);
        const celsWidth = rowsWidth;
        const board = rowsWidth.map((row, i) => {
            const squares = celsWidth.map((cel, j) => {
                const squareIndex = i * rowsWidth.length + j;
                return (
                    <span key={squareIndex}>{this.renderSquare(squareIndex)}</span>
                );
            });
            return <div key={i}>{squares}</div>
        });
        return board;
    }

    render() {
        const board = this.renderBoard();
        return (
            <div>{board}</div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20],
    ];

    for (let i = 0; i < lines.length; i++) {
        var [a, b, c, d, e] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
            return {
                winnerPlayer: squares[a],
                winnerLocation: [a, b, c, d, e]
            }
        }
    }

    return;
}

class Game extends React.Component {
    constructor() {
        super();

        this.state = {
            history: [{
                squares: Array(25).fill(null),
                moveLocation: '',
            }],
            xIsNext: true,
            stepNumber: 0,
            isReverse: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (squares[i] || calculateWinner(squares)) {
            return;
        }

        const gameSize = Math.sqrt(history[0].squares.length);
        const moveLocation = [Math.floor(i / gameSize + 1), i % gameSize + 1].join(', ');

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares,
                moveLocation
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(move) {
        this.setState({
            xIsNext: (move % 2) ? false : true,
            stepNumber: move,
        })
    }

    reverseSort(isReverse) {
        this.setState({
            isReverse: !isReverse,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const isReverse = this.state.isReverse;
        let status;

        if (winner) {
            status = `Winner is: ${winner.winnerPlayer}`;
        } else if (this.state.stepNumber === 25) {
            status = "Draw";
        } else {
            status = `Next player is: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        const moves = history.map((step, move) => {
            const desc = move ? `Move #${move} (${step.moveLocation})` : 'Start game';
            return (
                <li key={move}><a href="#" onClick={() => this.jumpTo(move)}>{desc}</a></li>
            );
        });

        return (
            <div>
                <div className="game">
                    <Board squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        winner={winner && winner.winnerLocation} />
                    <div className="game-info">
                        <p>{status}</p>
                        <ol reversed={isReverse ? 'reverse' : ''}>{isReverse ? moves.reverse() : moves}</ol>
                        <button onClick={() => this.reverseSort(isReverse)}>Reverse list</button>
                    </div>
                </div>

            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);