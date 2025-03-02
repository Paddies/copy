


export const fCourseList = [
  {
    id: 1, name: '新手基础课程', Description: '帷幄学院的基础知识小课堂，让你尽快了解帷幄科技', course: '新手勋章', img: require('@/assets/images/Frame4.png'), showButton: true,
    courses: [{
      id: 1, name: '第一节课程', Description: '了解帷幄科技',ptdUrl:"https://bd.woai996.com/pdf/了解帷幄科技.pdf",videos: require('../../assets/videos/了解帷幄科技.mp4'),
    },
    {
      id: 2, name: '第二节课程', Description: '了解任务',ptdUrl:"https://bd.woai996.com/pdf/任务了解.pdf",videos: require('../../assets/videos/了解任务.mp4'),
    },
    {
      id: 3, name: '第三节课程', Description: '了解工具',ptdUrl:"https://bd.woai996.com/pdf/了解工具.pdf"
    },
    {
      id: 4, name: '第四节课程', Description: '了解提现',ptdUrl:"https://bd.woai996.com/pdf/了解提现.pdf",videos: require('../../assets/videos/了解提现.mp4'),
    },
    {
      id: 5, name: '第五节课程', Description: '了解公会',ptdUrl:"https://bd.woai996.com/pdf/了解公会.pdf"
    }]
  },
  {
    id: 2, name: '3D点云标注基础课程', Description: '了解什么是3D点云，以及平台操作方法，学会基本的3D拉框标注', course: '3D点云', img: require('@/assets/images/Frame2.png'), showButton: false,
    courses: [{
      id: 1, name: '第一节课程', Description: '了解3D点云标注',ptdUrl:"https://bd.woai996.com/pdf/3D点云标注解读.pdf"
    },
    ]
  },
  {
    id: 3, name: '2D人体拉框课程', Description: '本课程以人体拉框任务为例讲解拉框类通用任务要求以及帷幄科技...', course: '2D人体拉框', img: require('@/assets/images/Frame3.png'), showButton: false,
    courses: [{
      id: 1, name: '第一节课程', Description: '了解2D人体拉框',ptdUrl:"https://bd.woai996.com/pdf/人体拉框.pdf"
    }]
  },
  {
    id: 4, name: '长沙话语音转写基础课程', Description: '长沙话转写，了解长沙话，学习长沙话转写！', course: '语音转写', img: require('@/assets/images/Frame5.png'), showButton: false,
    courses: [{
      id: 1, name: '第一节课程', Description: '了解语音转写',ptdUrl:"https://bd.woai996.com/pdf/语音转写.pdf"
    }]
  },
  {
    id: 5, name: 'OCR标注课程', Description: '了解什么是OCR标注，以及平台操作方法，学会基本的OCR标注', course: 'OCR标注', img: require('@/assets/images/Frame5.png'), showButton: false,
    courses: [{
      id: 1, name: '第一节课程', Description: '了解OCR标注',ptdUrl:"https://bd.woai996.com/pdf/OCR标注.pdf"
    }]
  },
  {
    id: 6, name: ' 题目标注课程', Description: '了解什么是题目标注，以及平台操作方法，学会基本的题目标注', course: '题目标注', img: require('@/assets/images/Frame5.png'), showButton: false,
    courses: [{
      id: 1, name: '第一节课程', Description: '了解题目标注',ptdUrl:"https://bd.woai996.com/pdf/题目标注.pdf",videos: require('../../assets/videos/topicAnnotation.mp4'),
    }]
  },


]
export const CardList= [
  {
    id:1,
    imgUrl: require('@/assets/images/11.png'),
    name: '3D云拉框',
    num: 2334,
    path: "/marks/3D"
  },
  {
    id: 2,
    imgUrl: require('@/assets/images/12.png'),
    name: '2D点云拉框',
    num: 2334,
    path: "/marks/2D"
  },
  {
    id: 3,
    imgUrl:  require('@/assets/images/12.png'),
    name: '语音标注',
    num: 2334,
    path: "/marks/voice"
  },
  {
    id: 4,
    imgUrl: require('@/assets/images/12.png'),
    name: '题目标注',
    num: 2334,
    path: "/project/list"
  },
  {
    id: 5,
    imgUrl: require('@/assets/images/12.png'),
    name: 'OCR标注',
    num: 2334,
    path: "/OCR/imgTask"
  },
  {
    id: 6,
    imgUrl: require('@/assets/images/12.png'),
    name: '长沙话转写',
    num: 2334
  }
]


