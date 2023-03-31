<script>
  import { defineComponent } from "@vue/composition-api";
  import Service from "./components/service";

  export default defineComponent({
    components: {
      Service
    },
    setup() {
      const editFlag = true;
      return {
        editFlag
      };
    }
  });
</script>

<template>
  <div class="content">
    <Service :editFlag="editFlag" />
  </div>
</template>

<style lang="scss" scoped>
  .content {
    min-height: 100%;
    background: #f2f4f8;
    overflow: hidden;
  }
</style>
