import React from 'react';
import propTypes from 'prop-types';

import moment from 'moment';
import {Card, Icon, Button, Modal, List} from 'antd';
import EventAddForm from '../components/form/event_add';
import { dateFomat, dateFomatOnlyDay, dateFomatOnlyMonth, dateFomatOnlyYear } from '../common/const';


class CalendarEvents extends React.Component {
    constructor(props) {
        super(props);
        this.handleShowAddEvent = this.handleShowAddEvent.bind(this);
        this.handleAddEvent = this.handleAddEvent.bind(this);
        this.state = {
            showAddEvent: false,
            curEvent: {}
        };
    }
    render() {
        const {showAddEvent, curEvent} = this.state;
        const {events, curTime} = this.props;
        const title = (
            <div>
                <Icon type="heart" style={{verticalAlign: 'middle', color: 'red'}}/>
                <span>{curTime.format(dateFomatOnlyYear)}年{curTime.format(dateFomatOnlyMonth)}月{curTime.format(dateFomatOnlyDay)}号的事件</span>
            </div>
        );
        let result = [];
        let year = curTime.format(dateFomatOnlyYear);
        let month = curTime.format(dateFomatOnlyMonth);
        let day = curTime.format(dateFomatOnlyDay);
        // 遍历整个事件列表取得当前所选事件
        for(let i = 0; i < events.length; i++) {
            let time = new moment(parseInt(events[i].time));
            let eventYear = time.format(dateFomatOnlyYear);
            let eventMonth = time.format(dateFomatOnlyMonth);
            let eventDay = time.format(dateFomatOnlyDay);
            if(year === eventYear && month === eventMonth && day === eventDay) {
                result.push(events[i]);
            }
        }
        return (
            <div>
                <Card
                    title={title}
                    extra={<Button icon="plus" shape="circle" onClick={this.handleShowAddEvent}/>}
                    bodyStyle={{height: '400px', overflow: 'auto'}}
                >
                    {result ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={result}
                            renderItem={item => (
                                <List.Item
                                    extra={moment(parseInt(item.time)).format(dateFomat)}
                                    onClick={() => {this.setState({
                                        showAddEvent: true,
                                        curEvent: item
                                    });}}
                                >
                                    <List.Item.Meta
                                        title={<span>{item.level === 1 ? <Icon type="smile" style={{color: 'pink', marginRight: '10px'}}/> : <Icon type="frown" style={{color: 'black', marginRight: '10px'}}/>}{item.title}</span>}
                                        description={item.detail}
                                    />
                                </List.Item>
                            )}
                            
                        />
                    ) : (
                        <div>
                            还未添加过事件
                        </div>
                    )}
                </Card>
                <Modal
                    visible={showAddEvent}
                    onCancel={() => {this.setState({
                        showAddEvent: false
                    });}}
                    footer={null}
                    destroyOnClose={true}
                >
                    <EventAddForm
                        loading={false}
                        onSubmit={this.handleAddEvent}
                        defaultValue={curEvent}
                    />
                </Modal>
            </div>
        );
    }
    handleShowAddEvent() {
        this.setState({
            showAddEvent: true,
            curEvent: {}
        });
    }
    handleAddEvent(value, edit) {
        const {onAddEvent, curTime, onEditEvent} = this.props;
        // 插入时间字段
        let time = new moment();
        time.set({
            year: curTime.format(dateFomatOnlyYear),
            month: curTime.format(dateFomatOnlyMonth) - 1,
            date: curTime.format(dateFomatOnlyDay)
        });
        value.time = time.valueOf();
        if(edit) {
            return onEditEvent(value, () => {
                this.setState({
                    showAddEvent: false
                });
            });
        }
        onAddEvent(value, () => {
            this.setState({
                showAddEvent: false
            });
        });
    }
}
CalendarEvents.propTypes = {
    curTime: propTypes.object.isRequired,
    events: propTypes.array,
    onAddEvent: propTypes.func.isRequired,
    onEditEvent: propTypes.func.isRequired
};
export default CalendarEvents;