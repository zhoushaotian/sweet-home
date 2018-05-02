import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import { Layout, Menu, Avatar, Icon, Modal } from 'antd';
import Calendar from '../components/calendar';
import CalendarEvents from '../components/calendar_events';
import MateSetForm from '../components/form/mate_set';

import {fetchUserInfo, setMate} from '../actions/user';
import {addEvent, fetchEvents, editEvent, deleteEvent} from '../actions/events';


const { Header, Content, Footer } = Layout;
const MenuItem = Menu.Item;

function propMap(state) {
    return {
        user: state.user,
        events: state.events
    };
}
class Index extends React.Component {
    constructor() {
        super();
        this.handleDeleteEvent = this.handleDeleteEvent.bind(this);
        this.handleAddEvent = this.handleAddEvent.bind(this);
        this.handleEditEvent = this.handleEditEvent.bind(this);
        this.handleClickMenu = this.handleClickMenu.bind(this);
        this.handleSetMate = this.handleSetMate.bind(this);
        this.state = {
            showSetModal: false
        };
    }
    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchUserInfo());
        dispatch(fetchEvents());
    }
    render() {
        const {events, user} = this.props;
        const {showSetModal} = this.state;
        return (
            <Layout className="layout">
                <Header className="layout-header">
                    <div className="header-info"> 
                        <Avatar shape="circle" size="large" style={{marginRight: '10px'}} src={user.userInfo.avatar}/>
                        <span>{user.userInfo.nick}</span>
                    </div>
                    <Menu
                        selectedKeys={[]}
                        mode="horizontal"
                        className="layout-menu"
                        onClick={this.handleClickMenu}
                    >
                        <MenuItem>
                            <Icon type="database"/>信箱
                        </MenuItem>
                        <MenuItem key="login">
                            <Icon type="login" href="/login"/>登录/注册
                        </MenuItem>
                        <MenuItem key="mate">
                            <Icon type="search" />另一半
                        </MenuItem>
                    </Menu>
                </Header>
                <Content className="layout-content">
                    <div className="calendar-wrapper">
                        <Calendar/>
                    </div>
                    <div className="calendar-events">
                        <CalendarEvents onDeleteEvent={this.handleDeleteEvent} onEditEvent={this.handleEditEvent} onAddEvent={this.handleAddEvent} events={events.events} curTime={events.curTime}/>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Sweeet Home created By Liuyang
                </Footer>
                <Modal
                    visible={showSetModal}
                    footer={null}
                    title="另一半"
                    destroyOnClose={true}
                    onCancel={() => {
                        this.setState({
                            showSetModal: false
                        });
                    }}
                >
                    <MateSetForm mate={user.mate} onSubmit={this.handleSetMate}/>
                </Modal>
            </Layout>
        );
    }
    handleDeleteEvent(id) {
        const {dispatch} = this.props;
        dispatch(deleteEvent(id));
    }
    handleAddEvent(value, cb) {
        const {dispatch} = this.props;
        dispatch(addEvent(value, cb));
    }
    handleEditEvent(value, cb) {
        const {dispatch} = this.props;
        dispatch(editEvent(value, cb));
    }
    handleClickMenu(target) {
        switch(target.key) {
        case 'login':
            return window.location = '/login';
        case 'mate':
            this.setState({
                showSetModal: true
            });
            return;
        }
    }
    handleSetMate(value) {
        const {dispatch} = this.props;
        dispatch(setMate(value.userId));
    }
}
Index.propTypes = {
    user: propTypes.object,
    events: propTypes.object,
    list: propTypes.array,
    dispatch: propTypes.func,
    getState: propTypes.func
};

export default connect(propMap)(Index);