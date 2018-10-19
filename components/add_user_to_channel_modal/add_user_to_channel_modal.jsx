// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {Modal} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

import * as UserUtils from 'mattermost-redux/utils/user_utils';

import SearchChannelWithPermissionsProvider from 'components/suggestion/search_channel_with_permissions_provider.jsx';
import SuggestionBox from 'components/suggestion/suggestion_box.jsx';
import SuggestionList from 'components/suggestion/suggestion_list.jsx';

import * as Utils from 'utils/utils.jsx';

export default class AddUserToChannelModal extends React.Component {
    static propTypes = {

        /**
         * Function that's called when modal is closed
         */
        onHide: PropTypes.func.isRequired,

        /**
         * The user that is being added to a channel
         */
        user: PropTypes.object.isRequired,

        /**
         * Object used to determine if the user
         * is a member of a given channel
         */
        channelMembers: PropTypes.object.isRequired,

        actions: PropTypes.shape({

            /**
             * Function to add the user to a channel
             */
            addChannelMember: PropTypes.func.isRequired,

            /**
             * Function to fetch the user's channel membership
             */
            getChannelMember: PropTypes.func.isRequired,
        }).isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            show: true,
            saving: false,
            loadingChannels: false,
            checkingForMembership: false,
            text: '',
            selectedChannel: null,
            inviteError: '',
        };
        this.suggestionProviders = [new SearchChannelWithPermissionsProvider()];
        this.enableChannelProvider();
    }

    enableChannelProvider = () => {
        this.suggestionProviders[0].disableDispatches = false;
    }

    focusTextbox = () => {
        if (this.channelSearchBox == null) {
            return;
        }

        const textbox = this.channelSearchBox.getTextbox();
        if (document.activeElement !== textbox) {
            textbox.focus();
            Utils.placeCaretAtEnd(textbox);
        }
    }

    onChange = (e) => {
        this.setState({text: e.target.value, selectedChannel: null});
    }

    onHide = () => {
        this.setState({show: false});
    }

    setSearchBoxRef = (input) => {
        this.channelSearchBox = input;
        this.focusTextbox();
    }

    handleInviteError = (error) => {
        if (error) {
            this.setState({inviteError: error.message, saving: false});
            return;
        }
        this.onHide();
    }

    didSelectChannel = (selection) => {
        const channel = selection.channel;
        const userId = this.props.user.id;

        this.setState({
            text: channel.display_name,
            selectedChannel: channel,
            checkingForMembership: true,
            inviteError: '',
        });

        this.props.actions.getChannelMember(channel.id, userId).then(() => {
            this.setState({checkingForMembership: false});
        });
    }

    handleSubmit = () => {
        const channel = this.state.selectedChannel;
        const user = this.props.user;

        if (!channel) {
            return;
        }

        this.setState({saving: true});

        this.props.actions.addChannelMember(channel.id, user.id).then(({error}) => {
            this.handleInviteError(error);
        });
    }

    isUserMemberOfChannel = (channel) => {
        const user = this.props.user;
        const memberships = this.props.channelMembers;

        if (!channel) {
            return false;
        }

        if (!memberships[channel.id]) {
            return false;
        }

        return Boolean(memberships[channel.id][user.id]);
    }

    render() {
        const user = this.props.user;
        const channel = this.state.selectedChannel;
        const targetUserIsMemberOfSelectedChannel = this.isUserMemberOfChannel(channel);

        let name = UserUtils.getFullName(user);
        if (!name) {
            name = `@${user.username}`;
        }

        let inviteError;
        if (!this.state.saving) {
            if (this.state.inviteError) {
                inviteError = (<label className='has-error control-label'>{this.state.inviteError}</label>);
            } else if (targetUserIsMemberOfSelectedChannel) {
                inviteError = (<label className='has-error control-label'>{`${name} is already a member of that channel`}</label>);
            }
        }

        const help = (
            <FormattedMessage
                id='add_user_to_channel_modal.help'
                defaultMessage='Type to find a channel. Use ↑↓ to browse, ↵ to select, ESC to dismiss.'
            />
        );

        const content = (
            <SuggestionBox
                ref={this.setSearchBoxRef}
                className='form-control focused'
                onChange={this.onChange}
                value={this.state.text}
                onKeyDown={this.handleKeyDown}
                onItemSelected={this.didSelectChannel}
                listComponent={SuggestionList}
                maxLength='64'
                providers={this.suggestionProviders}
                listStyle='bottom'
                completeOnTab={false}
                renderDividers={false}
                delayInputUpdate={true}
                openWhenEmpty={true}
            />
        );

        const shouldDisableAddButton = targetUserIsMemberOfSelectedChannel ||
            this.state.checkingForMembership ||
            Boolean(!this.state.selectedChannel) ||
            this.state.saving;

        return (
            <Modal
                dialogClassName='modal--overflow'
                show={this.state.show}
                onHide={this.onHide}
                onExited={this.props.onHide}
                ref='modal'
                enforceFocus={true}
            >
                <Modal.Header closeButton={true}>
                    <Modal.Title>
                        <FormattedMessage
                            id='add_user_to_channel.title'
                            defaultMessage='Add {name} to a channel.'
                            values={{
                                name,
                            }}
                        />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal__hint'>
                        {help}
                    </div>
                    {content}
                    <div className='form-group has-error'>
                        <br/>
                        {inviteError}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type='button'
                        className='btn btn-link'
                        onClick={this.onHide}
                    >
                        <FormattedMessage
                            id='add_user_to_channel_modal.cancel'
                            defaultMessage='Cancel'
                        />
                    </button>
                    <button
                        type='button'
                        className='btn btn-primary'
                        onClick={this.handleSubmit}
                        disabled={shouldDisableAddButton}
                    >
                        <FormattedMessage
                            id='add_user_to_channel_modal.add'
                            defaultMessage='Add'
                        />
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}
