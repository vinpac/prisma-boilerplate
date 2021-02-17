import http from 'k6/http'
import { check, sleep, group } from 'k6'
import { Trend } from 'k6/metrics'

let FeedTrend = new Trend('Get feed', true)
let CreateUserTrend = new Trend('Create user', true)
let CreatePostTrend = new Trend('Create post', true)
let CreateCommentTrend = new Trend('Create comment', true)
let CreateLikeTrend = new Trend('Create like', true)

export let options = {
  vus: 40,
  duration: '15s',
}

const SLEEP_DURATION = 0.1

// const baseUrl = 'https://'
const GRAPHQL_ENDPOINT = `https://${__ENV.API_URL}`
const queries = {
  feed: `{
    feed {
      id
      content
      createdAt
      comments {
        id
        content
        updatedAt
      }
      author {
        id
        email
      }
    }
  }`,
  signUp: `mutation registerEmail ($email: String!) {
    userId: registerEmail(email: $email)
  }`,
  createPost: `mutation createDraft ($userId: Int!) {
    post: createDraft(userId: $userId, data: { title: "Teste", content: "Jon snow"}) {
      id
    }
  }`,
  likePost: `
    mutation ($userId: Int!, $postId: Int!) {
      likePost(userId: $userId, postId: $postId) 
    }
  `,
  createComment: `
    mutation createComment ($authorId: Int!, $postId: Int!, $content: String!) {
      comment: commentPost(authorId: $authorId, content: $content, postId:$postId) {
        id
      }
    }`,
}

export default function () {
  group('user flow', function () {
    // Get feed
    let getFeedRes = http.posts(GRAPHQL_ENDPOINT, {
      query: queries.feed,
    })
    check(getFeedRes, { 'status was 200 (get feed)': (r) => r.status == 200 })
    FeedTrend.add(getFeedRes.timings.duration)

    sleep(SLEEP_DURATION)

    // Create user
    let createUserRes = http.post(GRAPHQL_ENDPOINT, {
      query: queries.signUp,
      variables: {
        email: `daniel+${Date.now()}+${__VU}@gmail.com`,
      },
    })
    check(createUserRes, {
      'status was 200 (add user)': (r) => r.status == 200,
    })
    CreateUserTrend.add(createUserRes.timings.duration)

    sleep(SLEEP_DURATION)

    let userId = JSON.parse(createUserRes.body).data.userId

    // Create post
    let createPostRes = http.post(GRAPHQL_ENDPOINT, {
      query: queries.createPost,
      variables: {
        userId,
      },
    })
    check(createPostRes, {
      'status was 200 (add post)': (r) => r.status == 200,
    })
    CreatePostTrend.add(createPostRes.timings.duration)

    let postId = JSON.parse(createPostRes.body).data.post.id
    sleep(SLEEP_DURATION)

    // Create comment
    let createCommentRes = http.post(GRAPHQL_ENDPOINT, {
      query: queries.createComment,
      variables: {
        userId,
        postId: postId,
        content: 'Interesting post',
      },
    })
    check(createCommentRes, {
      'status was 200 (add comment)': (r) => r.status == 200,
    })
    CreateCommentTrend.add(createCommentRes.timings.duration)

    sleep(SLEEP_DURATION)

    let createLikeRes = http.post(GRAPHQL_ENDPOINT, {
      query: queries.likePost,
      variables: {
        userId,
        postId,
      },
    })
    check(createLikeRes, {
      'status was 200 (add like)': (r) => r.status == 200,
    })
    CreateLikeTrend.add(createLikeRes.timings.duration)

    sleep(SLEEP_DURATION)
  })
}

// Get feed       http localhost:3000/feed
// Create user    http POST localhost:3000/user email="norman@prisma.io" name="Daniel"
// Create post    http POST localhost:3000/post authorEmail="norman@prisma.io" title="Node.js best practices 2021"
// Add like       http POST localhost:3000/post/like userEmail="norman@prisma.io" postId=3
// Add comment    http POST localhost:3000/post/comment authorEmail="norman@prisma.io" postId=3 comment="wow"
