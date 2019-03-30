import React, {Component} from 'react';
import TopBar from './SideArea/TopBar'
import SideControl from './SideArea/SideControl'
import Chats from './SideArea/Chats'
import Friends from './SideArea/Friends'

export default class SideArea extends Component {
    constructor(props) {
        super(props)
        
        this.chats = ['Chat1', 'Chat2'];
        this.friends = ['Friend1', 'Friend2', 'Friend3'];

        this.state = {
            mode : 'chats',
            chats: this.chats,
            friends: this.friends,
        }

        this.updateMode = this.updateMode.bind(this);
        this.filterResult = this.filterResult.bind(this);
        // console.log(this.props);
    }

    updateMode(mode){
        this.setState({mode:mode});
    }
    
    filterResult(term){
        let currentMode = this.state.mode;
        let list = currentMode == 'chats' ? this.chats : this.friends;
        let filteredResult = list.filter(d => d.includes(term));
        
        if(currentMode == 'chats'){
            this.setState({chats:filteredResult});
        }
        else{
            this.setState({friends:filteredResult});
        }
        
    }

    render() {
        const style = {
            border: '2px solid black',
            height: '100%'
        }
        return (
            <div className={this.props.className} style={style}>
                <TopBar />
                <SideControl updateMode={this.updateMode} filterResult={this.filterResult} />
                <br />
                {
                    this.state.mode == 'chats' ? 
                    (<Chats chats={this.state.chats} chooseChat={this.props.chooseChat}/>) :
                    (<Friends friends={this.state.friends} />)
                }
            </div>
        )
    }
}