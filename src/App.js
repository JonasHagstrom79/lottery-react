import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from './web3';
import lottery from './lottery';

class App extends React.Component {
  //defines the state variables for setState
  state = {
    //manager sets to emty string, then hämtad from manager in .sol
    manager: "",
    //sets to empty array to start
    players: [],
    //set to empty string
    balance: "",
    value: ""
  };
  //lifecycle method
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    //sets the state, gets the adress of manager
    this.setState({manager, players, balance});
  }
  //event handler to form submission represented by (event)
  onSubmit = async (event) =>{
    //prevents the form from submitting itself in the classic HTML way
    event.preventDefault();
    //sends a transaction to the enter function
    //get a list of our accounts
    const accounts = await web3.eth.getAccounts();
    
    await lottery.methods.enter().send({
      //sends from the first account in the array
      from: accounts[0],
      //converts to Wei b4 sending it into the transaction
      value: web3.utils.toWei(this.state.value, "ether")
    });
  };


  render() {
    //console.log(web3.version);
    //web3.eth.getAccounts().then(console.log); //shows account address connected (ctrl+shift & I)
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}.</p>
        <p>There are currently {this.state.players.length} people entered,</p>
        <p>competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ethereum!</p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value})}
            />
          </div>
          <button>Enter</button>
        </form>
      </div>
    );
  }
}
export default App;
