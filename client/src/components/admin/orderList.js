import React, { Component } from 'react';
import HeaderMenu from '../header/headermenu';
import Footer from '../footer/footer';
import './orderList.css';
import { Table, Tag, Checkbox, Switch, Input, Tabs } from 'antd';
import PendingOrder from './pendingOrder';


function onChange(checked) {
  console.log(`switch to ${checked}`);
}

const { TabPane } = Tabs;
const { Search } = Input;
const columns = [
    {
      title: 'Document',
      dataIndex: 'document',
      key: 'document',
      
    },
    {
      title: 'Order No',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: 'Order date',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Update Date',
      dataIndex: 'updateDate',
      key: 'updateDate',
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',

    },
    {
      title: 'Retail Price',
      dataIndex: 'retailPrice',
      key: 'retailPrice',

    },
    {
      title: 'Number',
      dataIndex: 'numbers',
      key: 'numbers',

    },
    {
      title: 'status',
      dataIndex: 'status',
      key: 'status',

    },
    {
      title: 'Printed',
      dataIndex: 'printed',
      key: 'printed',

    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',

    }
  ];
  
  const data = [
    {
      key: '1',
      orderNo: '1',
      orderDate: 'Sony Experia mark II with so many features',
      updateDate: 'clmj100012',
      paymentMethod: '5 stars',
      retailPrice: '5',
      numbers: '200 Views',
      status: '15 Products',
      printed: '',
      actions: '',
      
    },
    {
      key: '2',
      orderNo: '2',
      orderDate: 'Sony Experia mark II with so many features',
      updateDate: 'dewp19003',
      paymentMethod: '4 stars',
      retailPrice: '3',
      numbers: '200 Views',
      status: '15 Products',
      printed: '',
      actions: '',
      
    },
    {
      key: '3',
      orderNo: '3',
      orderDate: 'Sony Experia mark II with so many features',
      updateDate: 'fulib90003',
      paymentMethod: '5 stars',
      retailPrice: '19',
      numbers: '200 Views',
      status: '15 Products',
      printed: '',
      actions: '',
      
    },
    {
      key: '4',
      orderNo: '4',
      orderDate: 'Sony Experia mark II with so many features',
      updateDate: 'dewp19003',
      paymentMethod: '2.5 Stars',
      retailPrice: '3',
      numbers: '200 Views',
      status: '15 Products',
      printed: '',
      actions: '',
      
    },
    {
      key: '5',
      orderNo: '5',
      orderDate: 'Sony Experia mark II with so many features',
      updateDate: 'clmj100012',
      paymentMethod: '3 stars',
      retailPrice: '5',
      numbers: '200 Views',
      status: '15 Products',
      printed: '',
      actions: '',
      
    },
    {
      key: '6',
      orderNo: '6',
      orderDate: 'Sony Experia mark II with so many features',
      updateDate: 'dhekib48003',
      paymentMethod: ['cool', 'teacher'],
      retailPrice: '19',
      numbers: '200 Views',
      status: '15 Products',
      printed: '',
      actions: '',
      
    },
    {
      key: '7',
      orderNo: '7',
      orderDate: 'Sony Experia mark II with so many features',
      updateDate: 'fjepss87003',
      paymentMethod: ['loser'],
      retailPrice: '3',
      numbers: '200 Views',
      status: '15 Products',
      printed: '',
      actions: '',
      
    },
  ];

  function callback(key) {
  console.log(key);
}
class OrderListNew extends Component{
    render(){
        return(
            <div className="">
                <HeaderMenu/>
                <div style={{marginTop:"110px"}}>
                    <h2 style={{textAlign:"center"}}>Order List</h2>

                    <div className="container" style={{width:"40%", marginBottom:"15px", marginTop:"15px"}}>
                        <Search placeholder="input search text" onSearch={value => console.log(value)} enterButton />
                    </div>
                    <div className="container">
                        <div className="row">
                            <Tabs defaultActiveKey="1" onChange={callback}>
                                <TabPane tab="All" key="1">
                                    <div>
                                        <Table columns={columns} dataSource={data} />
                                    </div>
                                </TabPane>
                                <TabPane tab="Pending" key="2">
                                        <PendingOrder/>
                                </TabPane>
                                <TabPane tab="Ready To Ship" key="3">
                                Content of Tab Pane 3
                                </TabPane>
                            </Tabs>,
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>

        )
    }
}

export default OrderListNew;