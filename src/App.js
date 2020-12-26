// import logo from './logo.svg';
import './App.css';
import React from 'react';

function App() {
    // table number
    const [numTable, setNumTable] = React.useState([[1, 2, 3], [4, 5, 6], [7, 8, 0]]);
    // empty position
    const [empty, setEmpty] = React.useState(8);
    // determine whether the game is done
    const [isFinished, setIsFinished] = React.useState(false);
    // count the number of moving block
    const [cnt, setCnt] = React.useState(0);
    // neighbor sequence
    const neighbor_sequence = [
        [-1, -1, 1, 3], [-1, 0, 2, 4], [-1, 1, -1, 5],
        [0, -1, 4, 6], [1, 3, 5, 7], [2, 4, -1, 8],
        [3, -1, 7, -1], [4, 6, 8, -1], [5, 7, -1, -1]
    ]
    const [num, setNum] = React.useState(8);

    const changeEmpty = (j) => {
        setEmpty(j)
    }

    const changeTable = (X) => {
        setNumTable(X)
    }

    const numChange = (e) => {
        if (typeof(e)==='object') {
            setNum(parseInt(e.target.value));
        }
        else if (typeof(e) ==='number') {
            setNum(e);
        }
    }

    const changeCnt = (n) => {
        setCnt(n);
    }

    const adjustEmpty = (val) => {
        let x = val
        // indx -> relative position of empty block
        // x -> block
        for (var i=0; i<3; i++){
            for( var j=0; j<3; j++) {
                if (x[i][j] ===0) {
                    changeEmpty(i*3+j);
                }
            }
        }
        console.log('curempty', empty);

    }

    const swapping = (indx, val) => {
        let x = val
        // indx -> relative position of empty block
        // x -> block
        adjustEmpty(x);

        let r0 = parseInt(empty/3);
        let c0 = empty %3;
        let tmp;

        switch (indx) {
            case 0:
                try {
                    tmp = x[r0 - 1][c0];
                    x[r0-1][c0] = x[r0][c0] ;
                    x[r0][c0] = tmp;
                }
                catch {
                    console.log('noprint')

                }
                break;

            case 1:
                try {
                    tmp = x[r0][c0-1];
                    x[r0][c0-1] = x[r0][c0];
                    x[r0][c0] = tmp;
                }
                catch {
                    console.log('noprint')

                }
                break;

            case 2:
                try {
                    tmp = x[r0][c0+1];
                    x[r0][c0+1] = x[r0][c0];
                    x[r0][c0] = tmp;
                }
                catch {
                    console.log('noprint')

                }
                break;

            case 3:
                try {
                    tmp = x[r0+1][c0];
                    x[r0+1][c0] = x[r0][c0];
                    x[r0][c0] = tmp;
                }
                catch {
                    console.log('noprint')

                }
                break;
        }
        //change the value of numTable
        changeTable(x);
        adjustEmpty(x);
        if (! isFinished) {
            setCnt(cnt + 1);
        }
        // check whether the game is done.
        if (cnt>0) {
            setIsFinished(
                numTable[0][0] === 1
                && numTable[0][1] === 2
                && numTable[0][2] === 3
                && numTable[1][0] === 4
                && numTable[1][1] === 5
                && numTable[1][2] === 6
                && numTable[2][0] === 7
                && numTable[2][1] === 8
                && numTable[2][2] === 0
            )
        }
    }

    // swap function
    const swap = (e) => {
        let list_td = document.querySelectorAll('td');

        if(typeof(e) === "object" && e.target.classList.contains('swappable')) {

            var nx = [...list_td].indexOf(e.target); // td position
            var indx = neighbor_sequence[empty].indexOf(nx); //relative position
            swapping(indx, numTable);
        }

    }
    const swapByNum = (num0, numTable) => {
        if (typeof(num0) ==='number') {
            var indx = neighbor_sequence[empty].indexOf(num0);
            console.log(neighbor_sequence[empty], num0, indx);
            if (indx !== -1) {
                swapping(indx, numTable);
                console.log(numTable);
            }
        }
    }


    const shuffleByNum = () => {
        console.log(num, 'input');
        swapByNum(num, numTable);
        console.log(num, numTable);
    }

    // Shuffle
    const shuffle = () => {
        setIsFinished(false);
        let x = Array(9)
        let y = []

        for (var i = 0; i < 9; i++) {
            x[i] = Math.random()
        }
        for (i = 0; i < 9; i++) {
            var cnx = 0;
            for (var j = 0; j < 9; j++) {
                if (x[i] > x[j]) {
                    cnx++;
                }
            }
            y = [...y, cnx]
        }
        let inver = 0 // count inversion
        for (i=1; i<9; i++) {
            for (j=0; j<i; j++){
                if (y[j]>y[i] && y[i]>0) {inver++;}
            }
        }
        if (inver %2 !==0) { // solvable only array is even
            shuffle() //
        }
        else {

            let z = Array(3)
            for (i = 0; i < 3; i++) {
                z[i] = [y[3 * i], y[3 * i + 1], y[3 * i + 2]]
            }
            changeTable(z);
            adjustEmpty(z);
            console.log(z, empty);

            changeCnt(0);
        }
    }


    // Game is finished when the puzzle is arranged


  return (
    <div className="App">
        <h3 className="title">3 X 3 Puzzle</h3>
        <div>
            <button onClick={shuffle}>Shuffle</button>&nbsp;&nbsp;
            <span>No. of moves : {cnt} </span> &nbsp;&nbsp;
            <span onChange={swapping}>{isFinished?'Game Clear!':(cnt>0?'Playing the game':'Preparing...')}</span>
        </div>
        <div>Position : <input onChange={numChange} placeholder={'No. of position'} /><button onClick={shuffleByNum}>Move</button></div>
        <div style={{margin:'auto'}}>
            <table onChange={swapping}>
              {numTable.map((val, row) => {
                return (<tr className={`row-${row}`}>
                  {val.map((nums, col ) => (
                      <td onClick={!isFinished && neighbor_sequence[empty].indexOf(row*3 + col)!==-1?swap:null}
                          className={!isFinished && neighbor_sequence[empty].indexOf(row*3 + col)!==-1?`swappable cell-${nums}`:`cell-${nums}`}>
                          {nums!==0?nums:''}
                      </td>))}
                </tr>)
              })}

            </table>
        </div>
    </div>
  );
}

export default App;
