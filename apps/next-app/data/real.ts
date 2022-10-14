export const PricePlans = [
  {
    id: "TRIAL",
    name: "TRIAL",
    features: ["目標管理", "クロス分析", "組織図", "アンケート", "人事評価", "ダッシュボード"],
  },
  {
    id: "SILVER",
    name: "SILVER",
    features: ["目標管理", "組織図"],
  },
  {
    id: "GOLD",
    name: "GOLD",
    features: ["目標管理", "組織図", "アンケート", "人事評価"],
  },
  {
    id: "PLATINUM",
    name: "PLATINUM",
    features: ["目標管理", "クロス分析", "組織図", "アンケート", "人事評価", "ダッシュボード"],
  },
  {
    id: "CUSTOM",
    name: "CUSTOM",
    features: [],
  },
];

export const basicFeatures = [
  {
    label: '人材一覧',
    value: 'PERSONNEL_TALENTS'
  },
  {
    label: '各種シート',
    value: 'PERSONNEL_DATA_SHEET'
  },
  {
    label: '人材グルーピング',
    value: 'PERSONNEL_TALENT_TAG'
  }
]

export const OptionalFeatures = [
  {
    // FIXME: i18n
    label: "目標管理",
    value: "OBJECTIVE",
  },
  {
    // FIXME: i18n
    label: "クロス分析",
    value: "CROSS_ANALYTICS",
  },
  {
    label: "組織図",
    value: "ORG_CHART",
  },
  {
    label: "アンケート",
    value: "QUESTIONNAIRE",
  },
  {
    label: "人事評価",
    value: "ASSESSMENT",
  },
  {
    label: "ダッシュボード",
    value: "DASHBOARD",
  },
  {
    label: "ワークフロー",
    value: "WORKFLOW",
  },
  {
    label: "汎用マスタ",
    value: "MASTER",
  },
];

export const romuFeatures = [
  {
    label: "電子契約",
    value: "DIGITAL_CONTRACT",
  },
  {
    label: "給与明細",
    value: "SALARY_DETAIL",
  },
  {
    label: "マイナンバー",
    value: "MYNUMBER",
  },
];

export const kintaiFeatures = [
  {
    label: "シフト管理",
    value: "SHIFT",
  },
  {
    label: "経費精算",
    value: "EXPENSE",
  },
  {
    label: "工数管理",
    value: "MAN_HOUR_MANAGEMENT",
  },
];

export const kyuyoFeatures = [];
