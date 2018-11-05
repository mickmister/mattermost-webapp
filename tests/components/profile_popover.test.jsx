// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import ProfilePopover from 'components/profile_popover/profile_popover';

describe('components/ProfilePopover', () => {
    const baseProps = {
        user: {name: 'name'},
        src: 'src',
        enableWebrtc: false,
        currentUserId: '',
        currentTeamId: '',
        teamUrl: '',
        actions: {},
    };

    test('should match snapshot', () => {
        const props = {...baseProps};

        const wrapper = shallow(
            <ProfilePopover {...props}/>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
