import { useState} from 'react'
import './App.css'
import './index.css'


const TURNS = {
  X: 'Χ',
  O: '○'
}



const Square = ({children, updateBoard, index, highlight, isSelected}) => { 
  
  const className= `square ${isSelected ? 'is-selected' : ''}`

  return( <div className= {className} onClick={() => updateBoard(index)} style={{backgroundColor: highlight ? 'blue' : undefined }}>
                {children}
          </div>
          )
      }  

function App() {
 
  const [turn, setTurn] = useState(TURNS.X)
  const [board, setBoard] = useState(Array(9).fill(null))
  const [winner, setWinner] = useState(null)
  const [winCombination, setWinCombination]= useState([])

    
   const checkWinner = (updatedBoard) => {
      const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
      ]
    
      for (const combo of winCombinations) {
         let [a, b, c] = combo
        if (updatedBoard[a] && 
            updatedBoard[a] === updatedBoard[b] && 
            updatedBoard[a] === updatedBoard[c]) {
          
          return { winner: updatedBoard[a], combination: combo }
        }
      }
      
      //Verificar empate
      if (updatedBoard.every(cell => cell !== null)) {
        return { winner: 'draw'}
      }
      
      return null // Aún no se acaba la partida
    }

    const resetGame = () => {
      setBoard(Array(9).fill(null))
      setTurn(TURNS.X)
      setWinner(null)
      setWinCombination([])
    }

    const actualizeBoard = (index) => {

      if(board[index] || winner) return;
      
      const boardUpdated = [...board]
      boardUpdated[index] = turn
     
      setBoard(boardUpdated)

      const result = checkWinner(boardUpdated)

      if(result && result.combination){
        setWinner(result.winner)
        setWinCombination(result.combination)
      }
      else if(result && !result.combination){
        setWinner(result.winner)
      }
      else
        setTurn(prev => prev === TURNS.X ? TURNS.O : TURNS.X)
   }


  return (
    <main>
      <h1>Tic tac toe</h1>

      <div className='game'>
       {/* Renderización de la lista de elementos */
        board.map((_,index) => (
             
             <Square
                key={index}
                index={index}
                updateBoard={actualizeBoard}
                highlight={winCombination.includes(index)}
                >

                {board[index]}
              
              </Square>
          )
        )
       }
      </div>

      <section className='turn'>
        <Square isSelected ={ turn == TURNS.X } >{TURNS.X}</Square>
        <Square isSelected ={ turn == TURNS.O } >{TURNS.O}</Square>
      </section>

     
           {
               (winner === TURNS.X || winner === TURNS.O)  && (<section className='modal-overlay'>
                      
                      <div className="modal-content modal-winner">
                        <h1>Winner :</h1>
                        <h2>{winner}</h2> 
                        <button className= "modal-btn" onClick={resetGame}> Restart the Game</button>
                      </div>
                 </section>
               )
           }
    
           {
               (winner === 'draw')  && (<section className='modal-overlay'>
                  
                    <div className="modal-content modal-draw">
                      <h1>Draw!</h1>

                      <button  className= "modal-btn" onClick={resetGame}> Restart the Game</button>
                    </div>
                </section>
              )
           }
  
    </main>
  )
}

export default App
