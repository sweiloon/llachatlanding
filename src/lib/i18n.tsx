'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Lang = 'en' | 'zh';

const en = {
  nav: {
    agents: 'Agents',
    about: 'About',
    features: 'Features',
    how: 'How It Works',
    tryNow: 'Try Now',
  },
  hero: {
    badge: 'Neural Trust Engine v3.2',
    words: [
      { text: 'AI', accent: false },
      { text: 'That', accent: false },
      { text: 'Feels', accent: false },
      { text: 'Human.', accent: true },
    ],
    subtitle1: 'Next-generation conversational AI so natural,',
    subtitle2: "your customers won't know the difference.",
    cta1: 'Meet Our Agents',
    cta2: 'Learn More',
    trust: [
      { icon: '◈', label: 'No sign-up required' },
      { icon: '◉', label: 'Free to try' },
      { icon: '⏣', label: 'Enterprise ready' },
    ],
    scroll: 'Scroll',
    clickToMorph: 'Click to morph',
  },
  marquee: [
    'Human-Like AI', '97% Trust Score', 'WhatsApp Native',
    'Real-Time Empathy', 'Zero Friction', '24/7 Available',
    'Domain Trained', 'Self-Evolving',
  ],
  agents: {
    num: '001',
    title: 'Meet the',
    titleAccent: 'Agents',
    subtitle: 'Chat with them on WhatsApp — see if you can tell the difference.',
    chatWith: 'Chat with {name}',
    livePreview: 'Live Preview',
    list: [
      {
        name: 'Eva',
        role: 'Customer Engagement Specialist',
        type: 'EMPATHY_ENGINE',
        personality: 'Warm, empathetic, and deeply knowledgeable. Eva builds genuine rapport — your customers will feel truly heard.',
        specialties: ['Customer Support', 'Sales Conversion', 'Lead Qualification', 'After-Sales Care'],
        photo: '/eva.jpg',
        number: '60176967269',
        chat: [
          { from: 'user', text: 'Hi, not sure this product is right for me...' },
          { from: 'agent', text: "Hey! I totally get that — tell me what you need and I'll give my honest take 😊" },
          { from: 'user', text: 'That would be great!' },
        ],
      },
      {
        name: 'Ashly',
        role: 'Lifestyle & Companion Agent',
        type: 'CONVERSION_EXPERT',
        personality: 'Fun, witty, and perceptive. Ashly feels like chatting with your most interesting friend — always on point.',
        specialties: ['Lifestyle Advice', 'Companion Chat', 'Recommendations', 'Brand Ambassador'],
        photo: '/ashly.jpg',
        number: '60174035203',
        chat: [
          { from: 'user', text: 'Heyy what do you think about this combo?' },
          { from: 'agent', text: "Okay I love where you're going! But try swapping the shoes? 👀" },
          { from: 'user', text: "Omg yes you're right!" },
        ],
      },
    ],
  },
  about: {
    num: '002',
    title: 'The Trust',
    titleAccent: 'Problem.',
    stats: [
      { value: '97', suffix: '%', prefix: '', label: 'Human-likeness', desc: 'Blind tester score' },
      { value: '3.2', suffix: 'x', prefix: '', label: 'Conversion Lift', desc: 'vs traditional bots' },
      { value: '0.5', suffix: 's', prefix: '<', label: 'Response Time', desc: 'Natural pace' },
      { value: '24', suffix: '/7', prefix: '', label: 'Availability', desc: 'Never sleeps' },
    ],
    p1a: '',
    p1Highlight: '68% of customers abandon conversations',
    p1b: " the moment they realize they\u2019re talking to a chatbot.",
    p2a: "For businesses in finance, healthcare, and luxury, this isn\u2019t friction \u2014 ",
    p2Highlight: "it\u2019s revenue left on the table.",
    quoteStart: "Our engine doesn\u2019t generate responses \u2014 it ",
    quoteEmotion: 'understands emotion',
    quotePatterns: 'mirrors patterns',
    quoteAnd: ', and ',
    quoteAdapts: 'adapts in real-time',
  },
  features: {
    num: '003',
    title: 'Why',
    titleAccent: 'LLachat',
    subtitle: 'Every feature engineered to make AI indistinguishable.',
    coreBadge: 'Core Technology',
    f1Title: 'Indistinguishable',
    f1Desc: 'Our proprietary model passes the conversational Turing test. Blind testers consistently rate our AI as human. Natural pauses, humor, empathy — all learned from millions of real conversations.',
    f1Stats: [
      { val: '97%', lab: 'Human-like' },
      { val: '3.2x', lab: 'Conversion' },
      { val: '<0.5s', lab: 'Response' },
    ],
    f2Title: 'Emotionally Aware',
    f2Desc: 'Detects sentiment shifts in real-time. Adjusts tone, pacing, and vocabulary like a real person would.',
    f3Title: 'WhatsApp Native',
    f3Desc: 'Deployed directly on WhatsApp — zero downloads, zero friction. Meet customers where they are.',
    f4Title: 'Multi-Domain Expert',
    f4Desc: 'Customer service, sales, healthcare, luxury — domain-trained for any industry.',
    f5Title: 'Self-Evolving',
    f5Desc: 'Gets smarter with every conversation. Continuously learning and adapting.',
    f6Title: 'Enterprise Secure',
    f6Desc: 'End-to-end encryption. Custom deployment. Built for businesses that demand military-grade security and full compliance.',
  },
  how: {
    num: '004',
    title: 'How It',
    titleAccent: 'Works',
    subtitle: 'Three steps. Zero friction. Instant conversations.',
    steps: [
      { num: '01', title: 'Choose Your Agent', desc: 'Select the AI agent that matches your needs. Each one is domain-trained with a unique personality.' },
      { num: '02', title: 'Open WhatsApp', desc: 'Click the chat button — instant redirect to WhatsApp. No sign-ups, no apps, no friction.' },
      { num: '03', title: 'Start Talking', desc: 'Say hello and experience the difference. Natural conversations that feel genuinely human.' },
    ],
    readyText: 'Ready in under 60 seconds',
    ctaText: 'Get Started',
  },
  footer: {
    badge: 'No credit card required',
    titleWords: ['Ready', 'to', 'Experience', 'the', 'Future?'],
    accentWord: 'Future?',
    subtitle: "No sign-up required. Just start chatting and see if you can tell the difference.",
    cta: 'Try It Now — Free',
    proof: [
      { icon: '◈', text: 'No sign-up' },
      { icon: '◉', text: '60s setup' },
      { icon: '⏣', text: 'End-to-end encrypted' },
    ],
    brandDesc: 'AI conversations indistinguishable from human.',
    productLabel: 'Product',
    companyLabel: 'Company',
    productLinks: ['Features', 'Agents', 'How It Works'],
    companyLinks: ['About', 'Privacy', 'Contact'],
    status: 'All systems operational',
    copyright: '\u00a9 2025 LLachat AI. All rights reserved.',
    signature: 'Built with obsession for human-like AI',
  },
  gyro: {
    enable: 'Enable Motion Effects',
  },
};

