import React, { Component } from 'react'

export default function ManageUser(props) {
    const members = props.chat.members.map((d,i) => {
        return (
            <div key={i} className='row'>
                <div className='col-5'>
                    <h5>{d.name}</h5>
                </div>
                <div className='col-5 form-group'>
                    {
                        d.role=='member'?
                        <select className='form-control'>
                            <option value='member'>Member</option>
                            <option value='admin'>Admin</option>
                        </select>
                        :
                        <select className='form-control'>
                            <option value='admin'>Admin</option>
                            <option value='member'>Member</option>
                        </select>
                    }
                </div>
            </div>
        )
    });

    let handleSave = (e) => {
    }


    return (
        <div>
                <div className='modal-body' id='modalBody'>
                    {members}
                </div>
                <div className='modal-footer'>
                    <button className='btn btn-secondary' data-dismiss='modal'>Cancel</button>
                    <button className='btn btn-primary' data-dismiss='modal' onClick={handleSave}>Save</button>
                </div>
            </div>
    )
}
