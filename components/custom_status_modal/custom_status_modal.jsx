// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import {Modal} from 'react-bootstrap';

import {ModalIdentifiers} from 'utils/constants';

export default class ResetStatusModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.modalState.open,
            customStatus: this.props.modalState.dialogProps
        };
    }

    hideModal = () => {
        this.setState({show: false});

        this.props.actions.closeModal(
            ModalIdentifiers.CUSTOM_STATUS,
        );
    };

    onConfirm = (event) => {
        if (event) {
            event.preventDefault();
        }
        this.hideModal();

        const newStatus = {...this.state.currentUserStatus};
        newStatus.status = this.state.newStatus;
        this.props.actions.setStatus(newStatus);
    };

    handleInputChange = (event) => {
        const {target: {value}} = event;
        this.setState({customStatus: value});
    }

    componentDidUpdate(prevProps) {
        if (prevProps.modalState.open !== this.props.modalState.open) {
            this.setState({show: this.props.modalState.open});
        }
        if (prevProps.modalState.dialogProps !== this.props.modalState.dialogProps) {
            this.setState({customStatus: this.props.modalState.dialogProps});
        }
    }

    render() {
        console.log('MODALSTate', this.props.modalState);
        console.log("state",this.state)
        const {show} = this.state;
        return (
            <Modal
                id='confirmModal'
                role='dialog'
                className={'modal-confirm '}
                dialogClassName='a11y__modal'
                show={show}
                onHide={this.hideModal}
                aria-labelledby='confirmModalLabel'
                centered={true}
            >
                <Modal.Header closeButton={true}>
                    <Modal.Title
                        componentClass='h1'
                        id='confirmModalLabel'
                    >
                        {'Set a status'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.onConfirm}>
                        <div className='form-group'>
                            <div className='row'>
                                <div className='col-sm-12'>
                                    <input
                                        autoFocus={true}
                                        className='form-control'
                                        type='text'
                                        placeholder='A status can be of maximum 25 characters'
                                        value={this.state.customStatus}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type='button'
                        className={'btn btn-primary'}
                        onClick={this.onConfirm}
                        id='confirmModalButton'
                    >
                        {'Save status'}
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}