import {ref,onMounted,onUnmounted} from 'vue'
//独立功能 返回滚动条高度
export default function useScroll () {
    const top = ref(0);
    function update() {
        // 文档在垂直方向已滚动的像素值
        top.value = window.scrollY;
    }
    onMounted(()=>{
        //生命周期
        window.addEventListener("scroll",update)
    })

    onUnmounted(()=>{
        window.removeEventListener("scroll",update)
    })

    return {top}


}
