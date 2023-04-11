import { ref, watch } from "@vue/composition-api";
import { isIosX } from "@/utils/isIosX";

/**
 * @description 视频播放的组合式函数
 * @param {boolean} recordFlag 记录视频播放时长开关
 * */
export function useVideo(recordFlag = false) {
  const showPlay = ref(false);
  const showVideo = ref(false); // 用于竖屏播放时，展示优化
  const adjustCloseBtn = ref(false); // iPhone 调整关闭按钮位置
  const playerOptions = ref({
    playbackRates: [0.5, 1.0, 1.25, 1.5, 2.0], //播放速度
    autoplay: false, // 是否自动播放。
    muted: false, // 是否静音播放，默认情况下将会消除任何音频。
    loop: false, // 是否循环播放。
    preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
    language: "zh-CN",
    // aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
    aspectRatio: "16:9",
    fluid: false, // 是否流体从而按比例缩放以适应其容器。
    flash: { hls: { withCreadentials: false } }, //可以播放rtmp视频
    html5: { hls: { withCreadentials: false } }, //可以播放m3u8视频
    sources: [
      {
        type: "video/mp4",
        src: "" // 视频url地址
      }
    ],
    poster: "", // 封面地址
    width: "100%",
    notSupportedMessage: ".", // 当无法播放时允许覆盖Video.js，显示的默认信息。
    controlBar: {
      timeDivider: true,
      durationDisplay: true,
      remainingTimeDisplay: false,
      fullscreenToggle: true
    }
  });
  let player = null;

  function playVideo(data) {
    const { videoUrl, extInfo, type = "", name = "" } = data;
    if (!videoUrl) return;

    playerOptions.value.sources[0].src = videoUrl;
    // showPlay 需要立即设为 true。获取视频尺寸后再设为 true，有的手机中 video 的 play() 方法会失效
    showPlay.value = true;

    new Promise(resolve => {
      if (extInfo) {
        // 有视频尺寸
        if (extInfo.height > extInfo.width) {
          resolve({ isHeight: true, dom: null });
        } else {
          resolve({ isHeight: false, dom: null });
        }
      } else {
        // 获取视频尺寸
        getVideoSize(videoUrl, resolve);
      }
    }).then(data => {
      const { isHeight, dom } = data;
      if (dom) dom.remove();
      //console.log(`长视频：${isHeight}`);
      if (isHeight) {
        const domVideo = document.getElementsByClassName("vjs-fluid");
        domVideo[0].style.height = "100vh";

        // 长视频 & iphone 调整关闭按钮位置
        if (isIosX) {
          adjustCloseBtn.value = true;
        }
      } else {
        adjustCloseBtn.value = false;
      }

      setTimeout(() => {
        // 播放器展示优化，放到 setTimeout 里，避免用户看到宽屏 -> 竖屏的过程
        showVideo.value = true;

        player = this.$refs.videoPlayer.player;
        player.play();

        // 记录时长
        if (recordFlag) {
          videoRecordStart({ name, type });
        }
      }, 100);
    });
  }

  // 弹窗播放的场景
  watch(showPlay, newValue => {
    if (newValue) return;
    showVideo.value = false;
    if (player && recordFlag) {
      videoRecordEnd();
    }
  });

  return {
    showPlay,
    showVideo,
    adjustCloseBtn,
    playerOptions,
    playVideo
  };
}

function getVideoSize(videoUrl, cb) {
  const domVideo = document.createElement("video");
  domVideo.style.display = "none";
  domVideo.src = videoUrl;
  // 监听 oncanplay 需要以下设置，onloadedmetadata 不用
  domVideo.muted = true;
  domVideo.playsInline = true;
  domVideo.play().then(() => domVideo.pause());

  domVideo.oncanplay = e => {
    const { videoWidth, videoHeight } = e.target;
    //console.log("宽:高", videoWidth, videoHeight);
    if (videoHeight > videoWidth) {
      cb({ isHeight: true, dom: domVideo });
    } else {
      cb({ isHeight: false, dom: domVideo });
    }
  };

  // domVideo.onloadedmetadata = (e) => {
  //     const { videoWidth, videoHeight } = e.target;
  //     //console.log("宽:高", videoWidth, videoHeight);
  //     if (videoHeight > videoWidth) {
  //         cb({ isHeight: true, dom: domVideo });
  //     } else {
  //         cb({ isHeight: false, dom: domVideo });
  //     }
  // };
}

/* 统计视频播放时长 */
function progressVideoData(data) {
  const { type, name } = data;
  const key = `${type}-${name}`;
  const time = new Date().getTime();
  return { type, name, key, time };
}

let playVideoData = null;
const videoMap = new Map();

export function videoRecordStart(data) {
  if (!data) return;
  playVideoData = data;
  const { type, name, key, time: start } = progressVideoData(data);

  let videoData = videoMap.get(key);
  if (videoData) {
    videoData.start = start;
  } else {
    videoData = { type, name, duration: 0, start };
    videoMap.set(key, videoData);
  }
}

export function videoRecordEnd() {
  if (!playVideoData) return;
  const { key, time: end } = progressVideoData(playVideoData);

  const videoData = videoMap.get(key);
  if (videoData) {
    videoData.duration += end - videoData.start;
  }
  playVideoData = null;
}

export function reportAllVideoDuration(zgStatistics) {
  // 上报前再处理，避免离开页面时正在播放的视频没有统计到
  videoRecordEnd();

  for (const videoData of videoMap.values()) {
    videoPlayDuration(zgStatistics, videoData);
  }
  videoMap.clear();
}

export function videoPlayDuration(zgStatistics, data) {
  const { type, name, duration } = data;
  zgStatistics("健康新奥-视频播放时长", {
    视频类别: type,
    视频名称: name,
    视频播放时长: duration / 1000
  });
  // console.log({
  //   视频类别: type,
  //   视频名称: name,
  //   视频播放时长: duration / 1000
  // });
}
