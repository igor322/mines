import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert} from 'react-native';

import params from './src/param'
import MineField from './src/components/MineField'
import Header from './src/components/Hearder'
import LevelSelection from './src/screens/levelSelection'
import { 
  createMinedBoard,
  cloneBoard,
  openField,
  hadExploded,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed,
} from './src/Logic'
import levelSelection from './src/screens/levelSelection';


export default class App extends Component {

  constructor(props){
    super(props)
    this.state = this.createState()
  }

  minesAmount = () => {
    const row = params.getRowsAmount()
    const col = params.getColumnsAmount()
    return Math.ceil(row * col * params.difficultLevel)
  }

  createState = () => {
    const rows = params.getRowsAmount()
    const col = params.getColumnsAmount()
    return {
      board: createMinedBoard(rows,col,this.minesAmount()),
      won: false,
      lost: false,
      showLevelSelection: false
    }    
  }

  onOpenField = (row,column) =>{
    const board = cloneBoard(this.state.board)
    openField(board, row, column)
    const lost = hadExploded(board)
    const won = wonGame(board)

    if (lost) {
      showMines(board)
      Alert.alert('Perdeu!!')
    }
    if (won) {
      Alert.alert('Ganhou!!')
    }

    this.setState({ board, lost, won})
  }

  onSelectField = (row,column) => {
    const board = cloneBoard(this.state.board)
    invertFlag(board, row, column)
    const won = wonGame(board)

    if (won) {
      Alert.alert('Ganhou!!')
    }

    this.setState({ board, won})
  }

  onLevelSelected = level => {
    params.difficultLevel = level
    this.setState(this.createState())
  }
  
  render() {
    return (
           
      <View style={styles.container}>
        <LevelSelection isVisible={this.state.showLevelSelection}
        onLevelSelected={this.onLevelSelected}
        onCancel={() => this.setState({ showLevelSelection: false})}/>
        <Header flagLeft={this.minesAmount() - flagsUsed(this.state.board) }
        onNewGame={() => this.setState(this.createState())}
        onFlagPress={() => this.setState({ showLevelSelection: true})} />
        <View style={styles.board}>
          <MineField board={this.state.board}
            onOpenField={this.onOpenField}
            onSelectField={this.onSelectField}/>
        </View>
    </View>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#AAA'
  }
})