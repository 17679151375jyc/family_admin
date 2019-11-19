<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
    data () {
        return {

        }
    },
    computed: {
        ...mapState({
            userId: state => state.user.userId
        })
    },
    watch: {
        userId: function (val, oldVal) {
            console.log('userId改变了', val, oldVal)
        }
    }
}
</script>
