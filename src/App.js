import React, { Component } from 'react'

class App extends Component {
  state = {
    index: 1,
  }

  getBackground = () => `${this.state.index}.jpeg`
  handleClick = () => this.setState({
    index: this.state.index > 17 ? 0 : this.state.index +1
  })

  render () {
    return (
      <div onClick={this.handleClick} className="background" style={{backgroundImage: `url(${this.getBackground()})`}}>
        <div className="logo">
          Kleiva + Ekrem
        </div>

      </div>
    )
  }
}

export default App
