// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import {Modal} from 'react-bootstrap';

import {ModalIdentifiers} from 'utils/constants';

export default class CustomStatusModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.modalState.open,
            status: this.props.currentUserStatus,
            customStatus: this.props.currentUserCustomStatus,
            duration: 'none'
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

        const {currentUserId} = this.props;
        const {customStatus, status} = this.state;

        this.props.actions.setStatus({
            user_id: currentUserId,
            status,
            custom_text: customStatus
        });
    };

    handleInputChange = (event) => {
        const {target: {value, name}} = event;
        this.setState({[name]: value});
    }

    componentDidUpdate(prevProps) {
        if (prevProps.modalState.open !== this.props.modalState.open) {
            this.setState({show: this.props.modalState.open});
        }
        if (prevProps.modalState.dialogProps !== this.props.modalState.dialogProps) {
            this.setState({customStatus: this.props.modalState.dialogProps});
        }
        if (prevProps.currentUserStatus !== this.props.currentUserStatus) {
            this.setState({status: this.props.currentUserStatus});
        }
        if (prevProps.currentUserCustomStatus !== this.props.currentUserCustomStatus) {
            this.setState({customStatus: this.props.currentUserCustomStatus});
        }
    }

    render() {
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
                        <div className='form-row'>
                            <div className='form-group col-sm-12'>
                                <input
                                    name='customStatus'
                                    autoFocus={true}
                                    className='form-control'
                                    type='text'
                                    placeholder='A status can be of maximum 25 characters'
                                    value={this.state.customStatus}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </div>
                        <div className='form-row mt-3'>
                            <div className='form-group col-sm-6 mt-3'>
                                <label htmlFor='custom-status-mark-as-select'>
                                    {'Mark it as'}
                                </label>
                                <select
                                    id='custom-status-mark-as-select'
                                    name='status'
                                    className='form-control'
                                    value={this.state.status}
                                    onChange={this.handleInputChange}
                                >
                                    <option value={'online'}>{'Online'}</option>
                                    <option value={'away'}>{'Away'}</option>
                                    <option value={'dnd'}>{'Do not disturb'}</option>
                                    <option value={'offline'}>{'Offline'}</option>
                                </select>
                            </div>
                            <div className='form-group col-sm-6 mt-3'>
                                <label htmlFor='custom-status-clear-select'>
                                    {'Clear after'}
                                </label>
                                <select
                                    id='custom-status-clear-select'
                                    name='duration'
                                    className='form-control'
                                    value={this.state.duration}
                                    onChange={this.handleInputChange}
                                >
                                    <option value={'none'}>{'Dont clear'}</option>
                                    <option value={'half-hour'}>{'30 minutes'}</option>
                                    <option value={'one-hour'}>{'1 hour'}</option>
                                    <option value={'two-hour'}>{'2 hour'}</option>
                                    <option value={'today'}>{'Today'}</option>
                                    <option value={'week'}>{'This week'}</option>
                                    <option value={'custom'}>{'Choose date & time'}</option>
                                </select>
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