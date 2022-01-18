var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: 'eGinUY1k8hA',
    enablejsapi: 1,
    autoplay: 1,
    controls: 0,
    disablekb: 1,
    fs: 0,
    loop: 1,
    modestbranding:0,
    rel:0,
    showinfo:0,
    iv_load_policy: 3,
    events: {
      'onReady': onPlayerReady,
       'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.stopVideo();
  event.target.mute();
  event.target.setPlaybackQuality('highres');
}
function onPlayerStateChange(e){
  //console.log(e.target);
  //console.log(player.getDuration());
  //console.log(player.getVideoBytesTotal());
  //if (e.data == 1){
  //  video_play('Agir plus pour sauver plus de vies face au cancer');
  //}
  //
  //if (e.data == 0){
  //  video_complete();
  //}
  switch (e.data){
    case YT.PlayerState.ENDED:
   //   video_complete();
      break;
    case YT.PlayerState.PLAYING:
   //   video_play('Agir plus pour sauver plus de vies face au cancer');
      break;
    case YT.PlayerState.PAUSED:
        var t = player.getCurrentTime() / (player.getDuration() * 0.01),
            r = 0;
        t < 100 ? r = 75 : null;
        t < 75 ? r = 50 : null;
        t < 50 ? r = 25 : null;
        t < 25 ? r = 0 : null;
     // video_event(r);
      break;
  }
}