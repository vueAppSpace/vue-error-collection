<template>
  <div class="container">
    <div :style="`background:url(${activeObj.cover}) no-repeat center;background-size: cover;`" class="banner">
      <!-- <img :src="activeObj.cover" alt="" class="active-image" /> -->
    </div>
    <div class="details">
      <div class="flex-between active-name">
        <div class="title">@{{ activeObj.title }}</div>
        <div class="praise">
          <van-icon @click="handlePraise" v-if="!hasLike" size="0.34rem" color="#565961" name="good-job-o" />
          <van-icon size="0.34rem" @click="handleCancelPraise" v-else color="#4B7AFF" name="good-job" />
          <span class="praise-count">{{ activeObj.clockInNum }}</span>
        </div>
      </div>
      <div class="active-text">
        {{ activeObj.briefIntro }}
      </div>
    </div>

    <div class="container-details">
      <div :class="`${filterStatus(item.dis)}-plane`" class="flex-column" v-for="(item, index) in array">
        <img v-if="item.dis == 1" :src="headerUrl" class="user-image" alt="" srcset="" />
        <div :class="`rank-${filterStatus(item.dis)}-count`">{{ item.cnt }}<span class="person">人</span> </div>
        <div :class="`tag-${filterStatus(item.dis)}`"> 累计打卡{{ item.key }}次</div>
        <div :class="filterStatus(item.dis)"> </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { queryClockInList, realDelete, activeDetail, activityLikePage, likeInsert } from "@/service/activity";
  export default {
    name: "intervense",
    data() {
      return {
        activeObj: {
          url: ""
        },
        array: [],
        clockInList: [],
        clockNum: 0,
        headerUrl: "",
        activeId: "",
        hasLike: false
      };
    },
    methods: {
      queryClockInList(days) {
        let params = {
          likeId: this.activeId,
          likeType: "2",
          memberCode: localStorage.getItem("memberCode"),
          clockInDays: days
        };
        queryClockInList(params).then(res => {
          if (res) {
            const { clockInList, clockNum, userHeadUrl } = res.data;
            this.clockInList = clockInList;
            this.clockNum = clockNum;
            this.headerUrl = userHeadUrl;
            let array = [];

            Object.keys(clockInList).forEach(key => {
              let dis = clockNum == key ? 1 : clockNum < key ? 2 : 0;
              let obj = {
                dis,
                key,
                cnt: clockInList[key]
              };
              array.push(obj);
            });
            this.array = array;
          }
        });
      },
      activeDetail(id) {
        activeDetail({ id }).then(res => {
          if (res) {
            this.activeObj = res.data;
            this.queryClockInList(this.activeObj.activityDays);
          }
        });
      },
      handlePraise() {
        let params = {
          likeType: 0,
          likeId: this.activeId,
          memberCode: localStorage.getItem("memberCode")
        };
        likeInsert(params).then(res => {
          if (res.code == 0) {
            this.zgStatistics("健康新奥-健康活动-活动点赞", { 来源: "动态打卡排行", 活动名称: this.activeObj.title });
            this.activeObj.clockInNum += 1;
            this.hasLike = true;
            console.log(res, "res");
          }
        });
      },
      handleCancelPraise() {
        let params = {
          likeType: 0,
          likeId: this.activeId,
          memberCode: localStorage.getItem("memberCode")
        };
        realDelete(params).then(res => {
          if (res) {
            this.activeObj.clockInNum -= 1;
            this.hasLike = false;
          }
        });
      },
      activityLikePage() {
        activityLikePage({
          memberCode: localStorage.getItem("memberCode"),
          likeId: this.activeId,
          likeType: "0",
          pageIndex: 1,
          pageSize: 10
        }).then(({ code, data }) => {
          if (code == 0 && data && data.length) {
            // console.log(res, 'res')
            this.hasLike = true;
          }
        });
      }
    },
    computed: {
      filterStatus() {
        return value => {
          if (value == 0) {
            return "used";
          } else if (value == 1) {
            return "inuse";
          } else if (value == 2) {
            return "dis";
          }
        };
      }
    },
    mounted() {
      this.activeId = this.$route.query.id;
      this.activeDetail(this.$route.query.id);
      this.activityLikePage();
    }
  };
</script>
<style scoped lang="scss">
  @mixin item-style {
    width: 216px;
    height: 216px;
    margin-left: 9px;
    margin-right: 9px;
    margin-bottom: 40px;
    border-radius: 16px;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  @mixin common-tag {
    width: 196px;
    height: 60px;
    font-size: 26px;
    color: #ffffff;
    line-height: 36px;
    position: absolute;
    top: 0;
    left: 0;
    line-height: 60px;
    text-align: center;
    border-top-left-radius: 56px;
    border-bottom-right-radius: 200px;
  }

  @mixin common-count {
    font-size: 64px;
    font-weight: 500;
    line-height: 90px;
    margin-top: 20px;
  }

  .details {
    padding-left: 32px;
    padding-right: 32px;
    background: #ffffff;
    border-radius: 24px 24px 0px 0px;
    margin-top: -60px;
    padding-top: 38px;
  }

  .active-image {
    width: 750px;
    height: 450px;
    object-fit: cover;
  }

  .banner {
    height: 450px;
    background-color: #ddd;
    background-size: cover !important;
  }

  .active-name {
    width: 680px;
    // margin-top: 38px;
  }

  .active-text {
    width: 686px;
    // height: 84px;
    background: #f5f6f9;
    border-radius: 16px;

    font-size: 26px;
    color: #3d3e42;
    line-height: 48px;
    text-align: left;
    padding-left: 24px;
    margin-top: 32px;
  }

  // .active-box {
  //     text-align: left;
  //     padding-left: 46px;
  //     box-sizing: border-box;
  // }

  .title {
    font-size: 36px;
    font-weight: 500;
    color: #1c1c1e;
    line-height: 50px;
    box-sizing: border-box;
  }

  .praise {
    font-size: 26px;
    color: #737782;
    line-height: 38px;
    display: flex;
    align-items: center;

    &-count {
      margin-left: 10px;
    }
  }

  .flex-column {
    display: flex;
    flex-direction: column;
  }

  .used-plane {
    @include item-style();
    background: linear-gradient(134deg, #91b7ff 0%, #4d8aff 100%);
  }

  .inuse-plane {
    @include item-style();
    background: linear-gradient(180deg, #ffca00 0%, #ff9a26 100%) !important;
  }

  .dis-plane {
    @include item-style();
    background: #edf1ff;
  }

  .container-details {
    display: flex;
    flex-wrap: wrap;
    padding-left: 23px;
    margin-top: 48px;
  }

  .rank-inuse-count {
    font-size: 40px;
    font-weight: 500;
    color: #ffffff;
  }

  .rank-used-count {
    color: #fff;
    @include common-count();
  }

  .rank-dis-count {
    color: #abafba;
    @include common-count();
  }

  // .rank-item {
  //     font-size: 25px;
  //     color: #3D3D3D;
  //     position: relative;
  // }

  // .rank-total {
  //     margin-top: 23px;
  // }

  .tag-used {
    @include common-tag();
    background: rgba(74, 74, 74, 0.3);
  }

  .tag-inuse {
    @include common-tag();
    background: #4a4a4a;
  }

  .tag-dis {
    @include common-tag();
    background: #d6dae8;
    font-size: 26px;
    color: #737782;
  }

  .user-image {
    width: 96px;
    height: 96px;
    border-radius: 50px;
    object-fit: cover;
    margin-top: 70px;
    border: 6px solid #fff;
  }

  .person {
    font-size: 40px;
    margin-top: -6px;
  }
</style>
