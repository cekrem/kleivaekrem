import React, { Component } from 'react'

class App extends Component {
  state = {
    index: 0,
    backgrounds: [],
  }

  handleClick = () => this.setState(state => ({
    ...state,
    index: Math.floor(Math.random() * state.backgrounds.length),
  }))

  createBackgroundArray = (length) => [...Array(17)].map(
    (_, index) => `./${index+1}.jpeg`)
    .sort(() => Math.random() - Math.random())

  componentDidMount () {
    const base = this.createBackgroundArray(17)

    base.forEach((background, index) => {
      setTimeout(() => {
        this.setState({
          backgrounds: this.state.backgrounds.concat(background),
        })
      }, index > 3 ? index * 1000 : 0)
    })
  }

  render () {
    const {backgrounds, index} = this.state
    return (
      <div className='wrapper' onClick={this.handleClick}>
        <div className="logo">
          Kleiva + Ekrem
        </div>

        {backgrounds.map((url, i) => <div key={url} className={`background${index === i ? ' active' :''}`}
                                     style={{backgroundImage: `url(${url})`}}/>)}
      </div>
    )
  }
}

export default App
