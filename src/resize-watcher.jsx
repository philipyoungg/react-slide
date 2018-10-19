import React from "react";

class ResizeWatcher extends React.Component {
  componentDidMount() {
    window.addEventListener("resize", this._handleResize);
    this._handleResize();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this._handleResize);
  }

  _handleResize = () => {
    const { width, height } = this._container.getBoundingClientRect();
    this.props.onResize({ width, height });
    if (this.props.getDimensionOnce) {
      window.removeEventListener("resize", this._handleResize);
    }
  };
  render() {
    const childElement = React.Children.only(this.props.children);
    return React.cloneElement(childElement, {
      ref: r => (this._container = r)
    });
  }
}

ResizeWatcher.defaultProps = {
  onResize: () => {},
  getDimensionOnce: false
};

export default ResizeWatcher;
