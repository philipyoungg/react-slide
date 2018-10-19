import React from "react";

const STATUS = {
  IDLE: "IDLE",
  DRAGGING: "DRAGGING"
};

const DEFAULT_STATE = {
  startX: 0,
  endX: 0,
  startY: 0,
  endY: 0,
  status: STATUS.IDLE
};

class Swipeable extends React.Component {
  state = DEFAULT_STATE;

  componentDidMount() {
    this._container.addEventListener("mousedown", this._handleMouseStart);
    this._container.addEventListener("mouseup", this._handleMouseEnd);
    this._container.addEventListener("mouseleave", this._handleMouseEnd);
    this._container.addEventListener("mousemove", this._handleMouseMove);
    this._container.addEventListener("touchstart", this._handleMouseStart);
    this._container.addEventListener("touchend", this._handleMouseEnd);
    this._container.addEventListener("touchmove", this._handleMouseMove);
  }

  componentWillUnmount() {
    this._container.removeEventListener("mousedown", this._handleMouseStart);
    this._container.removeEventListener("mouseup", this._handleMouseEnd);
    this._container.removeEventListener("mouseleave", this._handleMouseEnd);
    this._container.removeEventListener("mousemove", this._handleMouseMove);
    this._container.removeEventListener("touchstart", this._handleMouseStart);
    this._container.removeEventListener("touchend", this._handleMouseEnd);
    this._container.removeEventListener("touchmove", this._handleMouseMove);
  }

  _getCurrentPosition = e => {
    const isTouch = "changedTouches" in e;
    const x = isTouch ? e.changedTouches[0].clientX : e.clientX;
    const y = isTouch ? e.changedTouches[0].clientY : e.clientY;
    return { x, y };
  };

  _handleMouseStart = e => {
    const { x, y } = this._getCurrentPosition(e);

    const state = {
      startX: x,
      startY: y,
      endX: x,
      endY: y,
      status: STATUS.DRAGGING
    };

    this.setState(state);
    this.props.onSwipeStart(state);
  };

  _handleMouseEnd = e => {
    const deltaX = this.state.endX - this.state.startX;
    const deltaY = this.state.endY - this.state.startY;
    const data = { ...this.state, deltaX, deltaY };

    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > this.props.tolerance
    ) {
      deltaX > 0 ? this.props.onSwipeLeft(data) : this.props.onSwipeRight(data);
    } else if (Math.abs(deltaY) > this.props.tolerance) {
      deltaY > 0 ? this.props.onSwipeDown(data) : this.props.onSwipeUp(data);
    }

    this.setState(DEFAULT_STATE);
    this.props.onSwipeEnd(data);
  };

  _handleMouseMove = e => {
    if (this.state.status === STATUS.DRAGGING) {
      const { x, y } = this._getCurrentPosition(e);

      const deltaX = this.state.endX - this.state.startX;
      const deltaY = this.state.endY - this.state.startY;
      const data = { ...this.state, deltaX, deltaY };

      this.setState(prevState => {
        return {
          endX: x,
          endY: y
        };
      });
      this.props.onSwipe(data);
    }
  };

  render() {
    const childElement = React.Children.only(this.props.children);
    return React.cloneElement(childElement, {
      ref: r => (this._container = r)
    });
  }
}

const noop = () => {};

Swipeable.defaultProps = {
  onSwipeDown: noop,
  onSwipeUp: noop,
  onSwipeLeft: noop,
  onSwipeRight: noop,
  onSwipe: noop,
  onSwipeEnd: noop,
  onSwipeStart: noop,
  tolerance: 20
};

export default Swipeable;
