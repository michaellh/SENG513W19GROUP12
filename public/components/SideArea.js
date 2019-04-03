import React, {Component} from 'react';
import TopBar from './SideArea/TopBar'
import SideControl from './SideArea/SideControl'
import Chats from './SideArea/Chats'
import Friends from './SideArea/Friends'

export default class SideArea extends Component {
    constructor(props) {
        super(props)
        
        this.chats = [];
        this.friends = [];

        this.state = {
            mode : 'chats',
            chats: this.chats,
            friends: this.friends,
            searchTerm: '',
        }

        this.updateMode = this.updateMode.bind(this);
        this.filterResult = this.filterResult.bind(this);
        this.deleteChat = this.deleteChat.bind(this);
        // console.log(this.props);

        props.socket.on('chatlist', chats => {
            this.chats = chats;
            this.setState({chats});
            // apply back filter
            this.filterResult(this.state.searchTerm);
            // props.chooseChat(this.state.chats[0]);
        });


        props.socket.on('friendlist', friends => {
            this.friends = friends;
            this.setState({friends});
            // apply back filter
            this.filterResult(this.state.searchTerm);
        });
    }

    componentWillReceiveProps(newProp){
        const {chats, friends} = newProp.user;
        this.chats = chats;
        this.friends = friends;
        this.setState({chats, friends});
    }

    updateMode(mode){
        this.setState({mode:mode});
    }
    
    filterResult(term){
        this.setState({searchTerm:term});
        let currentMode = this.state.mode;
        let list = currentMode == 'chats' ? this.chats : this.friends;
        let filteredResult = list.filter(d => d.name.includes(term));
        
        if(currentMode == 'chats'){
            this.setState({chats:filteredResult});
        }
        else{
            this.setState({friends:filteredResult});
        }

    }

    deleteChat(chat){
        this.props.socket.emit('deleteChat', chat);
    }

    render() {
        return (
            <div className={this.props.className} id={this.props.id}>
                <TopBar modal={this.props.modal}/>
                <SideControl updateMode={this.updateMode} filterResult={this.filterResult} modal={this.props.modal} socket={this.props.socket} mode={this.state.mode}/>
                <br />
                {
                    this.state.mode == 'chats' ? 
                    (<Chats chats={this.state.chats} chooseChat={this.props.chooseChat} chosenChat={this.props.chosenChat} deleteChat={this.deleteChat}/>) :
                    (<Friends friends={this.state.friends} />)
                }
            </div>
        )
    }
}