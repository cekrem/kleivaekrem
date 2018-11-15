import React, { Component } from "react";
import debounce from "lodash.debounce";

const visueltText = [
  <div key={1} className="part">
    <div className="slant">Gull</div>
    <div className="slant">Visuelt</div>
    <div className="slant">2017</div>
    Braut
  </div>,
  <div key={2} className="part">
    <div className="slant">Gull</div>
    <div className="slant">Visuelt</div>
    <div className="slant">2015</div>
    Tøyenflora
  </div>,
  <div key={3} className="part">
    <div className="slant">Diplom</div>
    <div className="slant">Visuelt</div>
    <div className="slant">2016</div>
    <div className="slant">2013</div>
  </div>
];

const aboutText = [
  <div key={1} className="part">
    Blar er et designstudio basert i Oslo,
    <br />
    etablert i 2018 av Birgitte K. Ekrem
    <br />
    og Malin Kleiva.
  </div>,
  <div key={2} className="part">
    Blar utformer trykksaker, digitale flater
    <br />
    og visuelle identiteter.
  </div>
];

class App extends Component {
  defaultBackground = "default.jpg";
  aboutBackground = "about.jpg";
  defaultLogo = "Blar_01.svg";
  state = {
    bgIndex: 0,
    logoIndex: 0,
    backgrounds: [this.defaultBackground],
    backgroundLoaded: false,
    logos: [this.defaultLogo],
    x: 0,
    y: 0,
    rotation: 0,
    moved: false
  };

  handleClick = e => {
    const { clientX: x, clientY: y } = e;
    this.setState({
      x,
      y,
      moved: true,
      rotation: Math.floor(Math.random() * 9) * 45
    });

    if (window.location.pathname.length > 1) {
      window.history.pushState(null, "", "/");
    }
    this.setState(state => ({
      ...state,
      bgIndex: this.next(state.bgIndex, state.backgrounds.length - 1),
      logoIndex: this.next(state.logoIndex, state.logos.length - 1)
    }));
  };

  handleLogoClick = e => {
    if (window.location.pathname === "/about") {
      return this.handleClick(e);
    }
    window.history.pushState(null, "", "about");
    e.stopPropagation();
    this.forceUpdate();
  };

  next = (prev, max) => (prev < max ? prev + 1 : 0);

  imageLoaded = url =>
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
    this.imageLoaded().finally(() => {
      this.setState({
        backgroundLoaded: true
      });
    });

    window.onresize = debounce(({ target }) => {
      this.setState(state => ({
        ...state,
        x: Math.random() * target.innerWidth,
        y: Math.random() * target.innerHeight,
        rotation: (target.innerWidth / target.innerHeight) * 1080,
        logoIndex: this.next(state.logoIndex, state.logos.length - 1)
      }));
    }, 50);

    this.fetchAndLoad("/images.php", "backgrounds");
    this.fetchAndLoad("/logos.php", "logos");
  }

  componentWillUnmount() {
    window.onresize = () => undefined;
  }

  fetchAndLoad = (path, key) => {
    fetch(path)
      .then(res => res.json())
      .then(res => {
        res.forEach((image, index) => {
          setTimeout(
            () => {
              this.imageLoaded(image).then(() =>
                this.setState(state => ({
                  ...state,
                  [key]: [...new Set([...state[key], image])]
                }))
              );
            },
            index > 3 ? index * 1000 : 0
          );
        });
      });
  };

  getProject = (index = this.state.bgIndex) => {
    if (window.location.pathname === "/about") {
      return false;
    }
    const activeBg = this.state.backgrounds[index];
    return (
      (activeBg || "").includes("images") &&
      activeBg
        .replace("images/", "")
        .split(".")
        .map(text => text.replace(/-/g, " "))
    );
  };

  render() {
    const {
      backgrounds,
      bgIndex,
      backgroundLoaded,
      logos,
      logoIndex,
      rotation,
      x,
      y
    } = this.state;
    const logoStyle = `url(${logos[logoIndex]})`;
    const isAbout = window.location.pathname === "/about";
    const project = this.getProject();

    return (
      <div
        className={`wrapper${!backgroundLoaded ? " loading" : ""}`}
        onClick={this.handleClick}
      >
        {project && (
          <div className="project root">
            <div>{project[0]}</div>
            <div>&nbsp;</div>
            <div className="slant">{project[1]}</div>
          </div>
        )}
        <div
          onClick={this.handleLogoClick}
          className={`logo${this.state.moved ? " moved" : ""}${
            isAbout ? " about-logo" : ""
          }`}
          style={{
            left: x,
            top: y,
            backgroundImage: logoStyle,
            transform: `rotate(${rotation}deg)`
          }}
        />

        <div
          className={`background${isAbout ? " active" : ""}`}
          style={{ backgroundImage: `url(${this.aboutBackground})` }}
        >
          <div className="about">{aboutText}</div>
          <div className="visuelt">{visueltText}</div>
        </div>

        {backgrounds.map((url, i) => (
          <div
            key={url}
            className={`background${
              !isAbout && bgIndex === i ? " active" : ""
            }`}
            style={{ backgroundImage: `url(${url})` }}
          >
            <div className="project mobile">
              <div>{this.getProject(i)[0]}</div>
              <div>&nbsp;</div>
              <div className="slant">{this.getProject(i)[1]}</div>
            </div>
            {url.includes("visuelt") && (
              <div className="visuelt">{visueltText}</div>
            )}
          </div>
        ))}

        <div className="footer">
          <a onClick={e => e.stopPropagation()} href="mailto:mail@blar.design">
            mail@blar.design
          </a>
        </div>
      </div>
    );
  }
}

export default App;
