/*
 * @Description: 参与运算且不需要暴露给模板的methods
 * @Author: IFLS
 * @Date: 2022-06-10 18:27:41
 * @LastEditTime: 2023-03-23 17:35:50
 */
export default function (props, state, $nextTick, $el) {
  const rotateDirectionFn = () => {
    if (state.temporaryData.poswidth <= 0) {
      return -1;
    } else {
      return 1;
    }
  };

  const angleRatioFn = () => {
    const height = $el.offsetHeight;
    const offsetY = state.temporaryData.offsetY;
    const ratio = -1 * ((2 * offsetY) / height - 1);
    return ratio || 0;
  };

  const nextTickFn = direct => {
    // 记录最终滑动距离
    state.temporaryData.lastPosWidth = state.temporaryData.poswidth;
    state.temporaryData.lastPosHeight = state.temporaryData.posheight;
    state.temporaryData.lastRotate = state.temporaryData.rotate;
    state.temporaryData.lastZindex = 20;
    // 循环currentPage
    if (direct === "prev") {
      state.temporaryData.currentPage =
        state.temporaryData.currentPage === 0 ? props.pages.length - 1 : state.temporaryData.currentPage - 1;
    } else {
      state.temporaryData.currentPage =
        state.temporaryData.currentPage === props.pages.length - 1 ? 0 : state.temporaryData.currentPage + 1;
    }
    // currentPage切换，整体dom进行变化，把第一层滑动置最低
    $nextTick(() => {
      state.temporaryData.poswidth = 0;
      state.temporaryData.posheight = 0;
      state.temporaryData.opacity = 1;
      state.temporaryData.rotate = 0;
    });
  };

  const inStackFn = (index, currentPage) => {
    let stack = [];
    const visible = state.temporaryData.visible;
    const length = props.pages.length;
    for (let i = 0; i < visible; i++) {
      if (currentPage + i < length) {
        stack.push(currentPage + i);
      } else {
        stack.push(currentPage + i - length);
      }
    }
    return stack.indexOf(index) >= 0;
  };

  const preventDefaultFn = e => {
    e.preventDefault();
  };

  return {
    rotateDirectionFn,
    angleRatioFn,
    nextTickFn,
    inStackFn,
    preventDefaultFn
  };
}
