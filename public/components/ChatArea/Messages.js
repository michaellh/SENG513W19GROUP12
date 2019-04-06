import React, { Component } from 'react'

export default class Messages extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            
        }

        this.endMessageRef = React.createRef();

        this.fmtDate = this.fmtDate.bind(this);
        this.handleReact = this.handleReact.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.filterMessage = this.filterMessage.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);

    }

    scrollToBottom(){
        this.endMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    fmtDate(date){
        return `${date.getHours() < 10 ? '0'+date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()}`;
    }    
    // console.log(props);

    handleReact(date, userID, reactions, incReaction){
        this.props.socket.emit('messageReact', {chatID : this.props.chat.id, userID, date, reactions, incReaction});
    }

    handleDelete(date, userID){
        this.props.socket.emit('messageDelete', {chatID : this.props.chat.id, userID, date})
    }

    handleEdit(date, userID){
        // Message to be edited to
        let message = 'boo';
        this.props.socket.emit('messageEdit', {chatID : this.props.chat.id, userID, date, message})
    }

    filterMessage(searchTerm, message){
       return searchTerm ? message.split(searchTerm).join(`<span style='background-color:yellow'>${searchTerm}</span>`) : message
    };

    render() {
        const messages = this.props.messages.map((d,i) => {
            return (
                <div key={i} style={{textAlign: d.userID == this.props.user.id  ? 'right':'left'}}>
                    <div className='alert alert-primary m-2'>
                        [{this.fmtDate(d.date)}] {d.userName}: 
                        {this.props.searchTerm ? <span dangerouslySetInnerHTML={{__html:this.filterMessage(this.props.searchTerm, d.message)}}></span> : d.message}
                        
                        {/* {d.message} */}
                        {
                            // SHow reaction div if there is a reaction
                            d.reactions ? 
                            <div className='alert alert-secondary'>
                                {`[like:${d.reactions.like},${d.reactions.dislike}]`}
                            </div>
                            :
                            ''
                        }
                        <button onClick={() => this.handleReact(d.date, d.userID, d.reactions,'like')}>Like</button>
                        <button onClick={() => this.handleReact(d.date, d.userID, d.reactions,'dislike')}>Dislike</button>
                        <button onClick={() => this.handleDelete(d.date, d.userID)}>delete</button>
                        <button onClick={() => this.handleEdit(d.date, d.userID, d.message)}>Edit</button>
    
                        {/* <button className='btn btn-outline-primary' id={`message${i}`}><i className='fas fa-search'></i></button>
                        {createPopover(`message${i}`, <Reactions id={`message${i}`} />, {placement:'bottom'})} */}
                    </div>
                </div>
            )
        });

        return (
            <div className={this.props.className} id={this.props.id} style={{height:this.props.height}}>
                <div className='col-12'>
                    {messages}
                    <div ref={this.endMessageRef}></div>
                </div>
            </div>
        )
    }
}
