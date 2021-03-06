import React, { Component } from 'react';
import * as S from './styles.js'
import _ from 'lodash';
import { observer } from 'mobx-react';

const LayeredCanvas = observer(props => (
  <S.LayeredCanvas
    onWheel={props.onWheel}
    onMouseEnter={props.onMouseEnter}
    onMouseLeave={props.onMouseLeave} >
    { _.map(_.filter(props.layers, layer => !layer.isHidden), (layer, idx) => (
      <CustomCanvas
        zIndex={idx}
        key={layer.id}
        layer={layer}
        scale={props.scale}
        translateX={props.translateX}
        translateY={props.translateY}
        onCanvasMouseDown={props.onCanvasMouseDown}
        onCanvasMouseUp={props.onCanvasMouseUp}
        onCanvasDraw={props.onCanvasDraw}
        selected={props.selectedLayer === layer.id} />
    )) }
  </S.LayeredCanvas>
));

class CustomCanvas extends Component {
  constructor (props) {
    super(props);
    this.canvasRef = React.createRef();
    this.mouseDown = false;

    this.renderImageData = _ => {
      const canvas = this.canvasRef.current;
      if (canvas) {
        canvas.width = this.props.layer.imageData.width;
        canvas.height = this.props.layer.imageData.height;
        const context = canvas.getContext('2d');
        context.putImageData(this.props.layer.imageData, 0, 0);
      }
    };

    this.callFuncWithInfo = (evt, func) => {
      const canvas = this.canvasRef.current;
      if (canvas) {
        const cr = canvas.getBoundingClientRect();
        const distanceFromLeft = evt.clientX - cr.left;
        const distanceFromTop = evt.clientY - cr.top;
        const percentageFromLeft = distanceFromLeft / cr.width;
        const percentageFromTop = distanceFromTop / cr.height;
        func(evt, canvas, this.props.layer.id, percentageFromLeft, percentageFromTop);
      }
    };

    this.onMouseDown = evt => {
      if (this.props.selected) {
        this.mouseDown = true;
        this.props.onCanvasMouseDown && this.callFuncWithInfo(evt, this.props.onCanvasMouseDown);
      }
    };

    this.onMouseUp = evt => {
      if (this.props.selected) {
        this.mouseDown = false;
        this.props.onCanvasMouseUp && this.callFuncWithInfo(evt, this.props.onCanvasMouseUp);
      }
    };

    this.onMouseMove = evt => {
      if (this.props.selected && this.mouseDown) {
        this.props.onCanvasDraw && this.callFuncWithInfo(evt, this.props.onCanvasDraw);
      }
    };
  }

  componentDidMount () {
    this.renderImageData();
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  componentWillUnmount () {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.layer.dirty.display) {
      this.renderImageData();
      nextProps.layer.dirty.display = false;
    }
    return true;
  }

  render () {
    return (
      <S.Canvas
        selected={this.props.selected}
        zIndex={this.props.zIndex}
        ref={this.canvasRef}
        scale={this.props.scale}
        translateX={this.props.translateX}
        translateY={this.props.translateY} >
      </S.Canvas>
    );
  }
}

export default LayeredCanvas;
