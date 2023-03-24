<!--
 * @Description: 物联
 * @Author: IFLS
 * @Date: 2022-05-12 15:05:12
 * @LastEditTime: 2022-08-01 15:55:33
-->
<script>
import { defineComponent } from "@vue/composition-api";
import PanelTips from "@/components/PanelTips";
import PanelList from "@/components/PanelList";
// import { isIosX } from '@/utils/isIosX'
export default defineComponent({
    components: { PanelList, PanelTips },
    setup() {
        return {
            // isIosX
        };
    },
});
</script>

<template>
    <!-- <div :class="['page-box', isIosX ? 'padding-ipx' : '']"> -->
    <div class="page-box">
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
    </div>
</template>
