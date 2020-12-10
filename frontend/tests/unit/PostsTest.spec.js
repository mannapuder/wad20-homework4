import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue"
import moment from 'moment';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, {router, store, localVue});

    it('shows the correct amount of posts', () => {
        const items = wrapper.findAll('.post');
        expect(items.length).toEqual(testData.length);
    });

    it('shows the correct createTime', () => {
        for (let i = 0; i < wrapper.findAll('.post').length; i += 1) {
            const date = wrapper.findAll('.post').at(i).findAll('small').at(1).element.textContent;
            const PretestDate = testData[i].createTime;
            const testDate = moment(PretestDate).format('LLLL');
            expect(date).toEqual(testDate);
        }
        
    });

    it('shows the appropriate media type', () => { 
        let posts = wrapper.findAll(".post");
        for (let i = 0; i < posts.length; i += 1) {
            if (testData[i].media) {
                if (testData[i].media.type === "image") {
                    expect(posts.at(i).findAll("img").length).toBe(2); //Author avatar and post image.
                } else if (testData[i].media.type === "video") {
                    expect(posts.at(i).findAll("video").length).toBe(1);
                }
            } else {
                expect(!posts.at(i).find(".post-image").exists);
            }
        }

    });
});