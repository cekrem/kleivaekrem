import React, { Component } from "react";

class App extends Component {
  state = {
    index: 0,
    backgrounds: ["images/1.jpeg"]
  };

  handleClick = () =>
    this.setState(state => ({
      ...state,
      index: Math.floor(Math.random() * state.backgrounds.length)
    }));

  componentDidMount() {
    fetch("/images.php")
      .then(res => res.json())
      .then(res => {
        res
          .sort(() => Math.random() - Math.random())
          .forEach((background, index) => {
            setTimeout(() => {
              this.setState(state => ({
                ...state,
                backgrounds: [...new Set([...state.backgrounds, background])]
              }));
            }, index > 3 ? index * 1000 : 0);
          });
      });
  }

  render() {
    const { backgrounds, index } = this.state;
    return (
      <div className="wrapper" onClick={this.handleClick}>
        <div className="logo">Kleiva + Ekrem</div>

        {backgrounds.map((url, i) => (
          <div
            key={url}
            className={`background${index === i ? " active" : ""}`}
            style={{ backgroundImage: `url(${url})` }}
          />
        ))}
      </div>
    );
  }
}

export default App;
