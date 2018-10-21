// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import {Child as AddUserToChannelModal} from 'components/add_user_to_channel_modal';

describe('components/AddUserToChannelModal', () => {
    const baseProps = {
        channelMembers: {},
        user: {id: 'someUserId'},
        onHide: jest.fn(),
        actions: {
            addChannelMember: jest.fn(() => {
                return new Promise((resolve) => {
                    process.nextTick(() => resolve());
                });
            }),
            getChannelMember: jest.fn(() => {
                return new Promise((resolve) => {
                    process.nextTick(() => resolve());
                });
            }),
        },
    };

    it('should match snapshot', () => {
        const wrapper = shallow(
            <AddUserToChannelModal {...baseProps}/>
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should match snapshot when a channel is selected', () => {
        const wrapper = shallow(
            <AddUserToChannelModal {...baseProps}/>
        );

        wrapper.setState({inviteError: 'some error'});
        expect(wrapper).toMatchSnapshot();

        wrapper.setState({selectedChannelId: 'someChannelId'});
        expect(wrapper).toMatchSnapshot();
    });

    it('should match snapshot when an error message is captured', () => {
        const wrapper = shallow(
            <AddUserToChannelModal {...baseProps}/>
        );

        wrapper.setState({inviteError: 'some error'});
        expect(wrapper).toMatchSnapshot();
    });

    it('should match snapshot when membership is being checked', () => {
        const wrapper = shallow(
            <AddUserToChannelModal {...baseProps}/>
        );

        wrapper.setState({
            selectedChannelId: 'someChannelId',
            checkingForMembership: true,
        });
        expect(wrapper).toMatchSnapshot();
    });

    it('should match snapshot if user is a member of the selected channel', () => {
        const props = {...baseProps,
            channelMembers: {
                someChannelId: {
                    someUserId: {},
                },
            },
        };

        const wrapper = shallow(
            <AddUserToChannelModal {...props}/>
        );

        wrapper.setState({selectedChannelId: 'someChannelId'});
        expect(wrapper).toMatchSnapshot();
    });

    it('should match snapshot when saving', () => {
        const wrapper = shallow(
            <AddUserToChannelModal {...baseProps}/>
        );

        wrapper.setState({
            selectedChannelId: 'someChannelId',
            saving: true,
        });
        expect(wrapper).toMatchSnapshot();
    });

    describe('didSelectChannel', () => {
        it('should fetch the selected user\'s membership for the selected channel', () => {
            const props = {...baseProps};

            const wrapper = shallow(
                <AddUserToChannelModal {...props}/>
            );

            const selection = {channel: {id: 'someChannelId', display_name: 'channelName'}};
            wrapper.instance().didSelectChannel(selection);
            expect(props.actions.getChannelMember).toBeCalledWith('someChannelId', 'someUserId');
        });

        it('should match state on selection', async () => {
            const promise = Promise.resolve({});
            const props = {
                ...baseProps,
                actions: {
                    ...baseProps.actions,
                    getChannelMember: jest.fn(() => {
                        return promise;
                    }),
                },
            };

            const wrapper = shallow(
                <AddUserToChannelModal {...props}/>
            );

            expect(wrapper.state().text).toEqual('');
            expect(wrapper.state().checkingForMembership).toEqual(false);
            expect(wrapper.state().selectedChannelId).toEqual(null);
            expect(wrapper.state().inviteError).toEqual('');

            const selection = {channel: {id: 'someChannelId', display_name: 'channelName'}};
            wrapper.setState({inviteError: 'some pre-existing error'});

            wrapper.instance().didSelectChannel(selection);
            expect(wrapper.state().text).toEqual('channelName');
            expect(wrapper.state().checkingForMembership).toEqual(true);
            expect(wrapper.state().selectedChannelId).toEqual('someChannelId');
            expect(wrapper.state().inviteError).toEqual('');

            await promise;
            expect(wrapper.state().checkingForMembership).toEqual(false);
        });
    });

    describe('handleSubmit', () => {
        it('should do nothing if no channel is selected', () => {
            const props = {...baseProps};

            const wrapper = shallow(
                <AddUserToChannelModal {...props}/>
            );

            wrapper.instance().handleSubmit();
            expect(wrapper.state().saving).toBe(false);
            expect(props.actions.addChannelMember).not.toBeCalled();
        });

        it('should do nothing if user is a member of the selected channel', () => {
            const props = {...baseProps,
                channelMembers: {
                    someChannelId: {
                        someUserId: {},
                    },
                },
            };

            const wrapper = shallow(
                <AddUserToChannelModal {...props}/>
            );

            wrapper.setState({selectedChannelId: 'someChannelId'});
            wrapper.instance().handleSubmit();
            expect(wrapper.state().saving).toBe(false);
            expect(props.actions.addChannelMember).not.toBeCalled();
        });

        it('should submit if user is not a member of the selected channel', () => {
            const props = {...baseProps,
                channelMembers: {
                    someChannelId: {},
                },
            };

            const wrapper = shallow(
                <AddUserToChannelModal {...props}/>
            );

            wrapper.setState({selectedChannelId: 'someChannelId'});
            wrapper.instance().handleSubmit();
            expect(wrapper.state().saving).toBe(true);
            expect(props.actions.addChannelMember).toBeCalled();
        });

        test('should match state when save is successful', async () => {
            const onHide = jest.fn();
            const promise = Promise.resolve({});
            const props = {
                ...baseProps,
                onHide,
                actions: {
                    ...baseProps.actions,
                    addChannelMember: () => promise,
                },
            };

            const wrapper = shallow(
                <AddUserToChannelModal {...props}/>
            );

            expect(wrapper.state().show).toBe(true);
            expect(wrapper.state().saving).toBe(false);
            wrapper.setState({selectedChannelId: 'someChannelId'});

            wrapper.instance().handleSubmit();
            expect(wrapper.state().show).toBe(true);
            expect(wrapper.state().saving).toBe(true);

            await promise;
            expect(wrapper.state().inviteError).toEqual('');
            expect(wrapper.state().show).toBe(false);
            expect(onHide).toHaveBeenCalled();
        });

        test('should match state when save fails', async () => {
            const onHide = jest.fn();
            const promise = Promise.resolve({error: new Error('some error')});
            const props = {
                ...baseProps,
                onHide,
                actions: {
                    ...baseProps.actions,
                    addChannelMember: () => promise,
                },
            };

            const wrapper = shallow(
                <AddUserToChannelModal {...props}/>
            );

            expect(wrapper.state().show).toBe(true);
            wrapper.setState({selectedChannelId: 'someChannelId'});

            wrapper.instance().handleSubmit();

            await promise;
            expect(wrapper.state().inviteError).toEqual('some error');
            expect(wrapper.state().show).toBe(true);
            expect(onHide).not.toHaveBeenCalled();
        });
    });
});