const zh: typeof en = {
  nav: {
    agents: '智能体',
    about: '关于',
    features: '核心优势',
    how: '如何使用',
    tryNow: '立即体验',
  },
  hero: {
    badge: '神经信任引擎 v3.2',
    words: [
      { text: '你的客户', accent: false },
      { text: '分不出', accent: false },
      { text: '真假', accent: true },
    ],
    subtitle1: '下一代AI对话体验',
    subtitle2: '真实到让你的客户完全察觉不到',
    cta1: '认识我们的智能体',
    cta2: '了解更多',
    trust: [
      { icon: '◈', label: '免注册' },
      { icon: '◉', label: '免费试用' },
      { icon: '⏣', label: '企业级服务' },
    ],
    scroll: '下滑',
    clickToMorph: '点击变形',
  },
  marquee: [
    '拟真对话', '97% 信任评分', 'WhatsApp 原生',
    '实时共情', '零门槛', '全天候在线',
    '行业深度训练', '越聊越聪明',
  ],
  agents: {
    num: '001',
    title: '认识',
    titleAccent: '智能体',
    subtitle: '直接在WhatsApp上聊聊看——你分得出来吗',
    chatWith: '和{name}聊聊',
    livePreview: '对话实录',
    list: [
      {
        name: 'Eva',
        role: '客户互动专家',
        type: 'EMPATHY_ENGINE',
        personality: '亲切又专业，聊两句就让人放下戒备。你的客户会觉得在和一个真正懂他们的人说话',
        specialties: ['售前咨询', '销售转化', '客户筛选', '售后跟进'],
        photo: '/eva.jpg',
        number: '60176967269',
        chat: [
          { from: 'user', text: '你好 想问下你们产品怎么收费' },
          { from: 'agent', text: '嗨～你是想了解哪方面呢？跟我说说需求 我帮你看看哪个方案最划算 😊' },
          { from: 'user', text: '好嘞 那你帮我看看' },
        ],
      },
      {
        name: 'Ashly',
        role: '生活方式 & 陪伴助手',
        type: 'CONVERSION_EXPERT',
        personality: '活泼有梗又懂你，跟Ashly聊天就像跟闺蜜吐槽——每次都能get到你的点',
        specialties: ['穿搭种草', '闲聊陪伴', '好物推荐', '品牌种草'],
        photo: '/ashly.jpg',
        number: '60174035203',
        chat: [
          { from: 'user', text: '救命 明天约会不知道穿什么' },
          { from: 'agent', text: '哈哈别急！你平时啥风格呀？拍个衣柜给我看看 👀' },
          { from: 'user', text: '你也太靠谱了吧！' },
        ],
      },
    ],
  },
  about: {
    num: '002',
    title: '信任',
    titleAccent: '困局',
    stats: [
      { value: '97', suffix: '%', prefix: '', label: '拟真度', desc: '盲测评分' },
      { value: '3.2', suffix: 'x', prefix: '', label: '转化提升', desc: '对比传统机器人' },
      { value: '0.5', suffix: 's', prefix: '<', label: '响应速度', desc: '自然节奏' },
      { value: '24', suffix: '/7', prefix: '', label: '全天候', desc: '从不打烊' },
    ],
    p1a: '',
    p1Highlight: '68%的客户一秒弃聊',
    p1b: '——只因察觉到对面是个机器人',
    p2a: '金融、医疗、高端消费品行业——这不是体验问题，',
    p2Highlight: '是真金白银在流失',
    quoteStart: '我们的引擎不只是生成回复——它能',
    quoteEmotion: '读懂情绪',
    quotePatterns: '模拟真人习惯',
    quoteAnd: '，并',
    quoteAdapts: '实时调整话术',
  },
  features: {
    num: '003',
    title: '凭什么选',
    titleAccent: 'LLachat',
    subtitle: '每一项能力都在缩小AI与真人的差距',
    coreBadge: '核心技术',
    f1Title: '真假难辨',
    f1Desc: '盲测中，测试者分不清对面是AI还是真人。自然的停顿、幽默感、共情力——全靠百万级真实对话打磨而成',
    f1Stats: [
      { val: '97%', lab: '拟真度' },
      { val: '3.2x', lab: '转化率' },
      { val: '<0.5s', lab: '响应' },
    ],
    f2Title: '情绪感知',
    f2Desc: '实时捕捉对方情绪变化，像真人一样自动切换语气和节奏',
    f3Title: 'WhatsApp 原生',
    f3Desc: '直接跑在WhatsApp上——不用下载、不用注册，在客户最熟悉的地方触达他们',
    f4Title: '行业全覆盖',
    f4Desc: '客服、销售、医疗、奢侈品——针对不同行业做了深度训练',
    f5Title: '越聊越强',
    f5Desc: '每一次对话都是一次进化，持续学习、不断变聪明',
    f6Title: '企业级安全',
    f6Desc: '端到端加密，支持私有化部署。为安全要求极高的企业量身打造',
  },
  how: {
    num: '004',
    title: '如何',
    titleAccent: '使用',
    subtitle: '三步搞定，零门槛，秒开聊',
    steps: [
      { num: '01', title: '选一个智能体', desc: '挑一个最适合你需求的AI智能体，每个都有独特性格和专业训练' },
      { num: '02', title: '打开WhatsApp', desc: '点一下聊天按钮——直接跳转WhatsApp，不用注册不用下载' },
      { num: '03', title: '开始聊天', desc: '说声嗨就能开始。聊着聊着你会忘了对面是AI' },
    ],
    readyText: '60秒内上手',
    ctaText: '立即开始',
  },
  footer: {
    badge: '无需信用卡',
    titleWords: ['准备好', '见识', '未来了吗'],
    accentWord: '未来了吗',
    subtitle: '免注册，直接开聊。试试你能不能分辨出来',
    cta: '免费体验',
    proof: [
      { icon: '◈', text: '免注册' },
      { icon: '◉', text: '60秒部署' },
      { icon: '⏣', text: '端到端加密' },
    ],
    brandDesc: 'AI对话 真假难辨',
    productLabel: '产品',
    companyLabel: '公司',
    productLinks: ['核心优势', '智能体', '如何使用'],
    companyLinks: ['关于', '隐私协议', '联系我们'],
    status: '系统运行正常',
    copyright: '\u00a9 2025 LLachat AI',
    signature: '用偏执打造最拟真的AI对话',
  },
  gyro: {
    enable: '开启动态效果',
  },
};

const translations: Record<Lang, typeof en> = { en, zh };

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof en;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
