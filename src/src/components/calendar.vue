<template>
    <div class="calendar-wrapper">
        <div class="cal-wrapper">
            <div class="cal-header">
            <div class="l point" @click="handlePreMonth">《</div>
            <div class="title">{{curYearMonth}}</div>
            <div class="r point" @click="handleNextMonth">》</div>
            </div>
            <div class="cal-body">
            <div class="weeks">
                <span
                v-for="(dayName, dayIndex) in i18n[lang].dayNames"
                class="item"
                :key="dayIndex"
                >
                {{dayName}}
                </span>
            </div>
            <br>
            <div class="dates" >
                <span v-for="(date, index) in dayList" class="item" :key="index" v-html="date.date"></span>
            </div>
            </div>
        </div>
        <div class="events-wrapper">
            <Event/>
        </div>
    </div>
</template>

<script>
import i18n from '../../tool/i18n';
import Event from './event.vue';
export default {
    name: 'calendar',
    components: {
        Event
    },
    data () {
        return {
            i18n,
            curYear: 0,
            curMonth: 0
        };
    },
    props: {
        lang: {
            type: String,
            default: 'en'
        },
        weekStartOn: {
            type: Number,
            default: 0
        }
    },
    mounted () {
        let today = new Date();
        this.curYear = today.getFullYear();
        this.curMonth = today.getMonth();
    },
    computed: {
        dayList () {
            let temArr = [];
            let total = new Date(this.curYear, this.curMonth + 1, 0).getDate();
            let firstDay = new Date(this.curYear, this.curMonth, 1);
            let startDay = 0;
            if (firstDay.getDay() !== 6) {
                startDay = firstDay.getDay();
            }
            for (let i = 0; i < 42; i++) {
                if (i >= startDay && i <= total + startDay - 1) {
                    temArr.push({
                        date: i - startDay + 1,
                        status: 0
                    });
                } else {
                    temArr.push({
                        date: '&nbsp',
                        status: 0
                    });
                }
            }
            return temArr;
        },
        curYearMonth () {
            return `${this.curMonth + 1}/${this.curYear}`;
        }
    },
    methods: {
        handlePreMonth () {
            if (this.curMonth === 0) {
                this.curMonth = 11;
                this.curYear--;
            } else {
                this.curMonth--;
            }
        },
        handleNextMonth () {
            if (this.curMonth === 11) {
                this.curMonth = 0;
                this.curYear++;
            } else {
                this.curMonth++;
            }
        }
    }
};
</script>

<style>
.calendar-wrapper {
    display: flex;
    flex-wrap: nowrap;
}
.events-wrapper {
    width: 50%;
}
.cal-wrapper{
    width: 50%;
}
.point{
    cursor: pointer;
}
.cal-header{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}
.weeks{
    display: flex;
}
.dates{
    display: flex;
    flex-wrap: wrap;
}
.item{
    width: 14.28%
}
</style>
