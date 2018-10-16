// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addChannelMember, getChannelMember, autocompleteChannelsForSearch} from 'mattermost-redux/actions/channels';
import * as Selectors from 'mattermost-redux/selectors/entities/channels';

import AddUsersToChannel from './add_user_to_channel_modal';

function mapStateToProps(state) {
    const channelMembers = Selectors.getChannelMembersInChannels(state) || {};

    return {
        channelMembers,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            addChannelMember,
            getChannelMember,
            autocompleteChannelsForSearch,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUsersToChannel);
