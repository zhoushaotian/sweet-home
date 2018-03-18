<template>
    <div class="card-wrapper">
        <div class="card" v-for="(event, index) in events" :key="index">
            <div class="event-title">
                <span>{{event.name}}</span>
                <span>{{event.time}}</span>
            </div>
            <div class="event-body" >
                <p>
                    {{event.content}}
                </p>
            </div>
            <div class="event-attach"></div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'eventCard',
    props: {
        events: {
            type: Array
        }
    }
};
</script>
<style lang="less" scoped>
</style>
