<script>
import { defineComponent, onActivated, ref } from "@vue/composition-api";
import { fetchSportCenterList } from "@/service/service";
import { Toast } from "vant";

import PanelTips from "@/components/PanelTips";
import PanelList from "@/components/PanelList";

export default defineComponent({
    components: { PanelList, PanelTips },
    setup() {
        const sportList = ref([]);

        const getSportList = async () => {
            try {
                const { code, data, message } = await fetchSportCenterList({ status: 1, pageIndex: 1, pageSize: 10 });
                console.log("获取运动中心列表：", data);

                if (code === 0) {
                    sportList.value = data;
                } else {
                    console.log("fetchSportCenterList", message);
                    // Toast(message);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        onActivated(() => {
            getSportList();
        });

        return { sportList };
    },
});
</script>

<template>
    <div class="page-box">
        <template v-if="sportList.length">
            <template v-for="item in sportList">
                <div :key="item.id">
                    <div class="card">
                        <img :src="item.advertiseImage" alt="" />
                    </div>
                    <div class="content union-box" v-html="item.centerIntro"></div>
                </div>
            </template>
        </template>

        <template v-else>
            <panel-tips>链接您的健康！</panel-tips>
            <panel-list>
                <ul>
                    <li>
                        <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/sport.png" />
                        运动场馆分布
                    </li>
                    <li>
                        <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/massage.png" />
                        健康配套设施
                    </li>
                    <li>
                        <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/device.png" />
                        个人设备绑定
                    </li>
                    <li>
                        <i></i>
                        <i></i>
                        <i></i>
                    </li>
                </ul>
            </panel-list>
        </template>
    </div>
</template>
<style lang="scss" scoped>
.page-box {
    background: #f0f2f7;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
    .card {
        height: 340px;
        border-radius: 16px;
        margin-bottom: 24px;
        img {
            width: 100%;
            height: 100%;
            border-radius: 16px;
        }
    }
}
</style>

<style>
.union-box img {
    width: 100%;
}
</style>
