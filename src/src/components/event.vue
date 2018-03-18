<template>
    <div class="event-wrapper">
        <div class="event-date">
            测试事件
        </div>
        <EventCard :events="events"/>
    </div>
</template>
<script>
import EventCard from './event_card';
export default {
    name: 'event',
    components: {
        EventCard
    },
    data () {
        return {
            events: [
                {
                    name: '测试',
                    time: '2018-3-1',
                    content: 'test'
                }
            ]
        };
    }
};
</script>
<style lang="less" scoped>
</style>
