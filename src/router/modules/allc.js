/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const allcRouter = {
  path: '/allc',
  component: Layout,
  redirect: 'noRedirect',
  name: '系统配置信息',
  meta: {
    title: '系统配置信息',
    icon: 'chart'
  },
  children: [
    {
      path: 'systemcfg',
      component: () => import('@/views/allc/systemcfg'),
      name: '系统配置',
      meta: { title: '系统配置信息', noCache: true }
    },
    {
      path: 'companycfg',
      component: () => import('@/views/allc/companycfg'),
      name: '单位配置',
      meta: { title: '单位配置信息', noCache: true }
    },
    {
      path: 'areacfg',
      component: () => import('@/views/allc/areacfg'),
      name: '地区配置',
      meta: { title: '地区配置信息', noCache: true }
    },
    // {
    //   path: 'filecfg',
    //   component: () => import('@/views/allc/filecfg'),
    //   name: '文件配置',
    //   meta: { title: '文件配置信息', noCache: true }
    // },
    // {
    //   path: 'validatecfg',
    //   component: () => import('@/views/allc/validatecfg'),
    //   name: '认证配置',
    //   meta: { title: '认证配置信息', noCache: true }
    // },
    {
      path: 'menucfg',
      component: () => import('@/views/allc/menucfg'),
      name: '菜单配置',
      meta: { title: '菜单配置信息', noCache: true }
    },
    // {
    //   path: 'menuInRolecfg',
    //   component: () => import('@/views/allc/menuInRolecfg'),
    //   name: '菜单权限配置',
    //   meta: { title: '菜单权限配置信息', noCache: true }
    // },
    {
      path: 'rolecfg',
      component: () => import('@/views/allc/rolecfg'),
      name: '角色配置',
      meta: { title: '角色配置信息', noCache: true }
    },
    {
      path: 'usercfg',
      component: () => import('@/views/allc/usercfg'),
      name: '用户配置',
      meta: { title: '用户配置信息', noCache: true }
    },
    // {
    //   path: 'userExtcfg',
    //   component: () => import('@/views/allc/userExtcfg'),
    //   name: '用户扩展配置',
    //   meta: { title: '用户扩展信息', noCache: true }
    // },
    // {
    //   path: 'userInRolecfg',
    //   component: () => import('@/views/allc/userInRolecfg'),
    //   name: '用户角色配置',
    //   meta: { title: '用户角色配置信息', noCache: true }
    // },
    {
      path: 'datasourcecfg',
      component: () => import('@/views/allc/datasourcecfg'),
      name: '数据源配置',
      meta: { title: '数据源配置信息', noCache: true }
    },
    {
      path: 'tablecfg',
      component: () => import('@/views/allc/tablecfg'),
      name: '表信息定义',
      meta: { title: '表信息定义', noCache: true }
    },
    // {
    //   path: 'tablecolumncfg',
    //   component: () => import('@/views/allc/tablecolumncfg'),
    //   name: '表字段信息定义',
    //   meta: { title: '表字段信息定义', noCache: true }
    // },
    // {
    //   path: 'tableRelationSelectFieldcfg',
    //   component: () => import('@/views/allc/tableRelationSelectFieldcfg'),
    //   name: '查询字段配置',
    //   meta: { title: '查询字段配置信息', noCache: true }
    // },
    // {
    //   path: 'tableDmFieldcfg',
    //   component: () => import('@/views/allc/tableDmFieldcfg'),
    //   name: '表更新定义配置',
    //   meta: { title: '表更新定义配置信息', noCache: true }
    // },
    // {
    //   path: 'tableRelationcfg',
    //   component: () => import('@/views/allc/tableRelationcfg'),
    //   name: '表关系配置',
    //   meta: { title: '表关系配置信息', noCache: true }
    // },
    // {
    //   path: 'tableRelationConditioncfg',
    //   component: () => import('@/views/allc/tableRelationConditioncfg'),
    //   name: '表关联条件配置',
    //   meta: { title: '表关联条件配置信息', noCache: true }
    // },
    {
      path: 'bizcfg',
      component: () => import('@/views/allc/bizcfg'),
      name: '业务配置',
      meta: { title: '业务配置信息', noCache: true }
    },
    // {
    //   path: 'uicfg',
    //   component: () => import('@/views/allc/uicfg'),
    //   name: 'UI配置',
    //   meta: { title: 'UI配置信息', noCache: true }
    // },
    {
      path: 'paramscfg',
      component: () => import('@/views/allc/paramscfg'),
      name: '系统参数配置',
      meta: { title: '系统参数配置信息', noCache: true }
    },
    {
      path: 'dictionarycfg',
      component: () => import('@/views/allc/dictionarycfg'),
      name: '字典配置',
      meta: { title: '字典配置', noCache: true }
    },
    {
      path: 'operaterCodecfg',
      component: () => import('@/views/allc/operaterCodecfg'),
      name: '操作码配置',
      meta: { title: '操作码配置信息', noCache: true }
    },
    // {
    //   path: 'maintenanceLogcfg',
    //   component: () => import('@/views/allc/maintenanceLogcfg'),
    //   name: '查询字段配置',
    //   meta: { title: '查询字段配置信息', noCache: true }
    // },
    {
      path: 'mybatiscfg',
      component: () => import('@/views/allc/mybatiscfg'),
      name: 'mybatis配置信息生成',
      meta: { title: 'mybatis配置信息生成', noCache: true }
    }
  ]
}

export default allcRouter
