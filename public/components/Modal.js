import React from 'react'

export default function Modal(props) {

    const {title, component, custom} = props.modal;

    return (
        <div className="modal fade" id="myModal" role="dialog" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                {// Defined Modal Content in Custom
                    custom ? component : 
                    <div>
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                            {component}
                            {/* <form style={{margin:0,padding:0}}>
                                <div className="modal-body" id='modalBody'>
                            
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-secondary" data-dismiss="modal" onClick={() => {submit(document.querySelector('#modalBody'))}}>Okay</button>
                                    <button type="button" className="btn btn-primary">Save changes</button>
                                </div>
                            </form> */}
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}
