import React, { Component } from "react";

const visueltText = [
  <p>
    Gull Visuelt 2018 <br/> Årets studentarbeid: <br/> Braut –en elegi over en okse og en
    gård <br/> Malin Kleiva
  </p>,
  <p>
    Gull Visuelt 2016 <br/> Årets studentarbeid: <br/> Tøyenflora <br/> Birgitte Kolden Ekrem
  </p>,
  <p>
    Nominasjon Visuelt 2016 <br/>
    Årets studentarbeid: <br/>
    Visuell identitet til
    avgangsutstilling for <br/> Design v/ Kunsthøgskolen i Oslo <br/> Malin Kleiva, Anna
    Prestsæther og Ida Christensen
  </p>,
  <p>
    Nominasjon Visuelt 2014 <br/> Årets studentarbeid: <br/> Hidden Oslo, Bokdesign <br/> Malin
    Kleiva og Birgitte Ekrem
  </p>
];

class App extends Component {
  defaultBackground = "default.jpg";
  aboutBackground = "about.jpg";
  state = {
    index: 0,
    backgrounds: [this.defaultBackground],
    backgroundLoaded: false,
    x: 0,
    y: 0,
    moved: false,
  };

  handleClick = (e) => {
    const {clientX: x, clientY: y} = e;
    this.setState({
      x,
      y,
      moved: true,
    });

    if (window.location.pathname.length > 1) {
      window.history.pushState(null, "", "/");
    }
    this.setState(state => ({
      ...state,
      index: this.next(state.index, state.backgrounds.length)
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

  next = (prev, max) => (prev < max ? prev + 1 : 0);

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
        <div className={`logo${this.state.moved ? ' moved' : ''}`} style={{
          left: this.state.x,
          top: this.state.y,
        }}/>

        <div
          className={`background${isAbout ? " active" : ""}`}
          style={{ backgroundImage: `url(${this.aboutBackground})` }}
        />

        {backgrounds.map((url, i) => (
          <div
            key={url}
            className={`background${!isAbout && index === i ? " active" : ""}`}
            style={{ backgroundImage: `url(${url})` }}
          >
            {url.includes("visuelt") && <div>{visueltText}</div>}
          </div>
        ))}

        <div className="footer">
          <a
            onClick={e => e.stopPropagation()}
            href="mailto:post@kleivaekrem.no"
          >
            post@kleivaekrem.no
          </a>
        </div>
      </div>
    );
  }
}

export default App;
