import React from 'react';
import $ from 'jquery';
import { Tabs, Spin } from 'antd';
import { GEO_OPTIONS, POS_KEY, API_ROOT, AUTH_PREFIX, TOKEN_KEY } from '../constants';
import { Gallery } from './Gallery';
import {CreatePostButton} from './CreatePostButton';
import { WrappedAroundMap } from './AroundMap';

const TabPane = Tabs.TabPane;

export class Home extends React.Component {
    state = {
        loadingGeoLocation: false,
        loadingPosts: false,
        error: '',
        posts: [],
    }
    // we want to show the loading information after the element has been rendered
    componentDidMount() {
        // reset error message to empty
        this.setState({ loadingGeoLocation: true, error: '' });
        this.getGeoLocation();
    }

    getGeoLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailLoadGeoLocation,
                GEO_OPTIONS,
            );
        } else {
            this.setState({ error: 'Your browser does not support geolocation'})
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        console.log(position);
        // set error to empty since when fail load geolocation the error has been set to failed to load geolocation
        this.setState({ loadingGeoLocation: false, error: '' });
        const { latitude: lat, longitude: lon } = position.coords;
        const location = { lat: lat, lon: lon};
        localStorage.setItem(POS_KEY, JSON.stringify(location));

        // after success load geolocation, we want load posts
        this.loadNearbyPosts(location);
    }

    onFailLoadGeoLocation = () => {
        this.setState({ loadingGeoLocation: false, error: 'Failed to load geolocation!'});
    }

    getGalleryPanelContent = () => {
        if (this.state.error) {
            return <div>{this.state.error}</div>;
        } else if (this.state.loadingGeoLocation) {
            return <Spin tip="Loading Geo Location..."/>;
        } else if (this.state.loadingPosts){
            return <Spin tip="Loading Posts..."/>;
        } else if (this.state.posts && this.state.posts.length > 0) {
            const images = this.state.posts.map((post) => {
               return {
                   user: post.user,
                   src: post.url,
                   thumbnail: post.url,
                   thumbnailWidth: 400,
                   thumbnailHeight: 300,
                   caption: post.message,
               }
            });
            return <Gallery images={images}/>;
            // [1,2,3].map(f) => [f(1), f(2), f(3)]
        } else {
            return null;
        }
    }

    loadNearbyPosts = (location, radius) => {
        // convert from string to Javascript object
        // below assign lat to object.lat, lon to object.lon
        const { lat, lon } = location ? location : JSON.parse(localStorage.getItem(POS_KEY));
        const range = radius ? radius : 20;
        this.setState({ loadingPosts: true, error: '' });
        // ajax returns a promise
        return $.ajax({
            // root/search?lat=1111&lon=2222&range=20
            // set range to 20 miles
            url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`,
            method: 'GET',
            headers: {
                Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
            },
        }).then((response) => {
            this.setState({ loadingPosts: false, error: '', posts: response });
            console.log(response);
        }, (error) => {
            this.setState({ loadingPosts: false, error: error.responseText });
            console.log(error);
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        const createPostButton = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>;

        return (
                <Tabs tabBarExtraContent={createPostButton} className="main-tabs">
                    <TabPane tab="Posts" key="1">
                        { this.getGalleryPanelContent() }
                    </TabPane>
                    <TabPane tab="Map" key="2">
                        <WrappedAroundMap
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `600px` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                            posts={this.state.posts}
                            loadNearbyPosts={this.loadNearbyPosts}
                        />
                    </TabPane>
                </Tabs>
        )
    }
}