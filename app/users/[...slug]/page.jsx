'use client'
import { use } from 'react';
import HomePage from './home';
import UserPage from './info'
import PrivatePage from './private';
import PostsPage from './posts';
import StatsPage from './stats';

export default function userPage({ params }) {
    const { slug } = use(params)

    const page = slug[1]
    if (page == 'info') return <UserPage slug={slug[0]} />
    else if (page == 'private') return <PrivatePage slug={slug[0]} />
    else if (page == 'posts') return <PostsPage slug={slug[0]} />
    else if (page == 'stats') return <StatsPage slug={slug[0]} />
    else return <HomePage slug={slug[0]} />

} 