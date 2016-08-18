import React , { Component }  from 'react';
class Html extends Component {
    constructor(props) {
        super(props);
        this.state = {...props.formData};
    }

    onChange(name) {
        return (event) => {
            this.setState({[name]: parseFloat(event.target.value)});
            setImmediate(() => this.props.onChange(this.state));
        };
    }

    render() {
        const {lat, lon} = this.state;
        return (
            <div dangerouslySetInnerHTML={{__html:this.props.uiSchema['ui:html']}} />
        );
    }
}

export default Html;
