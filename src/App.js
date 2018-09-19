import React, { Component } from "react";

class App extends Component {
  defaultBackground = "images/1.jpeg";
  aboutBackground = "about.jpg";
  state = {
    index: 0,
    backgrounds: [this.defaultBackground],
    backgroundLoaded: false
  };

  handleClick = () => {
    if (window.location.pathname.length > 1) {
      window.history.pushState(null, "", "/");
    }
    this.setState(state => ({
      ...state,
      index: this.random(state.index, state.backgrounds.length)
    }));
  };

  handleLogoClick = e => {
    if (window.location.pathname === "/about") {
      return this.handleClick();
    }
    window.history.pushState(null, "", "about");
    e.stopPropagation();
    this.forceUpdate();
  };

  random = (prev, max) => {
    const next = Math.floor(Math.random() * max);
    return next === prev ? this.random(prev, max) : next;
  };

  backgroundLoaded = url =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src =
        url || window.location.pathname === "/about"
          ? this.aboutBackground
          : this.defaultBackground;
    });

  componentDidMount() {
    this.backgroundLoaded().finally(() => {
      this.setState({
        backgroundLoaded: true
      });
    });

    fetch("/images.php")
      .then(res => res.json())
      .then(res => {
        res
          .sort(() => Math.random() - Math.random())
          .forEach((background, index) => {
            setTimeout(() => {
              this.backgroundLoaded(background).then(() =>
                this.setState(state => ({
                  ...state,
                  backgrounds: [...new Set([...state.backgrounds, background])]
                }))
              );
            }, index > 3 ? index * 1000 : 0);
          });
      });
  }

  render() {
    const { backgrounds, index, backgroundLoaded } = this.state;
    const isAbout = window.location.pathname === "/about";

    return (
      <div
        className={`wrapper${!backgroundLoaded ? " loading" : ""}`}
        onClick={this.handleClick}
      >
        <div className="logo">
          <span onClick={this.handleLogoClick}>Kleiva + Ekrem</span>
        </div>

        <div
          className={`background${isAbout ? " active" : ""}`}
          style={{ backgroundImage: `url(${this.aboutBackground})` }}
        />

        {backgrounds.map((url, i) => (
          <div
            key={url}
            className={`background${!isAbout && index === i ? " active" : ""}`}
            style={{ backgroundImage: `url(${url})` }}
          />
        ))}
      </div>
    );
  }
}

export default App;
