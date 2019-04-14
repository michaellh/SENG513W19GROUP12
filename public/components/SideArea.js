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
            chatHeight: 0,
        }

        this.updateMode = this.updateMode.bind(this);
        this.filterResult = this.filterResult.bind(this);
        this.updateChatHeight = this.updateChatHeight.bind(this);

        props.socket.on('chatlist', chats => {
            // Updating the user object
            let user = {...this.props.user};
            user.chats = chats;
            this.props.updateUser(user);
            // ComponentWillReceiveProps will update everything
        });


        props.socket.on('friendlist', friends => {
            // Updating the user object
            let user = {...this.props.user};
            user.friends = friends;
            this.props.updateUser(user);
            // ComponentWillReceiveProps will update everything
        });
    }

    componentWillReceiveProps(newProp){
        const {chats, friends} = newProp.user;
        this.chats = chats;
        this.friends = friends;
        this.setState({chats, friends});

        // apply back filter
        this.filterResult(this.state.searchTerm);
    }

    componentDidMount(){
        this.updateChatHeight();
        window.addEventListener('resize', this.updateChatHeight);
    }

    updateChatHeight(){
        const windowHeight = parseInt(window.innerHeight);     
        const topSectionHeight = $('#side_topSection').outerHeight(true);

        const chatHeight = windowHeight - topSectionHeight - 20 + 'px';
        this.setState({chatHeight})
    }

    updateMode(mode){
        this.setState({mode:mode});
    }

    filterResult(searchTerm){
        this.setState({searchTerm});
        let currentMode = this.state.mode;
        let list = currentMode == 'chats' ? this.chats : this.friends;
        let filteredResult = currentMode == 'chats' ? list.filter(d => d.name.includes(searchTerm)) : list.filter(d => d.includes(searchTerm));
	
        if(currentMode == 'chats'){
            this.setState({chats:filteredResult});
        }
        else{
            this.setState({friends:filteredResult});
        }

    }

    render() {
        return (
            <div className={this.props.className} id={this.props.id}>
                <div id='side_topSection'>
                    <TopBar modal={this.props.modal} user={this.props.user} toggleSplitScreen={this.props.toggleSplitScreen} toggleNotification={this.props.toggleNotification}  splitScreenState={this.props.splitScreenState} notificationState={this.props.notificationState} resetChat={this.props.resetChat} logout={this.props.logout}/>
                    <SideControl updateMode={this.updateMode} filterResult={this.filterResult} modal={this.props.modal} socket={this.props.socket} mode={this.state.mode}/>
                </div>
                <div style={{height:this.state.chatHeight,overflowY:'auto',overflowX:'hidden'}}>
                    {
                        this.state.mode == 'chats' ? 
                        (<Chats chats={this.state.chats} chooseChat={this.props.chooseChat} chosenChat={this.props.chosenChat} deleteChat={this.deleteChat} resetChat={this.props.resetChat} />) :
                        (<Friends friends={this.state.friends} chats={this.state.chats} chooseChat={this.props.chooseChat} chosenChat={this.props.chosenChat} deleteChat={this.deleteChat} resetChat={this.props.resetChat} socket={this.props.socket} />)
                    }
                </div>
            </div>
        )
    }
}
