export type NewsArticle = { title: string; tags: string[] };

export type NewsReport = {
  date: string;
  weekday: string;
  issue: string;
  title: string;
  summary: string;
  hero: string;
  reportUrl: string;
  tags: string[];
  articles: NewsArticle[];
};

export const categories = ["全部", "具身智能", "厨房智能硬件", "大模型算法", "厨房空间设计", "厨房品类创新", "厨房工业设计"] as const;

export const archiveStartDate = "2026-08-24";

export const reports: NewsReport[] = [
  {
    "date": "2026-08-24",
    "weekday": "星期一",
    "issue": "第 042 期",
    "title": "AI未来厨房新闻报",
    "summary": "今天的主线是“AI 从联网功能走进厨房硬件系统”：厨电品牌开始把智能体、视觉感知、分屏交互和空间设计打包成可交付方案；家庭机器人也在 WRC 现场把“做早餐、洗衣服”这类家务拆成可验证动作。",
    "hero": "/archive/2026-08-24/images/casdon_xiaozi.png",
    "reportUrl": "/archive/2026-08-24/",
    "tags": [
      "具身智能",
      "厨房智能硬件",
      "大模型算法",
      "厨房空间设计",
      "厨房品类创新",
      "厨房工业设计"
    ],
    "articles": [
      {
        "title": "凯度让“小紫”住进厨电：AI智能体开始接管蒸烤、净饮、洗碗与烟灶",
        "tags": [
          "厨房智能硬件",
          "大模型算法"
        ]
      },
      {
        "title": "中国家电网：国补退场后，厨电竞争转向“好房子 + AI智慧大脑”",
        "tags": [
          "厨房智能硬件"
        ]
      },
      {
        "title": "WRC现场观察：宇树做早餐、擎朗洗衣服，机器人“到家”开始拆任务",
        "tags": [
          "具身智能"
        ]
      },
      {
        "title": "索菲亚启动厨电项目：定制家居开始把“厨房空间”纳入整案交付",
        "tags": [
          "厨房智能硬件",
          "厨房空间设计"
        ]
      },
      {
        "title": "高端新厨电白皮书发布：蒸烤、净饮、洗碗、咖啡机从参数赛转向“感知价值”",
        "tags": [
          "厨房智能硬件",
          "厨房品类创新"
        ]
      },
      {
        "title": "从无拉手全嵌到双TFT：厨房工业设计正在把“屏幕、材质、隐形化”变成体验入口",
        "tags": [
          "厨房智能硬件",
          "厨房工业设计"
        ]
      }
    ]
  }
];
