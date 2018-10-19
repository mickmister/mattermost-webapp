// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {haveIChannelPermission} from 'mattermost-redux/selectors/entities/roles';

import {areTimezonesEnabledAndSupported} from 'selectors/general';

import ProfilePopover from './profile_popover.jsx';

function mapStateToProps(state) {
    const config = state.entities.general.config;

    const enableWebrtc = config.EnableWebrtc === 'true';

    const hasManagePublicChannelMembersPermission = haveIChannelPermission(state, {permission: 'manage_public_channel_members'});
    const hasManagePrivateChannelMembersPermission = haveIChannelPermission(state, {permission: 'manage_private_channel_members'});
    const shouldShowAddToChannelButton = hasManagePublicChannelMembersPermission || hasManagePrivateChannelMembersPermission;

    return {
        enableWebrtc,
        enableTimezone: areTimezonesEnabledAndSupported(state),
        shouldShowAddToChannelButton,
    };
}

export default connect(mapStateToProps)(ProfilePopover);
