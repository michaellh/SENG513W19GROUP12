import React, {Component} from 'react';
import TopBar from './SideArea/TopBar'
import SideMode from './SideArea/SideMode'
import Chats from './SideArea/Chats'
import Friends from './SideArea/Friends'

export default class SideArea extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            mode : 'chat',
            chats: ['Chat1', 'Chat2'],
            friends: ['Friend1', 'Friend2', 'Friend3'],
        }

        this.updateMode = this.updateMode.bind(this);
        // console.log(this.props);
    }

    updateMode(mode){
        this.setState({mode:mode});
    }
    
    render() {
        const style = {
            border: '2px solid black',
            height: '100%'
        }
        return (
            <div className={this.props.className} style={style}>
                <TopBar />
                <SideMode updateMode={this.updateMode} />
                <br />
                {
                    this.state.mode == 'chat' ? 
                    (<Chats chats={this.state.chats} chooseChat={this.props.chooseChat}/>) :
                    (<Friends friends={this.state.friends} />)
                }
            </div>
        )
    }
}