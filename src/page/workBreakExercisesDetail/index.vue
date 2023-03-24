<template>
  <div class="container" id="container">
    <!-- <button @click="playAudio">播放音频</button> -->

    <full-loading :loading="loading" />

    <div class="content_wrapper">
      <div class="sport">
        <div class="videoBox" v-if="workBreakExercisesDetail">
          <div class="play_box" v-if="showPlayBtn">
            <img
              @click="handelPlay"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/video_2.png"
            />
          </div>

          <div class="video_poster" v-if="posterVisible">
            <img :src="workBreakExercisesDetail.videoImg" />
          </div>

          <video-player
            v-if="!videoFinished && isAndroid && !posterVisible"
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            webkit-playsinline="true"
            x-webkit-airplay="true"
            playsinline
            :options="playerOptions"
            @ready="playerReadied($event)"
            @play="onPlayerPlay($event)"
            @pause="onPlayerPause($event)"
            @ended="onPlayerEnded($event)"
            @timeupdate="onPlayerTimeupdate($event)"
          ></video-player>

          <video-player
            v-if="isIOS && !posterVisible"
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            webkit-playsinline="true"
            x-webkit-airplay="true"
            playsinline
            :options="playerOptions"
            @ready="playerReadied($event)"
            @play="onPlayerPlay($event)"
            @pause="onPlayerPause($event)"
            @ended="onPlayerEnded($event)"
            @timeupdate="onPlayerTimeupdate($event)"
          ></video-player>

          <video-player
            v-if="!isIOS && !isAndroid && !posterVisible"
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            webkit-playsinline="true"
            x-webkit-airplay="true"
            playsinline
            :options="playerOptions"
            @ready="playerReadied($event)"
            @play="onPlayerPlay($event)"
            @pause="onPlayerPause($event)"
            @ended="onPlayerEnded($event)"
            @timeupdate="onPlayerTimeupdate($event)"
          ></video-player>
        </div>
      </div>

      <div class="video-info" ref="hCanvas" v-if="workBreakExercisesDetail">
        <div class="video-name flex-middle">
          <div class="name">{{ workBreakExercisesDetail.name }}</div>
          <!-- <div class="source">七修功修</div> -->
          <!-- <div class="source">
                        {{ workBreakExercisesDetail.sourceDictName }}
                    </div> -->
        </div>

        <div class="behavior-box flex-between">
          <div class="behavior-left flex-between">
            <div class="behavior-item flex" @click="likeOrDislike(0)">
              <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/xin.png" />
              <div class="num">{{ workBreakExercisesDetail.likeCount }}</div>
            </div>

            <!-- <div class="behavior-item flex" @click="likeOrDislike(1)">
              <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/dislike.png" />
              <div class="num">{{ workBreakExercisesDetail.dislikeCount }}</div>
            </div> -->

            <div class="behavior-item flex">
              <img
                class="eye"
                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/eye.png"
              />
              <div class="num">{{ workBreakExercisesDetail.showCount }}</div>
            </div>
          </div>

          <!-- <div class="lianxi-person" v-if="firstPlay">
                        <div>
                            <img v-for="(item, index) in videoUsers" v-if="item.user_headurl" class="person-1" :src="item.user_headurl" />

                            <img v-else class="person-1" src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/person-1.png" />

                        </div>
                        <div>{{ videoUsers.length }}人正在练</div>
                    </div> -->
        </div>

        <div class="video-explain" v-if="workBreakExercisesDetail">
          <div class="content" v-html="workBreakExercisesDetail.info"></div>

          <!-- <div @click="handleToLottery">点击</div> -->

          <div class="posterWrapper" v-if="posterBoxVisible" ref="html2canvas">
            <div class="posterBgImg">
              <img :src="workBreakExercisesDetail.videoImg" />
            </div>
            <div class="posterBox">
              <div class="top flex-between">
                <div class="first item">
                  <div class="line66">
                    <span class="num">{{ workBreakExercisesDetail.videoTime }}</span
                    >min
                  </div>
                  <div class="line48">运动时长</div>
                </div>
                <div class="second"></div>
                <div class="third item">
                  <div class="line66">
                    <span class="num">{{ workBreakExercisesDetail.kcalConsumption }}</span
                    >kcal
                  </div>
                  <div class="line48">消耗热量</div>
                </div>
                <div class="fourth">=</div>
                <div class="fifth item">
                  <div class="line66">
                    <span class="num">{{ workBreakExercisesDetail.kcalConsumptionInfo.split("-")[0] }}</span>
                  </div>
                  <div class="line48">
                    {{ workBreakExercisesDetail.kcalConsumptionInfo.split("-")[1] }}
                  </div>
                </div>
              </div>

              <!-- <div class="bottom">
                                <div class="left_dot">"</div>
                                <div>人生没有白走的路，每一步都算数</div>
                                <div class="right_dot">"</div>
                            </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="change-box">
      <div class="btn" @click="changMore(true)" :class="{ forbiddenBtn: workBreakExercisesLength < 2 }">换一个</div>
    </div>

    <div class="zask" v-if="videoFinished"></div>

    <div class="zask" v-if="dynamicActionVisible"></div>

    <div class="dynamicActionBox" v-if="dynamicActionVisible">
      <!-- <img class="creatPosterImg" 
            src="https://laikangland-dev.oss-cn-beijing.aliyuncs.com/2022111318181729o7.png?Expires=2299054697&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=i%2FNm1FuG3lel4XZ%2Bk%2FZ4lifTT9k%3D" 
            /> -->

      <div class="dynamicActionInner">
        <img class="creatPosterImg" :src="creatImgUrl" />
        <div class="bottom-btn-box">
          <!-- <div @click="handelPlay(true)">保存到相册</div> -->
          <div @click="publishDynamic" class="dynamicBtn">发动态</div>

          <div class="arrowTipInfo flex-center">
            <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/guide_arrows.png" />
            <div class="text">长按保存到相册</div>
          </div>
        </div>

        <img
          class="dynamicBtn-close"
          @click="closeDynamicBox"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/common/close_2.png"
        />
      </div>
    </div>

    <img
      v-if="videoFinished"
      class="elep-3"
      src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/elep-2.png"
    />
    <div class="video_finish_wrapper" v-if="videoFinished">
      <div class="title">
        <img
          @click="closeYou"
          class="close-x"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/close-x.png"
        />
      </div>
      <div class="kcalConsumption flex-between">
        <div class="first item">
          <div class="line66">
            <span class="num">{{ workBreakExercisesDetail.videoTime }}</span
            >min
          </div>
          <div class="line36">运动时长</div>
        </div>

        <div class="second"></div>

        <div class="third item">
          <div class="line66">
            <span class="num">{{ workBreakExercisesDetail.kcalConsumption }}</span
            >kcal
          </div>
          <div class="line36">消耗热量</div>
        </div>

        <div class="fourth">=</div>

        <div class="fifth item">
          <div class="line66">
            <span class="num">{{ workBreakExercisesDetail.kcalConsumptionInfo.split("-")[0] }}</span>
          </div>
          <div class="line36">
            {{ workBreakExercisesDetail.kcalConsumptionInfo.split("-")[1] }}
          </div>
        </div>
      </div>

      <div class="sport-after">
        <div class="text">
          运动后的感受
          <div class="botton-border"></div>
        </div>

        <div class="lift-road">
          <!-- <img class="dot left-dot" src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/left-dot.png" /> -->
          人生没有白走的路，每一步都算数
          <!-- <img class="dot right-dot" src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/right-dot.png" /> -->
          <div v-if="pointVisible" class="health-point">
            健康积分 <span>+{{ healthPoints }}</span>
          </div>
        </div>

        <div class="tab_comment">
          <div class="tab_comment_item" @click="tabClick(index)" v-for="(item, index) in commentList" :key="index">
            <img :src="item.img" :class="{ itemSpec: index == 0 }" />
            <div :class="{ active: index == active }" class="text2">
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-btn-box flex-between">
        <div @click="handelPlay(true)">再来一次</div>
        <div class="yellow" @click="handleToLottery" style="margin: 0 10px">发布动态</div>

        <div class="greeen" @click="feedbackHandle">健康传递</div>
      </div>
    </div>

    <!-- <tips :value.sync="chuantiVisible" :duration="3000" :exp="exp" :title="exp > 0 ? '健康积分' : '恭喜你'">
            <div v-if="exp > 0">
                亲爱的，谢谢你的小手，已将该运动随机传递给了其他小伙伴
            </div>
            <div v-else style="padding: 0 0.48rem;">
                我完成了{{ workBreakExercisesDetail.name }}工间操，你也来试一下吧， 一起运动更健康哦～
            </div>
        </tips> -->

    <tips :value.sync="chuantiVisible" :duration="3000" :exp="exp" :title="exp > 0 ? '健康积分' : '恭喜你'">
      亲爱的，谢谢你的小手，已将该运动随机传递给了其他小伙伴
    </tips>
  </div>
