<script setup>
import { Timer } from '@element-plus/icons-vue'
import { Edit, Delete, View } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import ImageListDialog from '../component/ImageListDialog.vue'

// 表格列
const formInline = reactive({
    name: '',
    status: '',
    date: '',
})

const router = useRouter()

// 查询搜索
const onSubmit = () => {
    console.log('submit!')
}

// 当前页
const currentPage = ref(1)
const pageSize = ref(5)
// 总页数
const totalSize = ref(20)


const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val) => {
    console.log(`${val} items per page`)
}
const handleCurrentChange = (val) => {
    console.log(`current page: ${val}`)
}

// 处理编辑按钮
const handleEdit = (index, row) => {
    router.push({ path: '/reconstruction/edit' })
    console.log(index, row)
}


// 处理模型浏览按钮
const handleView = (index, row) => {
    router.push({ path: '/reconstruction/view' })
    console.log(index, row)
}

// 处理删除任务按钮
const handleDelete = (index, row) => {
    console.log(index, row)
}

// 打开图片库按钮跳转
const imageListVisible = ref(null)
const openImageList = () => {
    imageListVisible.value.openDialog()
}




const object = { 训练中: 'primary', 结束: 'success', 异常终止: 'danger', 未启动: 'info' }

const tableData = [
    {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
        tag: '训练中'
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
        tag: '结束'
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
        tag: '异常终止'
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
        tag: '未启动'
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
        tag: '训练中'
    }, {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
        tag: '训练中'
    }, {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
        tag: '训练中'
    },
]
</script>

<template>

    <el-card class="box-card" shadow="hover" height="200px">
        <div class="card-header" style="mar">
            <span>重建任务管理</span>
            <div>
                <ImageListDialog ref="imageListVisible" mode="manage" type="bg" />
                <el-button type="primary" @click="openImageList">打开图片库</el-button>
                
                <el-button type="danger">清空重建记录</el-button>

                <el-button type="success">新建重建任务</el-button>
            </div>

        </div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="名称/ID">
                <el-input v-model="formInline.name" placeholder="名称/ID" clearable />
            </el-form-item>
            <el-form-item label="任务状态">
                <el-select v-model="formInline.status" placeholder="请选择状态" clearable>
                    <el-option label="未启动" value="未启动" />
                    <el-option label="训练中" value="训练中" />
                    <el-option label="异常终止" value="异常终止" />
                    <el-option label="训练结束" value="训练结束" />
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker v-model="formInline.date" type="date" placeholder="Pick a date" clearable />
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="onSubmit">查询</el-button>
                <el-button type="info" @click="onSubmit">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" stripe class="full-width-table">
            <el-table-column label="名称/ID">
                <template #default="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间">
                <template #default="scope">
                    <div class="time-icon">
                        <el-icon>
                            <timer />
                        </el-icon>
                        <span>{{ scope.row.date }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template #default="scope">
                    <el-tag :type="object[scope.row.tag]" disable-transitions>{{
                        scope.row.tag }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <el-tooltip class="box-item" effect="dark" content="任务编辑" placement="left">
                        <el-button type="primary" @click="handleEdit(scope.$index, scope.row)" :icon="Edit" circle />
                    </el-tooltip>
                    <el-tooltip class="box-item" effect="dark" content="模型预览" placement="top">
                        <el-button type="warning" :disabled="scope.row.tag === '结束' ? false : true"
                            @click="handleView(scope.$index, scope.row)" :icon="View" circle />
                    </el-tooltip>
                    <el-tooltip class="box-item" effect="dark" content="删除任务" placement="top">
                        <el-button type="danger" @click="handleDelete(scope.$index, scope.row)" :icon="Delete" circle />
                    </el-tooltip>

                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
            :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
            :total="totalSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>

</template>

<style scoped>
.el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

.demo-form-inline .el-input {
    --el-input-width: 220px;
}

.demo-form-inline .el-select {
    --el-select-width: 220px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.full-width-table {
    width: 100%;
}

.time-icon {
    display: flex;
    align-items: center
}
</style>