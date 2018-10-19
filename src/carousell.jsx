import React from "react";
import Swipeable from "./swipeable";
import ResizeWatcher from "./resize-watcher";

const sum = arr => arr.reduce((acc, v) => acc + v, 0);

class Carousell extends React.Component {
  state = { index: 0, swipeOffset: 0, width: 0, heights: [] };

  _goToSlide = index => this.setState({ index });

  _nextSlide = () =>
    this.setState(prevState => ({
      index: Math.min(this.state.heights.length - 1, prevState.index + 1)
    }));

  _prevSlide = () =>
    this.setState(prevState => ({ index: Math.max(0, prevState.index - 1) }));

  _handleSwipeLeft = ({ deltaX }) => {
    if (
      Math.abs(deltaX) >= this.state.width / 10 &&
      this.props.direction === "HORIZONTAL"
    ) {
      this._prevSlide();
    }
  };

  _handleSwipeRight = ({ deltaX }) => {
    if (
      Math.abs(deltaX) >= this.state.width / 10 &&
      this.props.direction === "HORIZONTAL"
    ) {
      this._nextSlide();
    }
  };

  _handleSwipeDown = ({ deltaY }) => {
    if (
      Math.abs(deltaY) >= this._getCurrentHeight() / 10 &&
      this.props.direction === "VERTICAL"
    ) {
      this._prevSlide();
    }
  };

  _handleSwipeUp = ({ deltaY }) => {
    if (
      Math.abs(deltaY) >= this._getCurrentHeight() / 10 &&
      this.props.direction === "VERTICAL"
    ) {
      this._nextSlide();
    }
  };

  _handleSwipe = ({ deltaX, deltaY }) =>
    this.setState({
      swipeOffset: {
        HORIZONTAL: deltaX,
        VERTICAL: deltaY
      }[this.props.direction]
    });

  _handleSwipeStart = () => this.setState({ dragging: true });

  _handleSwipeEnd = () =>
    this.setState({
      dragging: false,
      swipeOffset: 0
    });

  _handleResize = ({ width }) => {
    this.setState({ width });
  };

  _getCurrentHeight = () => this.state.heights[this.state.index];

  _renderComponent = slides => (
    <ResizeWatcher onResize={this._handleResize}>
      <div
        style={{
          overflow: "hidden",
          transition: `0.3s cubic-bezier(0.165, 0.84, 0.44, 1)`,
          height:
            this.props.direction === "VERTICAL" ? this._getCurrentHeight() : ""
        }}
      >
        <Swipeable
          onSwipeLeft={this._handleSwipeLeft}
          onSwipeRight={this._handleSwipeRight}
          onSwipeUp={this._handleSwipeUp}
          onSwipeDown={this._handleSwipeDown}
          onSwipe={this._handleSwipe}
          onSwipeStart={this._handleSwipeStart}
          onSwipeEnd={this._handleSwipeEnd}
        >
          <div
            style={{
              width:
                this.props.direction === "HORIZONTAL"
                  ? `${slides.length * this.state.width}px`
                  : "",
              height:
                this.props.direction === "HORIZONTAL"
                  ? ""
                  : `${sum(this.state.heights)}px`,
              transform:
                this.props.direction === "HORIZONTAL"
                  ? `translateX(calc(${this.state.swipeOffset}px - ${this.state
                      .index * this.state.width}px))`
                  : `translateY(calc(${this.state.swipeOffset}px - ${sum(
                      this.state.heights.slice(0, this.state.index)
                    )}px)`,
              transition: this.state.dragging
                ? ""
                : `0.3s cubic-bezier(0.165, 0.84, 0.44, 1)`
            }}
          >
            {slides.map((slide, i) => (
              <ResizeWatcher
                key={i}
                getDimensionOnce
                onResize={({ height }) =>
                  this.setState(prevState => {
                    const heights = prevState.heights.slice();
                    heights[i] = height;
                    return { heights };
                  })
                }
              >
                <div
                  style={{
                    display:
                      this.props.direction === "HORIZONTAL"
                        ? "inline-block"
                        : "block",
                    width: this.state.width,
                    height:
                      this.props.direction === "VERTICAL"
                        ? this.state.heights[i]
                        : ""
                  }}
                >
                  {slide}
                </div>
              </ResizeWatcher>
            ))}
          </div>
        </Swipeable>
      </div>
    </ResizeWatcher>
  );

  render() {
    return this.props.children({
      transformSlides: this._renderComponent,
      goToSlide: this._goToSlide,
      nextSlide: this._nextSlide,
      prevSlide: this._prevSlide,
      index: this.state.index
    });
  }
}

Carousell.defaultProps = {
  direction: "HORIZONTAL",
  style: {}
};

export default Carousell;
