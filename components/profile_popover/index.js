// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';
import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';
import {haveIChannelPermission} from 'mattermost-redux/selectors/entities/roles';

import {openModal} from 'actions/views/modals';

import {areTimezonesEnabledAndSupported} from 'selectors/general';

import ProfilePopover from './profile_popover.jsx';

function mapStateToProps(state) {
    const hasManagePublicChannelMembersPermission = haveIChannelPermission(state, {permission: 'manage_public_channel_members'});
    const hasManagePrivateChannelMembersPermission = haveIChannelPermission(state, {permission: 'manage_private_channel_members'});
    const shouldShowAddToChannelButton = hasManagePublicChannelMembersPermission || hasManagePrivateChannelMembersPermission;

    return {
        enableTimezone: areTimezonesEnabledAndSupported(state),
        currentUserId: getCurrentUserId(state),
        teamUrl: '/' + getCurrentTeam(state).name,
        shouldShowAddToChannelButton,
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
