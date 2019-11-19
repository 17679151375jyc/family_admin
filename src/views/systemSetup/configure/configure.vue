<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <!-- <div class="handle-container">
      <div class="search-wrapper"></div>
      <div class="handle-wrapper">
        <Button icon="md-list"  type="success" v-if="$options.filters.auth(['systemM.configure.detail'])" @click="detailClick">详情</Button>
      </div>
    </div>
    <div class="handle-container">
      <div class="search-wrapper"></div>
      <div class="handle-wrapper">
        <Button icon="md-create"  type="info" v-if="$options.filters.auth(['systemM.configure.edit'])"  @click="editClick" >编辑</Button>
      </div>
    </div>-->
    <!-- 顶部操作内容-end -->
    <div class="tab-wrapper textWdith">
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icontoken"></i>
            <span>萤石accesstoken token</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.yingshi_access_token }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.yingshi_access_token)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.yingshi_access_token)"
            >编辑</Button>
          </div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconfujin"></i>
            <span>附近的时间范围</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.nearby_timerange }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.nearby_timerange)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.nearby_timerange)"
            >编辑</Button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshichang"></i>
            <span>萤石accesstoken时长</span>
          </div>
          <div class="text">
            <span
              class="spanClass"
            >{{ $options.filters.formatTime(parseInt(configureist.yingshi_access_token_time/1000) + 0) }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.yingshi_access_token_time)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.yingshi_access_token_time)"
            >编辑</Button>
          </div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>主机测试恢复的定时时间</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.machine_test_recover }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.machine_test_recover)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.machine_test_recover)"
            >编辑</Button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconkey"></i>
            <span>萤石app键</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.yingshi_app_key }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.yingshi_app_key)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.yingshi_app_key)"
            >编辑</Button>
          </div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconjiance"></i>
            <span>临时密码过期监测</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.temp_password }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.temp_password)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.temp_password)"
            >编辑</Button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconmiyue"></i>
            <span>萤石app密钥</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.yingshi_app_secret }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.yingshi_app_secret)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.yingshi_app_secret)"
            >编辑</Button>
          </div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont icontoken"></i>
            <span>萤石服务端token</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.ys_service_token }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.ys_service_token)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.ys_service_token)"
            >编辑</Button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>普通报警等待的时间</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.normal_alert_wait_time }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.normal_alert_wait_time)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.normal_alert_wait_time)"
            >编辑</Button>
          </div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>萤石服务端token过期时间</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.ys_service_token_time }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.ys_service_token_time)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.ys_service_token_time)"
            >编辑</Button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>紧急报警等待的时间</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.urgent_alert_wait_time }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.urgent_alert_wait_time)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.urgent_alert_wait_time)"
            >编辑</Button>
          </div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconid"></i>
            <span>云图api中的地图ID</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.map_table_id }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.map_table_id)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.map_table_id)"
            >编辑</Button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>维保等待自动接单</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.maintain_wait_time }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.maintain_wait_time)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.maintain_wait_time)"
            >编辑</Button>
          </div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconid"></i>
            <span>猎鹰api中的地图服务id</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.map_service_id }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.map_service_id)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.map_service_id)"
            >编辑</Button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>等待语音呼叫时间</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.wait_call_time }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.wait_call_time)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.wait_call_time)"
            >编辑</Button>
          </div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont icongeren"></i>
            <span>门口机心跳检测失败后通知的联系人</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.device_check_contact | phone }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.device_check_contact)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.device_check_contact)"
            >编辑</Button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>等待短信通知时间</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.wait_sms_time }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.wait_sms_time)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.wait_sms_time)"
            >编辑</Button>
          </div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont icongeren"></i>
            <span>主机服务器心跳检测失败后通知的联系人</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.machine_check_contact | phone }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.machine_check_contact)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.machine_check_contact)"
            >编辑</Button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>临时访客超时时间</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.wait_temp_visitot_time }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.wait_temp_visitot_time)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.wait_temp_visitot_time)"
            >编辑</Button>
          </div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconarea"></i>
            <span>忽略的主机区域码</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.ignore_machine_code }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.ignore_machine_code)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.ignore_machine_code)"
            >编辑</Button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>临时访客大门超时时间</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.gate_wait_time }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.gate_wait_time)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.gate_wait_time)"
            >编辑</Button>
          </div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont icontoken"></i>
            <span>微信公众号token</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.wx_mp_token }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.wx_mp_token)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.wx_mp_token)"
            >编辑</Button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjiance"></i>
            <span>主机心跳检测</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.machine_check_time }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.machine_check_time)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.machine_check_time)"
            >编辑</Button>
          </div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>微信token过期时间</span>
          </div>
          <div class="text">
            <span class="spanClass">
              {{
              $options.filters.formatTime(parseInt(configureist.wx_mp_token_time) + 0) }}
            </span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.wx_mp_token_time)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.wx_mp_token_time)"
            >编辑</Button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjiance"></i>
            <span>门口机心跳检测</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.device_check_time }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.device_check_time)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.device_check_time)"
            >编辑</Button>
          </div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>后台用户在线监测时间</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.fbuser_check_online_time }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.fbuser_check_online_time)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.fbuser_check_online_time)"
            >编辑</Button>
          </div>
        </div>
      </div>

      <div class="row" style="width: 50%">
        <div class="item">
          <div class="label">
            <i class="iconfont iconbanjingsousuo"></i>
            <span>附近半径</span>
          </div>
          <div class="text">
            <span class="spanClass">{{ configureist.nearby_radius }}</span>
          </div>
          <div class="butBox">
            <Button
              size="small"
              class="but_class"
              icon="md-list"
              type="success"
              v-if="$options.filters.auth(['systemM.configure.detail'])"
              @click="detailClick(nameList.nearby_radius)"
            >详情</Button>
            <Button
              size="small"
              class="but_class"
              icon="md-create"
              type="info"
              v-if="$options.filters.auth(['systemM.configure.edit'])"
              @click="editClick(nameList.nearby_radius)"
            >编辑</Button>
          </div>
        </div>
      </div>
    </div>

    <!-- 表格-start -->
    <!-- <div class="win-table-wrapper" id="win-table-wrapper">
      <Table border stripe highlight-row :loading="tabIsLoading" :columns="tabCol" :data="tabData"></Table>
    </div>-->

    <!-- 表格-end -->

    <!-- 添加内容弹窗-start -->
    <add @handleClose="addClose" :isShow="add.isShow"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :title="titleName" :name="keyName" :isShow="edit.isShow"></edit>
    <!-- 编辑内容弹窗-end -->

    <!-- 详情弹窗-start -->
    <detail @handleClose="detailClose" :name="keyName" :isShow="detail.isShow"></detail>
    <!-- 详情弹窗-end -->
  </div>
