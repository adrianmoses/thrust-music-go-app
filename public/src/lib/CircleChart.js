import React from 'react';
import { VictoryAnimation, VictoryPie, VictoryLabel } from 'victory';

// http://www.adeveloperdiary.com/d3-js/how-to-create-progress-chart-using-d3-js/

export default class CircleChart extends React.Component {
    constructor() {
      super();
      this.state = {
        percent: 25, 
        data: this.getData(0)
      };
    }

    componentDidMount() {
      let percent = 25;
      percent += (Math.random() * 25);
      percent = (percent > 100) ? 0 : percent;
      this.setState({
        percent, data: this.getData(percent)
      });
    }

    getData(percent) {
      return [{x: 1, y: percent}, {x: 2, y: 100 - percent}];
    }
    render() {

        return (
          <div style={{
              width: "300px", height: "300px",
              display: "inline-block",
              float: "right"
            }}>
            <svg viewBox="0 0 400 400" width="300" height="300">
              <VictoryPie
                animate={{duration: 1000}}
                width={400} height={400}
                data={this.state.data}
                innerRadius={150}
                cornerRadius={25}
                labels={() => null}
                style={{
                  data: { fill: (d) => {
                    const color = "#00aced";
                    return d.x === 1 ? color : "transparent";
                  }
                 }
                }}
              />
              <VictoryAnimation duration={1000} data={this.state}>
                {(newProps) => {
                  return (
                    <VictoryLabel
                      textAnchor="middle" verticalAnchor="middle"
                      x={200} y={200}
                      text={`${Math.round(newProps.percent)}%`}
                      style={{ fontSize: 45 }}
                    />
                  );
                }}
              </VictoryAnimation>
            </svg>
          </div>
        ) 
    }
}