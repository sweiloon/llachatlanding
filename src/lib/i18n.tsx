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
    chatWith: 'Chat with',
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
    features: '核心特性',
    how: '使用方式',
    tryNow: '立即体验',
  },
  hero: {
    badge: '神经信任引擎 v3.2',
    words: [
      { text: 'AI', accent: false },
      { text: '对话', accent: false },
      { text: '如同', accent: false },
      { text: '真人。', accent: true },
    ],
    subtitle1: '新一代对话式AI，自然真实到',
    subtitle2: '你的客户根本无法分辨。',
    cta1: '认识我们的智能体',
    cta2: '了解更多',
    trust: [
      { icon: '◈', label: '无需注册' },
      { icon: '◉', label: '免费体验' },
      { icon: '⏣', label: '企业级就绪' },
    ],
    scroll: '滚动',
    clickToMorph: '点击变换',
  },
  marquee: [
    '拟人化AI', '97% 信任评分', 'WhatsApp 原生',
    '实时情感感知', '零摩擦体验', '24/7 全天候',
    '专业领域训练', '自我进化',
  ],
  agents: {
    num: '001',
    title: '认识',
    titleAccent: '智能体',
    subtitle: '在WhatsApp上与他们对话——看看你能否分辨真伪。',
    chatWith: '与{name}对话',
    livePreview: '实时预览',
    list: [
      {
        name: 'Eva',
        role: '客户互动专家',
        type: 'EMPATHY_ENGINE',
        personality: '温暖、富有同理心且知识渊博。Eva善于建立真诚的信赖关系——让你的客户感到被真正理解和倾听。',
        specialties: ['客户服务', '销售转化', '商机筛选', '售后关怀'],
        photo: '/eva.jpg',
        number: '60176967269',
        chat: [
          { from: 'user', text: '你好，我想了解一下你们的产品' },
          { from: 'agent', text: '嗨你好呀！当然可以～你先跟我说说你的需求，我帮你看看哪个最合适 😊' },
          { from: 'user', text: '好的好的，太贴心了！' },
        ],
      },
      {
        name: 'Ashly',
        role: '生活方式与陪伴智能体',
        type: 'CONVERSION_EXPERT',
        personality: '有趣、机智、洞察力敏锐。和Ashly聊天就像和最懂你的好朋友交流——每次都能说到你心坎里。',
        specialties: ['生活建议', '陪伴聊天', '个性推荐', '品牌大使'],
        photo: '/ashly.jpg',
        number: '60174035203',
        chat: [
          { from: 'user', text: '在吗在吗，帮我看看这套穿搭怎样' },
          { from: 'agent', text: '来了来了～整体很搭！但我建议换双白色的鞋，会更出彩哦 👀' },
          { from: 'user', text: '确实！你眼光真的太好了吧！' },
        ],
      },
    ],
  },
  about: {
    num: '002',
    title: '信任',
    titleAccent: '难题。',
    stats: [
      { value: '97', suffix: '%', prefix: '', label: '拟人度', desc: '盲测评分' },
      { value: '3.2', suffix: 'x', prefix: '', label: '转化提升', desc: '对比传统机器人' },
      { value: '0.5', suffix: 's', prefix: '<', label: '响应速度', desc: '自然节奏' },
      { value: '24', suffix: '/7', prefix: '', label: '全天候', desc: '永不休息' },
    ],
    p1a: '',
    p1Highlight: '68%的客户会在瞬间放弃对话',
    p1b: '——就在他们意识到自己在和聊天机器人交谈的那一刻。',
    p2a: '对于金融、医疗和奢侈品行业来说，这不只是用户流失——',
    p2Highlight: '更是白白浪费的真金白银。',
    quoteStart: '我们的引擎不只是生成回复——它',
    quoteEmotion: '理解情感',
    quotePatterns: '映射模式',
    quoteAnd: '，并',
    quoteAdapts: '实时适应',
  },
  features: {
    num: '003',
    title: '为何选择',
    titleAccent: 'LLachat',
    subtitle: '每一项特性精心设计，让AI与真人无法区分。',
    coreBadge: '核心技术',
    f1Title: '无法分辨',
    f1Desc: '我们的专有模型通过了对话图灵测试。在盲测中，测试者始终将我们的AI评定为真人。自然的停顿、幽默感、共情能力——全部源自数百万真实对话的深度学习。',
    f1Stats: [
      { val: '97%', lab: '拟人度' },
      { val: '3.2x', lab: '转化率' },
      { val: '<0.5s', lab: '响应' },
    ],
    f2Title: '情感感知',
    f2Desc: '实时检测情绪变化，像真人一样自动调整语气、节奏和用词。',
    f3Title: 'WhatsApp 原生',
    f3Desc: '直接部署在WhatsApp——零下载、零摩擦。在客户最常用的地方触达他们。',
    f4Title: '多领域专家',
    f4Desc: '客服、销售、医疗、奢侈品——针对任何行业进行专业领域训练。',
    f5Title: '自我进化',
    f5Desc: '每次对话都在变得更聪明。持续学习，不断适应。',
    f6Title: '企业级安全',
    f6Desc: '端到端加密，私有化部署。为对安全有极高要求的企业量身打造，完全合规。',
  },
  how: {
    num: '004',
    title: '使用',
    titleAccent: '方式',
    subtitle: '三步上手。零摩擦。即刻对话。',
    steps: [
      { num: '01', title: '选择你的智能体', desc: '选择最符合你需求的AI智能体，每一个都经过专业领域训练，拥有独特个性。' },
      { num: '02', title: '打开WhatsApp', desc: '点击聊天按钮——直接跳转WhatsApp。无需注册，无需下载，毫无障碍。' },
      { num: '03', title: '开始对话', desc: '说声你好，亲身体验不同之处。自然流畅的对话，真实得让人难以置信。' },
    ],
    readyText: '60秒内即可就绪',
    ctaText: '立即开始',
  },
  footer: {
    badge: '无需信用卡',
    titleWords: ['准备好', '体验', '未来了吗？'],
    accentWord: '未来了吗？',
    subtitle: '无需注册。直接开始聊天，看看你能否分辨出区别。',
    cta: '立即免费体验',
    proof: [
      { icon: '◈', text: '无需注册' },
      { icon: '◉', text: '60秒部署' },
      { icon: '⏣', text: '端到端加密' },
    ],
    brandDesc: 'AI对话，与真人无异。',
    productLabel: '产品',
    companyLabel: '公司',
    productLinks: ['核心特性', '智能体', '使用方式'],
    companyLinks: ['关于', '隐私政策', '联系我们'],
    status: '所有系统运行正常',
    copyright: '\u00a9 2025 LLachat AI. 保留所有权利。',
    signature: '以对拟人化AI的执着打造',
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