</template>
<script>
import add from "./add"; // 添加主机
import edit from "./edit"; // 主机
import detail from "./detail"; // 详情
// import defenceArea from "./defenceArea/defenceArea"; // 防区列表systemSetup
import { getConfigureList } from "@/api/systemSetup";
export default {
  components: {
    add,
    edit,
    detail
    // defenceArea,
  },
  data() {
    return {
      buttonShow: false,
      titleName: null,
      keyName: null,
      hostStatusNum: 2,
      nameList: {
        yingshi_access_token: "yingshi_access_token", //萤石accesstoken token
        yingshi_access_token_time: "yingshi_access_token_time", //萤石accesstoken时长
        yingshi_app_key: "yingshi_app_key", //萤石app键
        yingshi_app_secret: "yingshi_app_secret", //萤石app密钥
        normal_alert_wait_time: "normal_alert_wait_time", //普通报警时间
        urgent_alert_wait_time: "urgent_alert_wait_time", //紧急报警时间
        maintain_wait_time: "maintain_wait_time", //维保等待自动接单
        wait_call_time: "wait_call_time", //等待语音呼叫时间
        wait_sms_time: "wait_sms_time", //等待短信通知时间
        wait_temp_visitot_time: "wait_temp_visitot_time", //临时访客超时时间
        gate_wait_time: "gate_wait_time", //临时访客大门超时时间
        machine_check_time: "machine_check_time", //主机心跳检测
        device_check_time: "device_check_time", //门口机心跳检测
        nearby_radius: "nearby_radius", //附近半径
        nearby_timerange: "nearby_timerange", //附近的时间范围
        machine_test_recover: "machine_test_recover", //主机测试恢复的定时时间
        temp_password: "temp_password", //临时密码过期监测
        ys_service_token: "ys_service_token", //萤石服务端token
        ys_service_token_time: "ys_service_token_time", //萤石服务端token过期时间
        map_table_id: "map_table_id", //云图api中的地图ID
        map_service_id: "map_service_id", //猎鹰api中的地图服务id
        gate_wait_time: "gate_wait_time", //门等待时间
        device_check_contact: "device_check_contact", //门口机心跳检测失败后通知的联系人多个用,号分开
        //主机服务器心跳检测失败后通知的联系人多个用,号分开
        ignore_machine_code: "ignore_machine_code", //忽略的主机区域码
        wx_mp_token: "wx_mp_token", //微信公众号token
        wx_mp_token_time: "wx_mp_token_time", //微信token过期时间
        fbuser_check_online_time: "fbuser_check_online_time" //后台用户在线监测时间
      },
      configureist: {
        yingshi_access_token: null, //萤石accesstoken token
        yingshi_access_token_time: null, //萤石accesstoken时长
        yingshi_app_key: null, //萤石app键
        yingshi_app_secret: null, //萤石app密钥
        normal_alert_wait_time: null, //普通报警等待时间
        urgent_alert_wait_time: null, //紧急报警等待时间
        maintain_wait_time: null, //维保等待自动接单
        wait_call_time: null, //等待语音呼叫时间
        wait_sms_time: null, //等待短信通知时间
        wait_temp_visitot_time: null, //临时访客超时时间
        gate_wait_time: null, //临时访客大门超时时间
        machine_check_time: null, //主机心跳检测
        device_check_time: null, //门口机心跳检测
        nearby_radius: null, //附近半径
        nearby_timerange: null, //附近的时间范围
        machine_test_recover: null, //主机测试恢复的定时时间
        temp_password: null, //临时密码过期监测
        ys_service_token: null, //萤石服务端token
        ys_service_token_time: null, //萤石服务端token过期时间
        map_table_id: null, //云图api中的地图ID
        map_service_id: null, //猎鹰api中的地图服务id
        gate_wait_time: null, //门等待时间
        device_check_contact: null, //门口机心跳检测失败后通知的联系人多个用,号分开
        machine_check_contact: "machine_check_contact", //主机服务器心跳检测失败后通知的联系人多个用,号分开
        ignore_machine_code: null, //忽略的主机区域码
        wx_mp_token: null, //微信公众号token
        wx_mp_token_time: null, //微信token过期时间
        fbuser_check_online_time: null //后台用户在线监测时间
      },
      statusList: {
        // 主机状态列表
        1: {
          name: "布防",
          value: "TYPE_NO",
          class: "cell-success"
        },
        2: {
          name: "撤防",
          value: "TYPE_0",
          class: "cell-warning"
        },
        3: {
          name: "留守布防",
          value: "TYPE_1",
          class: "cell-success"
        }
      },
      list: [], // table数据列表
      add: {
        // 添加弹窗
        isShow: false
      },
      edit: {
        // 编辑弹窗
        isShow: false,
        id: null
      },
      detail: {
        // 详情弹窗
        isShow: false,
        macNumber: null // 主机number
      },
      // defenceArea: {
      //   // 防区列表
      //   isShow: false,
      //   macNumber: null // 防盗主机number
      // },
      tabIsLoading: false // 表格是否loading状态
    };
  },
  computed: {
    tabCol: function() {
      return [
        // 表格标题栏
        {
          type: "index",
          title: "序号",
          width: 64,
          align: "center",
          indexMethod: row => {
            // return row._index + 1 + (this.page.current - 1) * this.page.size;
          }
        },
        {
          title: "地图服务ID",
          key: "map_service_id",
          width: 100
        },
        {
          title: "萤石app键",
          key: "yingshi_app_key",
          width: 250
        },
        {
          title: "萤石app密钥",
          key: "yingshi_app_secret",
          width: 250
        },
        {
          title: "一般报警时间",
          key: "normal_alert_wait_time",
          width: 110
        },
        {
          title: "紧急报警时间",
          key: "urgent_alert_wait_time",
          width: 110
        },
        {
          title: "维保等待时间",
          key: "yingshi_access_token_time",
          minWidth: 150
        },
        {
          title: "萤石accesstoken时长",
          key: "yingshi_app_key",
          width: 250
        },
        {
          title: "萤石accesstoken token",
          key: "yingshi_access_token",
          width: 200
        },
        {
          title: "映射表ID",
          key: "map_table_id",
          width: 110
        },
        {
          title: "门等待时间",
          key: "gate_wait_time",
          width: 120
        },
        {
          title: "等待临时访问时间",
          key: "wait_temp_visitot_time",
          minWidth: 150
        },
        {
          title: "操作",
          key: "handle",
          width: 180,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            let editBtn = null;
            let delBtn = null;
            if (this.$options.filters.auth(["systemM.configure.detail"])) {
              // 详情按钮
              let btn = h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    marginRight: "2px"
                  },
                  on: {
                    click: () => {
                      this.showDetail(params.index);
                    }
                  }
                },
                "详情"
              );
              btnGroup.push(btn);
            }
            if (this.$options.filters.auth(["systemM.configure.edit"])) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "2px"
                  },
                  on: {
                    click: () => {
                      this.showEdit(params.index);
                    }
                  }
                },
                "编辑"
              );
              btnGroup.push(btn);
            }
            return h("div", btnGroup);
          }
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      let {
        map_service_id, //地图服务ID
        yingshi_app_key, //萤石app键
        yingshi_app_secret, //萤石app密钥
        normal_alert_wait_time, //一般报警时间
        urgent_alert_wait_time, //紧急报警时间
        maintain_wait_time, //维保等待时间
        yingshi_access_token_time, //萤石accesstoken时长
        yingshi_access_token, //萤石accesstoken token
        map_table_id, //映射表ID
        gate_wait_time, //门等待时间
        wait_temp_visitot_time, //等待临时访问时间

        client_app_id, //客户端appId
        client_app_key, //客户端app键
        machine_app_id,
        machine_app_key,
        server_app_id,
        server_app_key
      } = this.list;
      tabData.push({
        map_service_id, //地图服务ID
        yingshi_app_key, //萤石app键
        yingshi_app_secret, //萤石app密钥
        normal_alert_wait_time, //一般报警时间
        urgent_alert_wait_time, //紧急报警时间
        maintain_wait_time, //维保等待时间
        yingshi_access_token_time, //萤石accesstoken时长
        yingshi_access_token, //萤石accesstoken token
        map_table_id, //映射表ID
        gate_wait_time, //门等待时间
        wait_temp_visitot_time //等待临时访问时间
      });
      return tabData;
    }
  },
  filters: {
    phone: value => {
      if (value) {
        let result = [];
        let num = 0;
        for (var i = 1; i < value.length; i++) {
          num++;
          result.unshift(value[i]);
          if (num % 11 == 0 && i != value.length) {
            result.unshift(",");
          }
        }
        let data = result.join("");
        return data;
      }
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    /**
     * @method getList 获取当前的数据列表
     */
    getList() {
      this.tabIsLoading = true;
      let keys = {
        yingshi_app_key: "f4ca816b051e42409c33cb583d3475a0", //萤石app键
        map_service_id: "61678", //地图服务键
        client_app_key: "0CQCzfHIE4Mj7QBJ8o9rMA63SlCzY0Zo", //客户端app键
        yingshi_app_secret: "ed4421109667e3b0d550afefcfe2a8d4", //萤石app密钥
        yingshi_access_token_time: "1568768359790" //萤石accesstoken时长
      };
      getConfigureList(keys)
        .then(({ data, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            if (data) {
              this.list = data;
              this.configureist = data;
              // this.configureist.yingshi_access_token_time = this.$options.filters.formatTime(data.yingshi_access_token_time/1000)
              console.log(data);
            } else {
              this.configureist = {};
            }
          }
        })
        .catch(err => {
          this.tabIsLoading = false;
        });
    },
    /**
     * @method delItem 删除该项数据
     * @param {Number} index 要删除的内容在列表中的序号
     */
    delItem(index) {
      // 删除
      delAccount({
        deleteUserId: this.list[index].id
      }).then(({ errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("删除成功");
          this.getList();
        }
      });
    },
    /**
     * @method showAdd 显示添加弹窗
     */
    showAdd() {
      this.add.isShow = true;
    },
    detailClick(val) {
      console.log(val);
      this.detail.isShow = true;
      this.keyName = val;
    },
    editClick(val) {
      this.edit.isShow = true;
      this.keyName = val;
    },
    /**
     * @method addClose 添加的弹窗关闭时触发
     * @param {Boolean} isRefresh 是否需要重新加载列表
     */
    addClose(isRefresh = false) {
      this.add.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    },
    /**
     * @method showEdit 显示编辑弹窗
     * @param {Number} index 当前要编辑的数据的序号
     */
    showEdit(index) {
      let { number } = this.list[index];
      this.edit.number = number;
      this.edit.isShow = true;
    },
    /**
     * @method editClose 编辑框关闭触发
     * @param {Boolean} isRefresh 是否需要重新加载列表
     */
    editClose(isRefresh = false) {
      this.edit.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    },
    /**
     * 显示详情弹窗
     * @param {Number} index 当前选择的数据的序号
     */
    showDetail(index) {
      let { number } = this.list[index];
      this.detail.macNumber = number;
      this.detail.isShow = true;
    },
    /**
     * 关闭详情弹窗
     */
    detailClose() {
      this.detail.isShow = false;
    },
    /**
     * 显示防区列表弹窗
     */
    // showDefenceArea(index) {
    //   let { number } = this.list[index];
    //   this.defenceArea.macNumber = number;
    //   this.defenceArea.isShow = true;
    // },
    /**
     * 防区列表弹窗关闭
     */
    // defenceAreaClose() {
    //   this.defenceArea.isShow = false;
    // },
    /**
     * 显示绑定弹窗
     */
    showBind(index) {
      this.bind.isShow = true;
      this.bind.number = this.list[index].number;
    },
    bindClose() {
      this.bind.isShow = false;
      this.getList();
    }
  }
};
</script>
<style lang="stylus" scoped>
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
}

.textWdith {
  word-wrap: break-word;
  min-width: 1490px;
}

.label {
  flex: 0 0 190px !important;
}

.spanClass {
  width: 400px;
}

.butBox {
  display: flex;
  justify-content: center;
  width: 150px;
  align-items: center;
}

.but_class {
  height: 25px;
  margin-left: 3px;
}
</style>


