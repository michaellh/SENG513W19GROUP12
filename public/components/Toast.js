import React, { Component } from 'react'

export default class Toast extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            notifications: [],
        }
        this.style = {
            position: 'absolute',
            right: 20,
            bottom: 100,
        }
    }
    
    componentWillReceiveProps({user}){
        const {notifications} = user;
        if (notifications){
            this.setState({notifications});
            setTimeout(() => {
                $('.toast').toast('show');
                $('.toast').on('hide.bs.toast', (e) => {
                    this.props.socket.emit('removeNotification', e.target.attributes.time.value);
                });
            }, 10);
        }
    }

    componentDidMount(){
        $('.toast').toast();
        $('.toast').toast('show');
        $('.toast').on('hide.bs.toast', (e) => {
            this.props.socket.emit('removeNotification', e.target.attributes.time.value);
        });
    }


    render() {
        const notifications = this.state.notifications.reverse().map((notification) => {
            return(
                <div key={notification.time} time={notification.time} role="alert" aria-live="assertive" aria-atomic="true" className="toast" data-autohide={!!notification.autohide} data-delay={notification.delay}>
                <div className="toast-header" style={{backgroundColor:notification.color}}>
                    <strong className="mr-auto">{notification.title}</strong>
                    <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="toast-body">
                    {notification.message}
                </div>
                </div>
            )
        })

        return (
        <div style={this.style} >
            {notifications}
        </div>
        )
    }
}
