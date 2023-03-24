/*
 * @Description: 视频播放器控件配置
 * @Author: IFLS
 * @Date: 2022-06-24 13:35:06
 * @LastEditTime: 2023-03-23 17:46:29
 */
export default {
  playbackRates: [0.5, 1.0, 1.25, 1.5, 2.0], //播放速度
  autoplay: false, // 是否自动播放。
  muted: false, // 是否静音播放，默认情况下将会消除任何音频。
  loop: false, // 是否循环播放。
  preload: "none", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
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
  notSupportedMessage: "video error", // 当无法播放时允许覆盖Video.js，显示的默认信息。
  controlBar: {
    timeDivider: true,
    durationDisplay: true,
    remainingTimeDisplay: false,
    fullscreenToggle: true
  }
};
