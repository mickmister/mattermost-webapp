// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {haveICurrentTeamPermission} from 'mattermost-redux/selectors/entities/roles';
import {Permissions} from 'mattermost-redux/constants';

import {areTimezonesEnabledAndSupported} from 'selectors/general';

import ProfilePopover from './profile_popover.jsx';

export const Child = ProfilePopover;

function mapStateToProps(state) {
    const config = state.entities.general.config;

    const enableWebrtc = config.EnableWebrtc === 'true';

    const canManagePublicChannels = haveICurrentTeamPermission(state, {permission: Permissions.MANAGE_PUBLIC_CHANNEL_MEMBERS});
    const canManagePrivateChannels = haveICurrentTeamPermission(state, {permission: Permissions.MANAGE_PRIVATE_CHANNEL_MEMBERS});

    const canManageChannelMembers = canManagePublicChannels || canManagePrivateChannels;

    return {
        enableWebrtc,
        enableTimezone: areTimezonesEnabledAndSupported(state),
        canManageChannelMembers,
    };
}

export default connect(mapStateToProps)(ProfilePopover);
