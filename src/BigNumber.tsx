import React from 'react';
import './App.css';

export interface Style {
    [s: string]: string | number;
}

interface Props {
    isActive?: boolean;
    value: string;
}

const style: Style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '5vw',
    height: '5vw',
    fontSize: '5vw',
    borderRadius: '50%',
    backgroundColor: '#61dafb',
    color: '#ffffff',
    transition: 'all 1s ease',
};

class BigNumber extends React.PureComponent<Props, {}> {
    getStyle(): Style {
        const out: Style = { ...style };
        if (!this.props.isActive) {
            out.backgroundColor = 'rgb(200,200,200)';
        }
        return out;
    }

    render(): JSX.Element {
        return <div style={this.getStyle()}>{this.props.value}</div>;
    }
}

export default BigNumber;
