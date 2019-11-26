// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* eslint-disable camelcase */
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {setStatus} from 'mattermost-redux/actions/users';
import {getStatusForUserId} from 'mattermost-redux/selectors/entities/users';

import {closeModal} from 'actions/views/modals';

import CustomStatusModal from './custom_status_modal.jsx';

function mapStateToProps(state) {
    const {entities: {users: {currentUserId}}, views: {modals: {modalState: {custom_status}}}} = state;
    return {
        currentUserId,
        currentUserStatus: getStatusForUserId(state, currentUserId),
        modalState: custom_status,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            setStatus,
            closeModal
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomStatusModal);
