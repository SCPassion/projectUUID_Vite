import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    } else if(e.target.dataset.replyto) {
        handleReplyBtnInput(e.target.dataset.replyto)
    } else if(e.target.dataset.removetweet) {
        handleRemoveTweetBtn(e.target.dataset.removetweet)
    } else if(e.target.id =='reset') {
        handleResetBtn()
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tsD.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    localStorage.setItem("tweetsData", JSON.stringify(tsD))
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tsD.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    localStorage.setItem("tweetsData", JSON.stringify(tsD))
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tsD.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        localStorage.setItem("tweetsData", JSON.stringify(tsD))
    render()
    tweetInput.value = ''
    }
}

function handleReplyBtnInput(uuid) {
    const tweetReply = document.getElementById('tweet-reply')
    const tweetObj = tsD.filter(function(tweet){
        return tweet.uuid === uuid
    })[0]
    tweetObj.replies.unshift({
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        tweetText: tweetReply.value
    })
    localStorage.setItem("tweetsData", JSON.stringify(tsD))
    render()
}

function handleRemoveTweetBtn(uuid) {
    const index = tsD.findIndex(function(tweet) {
        return uuid === tweet.uuid
    })
    
    if(index !== -1) {
        tsD.splice(index, 1)
    }
    localStorage.setItem("tweetsData", JSON.stringify(tsD))
    render()
}

function handleResetBtn() {
    localStorage.clear()
    tsD = tweetsData
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
    render()
}

function getFeedHtml(){
    let feedHtml = ``
    
    tsD.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash"
                    data-removetweet="${tweet.uuid}"
                    ></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        <div class="tweet-reply-area">
			<img src="images/scrimbalogo.png" class="profile-pic">
			<textarea placeholder="What's happening?" id="tweet-reply" 
            ></textarea>
		</div>
        <button class="reply-btn" data-replyto="${tweet.uuid}">Reply</button>
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

//localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
let tsD = JSON.parse(localStorage.getItem("tweetsData"))

if(!tsD) 
{
    tsD = tweetsData
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
}

render()

