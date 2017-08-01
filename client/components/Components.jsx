import React from 'react';
import _ from 'lodash';

export class Parent extends React.Component {
   constructor() {
      super();
      this.state = {
         words: {
          "easy": ["CAT", "DOG", "FUN", "DOLL"],
          "medium": ["AEROPLANE", "INTERNET", "HANGMAN"],
          "hard": ["ARCHIVOLT", "TETRAMORPH", "AGGREGATION"]
             },
         difficultyLevel: "easy",
         alphabet: "abcdefghijklmnopqrstuvwxyz",
         chosenSet: [],
         chosenWord: [],
         underWord: [],
         typedList: [],
         typedLetter: [],
         chancesLeft: 3,
         startGame: false
      };
     this.onChoice = this.onChoice.bind(this);
     this.handleGameStart = this.handleGameStart.bind(this);
     this.handleType = this.handleType.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
   }
   
   onChoice(e) {
      this.setState({difficultyLevel: e.target.value});
   }
   
   handleGameStart() {
      const set = this.state.words[this.state.difficultyLevel];
      const word = Array.from(_.sample(set));
      const underscores = _.map((word), () => {return "_ "});
      const initialPattern = this.state.alphabet + this.state.alphabet.toUpperCase();
      this.setState({
         startGame: true,
         chosenSet: set,
         chosenWord: word,
         underWord: underscores,
         alphabet: initialPattern
      })
   }
   
   handleType(e) {
     this.setState({typedLetter: e.target.value});
   }
   
   handleSubmit() {
     if(this.state.chancesLeft !== 0 && _.countBy(Array.from(this.state.underWord))["_ "] > 0 && this.state.alphabet.includes(this.state.typedLetter) && this.state.typedLetter !== '')  {
        const TL = this.state.typedLetter.toUpperCase();
        const newPattern = this.state.alphabet.replace(TL.toUpperCase(),'').replace(TL.toLowerCase(),'');
        const typed = Array.from(this.state.typedList).concat(TL).filter((value, index, self) => {return self.indexOf(value) === index});
        const checkList = this.state.chosenWord.map((char, index) => char === TL ? index : null);
        const newUnderWord = underWordReconstructor(this.state.chosenWord,checkList,this.state.underWord);
        const negativePoint = pointCalculator(checkList,typed,(Array.from(this.state.typedList)));
        this.setState({
           underWord: newUnderWord,
           alphabet: newPattern,
           typedList: typed,
           typedLetter: [],
           chancesLeft: this.state.chancesLeft - negativePoint
        })
     }
      
     (() => {
       let formula = document.getElementById("typeForm");
       let box = document.getElementById("textBox");
       formula.reset();
       box.focus();
     })();
     
     function underWordReconstructor(reference,check,underscoresOutput) {
        for (let i=0 ; i < check.length ; i++) {
           if(check[i] !== null){
              underscoresOutput[i] = (reference[check[i]])+" ";
           }
        }
        return underscoresOutput;
     }
      
     function pointCalculator(array,presentTyped,previousTyped) {
        let point = 0;
        let condition = array.every((value) => {return value === null});
        if(condition && (presentTyped.length - previousTyped.length) !== 0) {point = 1};
        return point;
     }
     
   }
   
   render() {
      (() => { typeof InstallTrigger !== 'undefined' ? window.location = "#" : window.location = "?#" })();
      return(
        this.state.startGame ? 
         <GameChild 
            underWord={this.state.underWord} 
            typedLetter={this.typedLetter} 
            handleType={this.handleType} 
            handleSubmit={this.handleSubmit} 
            typedList={this.state.typedList} 
            chancesLeft={this.state.chancesLeft}
            />
         : <DifficultChild 
              onChoice={this.onChoice} 
              words={this.state.words} 
              buttonClick={this.handleGameStart} 
              />
      );
   }   
}

export class DifficultChild extends React.Component {
   render() {
      return (
        <div className="FormDiv">
        <form id="diffForm">
         <label>
           Difficulty level:
           <select onChange={this.props.onChoice}>
              {(Object.keys(this.props.words)).map((iter, index) => <option key={index}>{iter}</option>)}
           </select>
         </label>
        </form>
        <button onClick={this.props.buttonClick}></button>
        </div>
      );
   }
}

export class GameChild extends React.Component {
   render() {
         return (
           <div className="FormDiv">
            <div className="noselect">
               {this.props.underWord}
            </div>
            <form id="typeForm" action="#" autoComplete="nope">
              <label>
               Insert single character:
               <input id="textBox" type="text" maxLength="1" value={this.props.typedLetter} onChange={this.props.handleType}/>
              </label>
              <button type="button" onClick={this.props.handleSubmit} />
            </form>
              <div id="score">
               <p>Attempts so far: {this.props.typedList.length}</p>
               <p>Typed characters: {this.props.typedList+'  '}</p>
               <p>Chances left: {this.props.chancesLeft}</p>
               <div id="scoreBox"><p>{this.props.chancesLeft === 0 ? "Game over..." : (_.countBy(Array.from(this.props.underWord))["_ "] > 0 ? "" : (this.props.chancesLeft === 3 ? "FLAWLESS!" : "Victory!"))}</p></div>
              </div>
           </div>
         )
   }
}
