import React from "react";
import ReactDOM from "react-dom";
import Carousell from "./carousell";

import "./styles.css";

const log = console.log.bind(console);

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

class App extends React.Component {
  state = { type: "HORIZONTAL" };
  _handleChangeType = e =>
    this.setState({ type: e.target.getAttribute("type") });
  render() {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100vw"
        }}
      >
        <Carousell direction={this.state.type}>
          {({
            transformSlides,
            index,
            totalItems,
            goToSlide,
            nextSlide,
            prevSlide
          }) => (
            <div style={{ position: "relative" }}>
              {transformSlides(
                items.map((item, i) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "5rem",
                      padding: "8rem",
                      color: "white",
                      fontWeight: "bold",
                      backgroundImage: `url(https://source.unsplash.com/random?sig=${i})`,
                      backgroundSize: "cover",
                      height: "100vh"
                    }}
                  >
                    <div>{item}</div>
                  </div>
                ))
              )}
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  top: ".5rem"
                }}
              >
                {["HORIZONTAL", "VERTICAL"].map(type => (
                  <div
                    key={type}
                    type={type}
                    style={{
                      padding: ".25rem 1rem",
                      margin: ".25rem",
                      fontFamily: "sans-serif",
                      color: "white",
                      fontSize: ".25rem",
                      borderRadius: "1rem",
                      background: "rgba(0,0,0,0.5)",
                      cursor: "pointer",
                      fontWeight: this.state.type === type ? "bold" : ""
                    }}
                    onClick={this._handleChangeType}
                  >
                    {type}
                  </div>
                ))}
              </div>
              <button
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  left: "1rem",
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "100%",
                  cursor: "pointer"
                }}
                onClick={prevSlide}
              />
              <button
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  right: "1rem",
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "100%",
                  cursor: "pointer"
                }}
                onClick={nextSlide}
              />
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  bottom: "1rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.5)",
                  borderRadius: "1rem",
                  padding: "0 .5rem"
                }}
              >
                {items.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => goToSlide(i)}
                    style={{
                      cursor: "pointer",
                      borderRadius: "100%",
                      margin: ".5rem",
                      width: ".5rem",
                      height: ".5rem",
                      backgroundColor: index === i ? "white" : "grey"
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </Carousell>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
