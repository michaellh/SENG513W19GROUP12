import React, { Component } from 'react'

export default function ManageUser(props) {

    let handleClick = (e) => {
    }
    
    return (
        <div className="modal-footer">
            <button className="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button className="btn btn-danger" data-dismiss="modal" onClick={handleClick}>Okay</button>
        </div>
    )
}
