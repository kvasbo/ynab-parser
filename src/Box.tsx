import React from 'react';

interface Props {
    render: boolean;
}

class Box extends React.PureComponent<Props, {}> {
    render(): JSX.Element | null {
        if (!this.props.render || !this.props.children) return null;
        return <div>{this.props.children}</div>;
    }
}

export default Box;
