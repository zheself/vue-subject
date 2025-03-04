<template>
  <Table
    rowKey="name"
    :columns="columns"
    :dataSource="data"
    :expandedRowRender="expandRowRender"
    :rowSelection="rowSelection"
    :pagination="false"
  />
</template>

<script setup>
import { ref, h } from 'vue';
import { Table, Avatar, Descriptions, Tag } from '@kousum/semi-ui-vue';
import { IconMore, IconTickCircle, IconClear, IconComment } from '@kousum/semi-icons-vue';

// 列定义
const columns = [
  {
    title: '标题',
    width: 500,
    dataIndex: 'name',
    render: (text, record) =>
      h('span', {}, [
        h(Avatar, {
          size: 'small',
          shape: 'square',
          src: record.nameIconSrc,
          style: { marginRight: '12px' }
        }),
        text
      ])
  },
  {
    title: '耗时',
    dataIndex: 'duration',
    // 可根据实际情况添加 sorter 等其他配置
  },
  {
    title: '共同工作者',
    dataIndex: 'collaborators',
    render: (text, record) =>
      h('div', {}, [
        h(Avatar, {
          size: 'small',
          color: record.avatarBg,
          style: { marginRight: '4px' }
        }, () => text[0]),
        text
      ])
  },
  {
    title: '工作状态',
    dataIndex: 'status',
    render: (text) => {
      const tagConfig = {
        success: {
          color: 'green',
          prefixIcon: h(IconTickCircle),
          text: '已完成'
        },
        pending: {
          color: 'pink',
          prefixIcon: h(IconClear),
          text: '进行中'
        },
        wait: {
          color: 'cyan',
          prefixIcon: h(IconComment),
          text: '待开始'
        }
      };
      const tagProps = tagConfig[text];
      return h(
        Tag,
        {
          shape: 'circle',
          ...tagProps,
          style: { userSelect: 'text' }
        },
        { default: () => [tagProps.text] }
      );
    }
  },
  {
    title: '',
    dataIndex: 'operate',
    render: () => h(IconMore)
  }
];

// 数据源
const data = ref([
  {
    key: '1',
    name: '走廊改造',
    nameIconSrc: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/figma-icon.png',
    duration: '2 小时', // 新增耗时字段
    collaborators: '张三',
    status: 'success', // 新增工作状态字段
    updateTime: '2020-02-02 05:13',
    avatarBg: 'grey'
  },
  {
    key: '2',
    name: '北京海淀区老李家庭改造设计',
    nameIconSrc: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
    duration: '3 小时',
    collaborators: '李四',
    status: 'pending',
    updateTime: '2020-01-17 05:31',
    avatarBg: 'red'
  },
  {
    key: '3',
    name: '杭州余杭区老方家庭改造设计',
    nameIconSrc: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
    duration: '1 小时',
    collaborators: '王五',
    status: 'wait',
    size: '34KB',
    updateTime: '2020-01-26 11:01',
    avatarBg: 'light-blue'
  }
]);

const expandData = {
  '0': [
    { key: '实际用户数量', value: '1,480,000' },
    { key: '7 天留存', value: '98%' },
    { key: '安全等级', value: '3 级' },
    { key: '垂类标签', value: h(Tag, { style: { margin: '0' } }, () => '设计') },
    { key: '认证状态', value: '未认证' }
  ],
  '1': [
    { key: '实际用户数量', value: '2,480,000' },
    { key: '7 天留存', value: '90%' },
    { key: '安全等级', value: '1 级' },
    { key: '垂类标签', value: h(Tag, { style: { margin: '0' } }, () => '模板') },
    { key: '认证状态', value: '已认证' }
  ],
  '2': [
    { key: '实际用户数量', value: '2,920,000' },
    { key: '7 天留存', value: '98%' },
    { key: '安全等级', value: '2 级' },
    { key: '垂类标签', value: h(Tag, { style: { margin: '0' } }, () => '文档') },
    { key: '认证状态', value: '已认证' }
  ]
};

const expandRowRender = (record, index) => h(Descriptions, {
  align: 'justify',
  data: expandData[index]
});

const rowSelection = {
  getCheckboxProps: (record) => ({
    disabled: record.name === '设计文档',
    name: record.name
  }),
  onSelect: (record, selected) => {
    console.log(`select row: ${selected}`, record);
  },
  onSelectAll: (selected, selectedRows) => {
    console.log(`select all rows: ${selected}`, selectedRows);
  },
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  }
};
</script>