</template>
<script>
  import {
    healthDelivery,
    getToken,
    login,
    workBreakExercisesDetail,
    workBreakExercisesLike,
    workBreakExercisesDisLike,
    finishedVideo,
    feedbackVideo,
    watchingVideo,
    getWatchingVideoUsers,
    relatedExerciseworkjoblink
  } from "../../service/api";

  import { checkEvaluation } from "@/utils/ZGdictionary";
  import Tips from "@/components/Tips";

  import FullLoading from "@/components/Loading";

  import html2canvas from "html2canvas";

  import { uploadPic } from "@/service/activity";
  import { videoRecordStart, videoRecordEnd, reportAllVideoDuration } from "@/hooks/useVideo";

  import { mapState, useNavStore } from "@/pinia";

  import { jsBridge } from "@/utils/native/jsBridge";

  export default {
    directives: {},
    components: {
      Tips,
      FullLoading
    },
    data() {
      return {
        creatImgUrl: "",
        dynamicActionVisible: false, // 发动态弹窗标记
        posterBoxVisible: false, // 判断海报面板是否显示
        // posterBoxVisible: true,// 判断海报面板是否显示
        isShowBtn: false,
        repeatClick: false,
        pointVisible: false,
        posterVisible: true,
        address: "河北省廊坊市",
        workBreakExercisesDetail: null,
        likeNum: 0,
        disLikeNum: 0,
        watchNum: 0,
        playerOptions: {
          playbackRates: [0.5, 1.0, 1.25, 1.5, 2.0], //播放速度
          autoplay: false, // 是否自动播放。
          muted: false, // 是否静音播放，默认情况下将会消除任何音频。
          loop: false, // 是否循环播放。
          // preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          preload: "none",
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
        },
        showPlayBtn: true,
        paused: false,
        playTime: 0,
        classContentUrl:
          "https://video.laikang.com/080433eddb3c496bb56fe55937f8a3c4/9125c6330ab24cd49a2694d91b460681-833e5e536996d7b860586722e96c3677-ld.mp4",
        classPreviewUrl:
          "https://video.laikang.com/080433eddb3c496bb56fe55937f8a3c4/snapshots/3d8838fd7d214a7db1b98fb94681e5d7-00005.jpg",
        active: 0,
        health: {
          active:
            "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/20220406153813qB8p.png?Expires=2279950693&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=bKsTy4fDaaY7IsJGvDl6URmZ%2BmU%3D",
          inactive:
            "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/20220406153656x291.png?Expires=2279950616&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=LmqYVyhFmoL8eIX8GwaG29Gh6X4%3D"
        },
        service: {
          active:
            "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/20220406154317BPha.png?Expires=2279950998&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=bRpq6cutzgP6sGU5g4XqESit22g%3D",
          inactive:
            "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/202204061542399w66.png?Expires=2279950959&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=%2BBy%2B1XHFYCWEaNI%2BTk3Z4aZVSNA%3D"
        },
        internet: {
          active:
            "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/202204061551330u5U.png?Expires=2279951493&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=IYhr7L%2FYPuMUXK1odT6ZCvE8d74%3D",
          inactive:
            "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/202204061544513GYW.png?Expires=2279951091&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=1PkMOPouqht%2Bf5axNN9QcA10Mzs%3D"
        },
        activity: {
          active:
            "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/20220406154719855w.png?Expires=2279951239&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=t7DQsNkJd0YAqdkIS3o8P04LuJ0%3D",
          inactive:
            "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/202204061546377R40.png?Expires=2279951197&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=jFJsxJBRBE%2FTkqN4Uf08Hbg0R%2BQ%3D"
        },
        mine: {
          active:
            "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/2022040615484662e4.png?Expires=2279951326&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=vPxcqg5XLRWaji69mfPzFzUJHbM%3D",
          inactive:
            "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/20220406154800uadW.png?Expires=2279951280&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=kh3Cu7CE6kX4wYDbuVfCAPit%2BbE%3D"
        },
        guideVisible: false,
        commentList: [
          {
            img: "https://fine.laikang.com/img/very-easy.png",
            text: "非常轻松"
          },
          {
            img: "https://fine.laikang.com/img/easy-default.png",
            text: "轻松"
          },
          {
            img: "https://fine.laikang.com/img/little-labored-default.png",
            text: "有点吃力"
          },
          {
            img: "https://fine.laikang.com/img/labored-default.png",
            text: "吃力"
          },
          {
            img: "https://fine.laikang.com/img/very-labored-default.png",
            text: "非常吃力"
          }
        ],
        videoFinished: false,
        feedbackLevel: 5,
        chuantiVisible: false,
        videoUsers: null,
        firstPlay: false,
        posterArray: [
          "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/202204181540169Hdn.png?Expires=2280987616&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=Stn8eqC0adiemZxZLUjz%2BALyrCM%3D"
        ],
        relatedExerciseworkjoblinkData: null,
        workBreakExercisesLength: 0,
        index: 0,

        // localAudioIdList: [// 生产环境音频数据
        //     '@lAXPDeC25FvD1HrOMrsJ085KM1Ic',
        //     '@lAXPDe7s3u7nbQDONniDZc4KeKeP',
        //     '@lAXPDefR4aVlCyTOI-osYM5kb6uV',
        //     '@lAXPDefR4aUrh2TOJJT57s41K1h5',
        //     '@lAXPDfYH3Dh6IbDOR2Q3d84ySimi',
        //     '@lAXPDeC25FvJ11LOIYRowc46CmYa',
        //     '@lAXPDe7s3u7XWLPONHaIVc49Nmsk',
        //     '@lAXPDetfYEoTaNnOY4d7v85QYdLL',
        //     '@lAXPDf0i2YHpF_PObJjr784pl_AQ',
        //     '@lAXPDefR4aVZRC_OaxVGQM4YzkYo',
        //     '@lAXPDeC25Fur1TPOHhkPRM4zLWp4',
        //     '@lAXPDetfYEowPhrODekucc5m9kZL',
        //     '@lAXPDf0i2YH94vLOPNDvPM4mzH6U',
        //     '@lAXPDgCwWCa9oOnOJ7xlaM5wbIle',
        //     '@lAXPDetfYEosfVbOFJMd2s44hyWg',
        //     '@lAXPDfJ6XZOkVKLOTca6rc4tzYAU',
        //     '@lAXPDfJ6XZOAR-fOJgUux84-Cwxg',
        //     '@lAXPDeREYwBdtMrOXYuDjM5CEhTZ',
        //     '@lAXPDeREYwB5_ZHOYDfcWc4rl8L5',
        //     '@lAXPDefR4aUofmfOHuDrTc4tqS_Y',
        //     '@lAXPDeC25FuzjZPOEuGfO847RoKy',
        //     '@lAXPDfYH3Dh_CyfOC_MOVs4ZG1Gv',
        //     '@lAXPDfJ6XZO4iyjOeL0aYM4uBnWw',
        //     '@lAXPDetfYEn_VTbONG_dHM5sdSuv',
        //     '@lAXPDeC25FvDpbLOa4mkF85o7ufX',
        //     '@lAXPDetfYEolp7jOD2BCy85gvMLn'
        // ],

        localAudioIdList: [
          "@lAXPDeREYxJkSvbOMOW84M4WergI",
          "@lAXPDeC25G2hQV3OHifQgc4jo9cM",
          "@lAXPDfJ6XaV8M_rOdXLYks5M_PMK",
          "@lAXPDetfYFv8eXDOMwDEss4o1AGD",
          "@lAXPDeREYxJ8ZRnORCYK5857c-x6",
          "@lAXPDeC25G2hVQPOJS1cbs4Et8lM",
          "@lAXPDfYH3EpUmKPOXzZnUM5btt2h",
          "@lAXPDetfYFwBFMPOUUNmAM4S2bE1",
          "@lAXPDeC25G2fuwXOLHY_iM4owWou",
          "@lAXPDetfYFvzXffOKqHCFc4b6U7z",
          "@lAXPDefR4bcRp3POXSEK9c5kgykQ",
          "@lAXPDfJ6XaWOKF_ODKtnL85Am7rF",
          "@lAXPDeREYxJiLBfOM0cO-s4yTocx",
          "@lAXPDf0i2ZPHc3HOIAA-2s5EOhIz",
          "@lAXPDefR4bcZBaLOaAaANc5d4cmc",
          "@lAXPDfYH3EozKL3OcJbGLc5ZIO4q",
          "@lAXPDfmVWu74pwfOWTBX884CIReD",
          "@lAXPDgCwWDiG_rrOM_-QQs42A_4q",
          "@lAXPDfmVWu8HdsnOY9oAgs5ENkWI",
          "@lAXPDgCwWDijCC_OM7vnmc5JoM6p",
          "@lAXPDf0i2ZO-sePOGpBQus4dvynn",
          "@lAXPDf0i2ZPN9srOPfh1wM5dAx_Y",
          "@lAXPDeC25G2e_4jOEQVu084yDLA6",
          "@lAXPDetfYFwEApHOKMgFDs4IninJ",
          "@lAXPDeC25G2Ns0DOFjPhA84Xc9hw",
          "@lAXPDfJ6XaV5QmzOA2aP085LHide"
        ],
        localAudioIdIndex: 0,
        localAudioId: 0,
        isAndroid: false,
        isIOS: false,
        dislikeLock: true,
        likeLock: true,
        isFullscreen: undefined,
        exp: 0,
        healthPoints: 0, // 弹窗提示积分

        loading: true
      };
    },
    computed: {
      ...mapState(useNavStore, ["onback"])
    },
    methods: {
      closeDynamicBox() {
        this.dynamicActionVisible = false;
      },
      publishDynamic() {
        sessionStorage.setItem("creatImgUrl", this.creatImgUrl);
        this.$router.push({
          name: "publish",
          query: {
            source: "workBreakExercisesDetail"
          }
        });
      },
      dataURLtoFile(dataurl, filename) {
        //将base64转换为文件
        var arr = dataurl.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      },
      handleToLottery() {
        this.videoFinished = false;
        this.posterBoxVisible = true;
        this.loading = true;

        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        let that = this;
        let a = document.createElement("a");

        setTimeout(() => {
          let canvasID = this.$refs.html2canvas;
          html2canvas(canvasID, {
            allowTaint: true,
            useCORS: true,
            backgroundColor: "transparent"
          }).then(canvas => {
            // console.log('canvas', canvas)
            a.style.display = "none";
            let dom = document.body.appendChild(canvas);
            dom.style.display = "none";
            document.body.removeChild(dom);
            let base64Img = dom.toDataURL("image/png");
            let imgFile = this.dataURLtoFile(base64Img, "png");

            const formdata = new FormData();
            formdata.append("file", imgFile);
            uploadPic(formdata)
              .then(({ code, data, msg }) => {
                if (code == 1000) {
                  // console.log(data);
                  this.loading = false;
                  const url = data.keyList[0][Object.keys(data.info)[0]];
                  this.creatImgUrl = url;
                  this.dynamicActionVisible = true;
                  this.posterBoxVisible = false;
                }
              })
              .catch(error => {
                this.loading = false;
              });
          });
        }, 500);
      },
      randomNum(min, max) {
        let a = 0;
        a = Math.floor(Math.random() * (max - min + 1)) + min;
        return a;
      },
      relatedExerciseworkjoblinkFn(index, fromMore, type) {
        let data = {
          pageIndex: 1,
          pageSize: 100,
          exerciseWorkJobId: this.$route.query.id,
          status: 1
        };

        // console.log('index', index);
        // console.log('--------------');
        // console.log('fromMore', fromMore);
        // console.log('--------------');
        // console.log('type', type);
        // console.log('--------------');

        relatedExerciseworkjoblink(data)
          .then(res => {
            if (res.code == 0) {
              //    this.relatedExerciseworkjoblinkData = res.data;
              if (res.data.length) {
                this.workBreakExercisesLength = res.data.length;
                let arrs = res.data;
                if (type == "jiankangchuandi") {
                  arrs.forEach((item, idx, arrs) => {
                    // console.log('item', item.exerciseWorkId)
                    if (item.exerciseWorkId == this.$route.query.workBreakExercisesId) {
                      index = idx;
                      this.index = idx;
                      // console.log('index', index)
                    }
                  });
                }

                this.workBreakExercisesDetail = res.data[index].exerciseWorkDTO;

                this.playerOptions.sources[0].poster = this.workBreakExercisesDetail.videoImg;

                this.playerOptions.sources[0].src = this.workBreakExercisesDetail.videoUrl + "";

                this.workBreakExercisesDetail.videoTime = this.formatTime(this.workBreakExercisesDetail.videoTime);

                this.dislikeLock = true;
                this.likeLock = true;

                fromMore &&
                  this.zgStatistics("健康新奥-点击换一个", {
                    视频名称: this.workBreakExercisesDetail.name,
                    视频ID: this.workBreakExercisesDetail.id
                  });
              }

              setTimeout(() => {
                this.loading = false;
              }, 500);
            }
          })
          .catch(ex => {});
      },
      closeYou() {
        this.videoFinished = false;
        document.getElementById("container").style.overflow = "scroll";
        this.zgStatistics("健康新奥-点击完成弹窗按钮", {
          视频名称: this.workBreakExercisesDetail.name,
          按钮名称: "关闭",
          视频ID: this.workBreakExercisesDetail.id
        });

        this.sendFeedback();
      },
      feedbackHandle() {
        this.zgStatistics("健康新奥-点击完成弹窗按钮", {
          视频名称: this.workBreakExercisesDetail.name,
          按钮名称: "健康传递",
          视频ID: this.workBreakExercisesDetail.id
        });
        this.videoFinished = false;
        if (this.repeatClick) {
          return false;
        }
        this.repeatClick = true;

        // console.log('this.repeatClick', this.repeatClick);
        // 健康传递

        // console.log('this.workBreakExercisesDetail', this.workBreakExercisesDetail)
        let data = {
          memberCode: localStorage.getItem("memberCode"),
          exerciseWorkId: this.workBreakExercisesDetail.id,
          exerciseWorkJobId: this.$route.query.id
        };
        healthDelivery(data).then(({ code, message, data }) => {
          if (code === 0) {
            // console.log('data', data);
            this.exp = data.healthPoints;
            this.chuantiVisible = true;
            setTimeout(() => {
              this.repeatClick = false;
            }, 3000);
          } else {
            this.$toast(message || "网络异常, 请稍后再试");
            this.repeatClick = false;
          }
        });

        this.sendFeedback();
      },
      sendFeedback() {
        const data = {
          id: this.workBreakExercisesDetail.id,
          memberCode: localStorage.getItem("memberCode"),
          feedbackLevel: this.feedbackLevel
        };
        feedbackVideo(data)
          .then(res => {
            if (res.isOk == true) {
              document.getElementById("container").style.overflow = "scroll";

              this.zgStatistics("健康新奥-点击评价按钮", {
                视频名称: this.workBreakExercisesDetail.name,
                按钮名称: checkEvaluation(this.feedbackLevel),
                视频ID: this.workBreakExercisesDetail.id,
                视频机构: this.workBreakExercisesDetail.sourceDictName
              });
            }
          })
          .catch(ex => {});
      },
      watchingVideoFn() {
        watchingVideo({
          exerciseWorkId: this.workBreakExercisesDetail.id
        })
          .then(res => {
            if (res.isOk == true) {
              if (res.data) {
                this.watchNum = res.data;
              }
            }
          })
          .catch(ex => {});
      },
      getWatchingVideoUsersFn() {
        getWatchingVideoUsers({
          exerciseWorkId: this.workBreakExercisesDetail.id
        })
          .then(res => {
            if (res.isOk == true) {
              this.videoUsers = res.data;
            }
          })
          .catch(ex => {});
      },
      likeOrDislike(val) {
        const T = {
          0: ["likeLock", workBreakExercisesLike],
          1: ["dislikeLock", workBreakExercisesDisLike]
        };

        // 添加按钮lock
        if (this[T[val][0]]) {
          this[T[val][0]] = false; // 关闭lock 避免重复请求

          const { id } = this.workBreakExercisesDetail;
          T[val][1]({ id }).then(res => {
            if (res.code === 0) {
              this.relatedExerciseworkjoblinkFn(this.index);
            } else {
              this.$toast(res.message || "网络异常, 请稍后再试");
            }
          });
        }
      },
      // workBreakExercisesDetailFn() {
      //     workBreakExercisesDetail({
      //         id: this.workBreakExercisesDetail.id,
      //     })
      //         .then((res) => {
      //             if (res.isOk == true) {
      //                 // this.playerOptions.poster = res.data.videoImg;
      //                 this.workBreakExercisesDetail = res.data;
      //                 this.playerOptions.sources[0].src = res.data.videoUrl;
      //                 this.workBreakExercisesDetail.videoTime = this.formatTime(this.workBreakExercisesDetail.videoTime);
      //             }
      //         })
      //         .catch((ex) => {});
      // },
      changMore(fromMore) {
        // console.log('fromeMore', fromMore);
        this.index += 1;
        if (this.index == this.workBreakExercisesLength) {
          this.index = 0;
        }
        this.showPlayBtn = true;
        // console.log('this.localAudioIdIndex', this.localAudioIdIndex)
        this.loading = true;
        this.relatedExerciseworkjoblinkFn(this.index, fromMore);
        this.posterVisible = true;

        document.body.scrollTop = document.documentElement.scrollTop = 0;
      },
      formatTime(seconds) {
        let min = "";
        if (Math.floor(seconds / 60) >= 10) {
          min = Math.ceil(seconds / 60);
        } else {
          min = Math.ceil(seconds / 60);
        }
        return min;
      },
      tabClick(index) {
        // console.log("index", index);
        this.active = index;
        this.commentList = [
          {
            img: "https://fine.laikang.com/img/very-easy-default.png",
            text: "非常轻松"
          },
          {
            img: "https://fine.laikang.com/img/easy-default.png",
            text: "轻松"
          },
          {
            img: "https://fine.laikang.com/img/little-labored-default.png",
            text: "有点吃力"
          },
          {
            img: "https://fine.laikang.com/img/labored-default.png",
            text: "吃力"
          },
          {
            img: "https://fine.laikang.com/img/very-labored-default.png",
            text: "非常吃力"
          }
        ];
        if (index == 0) {
          this.commentList.splice(0, 1, {
            img: "https://fine.laikang.com/img/very-easy.png",
            text: "非常轻松"
          });
          this.feedbackLevel = 5;
        } else if (index == 1) {
          this.commentList.splice(1, 1, {
            img: "https://fine.laikang.com/img/easy.png",
            text: "轻松"
          });
          this.feedbackLevel = 4;
        } else if (index == 2) {
          this.commentList.splice(2, 1, {
            img: "https://fine.laikang.com/img/little-labored.png",
            text: "有点吃力"
          });
          this.feedbackLevel = 3;
        } else if (index == 3) {
          this.commentList.splice(3, 1, {
            img: "https://fine.laikang.com/img/labored.png",
            text: "吃力"
          });
          this.feedbackLevel = 2;
        } else if (index == 4) {
          this.commentList.splice(4, 1, {
            img: "https://fine.laikang.com/img/very-labored.png",
            text: "非常吃力"
          });
          this.feedbackLevel = 1;
        }
      },

      //点击大播放按钮播放
      handelPlay(playAgain) {
        this.videoFinished = false;
        this.firstPlay = true;

        this.posterVisible = false;

        if (this.isAndroid) {
          setTimeout(() => {
            this.$refs.videoPlayer.player.play();
          }, 1000);
        } else {
          setTimeout(() => {
            this.$refs.videoPlayer.player.play();
          }, 1000);
        }

        this.showPlayBtn = false;
        if (playAgain) {
          this.sendFeedback();
          this.zgStatistics("健康新奥-点击完成弹窗按钮", {
            视频名称: this.workBreakExercisesDetail.name,
            按钮名称: "再来一次",
            视频ID: this.workBreakExercisesDetail.id
          });
        }
        // console.log("点击播放");
      },
      //记录播放时间的函数（视频）
      onPlayerTimeupdate(player) {
        this.playTime = player.cache_.currentTime;

        if (!ic.isIOS && !ic.isAndroid) {
          // isFullscreen_: 未点击undefined 点击全屏true 关闭全屏false
          if (player.player_.isFullscreen_ === this.isFullscreen) return;
          // 避免函数多次调用
          this.isFullscreen = player.player_.isFullscreen_;
          // 点击全屏
          if (player.player_.isFullscreen_ === true) {
            // 静音
            document.getElementsByTagName("video")[0].muted = true;
            // 拼接钉钉url
            // const url = `dingtalk://dingtalkclient/page/link?url=${encodeURIComponent(this.playerOptions.sources[0].src + '?ddtab=true')}`
            // window.location.href = url
            ic.run({
              action: "util.openModal",
              params: {
                title: "视频详情",
                url: this.playerOptions.sources[0].src
              }
            });
            // 关闭全屏
          } else if (player.player_.isFullscreen_ === false) {
            // 恢复声音
            document.getElementsByTagName("video")[0].muted = false;
          }
        }
      },

      //准备播放的函数（视频）
      playerReadied(player) {
        // this.showPlayBtn = true;

        // console.log("player", player);
        let _this = this;
        player.on("error", function () {
          // player.errorDisplay.close();   //将错误信息不显示
          setTimeout(() => {
            _this.showPlayBtn = true;
            _this.posterVisible = true;
          }, 2000);
        });
      },
      //正在播放回调函数（视频）
      onPlayerPlay(player) {
        this.showPlayBtn = false;
        // console.log("11");
        this.watchingVideoFn();
        this.getWatchingVideoUsersFn();

        videoRecordStart({
          name: this.workBreakExercisesDetail.name,
          type: this.workBreakExercisesDetail.typeDictName
        });
      },
      // 暂停回调(视频)
      onPlayerPause(player) {
        // console.log("视频暂停");
        this.showPlayBtn = true;
        this.paused = true;
        videoRecordEnd();
      },
      //结束回调（视频）
      onPlayerEnded(player) {
        this.showPlayBtn = true;
        this.paused = true;
        this.videoFinished = true;

        // 视频结束，弹框显示的时候 去抽奖

        const currentTime = new Date().valueOf();
        const startTime = 1664553600000; // 10月1日
        // const startTime = 1664035200000; // 9月25日
        const endTime = 1667231999000;
        if (currentTime >= startTime && currentTime <= endTime) {
          this.isShowBtn = true;
        } else {
          this.isShowBtn = false;
        }

        if (!this.isIOS && !this.isAndroid) {
          // console.log("什么都不做");
        } else {
          this.posterVisible = true;
          document.getElementById("container").style.overflow = "hidden";
        }
        this.playAudio();
        this.finishedVideoFn();
        // console.log("播放完成");
        // 调用埋点函数
        // this.zgStatistics('播放完成')

        // 处于全屏状态 且 是pc端
        if (player.player_.isFullscreen_ && !ic.isIOS && !ic.isAndroid) {
          const dom = document.getElementsByTagName("video")[0];
          // 退出全屏状态(浏览器不同内核兼容写法)
          if (dom.exitFullscreen) {
            dom.exitFullscreen();
          } else if (dom.mozCancelFullScreen) {
            dom.mozCancelFullScreen();
          } else if (dom.webkitCancelFullScreen) {
            dom.webkitCancelFullScreen();
          }
        }
      },

      finishedVideoFn() {
        this.pointVisible = false;
        finishedVideo({
          exerciseWorkId: this.workBreakExercisesDetail.id,
          memberCode: localStorage.getItem("memberCode")
        })
          .then(res => {
            if (res.isOk == true) {
              if (res.data && res.data.healthPoints > 0) {
                this.healthPoints = res.data.healthPoints;
                this.pointVisible = true;
              }
              const { name } = this.$route.query;
              const type = name ? decodeURI(name) : "";
              this.zgStatistics("健康新奥-进入完成弹窗页面", {
                视频名称: this.workBreakExercisesDetail.name,
                类别: type,
                视频ID: this.workBreakExercisesDetail.id
              });
            }
          })
          .catch(ex => {});
      },
      closeChuandiVisible() {
        this.chuantiVisible = false;
      },
      getAudio(localAudioIdIndex) {
        let mediaId = this.localAudioIdList[localAudioIdIndex];
        const { localAudioId } = jsBridge.invoke("audioDownload", { mediaId }).then(data => {
          this.localAudioId = data.localAudioId;
        });
      },
      playAudio() {
        jsBridge.invoke("audioPlay", {
          localAudioId: this.localAudioId
        });
      }
    },
    watch: {},
    mounted() {
      console.log("href", window.location.href);
      // jiankangchuandi
      if (this.$route.query.workBreakExercisesId) {
        this.relatedExerciseworkjoblinkFn(this.index, false, "jiankangchuandi");
      } else {
        this.relatedExerciseworkjoblinkFn(this.index);
      }

      this.localAudioIdIndex = this.randomNum(0, 25);
      this.getAudio(this.localAudioIdIndex);

      if (ic && ic.isIOS) {
        this.isIOS = true;
      }
      if (ic && ic.isAndroid) {
        this.isAndroid = true;
      }

      // 监听返回事件
      this.onback(() => {
        if (this.$route.query.workBreakExercisesId) {
          this.$router.replace("/health");
        } else {
          this.$router.go(-1);
        }
      });

      // console.log("this.posterVisible", this.posterVisible);
    },
    beforeDestroy() {
      reportAllVideoDuration(this.zgStatistics);
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../style/workBreakExercisesDetail.css";
  .spec_icon_wrapper {
    position: fixed;
    bottom: 0px;
    left: 12px;
    z-index: 110;
  }
  .spec_icon {
    width: 100px;
    height: 100px;
    text-align: center;
    color: #467ffc;
    background-color: #fff;
    border-radius: 100%;
    position: relative;
    font-size: 24px;
    img {
      width: 40px;
      height: 40px;
    }
  }
  html,
  body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .container {
    width: 100%;
    height: 100%;
    position: relative;
    .header {
      height: 40px;
      font-size: 28px;
      line-height: 40px;
      margin: 38px 0;
      padding: 0 30px;
      img {
        vertical-align: middle;
      }
      .location {
        width: 26px;
        height: 32px;
      }
      .arrow_right {
        width: 12px;
        height: 20px;
      }
      .header_right {
        position: relative;
        line-height: 40px;
        .bg_bottom {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -4px;
          height: 12px;
          background: linear-gradient(270deg, rgba(74, 135, 252, 0.03) 0%, rgba(81, 146, 253, 0.3) 100%);
        }
      }
    }
    .content_wrapper {
      background-color: #f9f9f9;
      padding: 0px;
      padding-bottom: 174px;
      .sport {
        .videoBox {
          position: relative;
          width: 100%;
          color: #fff;
          .play_box {
            position: absolute;
            // z-index: 99;
            bottom: 0;
            left: 0;
            right: 0;
            top: 0;
            width: 88px;
            height: 88px;
            margin: auto;
            border-radius: 50%;
            img {
              width: 88px;
              height: 88px;
            }
          }
          .video_poster {
            // position: relative;
            // z-index: 98;
            // bottom: 0;
            // left: 0;
            // right: 0;
            // top: 0;
            img {
              width: 750px;
              height: auto;
            }
          }
        }
      }

      .video-info {
        width: 690px;
        margin: 0 auto;
        // margin-top: -14px;
        margin-top: 20px;
        /* height: 1020px; */
        padding-bottom: 20px;
        background: #ffffff;
        box-shadow: 4px 4px 26px 10px rgba(0, 0, 0, 0.05);
        border-radius: 16px;
        position: relative;
        // z-index: 115;
        padding: 40px 30px;
        .video-name {
          height: 56px;
          font-size: 40px;
          color: #1e201e;
          justify-content: left;
          .name {
            max-width: 630px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .source {
          margin-left: 12px;
          // width: 128px;
          padding: 0 10px;
          height: 44px;
          border-radius: 16px 0px 20px 0px;
          background: rgba(70, 127, 252, 0.1);
          line-height: 44px;
          font-size: 22px;
          color: #467ffc;
        }

        .behavior-box {
          height: 78px;
          margin-top: 42px;
          .behavior-left {
            .behavior-item {
              img {
                width: 36px;
                height: 36px;
                margin-right: 12px;
              }
              .eye {
                width: 40px;
                height: 28px;
              }
              font-size: 26px;
              color: #1e201e;
              margin-right: 80px;
            }
          }
          .lianxi-person {
            img {
              width: 44px;
              height: 44px;
              border-radius: 50%;
            }
            .person-1 {
              margin-right: -16px;
            }
            font-size: 24px;
            line-height: 34px;
            color: #666;
          }
        }

        .video-explain {
          text-align: left;
          overflow-y: auto;
          .content {
            font-size: 30px;
            font-weight: 400;
            text-align: left;
            color: #333333;
            background: #ffffff;
            line-height: 1.6;
          }
        }
      }
    }
    .elep-3 {
      position: fixed;
      z-index: 124;
      left: 30px;
      top: 20px;
      width: 0;
    }
    .video_finish_wrapper {
      /* position: absolute; */

      /* position: fixed;
            z-index: 131;
            left: 40px;
            top: 600px;
            width: 670px;
            height: 682px;

            height: auto;
            background: url('https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/blue_bg.png') no-repeat left center;
            background-size: 100% 100%; */

      position: fixed;
      z-index: 131;
      left: 40px;
      top: 300px;
      width: 670px;
      height: 540px;
      padding: 15px 0 20px;
      background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/blue_bg.png")
        no-repeat left center;
      background-size: 100% 100%;

      .title {
        position: relative;
        margin: 22px auto;
        font-size: 36px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 50px;
        .close-x {
          position: absolute;
          right: 18px;
          top: -24px;
          width: 24px;
          height: 24px;
        }
      }
      .kcalConsumption {
        position: relative;
        padding: 0 65px;
        font-size: 26px;
        color: #fff;
        line-height: 36px;
        .item {
          .line66 {
            .num {
              font-size: 48px;
              line-height: 66px;
            }
          }
        }
        .second {
          position: absolute;
          left: 216px;
          width: 2px;
          height: 48px;
          background: #ffffff;
          border-radius: 2px;
          opacity: 0.4;
        }
        .fourth {
          position: absolute;
          right: 216px;
          width: 18px;
          height: 36px;
          font-size: 30px;
          font-family: Helvetica;
          color: #ffffff;
          line-height: 36px;
        }
      }

      .sport-after {
        width: 600px;
        margin: 0 auto;
        height: 330px;
        background: #ffffff;
        box-shadow: 0px 4px 26px 0px rgba(124, 159, 255, 0.3);
        border-radius: 20px;
        margin-top: 48px;
        .text {
          padding: 26px 0;
          font-size: 32px;
          font-weight: 550;
          color: #333333;
          line-height: 32px;
          text-align: center;
          position: relative;
          .botton-border {
            position: absolute;
            left: 188px;
            bottom: 18px;
            width: 220px;
            height: 24px;
            background: linear-gradient(135deg, #e5d7ff 0%, #aeecff 100%);
            border-radius: 12px;
            opacity: 0.59;
          }
        }

        .lift-road {
          text-align: center;
          height: 48px;
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 48px;
          position: relative;
          .health-point {
            color: #467ffc;
            font-size: 32px;
            span {
              color: #03bf2c;
            }
          }
          .dot {
            position: absolute;
            right: 520px;
            top: 0;
            width: 18px;
            height: 16px;
          }
          .right-dot {
            right: 56px;
            top: 32px;
          }
        }

        .tab_comment {
          display: flex;
          padding: 20px;
          justify-content: space-between;
          .tab_comment_item {
            text-align: center;
            img {
              width: 48px;
              height: 48px;
            }
            .text2 {
              font-size: 26px;
              line-height: 26px;
              color: #999;
            }
            .active {
              color: #333;
            }
          }
        }

        .comment_text {
          padding-top: 24px;
          padding-left: 8px;
          padding-right: 8px;
          .van-cell {
            background-color: #f7f8fa;
          }
        }
      }

      .bottom-btn-box {
        position: absolute;
        left: 15px;
        right: 15px;
        height: 90px;
        top: 580px;
        padding: 0 20px;
        color: #fff;
        font-size: 32px;
        line-height: 90px;
        div {
          width: 268px;
          height: 90px;
          background: linear-gradient(90deg, #5ba4ff 0%, #467ffc 100%);
          border-radius: 50px;
        }
        .yellow {
          background: linear-gradient(90deg, #fe7315 0%, #e55c00 100%);
          color: #ffffff;
        }
        .greeen {
          background: #16b57d;
        }
      }
    }

    .dynamicActionBox {
      position: fixed;
      z-index: 131;
      left: 40px;
      top: 300px;
      width: 670px;
      // height: 540px;
      padding: 24px 20px;
      border-radius: 16px;
      /* background: #E0ECFF; */
      background: linear-gradient(136deg, #fff 0%, #e0ecff 46%, #fff 100%);
      .dynamicActionInner {
        position: relative;
      }
      .dynamicBtn-close {
        position: absolute;
        width: 48px;
        height: 48px;
        z-index: 131;
        left: 300px;
        bottom: -100px;
      }
      .creatPosterImg {
        width: 100%;
        height: auto;
      }
      .bottom-btn-box {
        width: 100%;
        padding: 0 20px;
        color: #fff;
        font-size: 32px;

        .yellow {
          width: 360px;
          height: 90px;
          background: linear-gradient(90deg, #fe7315 0%, #e55c00 100%);
          color: #ffffff;
        }
        .dynamicBtn {
          width: 360px;
          height: 90px;
          background: linear-gradient(90deg, #5ba4ff 0%, #467ffc 100%);
          border-radius: 50px;
          margin-left: 125px;
          line-height: 90px;
        }

        .arrowTipInfo {
          justify-content: center;
          margin: 20px 0;
          img {
            width: 18px;
            height: 28px;
            margin-right: 8px;
            vertical-align: text-top;
          }
          .text {
            font-size: 26px;
            color: #565961;
          }
        }
      }
    }

    .posterWrapper {
      height: auto;
      margin: 0 auto;
      position: relative;
      background-color: transparent;
      border-radius: 16px;
      // background-color: #E0ECFF;;

      // background-color: #fff;

      .posterBgImg {
        width: 100%;
        margin: 0 auto;
        position: relative;
        border-radius: 16px 16px 0 0;
        img {
          width: 100%;
          display: block;
          border-radius: 16px 16px 0 0;
        }
      }

      .posterBox {
        position: relative;
        z-index: 99999;
        font-size: 26px;
        color: #333;
        line-height: 36px;
        background-color: #fff;

        width: 100%;
        margin: 0 auto;
        padding: 30px 0;
        /* margin-top: -1.4rem; */
        border-radius: 0 0 16px 16px;
        .top {
          padding: 0 40px;
          .item {
            .line66 {
              .num {
                font-size: 48px;
                line-height: 66px;
              }
            }
            .line48 {
              color: #54565c;
            }
          }
          .second {
            position: absolute;
            left: 186px;
            width: 2px;
            height: 48px;
            background-color: #333;
            border-radius: 2px;
            opacity: 0.4;
          }
          .fourth {
            position: absolute;
            right: 216px;
            width: 18px;
            height: 36px;
            font-size: 30px;
            font-family: Helvetica;
            color: #54565c;
            line-height: 36px;
          }
        }
        .bottom {
          width: 100%;
          // background-color: #fff;
          position: relative;
          // box-shadow: 0px 4px 8px 0px rgba(145,149,161,0.2);
          background: rgba(255, 255, 255, 1);
          font-size: 32px;
          line-height: 40px;
          padding-top: 20px;
          border-radius: 0 0 16px 16px;
          border-top: none;
          text-align: center;
          color: #333;
          .left_dot {
            padding-left: 80px;
            font-size: 48px;
            text-align: left;
          }
          .right_dot {
            margin-top: 20px;
            font-size: 48px;
            text-align: right;
            padding-right: 80px;
          }
        }
      }
    }
  }

  .line48 {
    line-height: 36px;
    padding-bottom: 12px;
  }

  // .transmit-box{
  //     position: fixed;
  //     left: 0;
  //     top: 550px;
  //     z-index: 200;
  //     left: 40px;

  //     .transmit-box-positive{
  //         width: 670px;
  //         height: 238px;
  //         background: url('https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/star-bg.png') no-repeat left center;
  //         background-size: 100% 100%;
  //         position: relative;
  //         .h-title{
  //             padding: 34px 0;
  //             font-size: 32px;
  //             color: #467FFC;
  //             .num{
  //                 font-size: 44px;
  //                 color: #03BF2C;
  //             }
  //         }
  //         .value-info{
  //             text-align: left;
  //             font-size: 28px;
  //             color: #333;
  //             line-height: 42px;
  //             margin: 0 34px 0 166px;
  //         }
  //         .close-circle{
  //             position: absolute;
  //             right: 40px;
  //             top: -120px;
  //             width: 60px;
  //             height: 60px;
  //         }
  //         .shutiao{
  //             width: 4px;
  //             height: 60px;
  //             background: #FFFFFF;
  //             position: absolute;
  //             right: 70px;
  //             top: -60px;
  //         }
  //         .elep-2{
  //             width: 214px;
  //             height: 186px;
  //             position: absolute;
  //             left: 0;
  //             top: -80px;
  //         }
  //     }
  // }

  .zask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 120;
    background: rgba(0, 0, 0, 0.7);
  }

  .change-box {
    position: fixed;
    z-index: 117;
    bottom: 0px;
    width: 750px;
    height: 164px;
    background: #ffffff;
    box-shadow: 0px -2px 0px 0px rgba(224, 225, 229, 0.5);
    font-size: 32px;
    .btn {
      width: 606px;
      margin-left: 72px;
      margin-top: 37px;
      height: 90px;
      background: linear-gradient(90deg, #5ba4ff 0%, #467ffc 100%);
      line-height: 90px;
      border-radius: 45px;
      color: #fff;
    }
    .forbiddenBtn {
      background: gray;
      color: #484343;
      opacity: 0.3;
    }
  }
</style>
