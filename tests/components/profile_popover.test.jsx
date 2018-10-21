// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import {Child as ProfilePopover} from 'components/profile_popover';

describe('components/ProfilePopover', () => {
    const baseProps = {
        user: {name: 'name'},
        src: 'src',
        enableWebrtc: false,
    };

    test('should show "add to channel" button if user has permissions to manage channel members', () => {
        const props = {...baseProps, canManageChannelMembers: true};

        const wrapper = shallow(
            <ProfilePopover {...props}/>
        );
        expect(wrapper.find('.user-popover__add_to_channel').exists()).toBe(true);
    });

    test('should hide "add to channel" button if user does not have permissions to manage channel members', () => {
        const props = {...baseProps, canManageChannelMembers: false};

        const wrapper = shallow(
            <ProfilePopover {...props}/>
        );
        expect(wrapper.find('.user-popover__add_to_channel').exists()).toBe(false);
    });
});
