// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {Modal} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

import SwitchChannelProvider from 'components/suggestion/switch_channel_provider.jsx';
import SuggestionBox from 'components/suggestion/suggestion_box.jsx';
import SuggestionList from 'components/suggestion/suggestion_list.jsx';

import * as Utils from 'utils/utils.jsx';

export default class AddUserToChannelModal extends React.Component {
    static propTypes = {
        onHide: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
        channelMembers: PropTypes.object.isRequired,
        actions: PropTypes.shape({
            addChannelMember: PropTypes.func.isRequired,
            getChannelMember: PropTypes.func.isRequired,
            autocompleteChannelsForSearch: PropTypes.func.isRequired,
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
        this.suggestionProviders = [new SwitchChannelProvider()];
        this.enableChannelProvider();
    }

    onChange = (e) => {
        this.setState({text: e.target.value});
    }

    onHide = () => {
        this.setState({show: false});
    }

    handleInviteError = (error) => {
        if (error) {
            this.setState({inviteError: error.message, saving: false});
            return;
        }
        this.onHide();
    }

    focusTextbox() {
        if (this.channelSearchBox == null) {
            return;
        }

        const textbox = this.channelSearchBox.getTextbox();
        if (document.activeElement !== textbox) {
            textbox.focus();
            Utils.placeCaretAtEnd(textbox);
        }
    }

    setSearchBoxRef = (input) => {
        this.channelSearchBox = input;
        this.focusTextbox();
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

    enableChannelProvider() {
        this.suggestionProviders[0].disableDispatches = false;
    }

    isUserMemberOfChannel = () => {
        const channel = this.state.selectedChannel;
        if (!channel) {
            return false;
        }
        const user = this.props.user;
        const memberships = this.props.channelMembers;
        if (!memberships[channel.id]) {
            return false;
        }
        return Boolean(memberships[channel.id][user.id]);
    }

    render() {
        const user = this.props.user;

        const userIsMemberOfSelectedChannel = this.isUserMemberOfChannel();

        let inviteError;
        if (this.state.inviteError) {
            inviteError = (<label className='has-error control-label'>{this.state.inviteError}</label>);
        } else if (userIsMemberOfSelectedChannel) {
            inviteError = (<label className='has-error control-label'>{'User is already in the channel'}</label>);
        }

        const help = (
            <FormattedMessage
                id='quick_switch_modal.help_no_team'
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

        const shouldDisableAddButton = Boolean(!this.state.selectedChannel) || this.state.checkingForMembership || userIsMemberOfSelectedChannel || this.state.saving;

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
                            defaultMessage='Add {first_name} {last_name} to a channel.'
                            values={{
                                first_name: user.first_name,
                                last_name: user.last_name,
                            }}
                        />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal__hint'>
                        {help}
                    </div>
                    {content}
                    {inviteError}
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
