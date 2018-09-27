import React from 'react';
import { VictoryChart, VictoryLine } from 'victory';


export default class LineChart extends React.Component {
    render() {

        const data = [
            {x: 1, y: 5},
            {x: 2, y: 12},
            {x: 3, y: 18},
            {x: 4, y: 23},
            {x: 5, y: 50},
            {x: 6, y: 65},
            {x: 7, y: 120}
        ];
        const width = 550;
        const height = 300;

        return (
            <div style={{
                width: "500px", height: "300px",
                display: "inline-block",
              }}>
                <VictoryChart>
                    <VictoryLine
                        data={data}
                    />
                </VictoryChart>
            </div>
        ) 
    }
}