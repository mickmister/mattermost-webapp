// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';
import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';
import {haveICurrentTeamPermission} from 'mattermost-redux/selectors/entities/roles';
import {Permissions} from 'mattermost-redux/constants';

import {openModal} from 'actions/views/modals';

import {areTimezonesEnabledAndSupported} from 'selectors/general';

import ProfilePopover from './profile_popover.jsx';

export const Child = ProfilePopover;

function mapStateToProps(state) {

    const canManagePublicChannels = haveICurrentTeamPermission(state, {permission: Permissions.MANAGE_PUBLIC_CHANNEL_MEMBERS});
    const canManagePrivateChannels = haveICurrentTeamPermission(state, {permission: Permissions.MANAGE_PRIVATE_CHANNEL_MEMBERS});

    const canManageChannelMembers = canManagePublicChannels || canManagePrivateChannels;

    return {
        enableTimezone: areTimezonesEnabledAndSupported(state),
        currentUserId: getCurrentUserId(state),
        teamUrl: '/' + getCurrentTeam(state).name,
        canManageChannelMembers,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            openModal,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePopover);
