// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import configureStore from 'redux-mock-store';

import SearchChannelWithPermissionsProvider from 'components/suggestion/search_channel_with_permissions_provider.jsx';

jest.useFakeTimers();

describe('components/SearchChannelWithPermissionsProvider', () => {
    const defaultState = {
        entities: {
            general: {
                config: {},
            },
            teams: {
                currentTeamId: 'someTeamId',
                myMembers: {
                    someTeamId: {
                        roles: '',
                    },
                },
            },
            channels: {
                myMembers: {
                    somePublicMemberChannelId: {
                    },
                    somePrivateMemberChannelId: {
                    },
                    someDirectConversation: {
                    },
                },
                channels: {
                    somePublicMemberChannelId: {
                        id: 'somePublicMemberChannelId',
                        type: 'O',
                        name: 'Some Public Member Channel',
                        display_name: 'Some Public Member Channel',
                        delete_at: 0,
                    },
                    somePrivateMemberChannelId: {
                        id: 'somePrivateMemberChannelId',
                        type: 'P',
                        name: 'Some Private Member Channel',
                        display_name: 'Some Private Member Channel',
                        delete_at: 0,
                    },
                    somePublicNonMemberChannelId: {
                        id: 'somePublicNonMemberChannelId',
                        type: 'O',
                        name: 'Some Public Non-Member Channel',
                        display_name: 'Some Public Non-Member Channel',
                        delete_at: 0,
                    },
                    somePrivateNonMemberChannelId: {
                        id: 'somePrivateNonMemberChannelId',
                        type: 'P',
                        name: 'Some Private Non-Member Channel',
                        display_name: 'Some Private Non-Member Channel',
                        delete_at: 0,
                    },
                    someDirectConversation: {
                        id: 'someDirectConversation',
                        type: 'D',
                        name: 'Some Direct Conversation',
                        display_name: 'Some Direct Conversation',
                        delete_at: 0,
                    },
                    someGroupConversation: {
                        id: 'someGroupConversation',
                        type: 'GM',
                        name: 'Some Group Conversation',
                        display_name: 'Some Group Conversation',
                        delete_at: 0,
                    },
                },
                channelsInTeam: {
                    someTeamId: [
                        'somePublicMemberChannelId',
                        'somePrivateMemberChannelId',
                        'somePublicNonMemberChannelId',
                        'somePrivateNonMemberChannelId',
                        'someDirectConversation',
                        'someGroupConversation',
                    ],
                },
            },
            roles: {
                roles: {
                    public_channels_manager: {
                        permissions: ['manage_public_channel_members'],
                    },
                    private_channels_manager: {
                        permissions: ['manage_private_channel_members'],
                    },
                },
            },
            users: {
                profiles: {},
            },
        },
    };

    it('should show public channels if user has public channel manage permission', async () => {
        const mockStore = configureStore();

        const state = {
            ...defaultState,
            entities: {
                ...defaultState.entities,
                teams: {
                    currentTeamId: 'someTeamId',
                    myMembers: {
                        someTeamId: {
                            roles: 'public_channels_manager',
                        },
                    },
                },
            },
        };

        const store = mockStore(state);
        const searchProvider = new SearchChannelWithPermissionsProvider();
        const dispatchResults = jest.fn();
        const getState = jest.fn().mockReturnValue(store.getState());
        searchProvider.dispatchResults = dispatchResults.bind(searchProvider);
        searchProvider.getState = getState.bind(searchProvider);

        const searchText = 'some';
        searchProvider.handlePretextChanged('suggestionId', searchText);
        jest.runAllTimers();
        const args = dispatchResults.mock.calls[0][0];

        expect(args.items[0].channel.id).toEqual('somePublicMemberChannelId');
        expect(args.items.length).toEqual(1);
    });

    it('should show private channels if user has private channel manage permission', async () => {
        const mockStore = configureStore();

        const state = {
            ...defaultState,
            entities: {
                ...defaultState.entities,
                teams: {
                    currentTeamId: 'someTeamId',
                    myMembers: {
                        someTeamId: {
                            roles: 'private_channels_manager',
                        },
                    },
                },
            },
        };

        const store = mockStore(state);
        const searchProvider = new SearchChannelWithPermissionsProvider();
        const dispatchResults = jest.fn();
        const getState = jest.fn().mockReturnValue(store.getState());
        searchProvider.dispatchResults = dispatchResults.bind(searchProvider);
        searchProvider.getState = getState.bind(searchProvider);

        const searchText = 'some';
        searchProvider.handlePretextChanged('suggestionId', searchText);
        jest.runAllTimers();
        const args = dispatchResults.mock.calls[0][0];

        expect(args.items[0].channel.id).toEqual('somePrivateMemberChannelId');
        expect(args.items.length).toEqual(1);
    });

    it('should show both public and private channels if user has public and private channel manage permission', async () => {
        const mockStore = configureStore();

        const state = {
            ...defaultState,
            entities: {
                ...defaultState.entities,
                teams: {
                    currentTeamId: 'someTeamId',
                    myMembers: {
                        someTeamId: {
                            roles: 'private_channels_manager public_channels_manager',
                        },
                    },
                },
            },
        };

        const store = mockStore(state);
        const searchProvider = new SearchChannelWithPermissionsProvider();
        const dispatchResults = jest.fn();
        const getState = jest.fn().mockReturnValue(store.getState());
        searchProvider.dispatchResults = dispatchResults.bind(searchProvider);
        searchProvider.getState = getState.bind(searchProvider);

        const searchText = 'some';
        searchProvider.handlePretextChanged('suggestionId', searchText);
        jest.runAllTimers();
        const args = dispatchResults.mock.calls[0][0];

        expect(args.items.length).toEqual(2);
    });

    it('should show nothing if the search does not match', async () => {
        const mockStore = configureStore();

        const state = {
            ...defaultState,
            entities: {
                ...defaultState.entities,
                teams: {
                    currentTeamId: 'someTeamId',
                    myMembers: {
                        someTeamId: {
                            roles: 'private_channels_manager public_channels_manager',
                        },
                    },
                },
            },
        };

        const store = mockStore(state);
        const searchProvider = new SearchChannelWithPermissionsProvider();
        const dispatchResults = jest.fn();
        const getState = jest.fn().mockReturnValue(store.getState());
        searchProvider.dispatchResults = dispatchResults.bind(searchProvider);
        searchProvider.getState = getState.bind(searchProvider);

        const searchText = 'not matching text';
        searchProvider.handlePretextChanged('suggestionId', searchText);
        jest.runAllTimers();
        const args = dispatchResults.mock.calls[0][0];

        expect(args.items.length).toEqual(0);
    });
});
